{{
  config(
    materialized='table'
  )
}}

-- This table has one row per hospital id per billing code.
-- This is where we add facility/hospital info to our institutional rates.
-- We have to do it this way because UHC uses different provider groups for institutional and professional rates.

WITH t0 AS (
    SELECT
        prov_ref.hospital_id,
        prov_ref.npi, -- everything is right these should all be type 2 NPIs
        t_inst.billing_code,
        t_inst.billing_code_type,
        t_inst.billing_code_type_version,
        t_inst.negotiated_rate AS institutional_rate,
    FROM
        {{ ref('united_pp1_00_prov_ref_hospital') }} AS prov_ref
    JOIN -- this is how we had the actual prices
        {{ ref('united_pp1_00_rates_institutional') }} AS t_inst
    ON
        prov_ref.provider_group_id = t_inst.provider_group_id
        AND t_inst.billing_code_type_version = '2025'
)
-- For some reasons a single facility can be mapped to multiple NPI type 2. We see the insurance carrier including these
-- multiple NPIs inside of one provider group. This is why we need to add the following GROUP BY

SELECT
    hospital_id,
    billing_code,
    billing_code_type,
    billing_code_type_version,
    MAX(institutional_rate) AS institutional_rate, -- to cover the worst case scenario
    ARRAY_AGG(npi) AS npi_array, -- this is just for QA and spot checking
FROM
    t0
GROUP BY
    hospital_id,
    billing_code,
    billing_code_type,
    billing_code_type_version

