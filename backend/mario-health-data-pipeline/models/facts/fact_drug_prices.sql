{{ config(materialized='table') }}

WITH prices AS (

  SELECT
    raw_drug_name,
    drug_form,
    price,
    quantity,
    pharmacy_id,
    source_id,
    product_url,
  FROM {{ ref('stg_costplus_prices') }}

  UNION ALL

  SELECT
    raw_drug_name,
    drug_form,
    price,
    quantity,
    pharmacy_id,
    source_id,
    product_url,
  FROM {{ ref('stg_goodrx_prices') }}

),

matched AS (

  SELECT
    p.*,
    m.rxnorm_cui
  FROM prices p
  LEFT JOIN {{ ref('drug_match_rules') }} m
    ON p.raw_drug_name = m.raw_drug_name

)

SELECT
  rxnorm_cui,
  pharmacy_id,
  source_id,
  price,
  quantity,
  product_url,
FROM matched
WHERE rxnorm_cui IS NOT NULL
