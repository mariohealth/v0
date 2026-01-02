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
from sqlalchemy.exc import SQLAlchemyError, DataError, IntegrityError
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
                logger.warning(f"⚠️ Null values found:\n{null_counts[null_counts > 0]}")

        # Special validation for zip_codes table
        if self.pg_table == 'zip_codes':
            # Check for invalid coordinates
            if 'latitude' in df.columns:
                invalid_lat = ((df['latitude'] < -90) | (df['latitude'] > 90)).sum()
                if invalid_lat > 0:
                    logger.warning(f"⚠️ Found {invalid_lat} rows with invalid latitude")
                    df = df[(df['latitude'] >= -90) & (df['latitude'] <= 90)]

            if 'longitude' in df.columns:
                invalid_lon = ((df['longitude'] < -180) | (df['longitude'] > 180)).sum()
                if invalid_lon > 0:
                    logger.warning(f"⚠️ Found {invalid_lon} rows with invalid longitude")
                    df = df[(df['longitude'] >= -180) & (df['longitude'] <= 180)]

        # Check for duplicates
        duplicates = df.duplicated().sum()
        if duplicates > 0:
            logger.warning(f"⚠️ Found {duplicates} duplicate rows - removing")
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
        """Insert data in chunks using pandas to_sql with error isolation"""
        chunksize = 10000
        total_chunks = len(df) // chunksize + (1 if len(df) % chunksize else 0)

        for i, chunk_start in enumerate(range(0, len(df), chunksize)):
            chunk_end = min(chunk_start + chunksize, len(df))
            chunk = df[chunk_start:chunk_end].copy()

            try:
                chunk.to_sql(
                    self.pg_table,
                    self.pg_engine,
                    if_exists='append',
                    index=False,
                    method='multi'
                )
                logger.info(f"Loaded chunk {i + 1}/{total_chunks}")

            except (SQLAlchemyError, Exception) as e:
                logger.error(f"❌ Chunk {i + 1} failed. Isolating problematic rows...")
                self._find_bad_rows(chunk, chunk_start, e)
                raise

    def _find_bad_rows(self, chunk, chunk_offset, original_error):
        """
        Binary search through chunk to find exact rows causing the error.
        Much faster than row-by-row for large chunks.
        """
        logger.info(f"🔍 Searching for bad rows in chunk (rows {chunk_offset} - {chunk_offset + len(chunk) - 1})...")

        bad_rows = []

        # If chunk is small enough, check row by row
        if len(chunk) <= 100:
            bad_rows = self._check_rows_individually(chunk, chunk_offset)
        else:
            # Binary search approach for larger chunks
            bad_rows = self._binary_search_bad_rows(chunk, chunk_offset)

        if bad_rows:
            self._log_bad_rows(bad_rows, original_error)
        else:
            # Fallback: log the original error with some context
            logger.error(f"Could not isolate specific bad rows. Original error: {original_error}")
            self._log_chunk_summary(chunk, chunk_offset)

    def _binary_search_bad_rows(self, chunk, chunk_offset):
        """Use binary search to efficiently find bad rows in large chunks"""
        bad_rows = []
        ranges_to_check = [(0, len(chunk))]

        while ranges_to_check:
            start, end = ranges_to_check.pop()
            subset = chunk.iloc[start:end]

            if len(subset) == 0:
                continue

            # Try inserting this subset
            try:
                # Use a transaction that we'll rollback
                with self.pg_engine.connect() as conn:
                    trans = conn.begin()
                    try:
                        subset.to_sql(
                            self.pg_table,
                            conn,
                            if_exists='append',
                            index=False,
                            method='multi'
                        )
                        trans.rollback()  # Don't actually insert, just test
                    except:
                        trans.rollback()
                        raise
            except Exception:
                # This subset has bad rows
                if len(subset) == 1:
                    # Found a bad row
                    bad_rows.append({
                        'index': chunk_offset + start,
                        'data': subset.iloc[0].to_dict()
                    })
                elif len(subset) <= 10:
                    # Small enough to check individually
                    for idx in range(len(subset)):
                        row_bad_rows = self._check_rows_individually(
                            subset.iloc[idx:idx + 1],
                            chunk_offset + start + idx
                        )
                        bad_rows.extend(row_bad_rows)
                else:
                    # Split and check both halves
                    mid = len(subset) // 2
                    ranges_to_check.append((start, start + mid))
                    ranges_to_check.append((start + mid, end))

        return bad_rows

    def _check_rows_individually(self, chunk, chunk_offset):
        """Check each row individually to find bad ones"""
        bad_rows = []

        for idx, (_, row) in enumerate(chunk.iterrows()):
            row_df = pd.DataFrame([row])
            try:
                with self.pg_engine.connect() as conn:
                    trans = conn.begin()
                    try:
                        row_df.to_sql(
                            self.pg_table,
                            conn,
                            if_exists='append',
                            index=False,
                            method='multi'
                        )
                        trans.rollback()
                    except:
                        trans.rollback()
                        raise
            except Exception as row_error:
                bad_rows.append({
                    'index': chunk_offset + idx,
                    'data': row.to_dict(),
                    'error': str(row_error)
                })

        return bad_rows

    def _log_bad_rows(self, bad_rows, original_error):
        """Log the problematic rows in a readable format"""
        logger.error("=" * 60)
        logger.error(f"❌ FOUND {len(bad_rows)} PROBLEMATIC ROW(S)")
        logger.error("=" * 60)

        # Extract error type from original error
        error_type = type(original_error).__name__
        error_msg = str(original_error)

        # Try to extract the specific column/constraint from the error
        error_hint = self._parse_postgres_error(error_msg)
        if error_hint:
            logger.error(f"🎯 Likely issue: {error_hint}")

        logger.error(f"Error type: {error_type}")
        logger.error("-" * 60)

        for i, bad_row in enumerate(bad_rows[:10]):  # Limit to first 10
            logger.error(f"\n📍 Bad Row #{i + 1} (DataFrame index: {bad_row['index']})")

            # Log specific error for this row if available
            if 'error' in bad_row:
                row_hint = self._parse_postgres_error(bad_row['error'])
                if row_hint:
                    logger.error(f"   Issue: {row_hint}")

            # Log each column value on its own line for readability
            for col, val in bad_row['data'].items():
                val_repr = repr(val)
                # Truncate very long values
                if len(val_repr) > 100:
                    val_repr = val_repr[:100] + "... [truncated]"
                logger.error(f"   {col}: {val_repr}")

        if len(bad_rows) > 10:
            logger.error(f"\n... and {len(bad_rows) - 10} more bad rows (showing first 10)")

        logger.error("=" * 60)

    def _parse_postgres_error(self, error_msg):
        """Extract useful info from Postgres error messages"""
        error_msg = str(error_msg).lower()

        # Common patterns
        patterns = [
            ('violates not-null constraint', 'NULL value in NOT NULL column'),
            ('violates unique constraint', 'Duplicate value in unique column'),
            ('violates foreign key constraint', 'Foreign key reference not found'),
            ('violates check constraint', 'Value fails CHECK constraint'),
            ('value too long', 'String value exceeds column length'),
            ('invalid input syntax', 'Wrong data type for column'),
            ('numeric field overflow', 'Number too large for column'),
            ('out of range', 'Value out of allowed range'),
            ('invalid byte sequence', 'Invalid character encoding'),
        ]

        for pattern, hint in patterns:
            if pattern in error_msg:
                # Try to extract column name
                import re
                col_match = re.search(r'column ["\']?(\w+)["\']?', error_msg)
                if col_match:
                    return f"{hint} - Column: {col_match.group(1)}"
                return hint

        return None

    def _log_chunk_summary(self, chunk, chunk_offset):
        """Log summary info about a problematic chunk when we can't isolate specific rows"""
        logger.error("-" * 60)
        logger.error("📊 Chunk Summary (could not isolate specific rows):")
        logger.error(f"   Rows: {chunk_offset} to {chunk_offset + len(chunk) - 1}")
        logger.error(f"   Columns: {list(chunk.columns)}")
        logger.error("\n   Data types:")
        for col in chunk.columns:
            dtype = chunk[col].dtype
            null_count = chunk[col].isnull().sum()
            sample = chunk[col].dropna().iloc[0] if not chunk[col].dropna().empty else "N/A"
            sample_repr = repr(sample)
            if len(sample_repr) > 50:
                sample_repr = sample_repr[:50] + "..."
            logger.error(f"   - {col}: {dtype} (nulls: {null_count}, sample: {sample_repr})")
        logger.error("-" * 60)

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
