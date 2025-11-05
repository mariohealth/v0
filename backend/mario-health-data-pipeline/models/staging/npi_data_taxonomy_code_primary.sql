{{
  config(
    materialized='table'
  )
}}

SELECT
    * EXCEPT (healthcare_provider_primary_taxonomy_switch, code_order)
FROM
    {{ ref('npi_data_taxonomy_code_unpivot') }}
WHERE
    healthcare_provider_primary_taxonomy_switch = 'Y'
