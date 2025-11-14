{{
  config(
    materialized='table'
  )
}}

WITH t0 AS (
    SELECT DISTINCT code, code_type
    FROM {{ ref('procedure_billing_code') }}
)

SELECT
  rates.*
FROM t0
JOIN {{ source('mario-mrf-data', 'uhc_apple_in_network_rates') }} AS rates -- don't do a left join here otherwise you
-- have null rates if the insurer doesn't list some codes
ON
  t0.code = rates.billing_code
  AND t0.code_type = rates.billing_code_type
  AND rates.billing_code_type_version = 2025
