#!/usr/bin/env python3
"""
Multi-table sync orchestrator
Syncs multiple tables from BigQuery to Postgres in sequence
"""

import os
import sys

# Add project root to Python path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_root)

import logging
from datetime import datetime
from dotenv import load_dotenv
from config.tables import TABLES, DEFAULT_SYNC_TABLES
from scripts.sync_data import DataSync

load_dotenv()

logging.basicConfig(
    level=os.getenv('LOG_LEVEL', 'INFO'),
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(f'logs/sync_all_{datetime.now().strftime("%Y%m%d_%H%M%S")}.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)


def sync_all_tables(tables_to_sync=None, force_full_refresh=False):
    """Sync multiple tables in sequence"""
    if tables_to_sync is None:
        tables_to_sync = DEFAULT_SYNC_TABLES

    start_time = datetime.now()
    results = {}

    logger.info("=" * 70)
    logger.info(f"Starting multi-table sync: {len(tables_to_sync)} tables")
    logger.info(f"Tables: {', '.join(tables_to_sync)}")
    logger.info(f"Full refresh: {force_full_refresh}")
    logger.info("=" * 70)

    for table_name in tables_to_sync:
        try:
            logger.info(f"\n{'=' * 70}")
            logger.info(f"Syncing table: {table_name}")
            logger.info(f"{'=' * 70}\n")

            table_config = TABLES[table_name]
            syncer = DataSync(table_config)
            syncer.run(force_full_refresh=force_full_refresh)

            results[table_name] = 'SUCCESS'

        except Exception as e:
            logger.error(f"Failed to sync {table_name}: {e}")
            results[table_name] = f'FAILED: {str(e)}'

    # Summary
    duration = (datetime.now() - start_time).total_seconds()
    logger.info("\n" + "=" * 70)
    logger.info("SYNC SUMMARY")
    logger.info("=" * 70)

    for table_name, status in results.items():
        status_icon = "✅" if status == 'SUCCESS' else "❌"
        logger.info(f"{status_icon} {table_name}: {status}")

    success_count = sum(1 for s in results.values() if s == 'SUCCESS')
    logger.info(f"\nTotal: {success_count}/{len(tables_to_sync)} tables synced successfully")
    logger.info(f"Duration: {duration:.2f} seconds")
    logger.info("=" * 70)

    # Exit with error if any table failed
    if success_count < len(tables_to_sync):
        sys.exit(1)


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description='Sync multiple tables from BigQuery to Postgres')
    parser.add_argument('--tables', nargs='+', choices=TABLES.keys(),
                        help='Specific tables to sync (default: all)')
    parser.add_argument('--full-refresh', action='store_true',
                        help='Force full refresh for all tables')

    args = parser.parse_args()

    sync_all_tables(
        tables_to_sync=args.tables,
        force_full_refresh=args.full_refresh
    )
