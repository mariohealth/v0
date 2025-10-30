#!/usr/bin/env python3
"""
Set up Postgres schemas without requiring psql command
"""

import os
import sys

# Add project root to Python path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_root)

from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()


def setup_schemas():
    """Create all Postgres tables from schema file"""

    # Read schema file
    schema_file = os.path.join(project_root, 'config', 'postgres_schemas.sql')

    if not os.path.exists(schema_file):
        print(f"❌ Schema file not found: {schema_file}")
        sys.exit(1)

    with open(schema_file, 'r') as f:
        schema_sql = f.read()

    # Connect to Postgres
    db_url = os.getenv('POSTGRES_DB_URL')
    if not db_url:
        print("❌ POSTGRES_DB_URL not set in .env")
        sys.exit(1)

    print(f"📊 Connecting to Postgres...")
    engine = create_engine(db_url)

    try:
        with engine.connect() as conn:
            # Split by semicolon and execute each statement
            statements = [s.strip() for s in schema_sql.split(';') if s.strip()]

            for i, statement in enumerate(statements, 1):
                if statement and not statement.startswith('--'):
                    print(f"Executing statement {i}/{len(statements)}...")
                    conn.execute(text(statement))
                    conn.commit()

        print("✅ All schemas created successfully!")

    except Exception as e:
        print(f"❌ Error creating schemas: {e}")
        sys.exit(1)


if __name__ == "__main__":
    setup_schemas()
