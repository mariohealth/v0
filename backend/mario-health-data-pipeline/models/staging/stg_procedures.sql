{{
  config(
    materialized='table',
    partition_by={
      'field': 'effective_date',
      'data_type': 'timestamp',
      'granularity': 'day'
    },
    cluster_by=['cpt_code', 'carrier']
  )
}}

/*
  Staging model: Clean and normalize raw healthcare pricing data
  
  Transformations:
  - Standardize CPT codes (remove spaces, uppercase)
  - Calculate price statistics
  - Add search-friendly fields
  - Filter out invalid records
*/

WITH raw_prices AS (
  SELECT * FROM {{ source('analytics', 'raw_healthcare_prices') }}
),

cleaned AS (
  SELECT
    -- Standardize CPT codes
    UPPER(TRIM(cpt_code)) AS cpt_code,
    
    -- Normalize procedure names
    TRIM(procedure_name) AS procedure_name,
    LOWER(TRIM(procedure_name)) AS procedure_name_searchable,
    
    -- Provider info
    TRIM(provider_name) AS provider_name,
    
    -- Pricing
    CAST(price AS FLOAT64) AS price,
    
    -- Metadata
    carrier,
    effective_date,
    CURRENT_TIMESTAMP() AS processed_at
    
  FROM raw_prices
  
  WHERE 
    -- Filter out invalid records
    cpt_code IS NOT NULL
    AND procedure_name IS NOT NULL
    AND price > 0
    AND LENGTH(cpt_code) >= 5
),

with_statistics AS (
  SELECT
    *,
    
    -- Calculate percentile pricing for each CPT code
    PERCENTILE_CONT(price, 0.25) OVER (PARTITION BY cpt_code) AS price_p25,
    PERCENTILE_CONT(price, 0.50) OVER (PARTITION BY cpt_code) AS price_median,
    PERCENTILE_CONT(price, 0.75) OVER (PARTITION BY cpt_code) AS price_p75,
    
    -- Count providers for each procedure
    COUNT(*) OVER (PARTITION BY cpt_code) AS provider_count
    
  FROM cleaned
)

SELECT * FROM with_statistics
