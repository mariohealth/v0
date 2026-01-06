{{
  config(
    materialized='table'
  )
}}

SELECT
    hospital_id,
    billing_code,
    billing_code_type,
    billing_code_type_version,
    COUNT(*) AS count_rows,
    COUNT(DISTINCT npi) AS count_distinct_npi,
    MIN(negotiated_rate_avg) AS min_negotiated_rate_avg,
    AVG(negotiated_rate_avg) AS avg_negotiated_rate_avg,
    MAX(negotiated_rate_avg) AS max_negotiated_rate_avg,
    ARRAY_AGG(DISTINCT npi) AS npi_array,
    ARRAY_AGG(DISTINCT healthcare_provider_taxonomy_code) AS nucc_specialty_array,
FROM
    {{ ref('united_pp1_00_rates_professional_hospital') }}
GROUP BY hospital_id,
    billing_code,
    billing_code_type,
    billing_code_type_version

