{{
  config(
    materialized='table'
  )
}}
WITH t0 AS (
    SELECT
        hos.hospital_id,
        tins.tin,
        prov_ref.provider_group_id,
        prov_ref.npi,
        taxo_primary.healthcare_provider_taxonomy_code,
    FROM
        {{ ref('hospitals') }} AS hos
    LEFT JOIN
        {{ ref('hospital_tins') }} AS tins
    ON hos.hospital_id = tins.hospital_id
    LEFT JOIN
            {{ ref('cigna_national_oap_provider_reference_unnest') }} AS prov_ref
    ON
        prov_ref.tin_type = 'ein' -- tin_type can also be NPI in Cigna's provider reference
        AND tins.tin = prov_ref.tin_value
    LEFT JOIN
            {{ ref('npi_data_taxonomy_code_primary') }} AS taxo_primary
    ON
        prov_ref.npi = taxo_primary.npi
    WHERE
        hos.operational_status = 'active'
)

-- we need to add this GROUP BY because the same NPI can belong to multiple TIN that can appear in the same provider_group_id
-- look for example at NPI 1639337108 or NPI 1245557891 that both belong to TIN 611661781 and TIN 464023734 belonging to provider_group_id 3121438
SELECT
    hospital_id,
    provider_group_id,
    npi,
    healthcare_provider_taxonomy_code,
    ARRAY_AGG(tin IGNORE NULLS) AS tin_array,
FROM
    t0
GROUP BY
    hospital_id,
    provider_group_id,
    npi,
    healthcare_provider_taxonomy_code
