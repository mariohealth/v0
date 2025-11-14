{{
  config(
    materialized='table'
  )
}}

SELECT
    CONCAT(org_id, '_', procedure_id, '_', carrier_id) AS id,
    org_id,
    procedure_id,
    carrier_id,
    carrier_name,
    COUNT(DISTINCT provider_id) AS count_provider,
    MIN(price) AS min_price,
    MAX(price) AS max_price,
    ROUND(AVG(price)) AS avg_price,
FROM
    {{ ref('procedure_pricing') }}
GROUP BY
    1,2,3,4,5
