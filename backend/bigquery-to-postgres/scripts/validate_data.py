#!/usr/bin/env python3
"""
Data validation checks for all tables
Run this after sync to verify data quality
"""

import os
import sys

# Add project root to Python path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_root)

from sqlalchemy import create_engine, text
from dotenv import load_dotenv
from config.tables import TABLES

load_dotenv()


def run_validation_checks(table_name=None):
    engine = create_engine(os.getenv('POSTGRES_DB_URL'))

    tables_to_validate = [table_name] if table_name else TABLES.keys()

    print("\n" + "=" * 70)
    print("DATA VALIDATION REPORT")
    print("=" * 70 + "\n")

    for table in tables_to_validate:
        config = TABLES[table]
        pg_table = config['postgres_table']

        print(f"📊 {pg_table.upper()}")
        print("-" * 70)

        checks = {
            'Total rows': f"SELECT COUNT(*) FROM {pg_table}",
            'Null required fields': None,  # Custom per table
        }

        # Add table-specific checks
        if pg_table == 'healthcare_prices':
            checks.update({
                'Null prices': f"SELECT COUNT(*) FROM {pg_table} WHERE price IS NULL",
                'Negative prices': f"SELECT COUNT(*) FROM {pg_table} WHERE price < 0",
                'Unique CPT codes': f"SELECT COUNT(DISTINCT cpt_code) FROM {pg_table}",
                'Unique carriers': f"SELECT COUNT(DISTINCT carrier_name) FROM {pg_table}",
            })
        elif pg_table == 'carriers':
            checks.update({
                'Null carrier names': f"SELECT COUNT(*) FROM {pg_table} WHERE carrier_name IS NULL",
            })
        elif pg_table == 'cpt_codes':
            checks.update({
                'Null descriptions': f"SELECT COUNT(*) FROM {pg_table} WHERE description IS NULL",
            })
        elif pg_table == 'provider_networks':
            checks.update({
                'Orphaned providers': f"SELECT COUNT(*) FROM {pg_table} WHERE carrier_id NOT IN (SELECT carrier_id FROM carriers)",
            })

        with engine.connect() as conn:
            for check_name, query in checks.items():
                if query:
                    try:
                        result = conn.execute(text(query)).scalar()
                        print(f"{check_name:.<40} {result:>10,}")
                    except Exception as e:
                        print(f"{check_name:.<40} {'ERROR':>10}")

        print()

    print("=" * 70 + "\n")


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description='Validate synced data')
    parser.add_argument('--table', choices=TABLES.keys(),
                        help='Validate specific table (default: all)')

    args = parser.parse_args()
    run_validation_checks(args.table)
