#!/usr/bin/env python3
"""
Quick diagnostic to check what tables exist in Supabase.
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

print("=" * 70)
print("SUPABASE TABLE DIAGNOSTIC")
print("=" * 70)
print()

try:
    supabase = create_client(supabase_url, supabase_key)
    print("✓ Connected to Supabase")
    print()
except Exception as e:
    print(f"✗ Failed to connect: {e}")
    sys.exit(1)

# Check for specialty-related tables
tables_to_check = [
    "specialty",
    "specialty_map",
    "specialty_procedure_map",
    "nucc_specialty_individual",
    "procedure",
]

print("Checking for tables:")
print("-" * 70)

for table in tables_to_check:
    try:
        result = supabase.table(table).select("*", count="exact").limit(1).execute()
        row_count = result.count if result.count else 0
        print(f"✓ {table:<35} EXISTS (rows: {row_count})")
    except Exception as e:
        error_msg = str(e)
        if "PGRST205" in error_msg:
            print(f"✗ {table:<35} NOT FOUND")
        else:
            print(f"⚠ {table:<35} ERROR: {error_msg[:50]}")

print()
print("=" * 70)
print()

# If specialty_procedure_map doesn't exist, provide instructions
try:
    supabase.table("specialty_procedure_map").select("id").limit(1).execute()
except Exception as e:
    if "PGRST205" in str(e):
        print("❌ specialty_procedure_map table does not exist yet!")
        print()
        print("To create the table:")
        print("  1. cd backend/bigquery-to-postgres")
        print("  2. python3 scripts/setup_schemas.py")
        print()
        print("To seed the data:")
        print("  1. cd backend/mario-health-data-pipeline")
        print("  2. dbt seed --select specialty_procedure_map")
        print()

