import os
import sys
import gzip
import logging
import time


def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )


def open_maybe_gzip(path):
    if path.endswith(".gz"):
        logging.info(f"Detected gzip-compressed file: {path}")
        return gzip.open(path, "rt", encoding="utf-8", errors="ignore")
    return open(path, "r", encoding="utf-8", errors="ignore")


def split_large_json(path):
    start = time.time()
    base = os.path.splitext(os.path.splitext(path)[0])[0]

    meta_path = f"{base}_meta.json"
    provider_path = f"{base}_provider_references.jsonl"
    in_network_path = f"{base}_in_network.jsonl"

    with open_maybe_gzip(path) as infile, \
            open(meta_path, "w", encoding="utf-8") as meta_out, \
            open(provider_path, "w", encoding="utf-8") as prov_out, \
            open(in_network_path, "w", encoding="utf-8") as net_out:

        state = "meta"
        brace_depth = 0
        buffer_lines = []
        provider_count = 0
        in_network_count = 0

        lines_processed = 0

        for raw_line in infile:
            lines_processed += 1
            line = raw_line.strip()

            if not line:
                continue

            # --- Detect provider_references array start ---
            if '"provider_references":' in line or '"provider_group_id":' in line:
                if state == "meta" and '"provider_references":' in line:
                    # Write everything before the array starts
                    pre = line.split('"provider_references":')[0]
                    if pre.strip():
                        meta_out.write(pre + "\n")
                    state = "provider"
                    logging.info(f"🎯 Found 'provider_references' at line {lines_processed}")

                    # Handle if array starts on same line
                    if ':[' in line:
                        post = line.split(':[', 1)[1]
                        if post.strip() and post.strip() != "[":
                            buffer_lines.append(post)
                            brace_depth += post.count("{") - post.count("}")
                    continue

                # If we see provider_group_id, we're in provider section
                elif '"provider_group_id":' in line and state == "meta":
                    state = "provider"
                    buffer_lines.append(raw_line)
                    brace_depth += raw_line.count("{") - raw_line.count("}")
                    continue

            # --- Detect in_network array start ---
            if '"in_network":' in line:
                logging.info(f"🎯 Found 'in_network' at line {lines_processed}")

                # Flush any provider buffer
                if buffer_lines and state == "provider":
                    obj_text = "".join(buffer_lines).strip().rstrip(",")
                    if obj_text:
                        prov_out.write(obj_text + "\n")
                        provider_count += 1
                    buffer_lines = []
                    brace_depth = 0

                state = "in_network"

                # Handle if array starts on same line
                if ':[' in line:
                    post = line.split(':[', 1)[1]
                    if post.strip() and post.strip() != "[":
                        buffer_lines.append(post)
                        brace_depth += post.count("{") - post.count("}")
                continue

            # --- Detect array closing ] ---
            if line.startswith("]") or line == "],":
                # Flush buffer
                if buffer_lines:
                    obj_text = "".join(buffer_lines).strip().rstrip(",")
                    if obj_text:
                        if state == "provider":
                            prov_out.write(obj_text + "\n")
                            provider_count += 1
                        elif state == "in_network":
                            net_out.write(obj_text + "\n")
                            in_network_count += 1
                    buffer_lines = []
                    brace_depth = 0

                logging.info(f"📍 Closed array at line {lines_processed} (was in '{state}' state)")
                state = "meta"
                continue

            # --- Route based on current state ---
            if state == "meta":
                meta_out.write(raw_line)
                continue

            # --- Buffer array items ---
            buffer_lines.append(raw_line)
            brace_depth += raw_line.count("{") - raw_line.count("}")

            # When brace depth returns to 0, we have a complete object
            if brace_depth == 0 and buffer_lines:
                obj_text = "".join(buffer_lines).strip().rstrip(",")
                buffer_lines = []

                if not obj_text:
                    continue

                if state == "provider":
                    prov_out.write(obj_text + "\n")
                    provider_count += 1
                    if provider_count % 10000 == 0:
                        logging.info(f"provider_references: {provider_count:,}")

                elif state == "in_network":
                    net_out.write(obj_text + "\n")
                    in_network_count += 1
                    if in_network_count % 10000 == 0:
                        logging.info(f"in_network: {in_network_count:,}")

        # Final flush
        if buffer_lines:
            obj_text = "".join(buffer_lines).strip().rstrip(",")
            if obj_text:
                if state == "provider":
                    prov_out.write(obj_text + "\n")
                    provider_count += 1
                elif state == "in_network":
                    net_out.write(obj_text + "\n")
                    in_network_count += 1

        elapsed = time.time() - start
        logging.info("\n✅ Extraction complete.")
        logging.info(f"Lines processed: {lines_processed:,}")
        logging.info(f"provider_references: {provider_count:,}")
        logging.info(f"in_network: {in_network_count:,}")
        logging.info(f"⏱ Runtime: {elapsed:.1f} sec")

        logging.info(f"\n📁 Output files:")
        logging.info(f"  {meta_path}")
        logging.info(f"  {provider_path}")
        logging.info(f"  {in_network_path}")


def main():
    setup_logging()
    if len(sys.argv) != 2:
        print("Usage: python split_json_v3.py <path_to_json_or_json.gz>")
        sys.exit(1)
    path = sys.argv[1]
    if not os.path.isfile(path):
        logging.error(f"File not found: {path}")
        sys.exit(1)
    split_large_json(path)


if __name__ == "__main__":
    main()

