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
    MIN(professional_rate) AS min_professional_rate,
    AVG(professional_rate) AS avg_professional_rate,
    MAX(professional_rate) AS max_professional_rate,

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
