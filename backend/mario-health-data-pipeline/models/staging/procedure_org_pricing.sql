{{
  config(
    materialized='table'
  )
}}

WITH t0 AS (
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
)

SELECT
    t0.id,
    t0.org_id,
    t0.procedure_id,
    t0.carrier_id,
    t0.carrier_name,
    t0.count_provider,
    t0.min_price,
    t0.max_price,
    t0.avg_price,
    t_hosp.hospital_name AS org_name,
    t_hosp.hospital_type AS org_type,
    t_hosp.address,
    t_hosp.city,
    t_hosp.state,
    t_hosp.zip_code,
    t_hosp.latitude,
    t_hosp.longitude,
    t_hosp.phone,
FROM
    t0
LEFT JOIN
        {{ ref('hospitals') }} AS t_hosp
  ON
      t0.org_id = t_hosp.hospital_id
WHERE
    t_hosp.operational_status = 'active'
