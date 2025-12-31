{{
  config(
    materialized='table'
  )
}}

-- this model is used to create a manual mapping of billing codes to provider taxonomy codes as manually declared
-- in `billing_code_provider_taxonomy_map.sql`

WITH t1 AS (
   SELECT t1.rndrng_npi, TRIM(t1.hcpcs_cd) AS hcpcs_cd, t1.hcpcs_desc,
   t2.*,
   t3.code AS taxonomy_code,
   t3.display_name AS taxonomy_display_name,
FROM {{ source('mario-mrf-data', 'medicare_partB_utilization_raw') }} AS t1
JOIN {{ ref('npi_data_taxonomy_code_primary') }} AS t2
ON t1.rndrng_npi = t2.npi
JOIN {{ ref('nucc_specialty') }} AS t3
ON healthcare_provider_taxonomy_code = t3.code
),

t2 AS (SELECT
  hcpcs_cd ,
  -- CONCAT(taxonomy_code, ' - ', taxonomy_display_name) AS taxonomy_code,
  taxonomy_code,
  taxonomy_display_name,
  COUNT(*) AS count_rows_per_taxonomy,
FROM
t1
GROUP BY 1,2,3),

t3 AS (
  SELECT
  t2.*,
  SUM(count_rows_per_taxonomy) OVER (PARTITION BY hcpcs_cd) AS count_rows_per_cpt,
  count_rows_per_taxonomy/ SUM(count_rows_per_taxonomy) OVER (PARTITION BY hcpcs_cd) AS percent_share,
  FROM t2
),

t4 AS (
SELECT
CASE WHEN percent_share < 0.01 then 'other' ELSE taxonomy_code END AS taxonomy_code,
CASE WHEN percent_share < 0.01 THEN 'other' ELSE taxonomy_display_name END AS taxonomy_display_name,
hcpcs_cd,
count_rows_per_cpt,
SUM(count_rows_per_taxonomy) AS count_rows_per_taxonomy,
ROUND(SUM(percent_share),2) AS percent_share,
FROM t3
GROUP BY 1,2,3,4
)

SELECT *,
ROW_NUMBER() OVER (PARTITION BY hcpcs_cd ORDER BY count_rows_per_taxonomy DESC) AS row_num,
FROM t4
ORDER BY 3, 6 DESC
