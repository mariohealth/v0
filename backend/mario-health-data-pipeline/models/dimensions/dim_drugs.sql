{{ config(materialized='table') }}

SELECT
  rxnorm_cui,
  drug_name,
  tty AS drug_type
FROM {{ ref('stg_rxnorm_conso') }}
