{{
  config(
    materialized='table'
  )
}}

WITH t0 AS ( -- because a procedure is made up of multiple CPT codes, we take the rate of the cheapest CPT code
    SELECT
        map.procedure_id,
        rates.hospital_id,
        rates.npi,
        ROUND(MIN(negotiated_rate_avg), 0) AS negotiated_rate_avg_min,
    FROM
       {{ ref('united_pp1_00_rates_hospital') }} AS rates
    JOIN
        {{ ref('procedure_billing_code') }} AS map
ON
    rates.billing_code = map.code
    AND rates.billing_code_type = map.code_type
    AND CAST(rates.billing_code_type_version AS STRING) = '2025'
GROUP BY
    map.procedure_id,
    rates.npi,
    rates.hospital_id
)

SELECT
    CONCAT(procedure_id, '_', hospital_id, '_', npi, '_', 'united_pp1_00') AS id,
    procedure_id,
    hospital_id AS org_id,
    npi AS provider_id,
    'united_pp1_00' AS carrier_id,
    'united' AS carrier_name,
    {{ round_price('negotiated_rate_avg_min') }} AS price
FROM
    t0
