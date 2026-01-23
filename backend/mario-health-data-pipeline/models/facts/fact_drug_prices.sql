{{ config(materialized='table') }}

WITH t_costplus AS (
    SELECT
        cpd_match.rxnorm_cui,
        cpd_p.price,
        cpd_p.quantity,
        cpd_p.pharmacy_id,
        cpd_p.source_id,
        cpd_p.product_url,
    FROM {{ ref('stg_costplus_drugs_matched') }} AS cpd_match
    JOIN {{ ref('stg_costplus_prices') }} AS cpd_p
    ON cpd_p.product_url = cpd_match.product_url -- can join only on URL for Cost Plus because they are unique, unlike
--    for our GoodRX data
    AND cpd_match.needs_review IS FALSE
),

t_goodrx AS (
    SELECT
        grx_match.rxnorm_cui,
        grx_p.price,
        grx_p.quantity,
        grx_p.pharmacy_id,
        grx_p.source_id,
        grx_p.product_url,
    FROM {{ ref('stg_goodrx_drugs_matched') }} AS grx_match
    JOIN {{ ref('stg_goodrx_prices') }} AS grx_p
    ON grx_match.product_url = grx_p.product_url -- The URLs aren't unique in our GoodRX data so we can't join just on them:
    AND grx_match.raw_drug_name = grx_p.raw_drug_name
    AND grx_match.drug_form = grx_p.drug_form
    AND grx_match.needs_review IS FALSE
),

prices AS (
    SELECT
        rxnorm_cui,
        price,
        quantity,
        pharmacy_id,
        source_id,
        product_url,
    FROM
        t_costplus

  UNION ALL
    SELECT
        rxnorm_cui,
        price,
        quantity,
        pharmacy_id,
        source_id,
        product_url,
    FROM
        t_goodrx
)

SELECT
  rxnorm_cui,
  pharmacy_id,
  source_id,
  price,
  quantity,
  product_url,
FROM prices
