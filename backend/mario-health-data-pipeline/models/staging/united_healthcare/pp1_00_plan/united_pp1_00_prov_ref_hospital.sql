{{
  config(
    materialized='table'
  )
}}

SELECT
    hos.hospital_id,
    hos.hospital_name,
    hos.city,
    hos.state,
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
        {{ ref('united_pp1_00_prov_ref_unnest') }} AS prov_ref
ON
    prov_ref.tin_type = 'ein'
    AND tins.tin = prov_ref.tin_value
LEFT JOIN
        {{ ref('npi_data_taxonomy_code_primary') }} AS taxo_primary
ON
    prov_ref.npi = taxo_primary.npi
WHERE
    hos.operational_status = 'active'
