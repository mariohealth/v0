"""
Table configuration for BigQuery → Postgres sync
Add/remove tables here to control what gets synced
"""

TABLES = {
    'zip_codes': {
        'bigquery_table': 'zip_codes',
        'postgres_table': 'zip_codes',
        'primary_key': 'zip_code',
        'required_columns': ['city', 'county', 'state_code', 'latitude', 'longitude'],
        'sync_mode': 'full_refresh',  # 'full_refresh' or 'incremental'
        'incremental_column': None,  # e.g., 'last_updated' for incremental
    },

    'provider_location': {
        'bigquery_table': 'provider_location',
        'postgres_table': 'provider_location',
        'primary_key': 'id',
        'required_columns': ['provider_id',
                             'provider_name',
                             'address',
                             'city',
                             'state',
                             'zip_code',
                             'latitude',
                             'longitude',
                             'phone'],
        'sync_mode': 'full_refresh',  # 'full_refresh' or 'incremental'
        'incremental_column': None,  # e.g., 'last_updated' for incremental
    },

    # 'healthcare_prices': {
    #     'bigquery_table': 'healthcare_pricing_data',
    #     'postgres_table': 'healthcare_prices',
    #     'primary_key': 'id',
    #     'required_columns': ['cpt_code', 'price', 'carrier_name'],
    #     'sync_mode': 'full_refresh',  # 'full_refresh' or 'incremental'
    #     'incremental_column': None,  # e.g., 'last_updated' for incremental
    # },
    # 'carriers': {
    #     'bigquery_table': 'carrier_information',
    #     'postgres_table': 'carriers',
    #     'primary_key': 'carrier_id',
    #     'required_columns': ['carrier_id', 'carrier_name'],
    #     'sync_mode': 'full_refresh',
    # },
    # 'cpt_codes': {
    #     'bigquery_table': 'cpt_code_master',
    #     'postgres_table': 'cpt_codes',
    #     'primary_key': 'cpt_code',
    #     'required_columns': ['cpt_code', 'description'],
    #     'sync_mode': 'full_refresh',
    # },
    # 'provider_networks': {
    #     'bigquery_table': 'provider_network_data',
    #     'postgres_table': 'provider_networks',
    #     'primary_key': 'provider_id',
    #     'required_columns': ['provider_id', 'network_name'],
    #     'sync_mode': 'incremental',
    #     'incremental_column': 'last_updated',
    # },
}

# Tables to sync by default (can be overridden via CLI)
DEFAULT_SYNC_TABLES = list(TABLES.keys())
