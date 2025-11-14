{{
  config(
    materialized='table'
  )
}}
<<<<<<< HEAD
=======
 -- this is the model where we will union pricing from all different carriers and plans

WITH t_union_all AS (
>>>>>>> 178385b (Everything to support procedure pricing at the org level API route, fixed and improved other routes, proc to specialty mapping  (#17))

SELECT
    *
FROM
    {{ ref('cigna_national_oap_proc_pricing') }}
<<<<<<< HEAD
=======

UNION ALL

SELECT
    id,
    procedure_id,
    org_id,
    provider_id,
    provider_location_id,
    carrier_id,
    carrier_name,
    price,
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

>>>>>>> 178385b (Everything to support procedure pricing at the org level API route, fixed and improved other routes, proc to specialty mapping  (#17))
