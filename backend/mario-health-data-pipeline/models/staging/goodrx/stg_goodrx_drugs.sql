{{ config(materialized='table') }}

WITH t0 AS (
SELECT DISTINCT
  LOWER(REPLACE(`Link`, 'https://www.goodrx.com/', '')) AS url_param,
  LOWER(`Primary Name`) AS primary_name,
  LOWER(`Secondary Name`) AS secondary_name,
  LOWER(`Prescription`) AS drug_full_name ,
  LOWER(`Dosage`) AS dosage,
FROM
  {{ source('raw_drug_prices', 'goodrx') }}
)

SELECT
  url_param,
  CASE WHEN primary_name LIKE '%generic %' THEN NULL ELSE primary_name END AS primary_name, -- we extract the brand somewhere else
  CASE WHEN secondary_name LIKE '%generic %' THEN NULL ELSE secondary_name END AS secondary_name,
  CASE WHEN primary_name LIKE '%generic %' THEN TRIM(REPLACE(primary_name, 'generic ', ''))
    WHEN secondary_name LIKE '%generic %' THEN TRIM(REPLACE(secondary_name, 'generic ', ''))
    ELSE NULL END AS brand, -- we extract the brand here
  TRIM(SPLIT(drug_full_name, '(')[SAFE_OFFSET(0)]) AS drug_name,
  TRIM(REPLACE(SPLIT(drug_full_name, '(')[SAFE_OFFSET(1)], ')','')) AS quantity,
  dosage,
 FROM
  t0
