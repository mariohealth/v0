{{
  config(
    materialized='table'
  )
}}
-- Purpose: Link institutional rates to hospitals via TIN mappings
-- Key difference from professional: NO specialty_map join (facilities serve all specialties)
-- Output: One rate per hospital per billing code (no NPI dimension)
WITH t0 AS (
    SELECT
        hos.hospital_id,
        tins.tin,
        inst_rates.billing_code,
        inst_rates.billing_code_type,
        inst_rates.billing_code_type_version,
        inst_rates.negotiated_rate_avg,
    FROM {{ ref('hospitals') }} AS hos
    LEFT JOIN {{ ref('hospital_tins') }} AS tins
        ON hos.hospital_id = tins.hospital_id
    LEFT JOIN {{ ref('united_pp1_00_prov_ref_unnest') }} AS prov_ref
        ON prov_ref.tin_type = 'ein'
        AND tins.tin = prov_ref.tin_value
    LEFT JOIN {{ ref('united_pp1_00_rates_institutional_unnest') }} AS inst_rates
        ON inst_rates.provider_group_id = prov_ref.provider_group_id
        AND CAST(inst_rates.billing_code_type_version AS STRING) = '2025'
    WHERE hos.operational_status = 'active'
        AND inst_rates.billing_code IS NOT NULL -- Filter out hospitals with no institutional pricing
)
SELECT
    hospital_id,
    billing_code,
    billing_code_type,
    billing_code_type_version,
    ROUND(AVG(negotiated_rate_avg), 0) AS inst_rate_avg, -- Average across multiple TINs if hospital has multiple
FROM t0
GROUP BY 1,2,3,4
