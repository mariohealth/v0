"""
Table configuration for BigQuery → Postgres sync
Add/remove tables here to control what gets synced
"""

TABLES = {
    'hospital_aliases' : {
        'bigquery_table': 'hospital_aliases',
        'postgres_table': 'hospital_aliases',
        'required_columns': ['hospital_id',
                         'alias',
                         'alias_type'
                         ],
        'sync_mode': 'full_refresh',
        'incremental_column': None,
    },

    'hospital_systems' : {
        'bigquery_table': 'hospital_systems',
        'postgres_table': 'hospital_systems',
        'primary_key': 'system_id',
        'required_columns': ['system_name',
                             'headquarters_city',
                             'headquarters_state',
                             'system_type',
                             'total_hospitals',
                             'coverage_area'
                         ],
        'sync_mode': 'full_refresh',
        'incremental_column': None,
    },

    'hospitals': {
        'bigquery_table': 'hospitals',
        'postgres_table': 'hospitals',
        'primary_key': 'hospital_id',
        'required_columns': ['hospital_name',
                             'system_id',
                             'address',
                             'city',
                             'state',
                             'zip_code',
                             'latitude',
                             'longitude',
                             'phone',
                             'hospital_type',
                             'operational_status',
                             ],
        'sync_mode': 'full_refresh',
        'incremental_column': None,
    },

    'insurance_carriers' : {
        'bigquery_table': 'insurance_carriers',
    'postgres_table': 'insurance_carriers',
    'primary_key': 'id',
    'required_columns': ['name', 'is_used'],
    'sync_mode': 'full_refresh',
    'incremental_column': None,
    },

    'insurance_plans' : {
        'bigquery_table': 'insurance_plans',
    'postgres_table': 'insurance_plans',
    'primary_key': 'id',
    'required_columns': ['name', 'carrier_id', 'type'],
    'sync_mode': 'full_refresh',
    'incremental_column': None,
    },


    'nucc_specialty_individual':{
        'bigquery_table': 'nucc_specialty_individual',
        'postgres_table': 'nucc_specialty_individual',
        'primary_key': 'id',
        'required_columns': ['grouping',
                         'display_name',
                         'definition'
                         ],
        'sync_mode': 'full_refresh',
        'incremental_column': None,
    },

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
                             'provider_name',
                             'provider_location_id',
                             'carrier_id',
                             'carrier_name',
                             'price'],
        'sync_mode': 'full_refresh',
        'incremental_column': None,
    },

    'procedure_org_pricing': {
        'bigquery_table': 'procedure_org_pricing',
        'postgres_table': 'procedure_org_pricing',
        'primary_key': 'id',
        'required_columns': ['org_id',
                             'procedure_id',
                             'carrier_id',
                             'carrier_name',
                             'count_provider',
                             'min_price',
                             'max_price',
                             'avg_price',
                             'org_name',
                             'org_type',
                             'address',
                             'city',
                             'state',
                             'zip_code',
                             'latitude',
                             'longitude',
                             'phone',
                             ],
        'sync_mode': 'full_refresh',
        'incremental_column': None,
    },

    'provider': {
        'bigquery_table': 'provider',
        'postgres_table': 'provider',
        'primary_key': 'id',
        'required_columns': ['provider_id',
                             'name_prefix',
                             'first_name',
                             'middle_name',
                             'last_name',
                             'name_suffix',
                             'credential',
                             'specialty_id',
                             'license_number',
                             'license_state_code',
                             'specialty_name',
                             ],
        'sync_mode': 'full_refresh',  # 'full_refresh' or 'incremental'
        'incremental_column': None,  # e.g., 'last_updated' for incremental
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

    'specialty': {
        'bigquery_table': 'specialty',
        'postgres_table': 'specialty',
        'primary_key': 'id',
        'required_columns': ['name', 'slug', 'is_used', 'description'],
        'sync_mode': 'full_refresh',
        'incremental_column': None,
    },

    'specialty_map': {
        'bigquery_table': 'specialty_map',
        'postgres_table': 'specialty_map',
        'required_columns': ['specialty_id','taxonomy_id'],
        'sync_mode': 'full_refresh',
        'incremental_column': None,
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
    'procedure_org_pricing',

    # these BQ tables are huge so it takes a couple of minutes to sync so I don't include it
    # BUT if you ran the setup_schemas.py script then zip codes have been erased
    'zip_codes',

]
