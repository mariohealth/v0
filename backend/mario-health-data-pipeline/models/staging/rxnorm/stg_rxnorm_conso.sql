{{ config(materialized='table') }}

SELECT
  CAST(rxcui AS INT64) AS rxnorm_cui,
  str AS drug_name,
  tty,
  sab
FROM {{ ref('rxn_conso') }}
WHERE sab = 'RXNORM'
  AND suppress = 'N'
  AND tty IN ('IN', 'SCD', 'SBD')
