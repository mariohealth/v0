{{ config(materialized='view') }}

SELECT
  LOWER(TRIM(`Medication Name`)) AS raw_drug_name,
  LOWER(TRIM(`Medication Form`)) AS drug_form,

  CAST(REGEXP_REPLACE(`Our Price`, r'[^0-9.]', '') AS NUMERIC) AS price,

  NULL AS quantity,  -- not provided by Cost Plus
  'cpd' AS pharmacy_id,
  'costplus' AS source_id,

  `URL` AS product_url,
FROM {{ source('raw_drug_prices', 'costplusdrugs') }}
