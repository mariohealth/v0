#!/usr/bin/env python3
"""
Deploy specialty_procedure_map table directly to Supabase PostgreSQL.
"""

import os
import sys
from pathlib import Path

try:
    import psycopg2
except ImportError:
    print("ERROR: psycopg2 not installed. Install with: pip3 install psycopg2-binary")
    sys.exit(1)

# Get database password
db_pass = os.getenv("SUPABASE_DB_PASS")
if not db_pass:
    print("ERROR: SUPABASE_DB_PASS environment variable not set")
    print()
    print("Set it with:")
    print("  export SUPABASE_DB_PASS='your_password'")
    print()
    print("Or run with:")
    print("  SUPABASE_DB_PASS='your_password' python3 deploy_table_direct.py")
    sys.exit(1)

# Connection string
conn_string = f"postgresql://postgres.anvremdouphhucqrxgoq:{db_pass}@aws-1-us-east-1.pooler.supabase.com:5432/postgres"

print("=" * 70)
print("DEPLOYING specialty_procedure_map TABLE")
print("=" * 70)
print()

# Read SQL file
script_dir = Path(__file__).parent
sql_file = script_dir / "config" / "sql" / "02_tables" / "specialty_procedure_map.sql"

if not sql_file.exists():
    print(f"✗ SQL file not found: {sql_file}")
    sys.exit(1)

print(f"📄 Reading SQL from: {sql_file.name}")

with open(sql_file, 'r') as f:
    sql_content = f.read()

print(f"📝 SQL loaded ({len(sql_content)} characters)")
print()

# Connect and execute
try:
    print("🔌 Connecting to Supabase PostgreSQL...")
    conn = psycopg2.connect(conn_string)
    conn.autocommit = True
    cursor = conn.cursor()
    
    print("✓ Connected")
    print()
    
    print("⚙️  Executing SQL...")
    cursor.execute(sql_content)
    
    print("✓ Table created successfully")
    print()
    
    # Verify table exists
    cursor.execute("""
        SELECT COUNT(*) 
        FROM information_schema.tables 
        WHERE table_name = 'specialty_procedure_map' 
          AND table_schema = 'public'
    """)
    count = cursor.fetchone()[0]
    
    if count == 1:
        print("✅ Verification: Table exists in database")
    else:
        print("⚠️  Verification: Table may not have been created")
    
    cursor.close()
    conn.close()
    
    print()
    print("=" * 70)
    print("DEPLOYMENT COMPLETE")
    print("=" * 70)
    print()
    print("Next steps:")
    print("  1. cd backend/mario-health-data-pipeline")
    print("  2. dbt seed --select specialty_procedure_map")
    print()
    
except psycopg2.Error as e:
    print(f"✗ Database error: {e}")
    sys.exit(1)
except Exception as e:
    print(f"✗ Error: {e}")
    sys.exit(1)

