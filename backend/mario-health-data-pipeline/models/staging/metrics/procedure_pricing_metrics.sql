{{
  config(
    materialized='table'
  )
}}
WITH pp AS (
SELECT DISTINCT
    procedure_id,
    state,
    city,
    hospital_name,
    carrier_id,
FROM
    {{ ref('procedure_pricing') }}
JOIN
    {{ ref('hospitals') }}
ON
    procedure_pricing.org_id = hospitals.hospital_id
),

p AS (
SELECT
    id,
    COUNT(DISTINCT id) OVER () AS total,
FROM
    {{ ref('procedure') }}
),

g AS (
SELECT
    pp.carrier_id,
    pp.state,
    pp.city,
    pp.hospital_name,
    p.total,
    COUNT(DISTINCT pp.procedure_id) AS count_procedure,
ROUND(COUNT(DISTINCT pp.procedure_id)/p.total, 2) AS prct_coverage,
FROM
    p
JOIN
 pp
ON
p.id = pp.procedure_id
GROUP BY
    pp.carrier_id, pp.state, pp.city, pp.hospital_name, pp.state, pp.city, p.total
    ),

t_all AS (
    SELECT
        carrier_id,
        'ALL' AS state,
        'ALL' AS city,
        'ALL' AS hospital_name,
        SUM(total) AS total,
        SUM(count_procedure) AS count_procedure,
        ROUND(SUM(count_procedure) / SUM(total), 2) AS prct_coverage,
    FROM
        g
    GROUP BY carrier_id, state, city, hospital_name
),

t_union AS (
SELECT * FROM g
UNION ALL
SELECT * FROM t_all
)

    SELECT
        state,
        city,
        hospital_name,
        IFNULL(prct_coverage_cigna_national_oap, 0) AS prct_coverage_cigna_national_oap,
        IFNULL(prct_coverage_united_pp1_00, 0) AS prct_coverage_united_pp1_00,
FROM
  (SELECT carrier_id, state, city, hospital_name, prct_coverage FROM t_union)
  PIVOT(SUM(prct_coverage) AS prct_coverage FOR carrier_id IN ('cigna_national_oap', 'united_pp1_00'))
ORDER BY state, city, hospital_name

