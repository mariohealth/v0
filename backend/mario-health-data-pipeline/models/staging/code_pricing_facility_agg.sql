{{
  config(
    materialized='table'
  )
}}

-- this is the model where we union the prices for each code (NOT Mario-defined procedure) at the facility level

SELECT
    hospital_id,
    billing_code,
    billing_code_type,
    billing_code_type_version,
    count_rows,
    count_distinct_npi,
    min_negotiated_rate_avg,
    avg_negotiated_rate_avg,
    max_negotiated_rate_avg,
    npi_array,
    nucc_specialty_array,
    '1' AS carrier_id,
    '2' AS carrier_plan_id,
FROM
    {{ ref('cigna_national_oap_code_pricing_facility_agg') }}
UNION ALL
SELECT
    hospital_id,
    billing_code,
    billing_code_type,
    billing_code_type_version,
    count_rows,
    count_distinct_npi,
    min_negotiated_rate_avg,
    avg_negotiated_rate_avg,
    max_negotiated_rate_avg,
    npi_array,
    nucc_specialty_array,
    '2' AS carrier_id,
    '1' AS carrier_plan_id,
FROM
    {{ ref('united_pp1_00_code_pricing_facility_agg') }}
