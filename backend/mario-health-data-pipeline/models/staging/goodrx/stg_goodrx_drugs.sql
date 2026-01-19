{{ config(materialized='table') }}

WITH t0 AS (
SELECT DISTINCT
  LOWER(REPLACE(`Link`, 'https://www.goodrx.com/', '')) AS url_param,
  LOWER(`Primary Name`) AS primary_name,
  LOWER(`Secondary Name`) AS secondary_name,
  LOWER(`Prescription`) AS drug_full_name ,
  LOWER(`Dosage`) AS dosage,
FROM
  raw_drug_prices.goodrx
)

SELECT
  url_param,
  drug_full_name,
  primary_name,
  secondary_name,
  CASE WHEN primary_name LIKE '%generic%' OR secondary_name LIKE '%generic%' THEN 'yes' ELSE 'unknown' END AS is_generic,
  TRIM(SPLIT(drug_full_name, '(')[SAFE_OFFSET(0)]) AS drug_name,
  TRIM(REPLACE(SPLIT(drug_full_name, '(')[SAFE_OFFSET(1)], ')','')) AS quantity,
  dosage,
 FROM
  t0
