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
    MIN(professional_rate_min) AS min_professional_rate,
    MAX(professional_rate_min) AS max_professional_rate,
    ROUND(AVG(professional_rate_min)) AS avg_professional_rate,
    MIN(institutional_rate_min) AS min_institutional_rate,
    MAX(institutional_rate_min) AS max_institutional_rate,
    ROUND(AVG(institutional_rate_min)) AS avg_institutional_rate,
    MIN(total_rate_min) AS min_total_rate,
    MAX(total_rate_min) AS max_total_rate,
    ROUND(AVG(total_rate_min)) AS avg_total_rate,
    MIN(total_rate_min) AS min_price,
    MAX(total_rate_min) AS max_price,
    ROUND(AVG(total_rate_min)) AS avg_price,
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
    t0.min_professional_rate,
    t0.max_professional_rate,
    t0.avg_professional_rate,
    t0.min_institutional_rate,
    t0.max_institutional_rate,
    t0.avg_institutional_rate,
    t0.min_total_rate,
    t0.max_total_rate,
    t0.avg_total_rate,
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
