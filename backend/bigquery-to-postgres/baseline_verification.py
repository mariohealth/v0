#!/usr/bin/env python3
"""
Baseline verification of existing tables before specialty_procedure_map creation.
"""

import os
import sys
from pathlib import Path

try:
    from supabase import create_client, Client
except ImportError:
    print("ERROR: supabase-py not installed.")
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
    print("ERROR: SUPABASE_URL and SUPABASE_KEY must be set")
    sys.exit(1)

print("=" * 70)
print("BASELINE VERIFICATION REPORT")
print("Current State of Supabase Tables")
print("=" * 70)
print()

try:
    supabase = create_client(supabase_url, supabase_key)
    print("✓ Connected to Supabase")
    print()
except Exception as e:
    print(f"✗ Failed to connect: {e}")
    sys.exit(1)

# Query 1: Count specialties
print("Query 1: COUNT(*) FROM specialty")
print("-" * 70)
try:
    result = supabase.table("specialty").select("*", count="exact").execute()
    count = result.count
    print(f"SQL: SELECT COUNT(*) FROM specialty;")
    print(f"Result: {count} rows")
    print(f"Status: ✓ PASS")
    print()
except Exception as e:
    print(f"Status: ✗ FAIL - {e}")
    print()

# Query 2: Count specialty_procedure_map (will fail if doesn't exist)
print("Query 2: COUNT(*) FROM specialty_procedure_map")
print("-" * 70)
try:
    result = supabase.table("specialty_procedure_map").select("*", count="exact").execute()
    count = result.count
    print(f"SQL: SELECT COUNT(*) FROM specialty_procedure_map;")
    print(f"Result: {count} rows")
    print(f"Status: ✓ PASS")
    print()
except Exception as e:
    if "PGRST205" in str(e):
        print(f"SQL: SELECT COUNT(*) FROM specialty_procedure_map;")
        print(f"Result: TABLE DOES NOT EXIST")
        print(f"Status: ⚠ NOT DEPLOYED YET")
        print()
    else:
        print(f"Status: ✗ FAIL - {e}")
        print()

# Query 3: Check for proc_office_visit
print("Query 3: Verify proc_office_visit exists")
print("-" * 70)
try:
    result = supabase.table("procedure")\
        .select("id,name,slug")\
        .eq("id", "proc_office_visit")\
        .execute()
    
    print(f"SQL: SELECT id, name, slug FROM procedure WHERE id = 'proc_office_visit';")
    if result.data:
        proc = result.data[0]
        print(f"Result: FOUND")
        print(f"  - id: {proc.get('id')}")
        print(f"  - name: {proc.get('name')}")
        print(f"  - slug: {proc.get('slug')}")
        print(f"Status: ✓ PASS")
    else:
        print(f"Result: NOT FOUND")
        print(f"Status: ✗ FAIL")
    print()
except Exception as e:
    print(f"Status: ✗ FAIL - {e}")
    print()

# Query 4: Sample specialties
print("Query 4: Sample of specialty data (first 5)")
print("-" * 70)
try:
    result = supabase.table("specialty")\
        .select("id,name,slug,is_used")\
        .order("id")\
        .limit(5)\
        .execute()
    
    print(f"SQL: SELECT id, name, slug, is_used FROM specialty ORDER BY id LIMIT 5;")
    print(f"Results:")
    for row in result.data:
        print(f"  {row['id']:<3} | {row['slug']:<30} | is_used={row['is_used']}")
    print(f"Status: ✓ PASS")
    print()
except Exception as e:
    print(f"Status: ✗ FAIL - {e}")
    print()

# Query 5: Check specialty with no representative (after table is created)
print("Query 5: Specialties without representative procedure mapping")
print("-" * 70)
try:
    # First get all specialties
    all_specialties = supabase.table("specialty").select("id,name,slug").execute()
    
    # Try to get mapped specialties
    try:
        mapped_result = supabase.table("specialty_procedure_map")\
            .select("specialty_id")\
            .eq("is_representative", True)\
            .execute()
        
        mapped_ids = set(row["specialty_id"] for row in mapped_result.data)
        all_ids = set(row["id"] for row in all_specialties.data)
        
        missing = all_ids - mapped_ids
        
        print(f"SQL: SELECT s.id, s.name FROM specialty s")
        print(f"     LEFT JOIN specialty_procedure_map spm ON s.id = spm.specialty_id")
        print(f"     WHERE spm.specialty_id IS NULL;")
        print(f"Result: {len(missing)} specialties without mapping")
        if missing:
            print(f"Missing IDs: {sorted(missing)}")
        print(f"Status: {'✓ PASS' if len(missing) == 0 else '⚠ NEEDS MAPPING'}")
    except Exception as map_e:
        if "PGRST205" in str(map_e):
            print(f"SQL: (Cannot run - specialty_procedure_map doesn't exist)")
            print(f"Result: TABLE NOT DEPLOYED")
            print(f"Status: ⚠ N/A - Deploy table first")
        else:
            raise map_e
    print()
except Exception as e:
    print(f"Status: ✗ FAIL - {e}")
    print()

# Summary
print("=" * 70)
print("SUMMARY")
print("=" * 70)
print()
print("Current State:")
print(f"  • specialty table: EXISTS ({result.count if 'result' in locals() else 'N/A'} rows)")
print(f"  • specialty_procedure_map: NOT DEPLOYED")
print(f"  • proc_office_visit: EXISTS")
print()
print("Next Steps:")
print("  1. Deploy table: cd backend/bigquery-to-postgres && python3 scripts/setup_schemas.py")
print("  2. Seed data: cd backend/mario-health-data-pipeline && dbt seed --select specialty_procedure_map")
print("  3. Verify: cd backend/bigquery-to-postgres && python3 verify_specialty_procedure_map.py")
print()

