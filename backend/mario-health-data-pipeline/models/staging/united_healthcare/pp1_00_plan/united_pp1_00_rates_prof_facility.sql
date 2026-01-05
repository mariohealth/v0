{{
  config(
    materialized='table'
  )
}}
-- This table has one row per hospital per NPI type 1 per billing code.
WITH t0 AS (
    SELECT
        prov_ref.hospital_id,
--        prov_ref.provider_group_id, -- only needed for QAing, ok to comment it out
--        prov_ref.tin_array, -- only needed for QAing, ok to comment it out
        prov_ref.npi,
        prov_ref.healthcare_provider_taxonomy_code,
        rates.billing_code,
        rates.billing_code_type,
        rates.billing_code_type_version,
        rates.negotiated_rate AS professional_rate,
    FROM
        {{ ref('united_pp1_00_prov_ref_hospital') }} AS prov_ref
    JOIN -- this is how we had the actual prices
        {{ ref('united_pp1_00_rates_professional') }} AS rates
    ON
        prov_ref.provider_group_id = rates.provider_group_id
        AND rates.billing_code_type_version = '2025'
    JOIN -- this join is to make sure we only list relevant NPIs for a given billing code
        {{ ref('billing_code_nucc_specialty_map') }} AS taxon_map
    ON
        taxon_map.billing_code = rates.billing_code
        AND taxon_map.billing_code_type = rates.billing_code_type
        AND prov_ref.healthcare_provider_taxonomy_code = taxon_map.taxonomy_id
)

-- a single NPI mapped to a single EIN can belong to 2 different provider group and thus have two rates for a given code
-- I don't believe it's very common but it can happen.
-- check NPI 1255542395 with EIN 133971298 belonging to provider_group_id 50446 AND 36688 as en example...
-- so we need to add the following GROUP BY:

SELECT
    hospital_id,
    npi,
    healthcare_provider_taxonomy_code,
    billing_code,
    billing_code_type,
    billing_code_type_version,
    MAX(professional_rate) AS professional_rate, -- to cover for worst case scenario
FROM
    t0
GROUP BY
    hospital_id,
    npi,
    healthcare_provider_taxonomy_code,
    billing_code,
    billing_code_type,
    billing_code_type_version
