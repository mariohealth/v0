#!/usr/bin/env python3
"""
Set up Postgres schemas from organized SQL files
Executes files in order: extensions → functions → tables → indexes → triggers → constraints
"""

import os
import sys
import glob

project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_root)

from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()


def execute_sql_file(conn, filepath):
    """Execute a single SQL file"""
    filename = os.path.basename(filepath)
    print(f"  📄 Executing: {filename}")

    with open(filepath, 'r') as f:
        sql_content = f.read()

    # Skip empty files
    if not sql_content.strip():
        print(f"     ⏭️  Skipped (empty)")
        return

    try:
        conn.execute(text(sql_content))
        conn.commit()
        print(f"     ✅ Success")
    except Exception as e:
        print(f"     ❌ Error: {str(e)[:100]}")
        raise


def setup_schemas():
    """Execute all SQL files in order"""

    sql_dir = os.path.join(project_root, 'config', 'sql')

    if not os.path.exists(sql_dir):
        print(f"❌ SQL directory not found: {sql_dir}")
        sys.exit(1)

    # Define execution order
    file_order = [
        '00_extensions.sql',
        '01_functions.sql',
        '02_tables/*.sql',  # All files in tables directory
        '03_indexes.sql',
        '04_triggers.sql',
        '05_constraints.sql',
        '06_views.sql',
    ]

    db_url = os.getenv('POSTGRES_DB_URL')
    if not db_url:
        print("❌ POSTGRES_DB_URL not set in .env")
        sys.exit(1)

    print(f"📊 Connecting to Postgres...")
    engine = create_engine(db_url)

    try:
        with engine.connect() as conn:
            print(f"\n🏗️  Setting up database schema...\n")

            for pattern in file_order:
                filepath_pattern = os.path.join(sql_dir, pattern)

                # Handle wildcards (e.g., 02_tables/*.sql)
                if '*' in pattern:
                    files = sorted(glob.glob(filepath_pattern))
                    if not files:
                        print(f"⚠️  No files found matching: {pattern}")
                        continue

                    print(f"\n📁 {os.path.dirname(pattern)}/")
                    for filepath in files:
                        execute_sql_file(conn, filepath)
                else:
                    # Single file
                    if os.path.exists(filepath_pattern):
                        print(f"\n📝 {pattern}")
                        execute_sql_file(conn, filepath_pattern)
                    else:
                        print(f"⏭️  Skipping {pattern} (file not found)")

        print("\n✅ All schemas created successfully!\n")

        # Verify setup
        with engine.connect() as conn:
            # Tables
            result = conn.execute(text("""
                                       SELECT table_name
                                       FROM information_schema.tables
                                       WHERE table_schema = 'public'
                                         AND table_type = 'BASE TABLE'
                                       ORDER BY table_name
                                       """))
            tables = [row[0] for row in result]
            print(f"📊 Tables: {', '.join(tables)}")

            # Functions
            result = conn.execute(text("""
                                       SELECT routine_name
                                       FROM information_schema.routines
                                       WHERE routine_schema = 'public'
                                         AND routine_type = 'FUNCTION'
                                       ORDER BY routine_name
                                       """))
            functions = [row[0] for row in result]
            if functions:
                print(f"⚙️  Functions: {', '.join(functions)}")

            # Triggers
            result = conn.execute(text("""
                                       SELECT DISTINCT trigger_name
                                       FROM information_schema.triggers
                                       WHERE trigger_schema = 'public'
                                       ORDER BY trigger_name
                                       """))
            triggers = [row[0] for row in result]
            if triggers:
                print(f"🔧 Triggers: {', '.join(triggers)}")

            # Views
            result = conn.execute(text("""
                                       SELECT table_name
                                       FROM information_schema.views
                                       WHERE table_schema = 'public'
                                       ORDER BY table_name
                                       """))
            views = [row[0] for row in result]
            if views:
                print(f"👁️  Views: {', '.join(views)}")

    except Exception as e:
        print(f"\n❌ Error setting up schemas: {e}")
        sys.exit(1)


if __name__ == "__main__":
    setup_schemas()
