#!/usr/bin/env python3
"""
Set up Postgres schemas without requiring psql command
Handles dollar-quoted strings (PostgreSQL functions/triggers)
"""

import os
import sys
import re

# Add project root to Python path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_root)

from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()


def split_sql_statements(sql_content):
    """
    Split SQL content into statements, respecting dollar-quoted strings.
    PostgreSQL functions use $$ delimiters which can contain semicolons.
    """
    statements = []
    current_statement = []
    in_dollar_quote = False
    dollar_quote_tag = None

    lines = sql_content.split('\n')

    for line in lines:
        # Skip empty lines and comments
        stripped = line.strip()
        if not stripped or stripped.startswith('--'):
            continue

        # Check for dollar quote start/end
        dollar_quotes = re.findall(r'\$([a-zA-Z_]*)\$', line)

        for quote in dollar_quotes:
            quote_marker = f'${quote}$'
            if not in_dollar_quote:
                # Starting a dollar quote
                in_dollar_quote = True
                dollar_quote_tag = quote_marker
            elif dollar_quote_tag == quote_marker:
                # Ending the dollar quote
                in_dollar_quote = False
                dollar_quote_tag = None

        current_statement.append(line)

        # If we're not in a dollar quote and line ends with semicolon, it's end of statement
        if not in_dollar_quote and stripped.endswith(';'):
            statement = '\n'.join(current_statement).strip()
            if statement:
                statements.append(statement)
            current_statement = []

    # Add any remaining statement
    if current_statement:
        statement = '\n'.join(current_statement).strip()
        if statement and not statement.startswith('--'):
            statements.append(statement)

    return statements


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
        # Split SQL into statements
        statements = split_sql_statements(schema_sql)

        print(f"📝 Found {len(statements)} SQL statements to execute")

        with engine.connect() as conn:
            for i, statement in enumerate(statements, 1):
                # Print abbreviated statement for tracking
                first_line = statement.split('\n')[0][:60]
                print(f"  [{i}/{len(statements)}] {first_line}...")

                try:
                    conn.execute(text(statement))
                    conn.commit()
                except Exception as e:
                    print(f"\n❌ Error executing statement {i}:")
                    print(f"Statement: {statement[:200]}...")
                    print(f"Error: {e}")
                    raise

        print("\n✅ All schemas created successfully!")

        # Verify key objects
        with engine.connect() as conn:
            # Check tables
            result = conn.execute(text("""
                                       SELECT table_name
                                       FROM information_schema.tables
                                       WHERE table_schema = 'public'
                                         AND table_type = 'BASE TABLE'
                                       ORDER BY table_name
                                       """))
            tables = [row[0] for row in result]

            print(f"\n📊 Tables created: {', '.join(tables)}")

            # Check functions
            result = conn.execute(text("""
                                       SELECT routine_name
                                       FROM information_schema.routines
                                       WHERE routine_schema = 'public'
                                         AND routine_type = 'FUNCTION'
                                       ORDER BY routine_name
                                       """))
            functions = [row[0] for row in result]

            if functions:
                print(f"⚙️  Functions created: {', '.join(functions)}")

            # Check triggers
            result = conn.execute(text("""
                                       SELECT DISTINCT trigger_name
                                       FROM information_schema.triggers
                                       WHERE trigger_schema = 'public'
                                       ORDER BY trigger_name
                                       """))
            triggers = [row[0] for row in result]

            if triggers:
                print(f"🔧 Triggers created: {', '.join(triggers)}")

    except Exception as e:
        print(f"\n❌ Error creating schemas: {e}")
        sys.exit(1)


if __name__ == "__main__":
    setup_schemas()
