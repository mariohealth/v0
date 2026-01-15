{{
  config(
    materialized='table'
  )
}}

-- This is the model where we aggregate the prices for each code (NOT Mario-defined procedure) at the facility level.

SELECT
    carrier_id,
    carrier_plan_id,
    hospital_id,
    billing_code,
    billing_code_type,
    billing_code_type_version,
    COUNT(*) AS count_rows,
    COUNT(DISTINCT npi) AS count_distinct_npi,

    MIN(rate_professional) AS min_professional_rate, -- see the code_pricing model for an explanation of why so many rates
    AVG(rate_professional) AS avg_professional_rate,
    MAX(rate_professional) AS max_professional_rate,

    MIN(rate_technical) AS min_technical_rate,
    MAX(rate_technical) AS max_technical_rate,
    ROUND(AVG(rate_technical)) AS avg_technical_rate,

    MIN(rate_global) AS min_global_rate,
    MAX(rate_global) AS max_global_rate,
    ROUND(AVG(rate_global)) AS avg_global_rate,

    MIN(institutional_rate) AS min_institutional_rate,
    AVG(institutional_rate) AS avg_institutional_rate,
    MAX(institutional_rate) AS max_institutional_rate,

    MIN(total_rate) AS min_total_rate,
    AVG(total_rate) AS avg_total_rate,
    MAX(total_rate) AS max_total_rate,

--    ARRAY_AGG(DISTINCT npi IGNORE NULLS) AS npi_array, -- not really needed and hard to sync with Postgres
--    ARRAY_AGG(DISTINCT healthcare_provider_taxonomy_code IGNORE NULLS) AS nucc_specialty_array,
FROM
    {{ ref('code_pricing') }}
GROUP BY carrier_id,
    carrier_plan_id,
    hospital_id,
    billing_code,
    billing_code_type,
    billing_code_type_version
