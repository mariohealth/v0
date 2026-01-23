{{ config(materialized='table') }}

WITH t_costplus AS (
    SELECT
        cpd_match.rxcui_scd,
        cpd_p.price,
        cpd_p.quantity,
        cpd_p.pharmacy_id,
        cpd_p.source_id,
        cpd_p.product_url,
    FROM {{ ref('stg_costplus_drugs_matched') }} AS cpd_match
    JOIN {{ ref('stg_costplus_prices') }} AS cpd_p
    ON cpd_p.product_url = cpd_match.product_url -- can join only on URL for Cost Plus because they are unique, unlike
--    for our GoodRX data

),

t_goodrx AS (
    SELECT
        grx_match.rxcui_scd,
        grx_p.price,
        grx_p.quantity,
        grx_p.pharmacy_id,
        grx_p.source_id,
        grx_p.product_url,
    FROM {{ ref('stg_goodrx_drugs_matched') }} AS grx_match
    JOIN {{ ref('stg_goodrx_prices') }} AS grx_p
    ON grx_match.url_param = REPLACE(grx_p.product_url, 'https://www.goodrx.com/', '') -- The URLs aren't unique in our GoodRX data so we can't join just on them:
    AND grx_match.dosage = grx_p.drug_form

),

prices AS (
    SELECT
        rxcui_scd,
        price,
        quantity,
        pharmacy_id,
        source_id,
        product_url,
    FROM
        t_costplus

  UNION ALL
    SELECT
        rxcui_scd,
        price,
        quantity,
        pharmacy_id,
        source_id,
        product_url,
    FROM
        t_goodrx
)

SELECT
  rxcui_scd,
  pharmacy_id,
  source_id,
  price,
  quantity,
  product_url,
FROM prices
