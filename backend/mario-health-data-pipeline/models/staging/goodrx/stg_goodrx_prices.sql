{{ config(materialized='table') }}

WITH raw AS (
SELECT
  LOWER(TRIM(`Prescription`)) AS raw_drug_name,
  LOWER(TRIM(`Dosage`)) AS drug_form,

  CAST(REGEXP_REPLACE(`Price`, r'[^0-9.]', '') AS NUMERIC) AS price,

  NULL AS quantity, -- assumed later (30-day default)
  LOWER(TRIM(`Pharmacy`)) AS raw_pharmacy_name,

  'goodrx' AS source_id,
  `link` AS product_url,

FROM {{ source('raw_drug_prices', 'goodrx') }}
),

matched_pharmacies AS (

  SELECT
    r.*,
    p.pharmacy_id
  FROM raw r
  LEFT JOIN {{ ref('pharmacy_aliases') }} a
  ON r.raw_pharmacy_name = LOWER(a.alias_name)
LEFT JOIN {{ ref('pharmacies') }} p
  ON a.pharmacy_id = p.pharmacy_id


)

SELECT
  raw_drug_name,
  drug_form,
  price,
  quantity,
  pharmacy_id,
  source_id,
  product_url,
FROM matched_pharmacies
WHERE pharmacy_id IS NOT NULL
