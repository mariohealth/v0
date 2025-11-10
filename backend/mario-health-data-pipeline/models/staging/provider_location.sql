{{
  config(
    materialized='table'
  )
}}

WITH t0 AS (
    SELECT DISTINCT -- The pricing model has prices for all procedures so we need a DISTINCT.
                    -- Moreover, a single NPI can work at different hospitals/locations.
        org_id,
        provider_id,
    FROM
        {{ ref('procedure_pricing') }} AS t_price -- using procedure pricing so we only include NPIs for which we
  -- need info because we have prices for them
),

  t1 AS (
  SELECT
      CONCAT(t0.org_id, "_", t0.provider_id) AS id,
      t0.org_id,
      t0.provider_id,
        t_hosp.hospital_name AS org_name,
        t_hosp.address,
        t_hosp.city,
        t_hosp.state,
        t_hosp.zip_code,
        t_hosp.latitude,
        t_hosp.longitude,
        t_hosp.phone,

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
        " ",
        t_npi.provider_credential_text
        ) AS provider_name,
  FROM
      t0
  JOIN
        {{ ref('hospitals') }} AS t_hosp
  ON
      t0.org_id = t_hosp.hospital_id
  JOIN
      {{ source('mario-mrf-data', 'npidata_pfile_20050523-20250907') }} AS t_npi
    ON
        t0.provider_id = t_npi.npi
  WHERE
      t_hosp.operational_status = 'active'
    )

SELECT
  id,
  org_id,
  org_name,
  provider_id,
  provider_name,
  address,
  city,
  state,
  zip_code,
  latitude,
  longitude,
  phone,

FROM
  t1

