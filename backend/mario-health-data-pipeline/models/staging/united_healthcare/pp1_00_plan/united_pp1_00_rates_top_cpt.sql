{{
  config(
    materialized='table'
  )
}}

WITH t0 AS (
    SELECT DISTINCT code
    FROM {{ ref('procedure_billing_code') }}
    WHERE code_type = 'CPT'
)

SELECT
  rates.*
FROM t0
LEFT JOIN {{ source('mario-mrf-data', 'uhc_apple_in_network_rates') }} AS rates
ON
  t0.code = rates.billing_code
  AND rates.billing_code_type = 'CPT'
  AND rates.billing_code_type_version = 2025
