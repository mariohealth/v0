{{
  config(
    materialized='table'
  )
}}

WITH t0 AS (
    SELECT
        prov_ref.provider_group_id,
        p.tin.type AS tin_type,
        p.tin.value AS tin_value,
        npi AS npi_array,
    FROM
        {{ source('mario-mrf-data', 'uhc_apple_provider_reference') }} AS prov_ref, UNNEST(provider_groups) AS p
)

SELECT
    DISTINCT
    CAST(provider_group_id AS STRING) AS provider_group_id,
    tin_type,
    CAST(tin_value AS STRING) AS tin_value,
    CAST(npi AS STRING) AS npi,
FROM
  t0, UNNEST(npi_array) AS npi

