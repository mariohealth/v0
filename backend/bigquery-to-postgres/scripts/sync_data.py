#!/usr/bin/env python3
"""
BigQuery to Postgres data sync script - Single table sync
Supports both full refresh and incremental sync modes
"""

import os
import sys

# Add project root to Python path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_root)

import logging
from datetime import datetime
from google.cloud import bigquery
import pandas as pd
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(
    level=os.getenv('LOG_LEVEL', 'INFO'),
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(f'logs/sync_{datetime.now().strftime("%Y%m%d_%H%M%S")}.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)


class DataSync:
    def __init__(self, table_config):
        self.bq_client = bigquery.Client(project=os.getenv('GCP_PROJECT_ID'))
        self.pg_engine = create_engine(os.getenv('POSTGRES_DB_URL'))
        self.dataset = os.getenv('BIGQUERY_DATASET')

        # Table-specific config
        self.config = table_config
        self.bq_table = table_config['bigquery_table']
        self.pg_table = table_config['postgres_table']
        self.sync_mode = table_config.get('sync_mode', 'full_refresh')
        self.required_columns = table_config.get('required_columns', [])

    def extract_from_bigquery(self, query=None):
        """Extract data from BigQuery"""
        logger.info(f"Extracting data from BigQuery: {self.dataset}.{self.bq_table}")

        if query is None:
            if self.sync_mode == 'incremental' and self.config.get('incremental_column'):
                query = self._build_incremental_query()
            else:
                query = f"SELECT * FROM `{os.getenv('GCP_PROJECT_ID')}.{self.dataset}.{self.bq_table}`"

        try:
            df = self.bq_client.query(query).to_dataframe()
            logger.info(f"Extracted {len(df)} rows from BigQuery")
            return df
        except Exception as e:
            logger.error(f"BigQuery extraction failed: {e}")
            raise

    def _build_incremental_query(self):
        """Build query for incremental sync"""
        incremental_col = self.config['incremental_column']

        # Get max value from Postgres
        try:
            with self.pg_engine.connect() as conn:
                result = conn.execute(
                    text(f"SELECT MAX({incremental_col}) FROM {self.pg_table}")
                )
                max_value = result.scalar()
        except:
            max_value = None

        if max_value:
            query = f"""
            SELECT * FROM `{os.getenv('GCP_PROJECT_ID')}.{self.dataset}.{self.bq_table}`
            WHERE {incremental_col} > TIMESTAMP('{max_value}')
            """
            logger.info(f"Incremental sync from {max_value}")
        else:
            query = f"SELECT * FROM `{os.getenv('GCP_PROJECT_ID')}.{self.dataset}.{self.bq_table}`"
            logger.info("No existing data, performing full sync")

        return query

    def validate_data(self, df):
        """Basic data quality checks"""
        logger.info("Validating data quality...")

        # Check for required columns
        missing_cols = [col for col in self.required_columns if col not in df.columns]
        if missing_cols:
            raise ValueError(f"Missing required columns: {missing_cols}")

        # Check for nulls in critical fields
        if self.required_columns:
            null_counts = df[self.required_columns].isnull().sum()
            if null_counts.any():
                logger.warning(f"Null values found:\n{null_counts[null_counts > 0]}")

        # Special validation for zip_codes table
        if self.pg_table == 'zip_codes':
            # Check for invalid coordinates
            if 'latitude' in df.columns:
                invalid_lat = ((df['latitude'] < -90) | (df['latitude'] > 90)).sum()
                if invalid_lat > 0:
                    logger.warning(f"Found {invalid_lat} rows with invalid latitude")
                    df = df[(df['latitude'] >= -90) & (df['latitude'] <= 90)]

            if 'longitude' in df.columns:
                invalid_lon = ((df['longitude'] < -180) | (df['longitude'] > 180)).sum()
                if invalid_lon > 0:
                    logger.warning(f"Found {invalid_lon} rows with invalid longitude")
                    df = df[(df['longitude'] >= -180) & (df['longitude'] <= 180)]

        # Check for duplicates
        duplicates = df.duplicated().sum()
        if duplicates > 0:
            logger.warning(f"Found {duplicates} duplicate rows - removing")
            df = df.drop_duplicates()

        logger.info(f"Validation complete. Final row count: {len(df)}")
        return df

    def load_to_postgres(self, df, force_full_refresh=False):
        """Load data into Postgres"""
        is_full_refresh = self.sync_mode == 'full_refresh' or force_full_refresh

        logger.info(f"Loading {len(df)} rows to Postgres table: {self.pg_table}")
        logger.info(f"Mode: {'FULL REFRESH' if is_full_refresh else 'INCREMENTAL'}")

        # Drop location column if it exists (trigger will populate it)
        if 'location' in df.columns:
            logger.info("Dropping 'location' column - will be auto-populated by trigger")
            df = df.drop(columns=['location'])

        try:
            if is_full_refresh:
                # Use TRUNCATE + INSERT to preserve schema/triggers
                self._load_full_refresh(df)
            else:
                # Append mode - simple insert
                self._load_incremental(df)

            logger.info("✅ Data load complete")

            # Verify trigger execution for zip_codes
            if self.pg_table == 'zip_codes':
                self._verify_location_trigger()

        except Exception as e:
            logger.error(f"Postgres load failed: {e}")
            raise

    def _load_full_refresh(self, df):
        """Load with TRUNCATE to preserve schema"""
        logger.info("Using TRUNCATE + INSERT to preserve schema and triggers")

        with self.pg_engine.connect() as conn:
            # Truncate existing data
            logger.info(f"Truncating table: {self.pg_table}")
            conn.execute(text(f"TRUNCATE TABLE {self.pg_table} CASCADE"))
            conn.commit()

            # Insert new data in chunks
            self._insert_chunks(df)

    def _load_incremental(self, df):
        """Load with simple append"""
        logger.info("Appending new data")
        self._insert_chunks(df)

    def _insert_chunks(self, df):
        """Insert data in chunks using pandas to_sql"""
        chunksize = 10000
        total_chunks = len(df) // chunksize + (1 if len(df) % chunksize else 0)

        for i, chunk_start in enumerate(range(0, len(df), chunksize)):
            chunk_end = min(chunk_start + chunksize, len(df))
            chunk = df[chunk_start:chunk_end]

            chunk.to_sql(
                self.pg_table,
                self.pg_engine,
                if_exists='append',  # Always append after TRUNCATE
                index=False,
                method='multi'
            )
            logger.info(f"Loaded chunk {i + 1}/{total_chunks}")

    def _verify_location_trigger(self):
        """Verify that location column was populated by trigger"""
        logger.info("Verifying location trigger execution...")

        with self.pg_engine.connect() as conn:
            result = conn.execute(text(f"""
                SELECT 
                    COUNT(*) as total_rows,
                    COUNT(location) as rows_with_location,
                    COUNT(*) - COUNT(location) as rows_without_location
                FROM {self.pg_table}
            """))
            row = result.fetchone()

            logger.info(f"Total rows: {row[0]}")
            logger.info(f"Rows with location: {row[1]}")
            logger.info(f"Rows without location: {row[2]}")

            if row[2] > 0:
                logger.warning(f"⚠️  {row[2]} rows missing location data (likely NULL lat/lon)")

    def verify_sync(self, original_count):
        """Verify data loaded correctly"""
        logger.info("Verifying sync...")

        with self.pg_engine.connect() as conn:
            result = conn.execute(text(f"SELECT COUNT(*) FROM {self.pg_table}"))
            pg_count = result.scalar()

        if self.sync_mode == 'full_refresh':
            if pg_count == original_count:
                logger.info(f"✅ Verification passed: {pg_count} rows in Postgres")
                return True
            else:
                logger.error(f"❌ Row count mismatch: BQ={original_count}, PG={pg_count}")
                return False
        else:
            logger.info(f"✅ Incremental sync complete: {original_count} new rows added, {pg_count} total rows")
            return True

    def run(self, force_full_refresh=False):
        """Execute full sync pipeline"""
        start_time = datetime.now()
        logger.info("=" * 50)
        logger.info(f"Starting BigQuery → Postgres sync: {self.pg_table}")
        logger.info(f"Mode: {'FULL REFRESH (forced)' if force_full_refresh else self.sync_mode.upper()}")
        logger.info("=" * 50)

        try:
            # Extract
            df = self.extract_from_bigquery()
            original_count = len(df)

            if original_count == 0:
                logger.info("⚠️  No data to sync")
                return

            # Validate
            df = self.validate_data(df)

            # Load
            self.load_to_postgres(df, force_full_refresh=force_full_refresh)

            # Verify
            self.verify_sync(original_count)

            duration = (datetime.now() - start_time).total_seconds()
            logger.info(f"✅ Sync completed successfully in {duration:.2f} seconds")

        except Exception as e:
            logger.error(f"❌ Sync failed: {e}")
            raise


if __name__ == "__main__":
    import argparse
    from config.tables import TABLES

    parser = argparse.ArgumentParser(description='Sync a single table from BigQuery to Postgres')
    parser.add_argument('table', choices=TABLES.keys(), help='Table to sync')
    parser.add_argument('--full-refresh', action='store_true', help='Force full refresh even for incremental tables')

    args = parser.parse_args()

    table_config = TABLES[args.table]
    syncer = DataSync(table_config)
    syncer.run(force_full_refresh=args.full_refresh)
