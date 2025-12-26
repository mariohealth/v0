{{
  config(
    materialized='table'
  )
}}

WITH t0 AS (
    SELECT DISTINCT -- The pricing model has prices for all procedures so we need a DISTINCT.
        provider_id,
    FROM
        {{ ref('procedure_pricing') }} AS t_price -- using procedure pricing so we only include NPIs for which we
  -- need info because we have prices for them
),

t1 AS (
    SELECT
        t0.provider_id AS id,
        t0.provider_id,
        t_npi.provider_name_prefix_text AS name_prefix,
        t_npi.provider_first_name AS first_name,
        t_npi.provider_middle_name AS middle_name,
        t_npi.provider_last_name AS last_name,
        t_npi.provider_name_suffix_text AS name_suffix,
        t_npi.provider_credential_text AS credential,
        taxon_map.healthcare_provider_taxonomy_code AS specialty_id,
        taxon_map.provider_license_number AS license_number,
        taxon_map.provider_license_number_state_code AS license_state_code,
        si.display_name AS specialty_name,
  FROM
      t0
  JOIN
      {{ source('mario-mrf-data', 'npidata_pfile_20050523-20250907') }} AS t_npi
ON
        t0.provider_id = t_npi.npi
LEFT JOIN
     {{ ref('npi_data_taxonomy_code_primary') }} AS taxon_map
ON
        t0.provider_id = taxon_map.npi
LEFT JOIN
    {{ ref('nucc_specialty_individual') }} AS si
ON
    taxon_map.healthcare_provider_taxonomy_code = si.id
    )

SELECT
    id,
    provider_id,
    name_prefix,
    first_name,
    middle_name,
    last_name,
    name_suffix,
    credential,
    specialty_id,
    license_number,
    license_state_code,
    specialty_name,
FROM
  t1
