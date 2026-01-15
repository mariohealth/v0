{{
  config(
    materialized='table'
  )
}}

WITH t0 AS (
SELECT
    CONCAT(org_id, '_', procedure_id, '_carrier_', carrier_id) AS id,
    org_id,
    procedure_id,
    carrier_id,
    carrier_name,
    carrier_plan_id,
    COUNT(DISTINCT provider_id) AS count_provider,
    -- this is from billing code modifier 26 from the professional billing class
    MIN(professional_rate_min) AS min_professional_rate,
    MAX(professional_rate_min) AS max_professional_rate,
    ROUND(AVG(professional_rate_min)) AS avg_professional_rate,
    -- this is also from the professional billing class, billing code modifier TC
    MIN(technical_rate_min) AS min_technical_rate,
    MAX(technical_rate_min) AS max_technical_rate,
    ROUND(AVG(technical_rate_min)) AS avg_technical_rate,
    -- this is also from the professional billing class, combines both 26 and TC billing code modifier
    MIN(global_rate_min) AS min_global_rate,
    MAX(global_rate_min) AS max_global_rate,
    ROUND(AVG(global_rate_min)) AS avg_global_rate,
    -- this is from the institutional billing class, no billing code modifier
    MIN(institutional_rate_min) AS min_institutional_rate,
    MAX(institutional_rate_min) AS max_institutional_rate,
    ROUND(AVG(institutional_rate_min)) AS avg_institutional_rate,

    MIN(total_rate_min) AS min_total_rate,
    MAX(total_rate_min) AS max_total_rate,
    ROUND(AVG(total_rate_min)) AS avg_total_rate,
    -- this is just a copy from above but using our old naming convention, should delete in the futur
    MIN(total_rate_min) AS min_price,
    MAX(total_rate_min) AS max_price,
    ROUND(AVG(total_rate_min)) AS avg_price,
FROM
    {{ ref('procedure_pricing') }}
GROUP BY
    1,2,3,4,5,6
)

SELECT
    t0.id,
    t0.org_id,
    t0.procedure_id,
    t0.carrier_id,
    t0.carrier_name,
    t0.carrier_plan_id,
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
