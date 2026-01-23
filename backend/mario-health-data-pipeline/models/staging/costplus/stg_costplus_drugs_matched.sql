{{ config(materialized='table') }}

SELECT
    t_scd.product_url,
    t_scd.rxcui_scd,
--    t_scd.similarity_scd,
    t_sbd.rxcui_sbd,
FROM
    {{ ref('drug_match_rules_costplus_scd') }} AS t_scd
LEFT JOIN
    {{ ref('drug_match_rules_costplus_sbd') }} AS t_sbd
ON
    t_scd.product_url = t_sbd.product_url
    AND t_scd.similarity_scd >= 0.9
    AND t_sbd.similarity_sbd >= 0.9
