#!/usr/bin/env python3
"""
Deploy specialty_procedure_map table using Supabase client.
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
    print("ERROR: SUPABASE_URL and SUPABASE_KEY must be set")
    sys.exit(1)

print("=" * 70)
print("DEPLOYING specialty_procedure_map TABLE")
print("=" * 70)
print()

try:
    supabase = create_client(supabase_url, supabase_key)
    print("✓ Connected to Supabase")
    print()
except Exception as e:
    print(f"✗ Failed to connect: {e}")
    sys.exit(1)

# Read the SQL file
sql_file = script_dir / "config" / "sql" / "02_tables" / "specialty_procedure_map.sql"

if not sql_file.exists():
    print(f"✗ SQL file not found: {sql_file}")
    sys.exit(1)

print(f"📄 Reading SQL from: {sql_file.name}")

with open(sql_file, 'r') as f:
    sql_content = f.read()

print(f"📝 SQL content loaded ({len(sql_content)} characters)")
print()

# Execute SQL using Supabase RPC
# Note: Supabase PostgREST doesn't support DDL directly via the Python client
# We need to use the Supabase SQL Editor or API endpoint
print("⚠️  Note: Supabase Python client doesn't support DDL operations.")
print("   The table must be created via Supabase SQL Editor.")
print()
print("Please execute the following SQL in Supabase SQL Editor:")
print("=" * 70)
print(sql_content)
print("=" * 70)
print()
print("After executing in Supabase, run:")
print("  cd backend/mario-health-data-pipeline")
print("  dbt seed --select specialty_procedure_map")
print()

