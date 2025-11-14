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
  FROM
      t0
  JOIN
      {{ source('mario-mrf-data', 'npidata_pfile_20050523-20250907') }} AS t_npi
    ON
        t0.provider_id = t_npi.npi
    )

SELECT
    id,
    provider_id,
    name_prefix,
    first_name,
    middle_name,
    last_name,
    name_suffix,
    credential
FROM
  t1
