{{ config(materialized='table') }}

SELECT -- For Good RX the combination of url_param and dosage is unique so we use this combination as an "id".
    url_param,
    dosage,
    CASE WHEN best_scd_similarity >= 0.9 THEN best_scd_rxcui ELSE NULL END AS rxcui_scd,
    CASE WHEN best_sbd_similarity >= 0.9 THEN best_sbd_rxcui ELSE NULL END AS rxcui_sbd
FROM
    {{ ref('drug_match_rules_goodrx') }}
WHERE
    best_scd_similarity >= 0.9
