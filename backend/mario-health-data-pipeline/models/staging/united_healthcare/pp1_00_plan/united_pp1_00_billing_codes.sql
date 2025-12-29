{{
  config(
    materialized='table'
  )
}}

SELECT
    DISTINCT
    billing_code,
    billing_code_type,
    billing_code_type_version,
    name,
    description
FROM
    {{ source('mario-mrf-data', 'uhc_apple_in_network_rates') }}
ORDER BY
billing_code,
    billing_code_type,
    billing_code_type_version
