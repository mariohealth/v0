{{
  config(
    materialized='table'
  )
}}

SELECT
    *
FROM
    {{ ref('cigna_national_oap_proc_pricing') }}
