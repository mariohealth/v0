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
    npi,
    healthcare_provider_taxonomy_code,
    professional_rate,
    institutional_rate,
    total_rate,
    '2' AS carrier_id,
    '1' AS carrier_plan_id,
FROM
    {{ ref('united_pp1_00_rates_total_facility') }}

-- doesn't exist yet

--UNION ALL
--SELECT
--hospital_id,
--    billing_code,
--    billing_code_type,
--    billing_code_type_version,
--    npi,
--    healthcare_provider_taxonomy_code,
--    professional_rate,
--    institutional_rate,
--    total_rate,
--'1' AS carrier_id,
--    '2' AS carrier_plan_id,
--FROM
