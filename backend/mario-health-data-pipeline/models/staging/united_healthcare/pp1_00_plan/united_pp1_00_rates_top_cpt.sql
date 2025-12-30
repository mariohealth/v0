{{
  config(
    materialized='table'
  )
}}

-- this table doesn't include all billing codes but only the ones included in procedure_billing_code to make the size
--of the table more manageable

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
