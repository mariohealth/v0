import os
import sys
import gzip
import logging
import time
import json


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


def clean_object_text(obj_text):
    """Remove trailing array/object closures that don't belong"""
    obj_text = obj_text.strip().rstrip(",")

    # Remove trailing ]} or }] patterns
    while obj_text.endswith("]}") or obj_text.endswith("}]"):
        test_text = obj_text[:-2]
        open_braces = test_text.count("{")
        close_braces = test_text.count("}")
        open_brackets = test_text.count("[")
        close_brackets = test_text.count("]")

        if open_braces == close_braces and open_brackets == close_brackets:
            obj_text = test_text
            break
        else:
            break

    return obj_text


def split_large_json(path):
    start = time.time()
    base = os.path.splitext(os.path.splitext(path)[0])[0]

    # Plain text output files (no gzip)
    meta_path = f"{base}_meta.json"
    provider_path = f"{base}_provider_references.jsonl"
    in_network_path = f"{base}_in_network.jsonl"

    provider_count = 0
    in_network_count = 0
    lines_processed = 0

    with open_maybe_gzip(path) as infile, \
            open(meta_path, "w", encoding="utf-8") as meta_out, \
            open(provider_path, "w", encoding="utf-8") as prov_out, \
            open(in_network_path, "w", encoding="utf-8") as net_out:

        state = "meta"
        brace_depth = 0
        buffer_lines = []
        meta_fields = {}

        in_meta_object = False

        for raw_line in infile:
            lines_processed += 1
            line = raw_line.strip()

            if not line:
                continue

            # Detect top-level object start
            if line == "{" and state == "meta" and not in_meta_object:
                in_meta_object = True
                continue

            # --- Capture meta fields ---
            if state == "meta" and in_meta_object and '":' in line:
                if '"provider_references":' not in line and '"in_network":' not in line:
                    clean_line = line.rstrip(',').strip()
                    if clean_line and clean_line not in ['{', '}', '[', ']']:
                        try:
                            if clean_line.startswith('"') and '":' in clean_line:
                                parts = clean_line.split('":', 1)
                                key = parts[0].strip('"')
                                value_str = parts[1].strip().rstrip(',')

                                try:
                                    value = json.loads(value_str)
                                except:
                                    value = value_str.strip('"')

                                meta_fields[key] = value
                        except:
                            pass

            # --- Detect provider_references array start ---
            if '"provider_references":' in line:
                if state == "meta":
                    state = "provider"
                    logging.info(f"🎯 Found 'provider_references' at line {lines_processed}")

                    if ':[' in line:
                        post = line.split(':[', 1)[1].strip()
                        if post and post not in ['[', '[,', '']:
                            buffer_lines.append(post)
                            brace_depth += post.count("{") - post.count("}")
                    continue

            if '"provider_group_id":' in line and state == "meta":
                state = "provider"
                buffer_lines.append(raw_line)
                brace_depth += raw_line.count("{") - raw_line.count("}")
                continue

            # --- Detect in_network array start ---
            if '"in_network":' in line:
                logging.info(f"🎯 Found 'in_network' at line {lines_processed}")

                # Flush provider buffer
                if buffer_lines and state == "provider":
                    obj_text = clean_object_text("".join(buffer_lines))
                    if obj_text and obj_text not in [']', '},', '}', '{']:
                        prov_out.write(obj_text + "\n")
                        provider_count += 1
                    buffer_lines = []
                    brace_depth = 0

                state = "in_network"

                if ':[' in line:
                    post = line.split(':[', 1)[1].strip()
                    if post and post not in ['[', '[,', '']:
                        buffer_lines.append(post)
                        brace_depth += post.count("{") - post.count("}")
                continue

            # --- Detect array closing ---
            if line.startswith("]") or line.startswith("],") or line == "]":
                if buffer_lines:
                    obj_text = clean_object_text("".join(buffer_lines))
                    if obj_text and obj_text not in [']', '},', '}', '{', ']}', '}]']:
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

            # --- Detect end of file ---
            if line == "}" and state == "meta":
                continue

            # --- Route based on state ---
            if state == "meta":
                continue

            # --- Buffer array items ---
            buffer_lines.append(raw_line)
            brace_depth += raw_line.count("{") - raw_line.count("}")

            # Complete object detected
            if brace_depth == 0 and buffer_lines:
                obj_text = clean_object_text("".join(buffer_lines))

                if obj_text and obj_text not in [']', '},', '}', '{', ']}', '}]']:
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

                buffer_lines = []

        # Final flush
        if buffer_lines:
            obj_text = clean_object_text("".join(buffer_lines))
            if obj_text and obj_text not in [']', '},', '}', '{', ']}', '}]']:
                if state == "provider":
                    prov_out.write(obj_text + "\n")
                    provider_count += 1
                elif state == "in_network":
                    net_out.write(obj_text + "\n")
                    in_network_count += 1

        # Write meta JSON
        if meta_fields:
            try:
                meta_out.write(json.dumps(meta_fields, separators=(',', ':')) + "\n")
                logging.info("✅ Meta JSON validated and written")
            except Exception as e:
                logging.warning(f"⚠️ Meta JSON write failed: {e}")

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

    # Show file sizes
    for fpath in [meta_path, provider_path, in_network_path]:
        size_mb = os.path.getsize(fpath) / (1024 * 1024)
        logging.info(f"  {os.path.basename(fpath)}: {size_mb:.1f} MB")


def main():
    setup_logging()
    if len(sys.argv) != 2:
        print("Usage: python split_json_final.py <path_to_json_or_json.gz>")
        sys.exit(1)
    path = sys.argv[1]
    if not os.path.isfile(path):
        logging.error(f"File not found: {path}")
        sys.exit(1)
    split_large_json(path)


if __name__ == "__main__":
    main()
