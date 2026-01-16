{{ config(materialized='view') }}

SELECT DISTINCT
  CASE
    WHEN pharmacy_name LIKE '%cvs%' THEN 'cvs'
    WHEN pharmacy_name LIKE '%walgreens%' THEN 'walgreens'
    WHEN pharmacy_name LIKE '%walmart%' THEN 'walmart'
    WHEN pharmacy_name LIKE '%kroger%' THEN 'kroger'
    WHEN pharmacy_name LIKE '%costco%' THEN 'costco'
    ELSE 'unknown'
  END AS pharmacy_id,
  pharmacy_name
FROM {{ ref('stg_goodrx_prices') }}
ORDER BY 1,2
