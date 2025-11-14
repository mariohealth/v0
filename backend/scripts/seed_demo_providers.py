#!/usr/bin/env python3
"""
Mario Health — Sample Provider & Pricing Seed (Demo Data)
Uses Supabase Python client to seed demo providers and MRI pricing.
"""

import os
import sys
import random
from pathlib import Path
from datetime import datetime

try:
    from supabase import create_client, Client
except ImportError:
    print("ERROR: supabase-py not installed. Install with: pip install supabase")
    sys.exit(1)

# Load environment variables
script_dir = Path(__file__).parent
backend_dir = script_dir.parent
env_file = backend_dir / "mario-health-api" / ".env"

supabase_url = None
supabase_key = None

if env_file.exists():
    with open(env_file) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, value = line.split("=", 1)
                if key == "SUPABASE_URL":
                    supabase_url = value.strip()
                elif key == "SUPABASE_KEY":
                    supabase_key = value.strip()

if not supabase_url or not supabase_key:
    print(
        "ERROR: SUPABASE_URL and SUPABASE_KEY must be set in backend/mario-health-api/.env"
    )
    sys.exit(1)


def main():
    print("=== Mario Health — Sample Provider & Pricing Seed (Demo Data) ===\n")

    # Connect to Supabase
    try:
        supabase = create_client(supabase_url, supabase_key)
        print("✓ Connected to Supabase\n")
    except Exception as e:
        print(f"ERROR: Could not connect to Supabase: {e}")
        sys.exit(1)

    # Step 1: Insert demo providers
    print("Step 1: Inserting demo providers...")
    try:
        # Generate composite IDs based on pattern: {prefix}_{provider_id}
        # Pattern appears to be like "sf_001_1851457980" where provider_id is numeric
        demo_providers = [
            {
                "id": "demo_001_1001",  # Composite ID required
                "provider_id": 1001,
                "provider_name": "City Imaging Center",
                "city": "New York",
                "state": "NY",
                "latitude": 40.713,
                "longitude": -74.006,
                "address": "123 Main St",
                "zip_code": "10001",
            },
            {
                "id": "demo_001_1002",
                "provider_id": 1002,
                "provider_name": "UCSF Radiology Clinic",
                "city": "San Francisco",
                "state": "CA",
                "latitude": 37.763,
                "longitude": -122.457,
                "address": "456 Market St",
                "zip_code": "94102",
            },
            {
                "id": "demo_001_1003",
                "provider_id": 1003,
                "provider_name": "Chicago MRI Specialists",
                "city": "Chicago",
                "state": "IL",
                "latitude": 41.878,
                "longitude": -87.629,
                "address": "789 State St",
                "zip_code": "60601",
            },
        ]

        for provider in demo_providers:
            # Check if provider exists by composite id
            existing = (
                supabase.table("provider_location")
                .select("id")
                .eq("id", provider["id"])
                .execute()
            )

            if existing.data:
                # Update existing
                supabase.table("provider_location").update(provider).eq(
                    "id", provider["id"]
                ).execute()
                print(f"  Updated: {provider['provider_name']}")
            else:
                # Insert new
                supabase.table("provider_location").insert(provider).execute()
                print(f"  Inserted: {provider['provider_name']}")

        print("✓ Demo providers inserted\n")
    except Exception as e:
        print(f"ERROR: Failed to insert providers: {e}")
        sys.exit(1)

    # Step 2: Get MRI procedures
    print("Step 2: Linking pricing to MRI procedures...")
    try:
        # Get MRI procedures
        mri_procedures = (
            supabase.table("procedure")
            .select("id,slug,name")
            .ilike("slug", "%mri%")
            .execute()
        )

        if not mri_procedures.data:
            print("⚠️  No MRI procedures found")
            return

        print(f"  Found {len(mri_procedures.data)} MRI procedures")

        # Get provider IDs and their corresponding provider_location.id values
        provider_ids = [1001, 1002, 1003]
        
        # Map provider_id to provider_location.id (composite id)
        provider_location_map = {}
        for provider_id in provider_ids:
            provider = (
                supabase.table("provider_location")
                .select("id")
                .eq("provider_id", provider_id)
                .execute()
            )
            if provider.data:
                provider_location_map[provider_id] = provider.data[0]["id"]

        # Insert pricing for each MRI procedure and provider combination
        pricing_count = 0
        for procedure in mri_procedures.data:
            for provider_id in provider_ids:
                # Get provider_location.id for this provider_id
                provider_location_id = provider_location_map.get(provider_id)
                if not provider_location_id:
                    print(f"    Warning: provider_id {provider_id} not found in provider_location, skipping")
                    continue
                
                # Generate random price between 400 and 550
                price = random.randint(400, 550)

                # Generate composite ID: {procedure_id}_{provider_location_id}
                pricing_id = f"{procedure['id']}_{provider_location_id}"

                pricing_data = {
                    "id": pricing_id,
                    "procedure_id": procedure["id"],
                    "provider_location_id": provider_location_id,
                    "price": price,
                    "updated_at": datetime.now().isoformat(),
                }

                try:
                    # Check if pricing already exists (try both provider_id and provider_location_id)
                    existing = (
                        supabase.table("procedure_pricing")
                        .select("id")
                        .eq("procedure_id", procedure["id"])
                        .or_(f"provider_location_id.eq.{provider_location_id},provider_id.eq.{provider_id}")
                        .execute()
                    )

                    if existing.data:
                        # Update existing
                        supabase.table("procedure_pricing").update(
                            {"price": price, "updated_at": datetime.now().isoformat(), "provider_location_id": provider_location_id}
                        ).eq("id", existing.data[0]["id"]).execute()
                        pricing_count += 1
                    else:
                        # Insert new
                        supabase.table("procedure_pricing").insert(
                            pricing_data
                        ).execute()
                        pricing_count += 1
                except Exception as e:
                    print(
                        f"    Error inserting pricing for {procedure['slug']} / provider {provider_id}: {e}"
                    )
                    import traceback

                    traceback.print_exc()

        print(f"✓ Linked {pricing_count} pricing records to MRI procedures\n")
    except Exception as e:
        print(f"ERROR: Failed to link pricing: {e}")
        import traceback

        traceback.print_exc()
        sys.exit(1)

    # Step 3: Verify the seed
    print("Step 3: Verifying seed...")
    try:
        # Get providers with pricing counts
        for provider_id in provider_ids:
            provider = (
                supabase.table("provider_location")
                .select("*")
                .eq("provider_id", provider_id)
                .execute()
            )
            if provider.data:
                p = provider.data[0]
                provider_location_id = p.get("id")
                # Get pricing for this provider (try both provider_location_id and provider_id for compatibility)
                pricing = (
                    supabase.table("procedure_pricing")
                    .select("price")
                    .or_(f"provider_location_id.eq.{provider_location_id},provider_id.eq.{provider_id}")
                    .execute()
                )
                prices = [float(pr["price"]) for pr in pricing.data if pr.get("price")]

                if prices:
                    print(
                        f"  {p.get('provider_name', 'Unknown')} ({p.get('city', 'N/A')}, {p.get('state', 'N/A')}):"
                    )
                    print(f"    - {len(prices)} pricing records")
                    print(f"    - Price range: ${min(prices):.2f} - ${max(prices):.2f}")
                    print(f"    - Average: ${sum(prices)/len(prices):.2f}")
                else:
                    print(f"  {p.get('provider_name', 'Unknown')}: No pricing records")
    except Exception as e:
        print(f"ERROR: Failed to verify seed: {e}")

    print("\n✅ Demo providers and MRI pricing seeded!")


if __name__ == "__main__":
    main()
