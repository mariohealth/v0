{{
  config(
    materialized='table'
  )
}}

SELECT
    carrier_id,
    carrier_plan_id,
    hospital_id,
    COUNT(DISTINCT npi) AS count_npi_with_code,
    COUNT(DISTINCT CONCAT(billing_code_type,billing_code)) AS count_code,
FROM
    {{ ref('code_pricing') }}
GROUP BY
    carrier_id,
    carrier_plan_id,
    hospital_id