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
        {{ source('mario-mrf-data', 'cigna_nvidia_provider_reference') }} AS prov_ref, UNNEST(provider_groups) AS p
)

SELECT
    DISTINCT -- this distinct is important because we go from 16.2 millions rows to 2.5 millions
    provider_group_id,
    tin_type, -- For CIGNA (check for other insurers), tin type can be EIN or NPI, multiple NPIs can be grouped under another NPI, I checked.
    -- See tin type NPI tin value 1851076152 for example who has multiple NPIs below it.
    --But an NPI can also be nested alone below its own self.
    tin_value,
    npi
FROM
  t0, UNNEST(npi_array) AS npi

