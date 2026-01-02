{{
  config(
    materialized='table'
  )
}}
 -- this is the model where we will union pricing from all different carriers and plans

WITH t_union_all AS (

SELECT
    id,
    procedure_id,
    org_id,
    provider_id,
    provider_location_id,
    carrier_id,
    carrier_name,
    NULL AS professional_rate_min,
    NULL AS institutional_rate_min,
    NULL AS total_rate_min,
    price,
FROM
    {{ ref('cigna_national_oap_proc_pricing') }}

UNION ALL

SELECT
    id,
    procedure_id,
    org_id,
    provider_id,
    provider_location_id,
    carrier_id,
    carrier_name,
    professional_rate_min,
    institutional_rate_min,
    total_rate_min,
    total_rate_min AS price,
FROM
    {{ ref('united_pp1_00_proc_pricing') }}

)

SELECT
    t_union_all.id,
    t_union_all.procedure_id,
    t_union_all.org_id,
    t_union_all.provider_id,
    t_union_all.provider_location_id,
    t_union_all.carrier_id,
    t_union_all.carrier_name,
    t_union_all.professional_rate_min,
    t_union_all.institutional_rate_min,
    t_union_all.total_rate_min,
    t_union_all.price,
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
    t_union_all
JOIN
      {{ source('mario-mrf-data', 'npidata_pfile_20050523-20250907') }} AS t_npi
    ON
        t_union_all.provider_id = t_npi.npi
