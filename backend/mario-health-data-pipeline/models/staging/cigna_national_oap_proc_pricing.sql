{{
  config(
    materialized='table'
  )
}}

WITH t0 AS (
    SELECT
        map.procedure_id,
        rates.npi,
        ROUND(MIN(negotiated_rate_avg), 0) AS negotiated_rate_avg_min,
    FROM
       {{ ref('cigna_national_oap_rates_prov_type_2_new_york') }} AS rates
    JOIN
        {{ ref('procedure_billing_code') }} AS map
ON
    rates.billing_code = map.code
    AND rates.billing_code_type = map.code_type
    AND CAST(rates.billing_code_type_version AS STRING) = '2025'
GROUP BY
    map.procedure_id,
    rates.npi
)

SELECT
    CONCAT(procedure_id, '_', npi, '_', 'cigna_national_oap') AS id,
    procedure_id,
    npi AS provider_id,
    'cigna_national_oap' AS carrier_id,
    'cigna' AS carrier_name,
    {{ round_price('negotiated_rate_avg_min') }} AS price
FROM
    t0

