{{ config(materialized='table') }}

WITH t_costplus AS (
    SELECT
        raw_drug_name,
        drug_form,
        price,
        quantity,
        pharmacy_id,
        source_id,
        product_url,
    FROM {{ ref('stg_costplus_prices') }}
    JOIN

),

t_goodrx AS (
    SELECT
        raw_drug_name,
        drug_form,
        price,
        quantity,
        pharmacy_id,
        source_id,
        product_url,
    FROM {{ ref('stg_goodrx_prices') }}
    JOIN

)

prices AS (



  UNION ALL



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
