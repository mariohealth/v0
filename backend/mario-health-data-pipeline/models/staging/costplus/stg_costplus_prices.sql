{{ config(materialized='table') }}

WITH t0 AS (
SELECT
  LOWER(TRIM(`Medication Name`)) AS raw_drug_name,
  LOWER(TRIM(`Medication Form`)) AS drug_form,

  CAST(REGEXP_REPLACE(`Our Price`, r'[^0-9.]', '') AS NUMERIC) AS price,

  NULL AS quantity,  -- not provided by Cost Plus
  'cpd' AS pharmacy_id,
  'costplus' AS source_id,

  `URL` AS product_url,
FROM {{ source('raw_drug_prices', 'costplusdrugs') }}
),

t1 AS (
  SELECT
    *,
    CASE WHEN raw_drug_name LIKE '%generic for%' THEN TRUE ELSE FALSE END AS is_generic,
    SPLIT(raw_drug_name, '(generic for') AS split_generic,
    SPLIT(raw_drug_name, '(') AS split_non_generic,
    REPLACE(REPLACE(LOWER(product_url), 'https://www.costplusdrugs.com/medications/', ''), '/', '') AS product_url_clean
  FROM
    t0
),

t2 AS (
  SELECT
    * EXCEPT(split_generic, split_non_generic),

    CASE WHEN is_generic THEN TRIM(split_generic[0])
    WHEN NOT is_generic THEN TRIM(REPLACE(split_non_generic[SAFE_OFFSET(1)], ')', ''))
    END AS drug_name_generic,

    CASE WHEN is_generic THEN TRIM(REPLACE(split_generic[SAFE_OFFSET(1)],')',''))
    WHEN NOT is_generic THEN split_non_generic[0]
    END AS drug_name_brand,

    FROM t1

),

t3 AS (
  SELECT
    *,
    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(drug_name_generic,')',''),'(', ''),'/', ''), ' & ', ' '), ' ', '-') AS drug_name_generic_dashed,
    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(drug_name_brand,')',''),'(', ''),'/', ''), ' & ', ' '), ' ', '-') AS drug_name_brand_dashed,
    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(drug_name_generic,')',''),'(', ''),'/', ''), ' & ', ' '), ' ', '') AS drug_name_generic_no_space,
    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(drug_name_brand,')',''),'(', ''),'/', ''), ' & ', ' '), ' ', '') AS drug_name_brand_no_space,
  FROM
    t2
)

SELECT * EXCEPT(product_url_clean, drug_name_generic_dashed, drug_name_brand_dashed, drug_name_generic_no_space, drug_name_brand_no_space),
TRIM(REPLACE(
  REPLACE(
REPLACE(
  REPLACE(
    REPLACE(product_url_clean, drug_name_generic_dashed, ''),
    drug_name_brand_dashed,
    ''),
    drug_name_generic_no_space,
    ''),
    drug_name_brand_no_space,
    ''),
    '-', ' '))
     AS drug_dosage_quantity
FROM t3
