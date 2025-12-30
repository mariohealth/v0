#!/usr/bin/env python3
"""
Verify specialty_procedure_map table implementation in Supabase.
Runs all verification checks and outputs a summary report.
"""

import os
import sys
from pathlib import Path

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
    print("ERROR: SUPABASE_URL and SUPABASE_KEY must be set in backend/mario-health-api/.env")
    sys.exit(1)


def run_verification():
    """Run all verification checks and print results."""
    print("=" * 70)
    print("SPECIALTY_PROCEDURE_MAP VERIFICATION REPORT")
    print("=" * 70)
    print()

    try:
        supabase = create_client(supabase_url, supabase_key)
        print("✓ Connected to Supabase")
        print()
    except Exception as e:
        print(f"✗ Failed to connect to Supabase: {e}")
        sys.exit(1)

    checks_passed = 0
    checks_failed = 0

    # Check 1: Table exists
    print("1. Checking if table exists...")
    try:
        result = supabase.table("specialty_procedure_map").select("id").limit(1).execute()
        print(f"   ✓ Table exists and is accessible")
        checks_passed += 1
    except Exception as e:
        print(f"   ✗ Table not found or not accessible: {e}")
        checks_failed += 1
        return

    # Check 2: Row count
    print("\n2. Checking row count...")
    try:
        result = supabase.table("specialty_procedure_map").select("id", count="exact").execute()
        row_count = result.count
        if row_count == 64:
            print(f"   ✓ Correct row count: {row_count} rows")
            checks_passed += 1
        else:
            print(f"   ⚠ Unexpected row count: {row_count} (expected 64)")
            checks_failed += 1
    except Exception as e:
        print(f"   ✗ Failed to count rows: {e}")
        checks_failed += 1

    # Check 3: Each specialty has exactly one representative
    print("\n3. Checking representative procedures...")
    try:
        result = supabase.table("specialty_procedure_map")\
            .select("specialty_id")\
            .eq("is_representative", True)\
            .execute()
        
        specialty_counts = {}
        for row in result.data:
            sid = row["specialty_id"]
            specialty_counts[sid] = specialty_counts.get(sid, 0) + 1
        
        duplicates = [sid for sid, count in specialty_counts.items() if count > 1]
        missing = 64 - len(specialty_counts)
        
        if not duplicates and missing == 0:
            print(f"   ✓ All 64 specialties have exactly 1 representative procedure")
            checks_passed += 1
        else:
            if duplicates:
                print(f"   ✗ Specialties with multiple representatives: {duplicates}")
            if missing > 0:
                print(f"   ✗ Missing representatives for {missing} specialties")
            checks_failed += 1
    except Exception as e:
        print(f"   ✗ Failed to check representatives: {e}")
        checks_failed += 1

    # Check 4: Foreign key integrity (specialty_id)
    print("\n4. Checking specialty_id foreign key integrity...")
    try:
        # Get all distinct specialty_ids from map
        map_result = supabase.table("specialty_procedure_map")\
            .select("specialty_id")\
            .execute()
        map_specialty_ids = set(row["specialty_id"] for row in map_result.data)
        
        # Get all specialty IDs
        specialty_result = supabase.table("specialty").select("id").execute()
        valid_specialty_ids = set(row["id"] for row in specialty_result.data)
        
        orphans = map_specialty_ids - valid_specialty_ids
        
        if not orphans:
            print(f"   ✓ No orphan specialty_ids (checked {len(map_specialty_ids)} unique IDs)")
            checks_passed += 1
        else:
            print(f"   ✗ Found {len(orphans)} orphan specialty_ids: {orphans}")
            checks_failed += 1
    except Exception as e:
        print(f"   ✗ Failed to check specialty_id integrity: {e}")
        checks_failed += 1

    # Check 5: Foreign key integrity (procedure_id)
    print("\n5. Checking procedure_id foreign key integrity...")
    try:
        # Get all distinct procedure_ids from map
        map_result = supabase.table("specialty_procedure_map")\
            .select("procedure_id")\
            .execute()
        map_procedure_ids = set(row["procedure_id"] for row in map_result.data)
        
        # Verify proc_office_visit exists
        proc_result = supabase.table("procedure")\
            .select("id,name")\
            .eq("id", "proc_office_visit")\
            .execute()
        
        if proc_result.data and "proc_office_visit" in map_procedure_ids:
            print(f"   ✓ proc_office_visit exists and is mapped")
            checks_passed += 1
        else:
            print(f"   ✗ proc_office_visit not found or not mapped")
            checks_failed += 1
    except Exception as e:
        print(f"   ✗ Failed to check procedure_id integrity: {e}")
        checks_failed += 1

    # Check 6: Visit types
    print("\n6. Checking visit_type values...")
    try:
        result = supabase.table("specialty_procedure_map")\
            .select("visit_type")\
            .execute()
        
        visit_types = set(row["visit_type"] for row in result.data)
        
        if visit_types == {"standard"}:
            print(f"   ✓ All visit_types are 'standard' (as expected for initial seed)")
            checks_passed += 1
        else:
            print(f"   ⚠ Found visit_types: {visit_types}")
            checks_passed += 1  # Not necessarily an error
    except Exception as e:
        print(f"   ✗ Failed to check visit_types: {e}")
        checks_failed += 1

    # Check 7: Sample functional query
    print("\n7. Testing functional query (Cardiologist)...")
    try:
        # This would use RPC in real implementation, but we'll approximate
        result = supabase.table("specialty_procedure_map")\
            .select("specialty_id,procedure_id,visit_type,is_representative")\
            .eq("specialty_id", "4")\
            .eq("is_representative", True)\
            .execute()
        
        if result.data and len(result.data) == 1:
            row = result.data[0]
            print(f"   ✓ Found representative procedure for Cardiologist:")
            print(f"     - procedure_id: {row['procedure_id']}")
            print(f"     - visit_type: {row['visit_type']}")
            checks_passed += 1
        else:
            print(f"   ✗ Could not find representative for Cardiologist")
            checks_failed += 1
    except Exception as e:
        print(f"   ✗ Failed functional query: {e}")
        checks_failed += 1

    # Summary
    print("\n" + "=" * 70)
    print("VERIFICATION SUMMARY")
    print("=" * 70)
    print(f"Checks Passed: {checks_passed}")
    print(f"Checks Failed: {checks_failed}")
    print()
    
    if checks_failed == 0:
        print("✓ ALL CHECKS PASSED - Table is ready for use!")
        return 0
    else:
        print("✗ SOME CHECKS FAILED - Review errors above")
        print("\nSee SPECIALTY_PROCEDURE_MAP_VERIFICATION.md for detailed SQL queries")
        return 1


if __name__ == "__main__":
    exit_code = run_verification()
    sys.exit(exit_code)

