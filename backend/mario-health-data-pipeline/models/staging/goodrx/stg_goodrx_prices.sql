{{ config(materialized='table') }}

SELECT
  LOWER(TRIM(`Prescription`)) AS raw_drug_name,
  LOWER(TRIM(`Dosage`)) AS drug_form,

  CAST(REGEXP_REPLACE(`Price`, r'[^0-9.]', '') AS NUMERIC) AS price,

  NULL AS quantity, -- assumed later (30-day default)
  LOWER(TRIM(`Pharmacy`)) AS pharmacy_name,

  'goodrx' AS source_id,
  `link` AS product_url,

FROM {{ source('raw_prices', 'goodrx') }}
