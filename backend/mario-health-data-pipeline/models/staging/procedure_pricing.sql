{{
  config(
    materialized='table'
  )
}}
 -- This is the model where we go from billing codes to Mario-defined procedures to make it more user friendly.
 -- Because a procedure is made up of multiple CPT codes, we take the rate of the cheapest CPT code.

WITH t0 AS (
    SELECT
        map.procedure_id,
        rates.hospital_id,
        rates.npi,
        rates.carrier_id,
        rates.carrier_plan_id,
        ROUND(MIN(professional_rate), 0) AS professional_rate_min,
        ROUND(MIN(institutional_rate), 0) AS institutional_rate_min,
        ROUND(MIN(total_rate), 0) AS total_rate_min,
    FROM
       {{ ref('code_pricing') }} AS rates
    JOIN
        {{ ref('procedure_billing_code') }} AS map
ON
    rates.billing_code = map.code
    AND rates.billing_code_type = map.code_type
    AND CAST(rates.billing_code_type_version AS STRING) = '2025'
GROUP BY
    map.procedure_id,
    rates.npi,
    rates.hospital_id,
    rates.carrier_id,
    rates.carrier_plan_id
),

t1 AS (
    SELECT
        CONCAT(procedure_id, '_', hospital_id, '_', npi, '_', 'united_pp1_00') AS id,
        procedure_id,
        hospital_id AS org_id,
        npi AS provider_id,
        CONCAT(hospital_id, "_", npi) AS provider_location_id,
        carrier_id,
        carrier_name,
        {{ round_price('professional_rate_min') }} AS professional_rate_min,
        {{ round_price('institutional_rate_min') }} AS institutional_rate_min,
        {{ round_price('total_rate_min') }} AS total_rate_min,
        {{ round_price('total_rate_min') }} AS price, -- this is left here to not brake the back end but will have to be
--        removed at some point.
    FROM
        t0
)


SELECT
    t1.id,
    t1.procedure_id,
    t1.org_id,
    t1.provider_id,
    t1.provider_location_id,
    t1.carrier_id,
    t1.carrier_name,
    t1.professional_rate_min,
    t1.institutional_rate_min,
    t1.total_rate_min,
    t1.price,
    CONCAT(
              t_npi.provider_name_prefix_text,
              " ",
              t_npi.provider_first_name,
              " ",
              t_npi.provider_middle_name,
              " ",
            t_npi.provider_last_name,
            " ",
        t_npi.provider_name_suffix_text,
        ", ",
        t_npi.provider_credential_text
        ) AS provider_name,
FROM
    t1
JOIN
      {{ source('mario-mrf-data', 'npidata_pfile_20050523-20250907') }} AS t_npi
    ON
        t1.provider_id = t_npi.npi
