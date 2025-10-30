"""
Predefined BigQuery queries for different sync scenarios
"""

# Full table sync
FULL_SYNC = """
SELECT 
    cpt_code,
    cpt_description,
    carrier_name,
    carrier_id,
    price,
    billing_class,
    place_of_service,
    effective_date,
    last_updated
FROM `{project}.{dataset}.{table}`
"""

# Incremental sync (last 7 days)
INCREMENTAL_SYNC = """
SELECT 
    cpt_code,
    cpt_description,
    carrier_name,
    carrier_id,
    price,
    billing_class,
    place_of_service,
    effective_date,
    last_updated
FROM `{project}.{dataset}.{table}`
WHERE last_updated > TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 7 DAY)
"""

# Specific carriers only
CARRIER_FILTER = """
SELECT 
    cpt_code,
    cpt_description,
    carrier_name,
    carrier_id,
    price,
    billing_class,
    place_of_service,
    effective_date,
    last_updated
FROM `{project}.{dataset}.{table}`
WHERE carrier_name IN ('Aetna', 'Blue Cross', 'UnitedHealthcare', 'Cigna', 'Humana')
"""