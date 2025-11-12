"""
Table configuration for BigQuery → Postgres sync
Add/remove tables here to control what gets synced
"""

TABLES = {
    'procedure': {
        'bigquery_table': 'procedure',
        'postgres_table': 'procedure',
        'primary_key': 'id',
        'required_columns': ['family_id', 'name', 'slug', 'description'],
        'sync_mode': 'full_refresh',  # 'full_refresh' or 'incremental'
        'incremental_column': None,  # e.g., 'last_updated' for incremental
    },
    'procedure_billing_code': {
        'bigquery_table': 'procedure_billing_code',
        'postgres_table': 'procedure_billing_code',
        'primary_key': 'procedure_id',
        'required_columns': ['code', 'code_type', 'description', 'is_primary'],
        'sync_mode': 'full_refresh',
        'incremental_column': None,
    },

    'procedure_category': {
        'bigquery_table': 'procedure_category',
        'postgres_table': 'procedure_category',
        'primary_key': 'id',
        'required_columns': ['name', 'slug', 'emoji', 'description'],
        'sync_mode': 'full_refresh',
        'incremental_column': None,
    },
    'procedure_family': {
        'bigquery_table': 'procedure_family',
        'postgres_table': 'procedure_family',
        'primary_key': 'id',
        'required_columns': ['category_id', 'name', 'slug', 'description'],
        'sync_mode': 'full_refresh',
        'incremental_column': None,
    },
    'procedure_pricing': {
        'bigquery_table': 'procedure_pricing',
        'postgres_table': 'procedure_pricing',
        'primary_key': 'id',
        'required_columns': ['procedure_id',
                             'org_id',
                             'provider_id',
                             'provider_location_id',
                             'carrier_id',
                             'carrier_name',
                             'price'],
        'sync_mode': 'full_refresh',
        'incremental_column': None,
    },

    'provider_location': {
        'bigquery_table': 'provider_location',
        'postgres_table': 'provider_location',
        'primary_key': 'id',
        'required_columns': ['provider_id',
                             'provider_name',
                             'org_id',
                             'org_name',
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

    'zip_codes': {
        'bigquery_table': 'zip_codes',
        'postgres_table': 'zip_codes',
        'primary_key': 'zip_code',
        'required_columns': ['city', 'county', 'state_code', 'latitude', 'longitude'],
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
DEFAULT_SYNC_TABLES = [
    'provider_location',
    'procedure',
    'procedure_billing_code',
    'procedure_category',
    'procedure_family',
    'procedure_pricing',

    # these BQ tables are huge so it takes a couple of minutes to sync so I don't include it
    # BUT if you ran the setup_schemas.py script then zip codes have been erased
    'zip_codes',

]
