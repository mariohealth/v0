#!/usr/bin/env python3
"""
Deploy specialty_procedure_map table via Supabase SQL execution.
Uses HTTP requests to execute SQL since Python client doesn't support DDL.
"""

import os
import sys
import requests
from pathlib import Path

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
                parts = line.split("=", 1)
                if len(parts) == 2:
                    key, value = parts
                    if key == "SUPABASE_URL":
                        supabase_url = value.strip()
                    elif key == "SUPABASE_KEY":
                        supabase_key = value.strip()

if not supabase_url or not supabase_key:
    print("ERROR: SUPABASE_URL and SUPABASE_KEY must be set")
    sys.exit(1)

print("=" * 70)
print("DEPLOYING specialty_procedure_map TABLE VIA SQL")
print("=" * 70)
print()

# Read SQL file
sql_file = script_dir / "config" / "sql" / "02_tables" / "specialty_procedure_map.sql"

if not sql_file.exists():
    print(f"✗ SQL file not found: {sql_file}")
    sys.exit(1)

print(f"📄 Reading SQL from: {sql_file.name}")

with open(sql_file, 'r') as f:
    sql_content = f.read()

print(f"📝 SQL loaded ({len(sql_content)} characters)")
print()

# Try to execute via Supabase REST API
# Note: This requires using the query endpoint which may not be exposed
print("Attempting to execute SQL via Supabase API...")
print()

# The SQL needs to be executed directly in Supabase SQL Editor
# Python clients don't support DDL operations

print("⚠️  IMPORTANT: Direct SQL execution via API is not supported.")
print("   Please execute the SQL manually in Supabase SQL Editor.")
print()
print("Instructions:")
print("  1. Go to: https://supabase.com/dashboard")
print("  2. Navigate to SQL Editor")
print("  3. Create new query")
print("  4. Copy the SQL below and execute it")
print()
print("=" * 70)
print("SQL TO EXECUTE:")
print("=" * 70)
print(sql_content)
print("=" * 70)
print()
print("After executing the SQL, run:")
print("  cd backend/mario-health-data-pipeline")
print("  dbt seed --select specialty_procedure_map")
print()

