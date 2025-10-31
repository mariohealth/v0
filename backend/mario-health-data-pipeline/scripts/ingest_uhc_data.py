"""
UHC Data Ingestion Script
Fetches healthcare pricing data and loads into BigQuery
"""

import os
import logging
from datetime import datetime
import pandas as pd
from google.cloud import bigquery

logger = logging.getLogger(__name__)

# Configuration
PROJECT_ID = os.getenv('GCP_PROJECT_ID', 'mario-health-prod')
DATASET_ID = 'analytics'
TABLE_ID = 'raw_healthcare_prices'


def fetch_uhc_data():
    """
    Fetch data from UHC API or file source
    Replace this with your actual data source logic
    """
    logger.info("Fetching UHC pricing data...")
    
    # TODO: Replace with actual API call or file read
    # Example: Load from Google Cloud Storage
    # df = pd.read_json('gs://mario-health-data/uhc-prices.json')
    
    # Mock data for demonstration
    data = {
        'cpt_code': ['70551', '70552', '99213'],
        'procedure_name': ['MRI Brain without contrast', 'MRI Brain with contrast', 'Office Visit'],
        'provider_name': ['Mayo Clinic', 'Cleveland Clinic', 'Local Practice'],
        'price': [1200, 1500, 150],
        'carrier': ['UHC', 'UHC', 'UHC'],
        'effective_date': [datetime.now()] * 3
    }
    
    df = pd.DataFrame(data)
    logger.info(f"Fetched {len(df)} rows")
    
    return df


def clean_and_validate(df):
    """Basic data quality checks"""
    logger.info("Cleaning and validating data...")
    
    # Remove duplicates
    initial_count = len(df)
    df = df.drop_duplicates(subset=['cpt_code', 'provider_name'])
    logger.info(f"Removed {initial_count - len(df)} duplicates")
    
    # Validate required fields
    required_cols = ['cpt_code', 'provider_name', 'price']
    missing_data = df[required_cols].isnull().sum()
    if missing_data.any():
        logger.warning(f"Missing data detected: {missing_data[missing_data > 0]}")
    
    # Remove rows with missing critical data
    df = df.dropna(subset=required_cols)
    
    return df


def load_to_bigquery(df):
    """Load dataframe to BigQuery"""
    logger.info("Loading data to BigQuery...")
    
    client = bigquery.Client(project=PROJECT_ID)
    table_ref = f"{PROJECT_ID}.{DATASET_ID}.{TABLE_ID}"
    
    # Configure load job
    job_config = bigquery.LoadJobConfig(
        write_disposition=bigquery.WriteDisposition.WRITE_TRUNCATE,  # Replace table
        schema_update_options=[
            bigquery.SchemaUpdateOption.ALLOW_FIELD_ADDITION
        ],
        time_partitioning=bigquery.TimePartitioning(
            type_=bigquery.TimePartitioningType.DAY,
            field="effective_date"
        )
    )
    
    # Execute load
    job = client.load_table_from_dataframe(
        df, table_ref, job_config=job_config
    )
    job.result()  # Wait for completion
    
    logger.info(f"✓ Loaded {len(df)} rows to {table_ref}")


def main():
    """Main ingestion workflow"""
    try:
        # Step 1: Fetch data
        df = fetch_uhc_data()
        
        # Step 2: Clean and validate
        df = clean_and_validate(df)
        
        # Step 3: Load to BigQuery
        load_to_bigquery(df)
        
        logger.info("✓ UHC data ingestion complete")
        return True
        
    except Exception as e:
        logger.error(f"✗ Ingestion failed: {e}")
        raise


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    main()
