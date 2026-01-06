{{
  config(
    materialized='table'
  )
}}

WITH t0 AS (
        SELECT hospital_id,
--COUNT(DISTINCT tin) AS count_tin,-- removing the TIN count because we converted it to an array, see explanation in
-- the cigna_national_oap_prov_ref_hospital model
COUNT(DISTINCT provider_group_id) AS count_provider_group,
COUNT(DISTINCT npi) AS count_npi,
COUNT(DISTINCT healthcare_provider_taxonomy_code) AS count_taxonomy,
 FROM {{ ref('united_pp1_00_prov_ref_hospital') }}
 GROUP BY hospital_id
    ),

t1 AS (
    SELECT hospital_id,
COUNT(DISTINCT npi) AS count_npi_with_billing_code,
COUNT(DISTINCT healthcare_provider_taxonomy_code) AS count_taxonomy_with_billing_code,
COUNT(DISTINCT billing_code) AS count_billing_code,
 FROM {{ ref('united_pp1_00_rates_professional_hospital') }}
 GROUP BY hospital_id
),

t2 AS (
    SELECT org_id,
           COUNT(DISTINCT provider_id) AS count_npi_with_procedure,
           COUNT(DISTINCT procedure_id) AS count_procedure,
    FROM {{ ref('united_pp1_00_proc_pricing') }}
    GROUP BY org_id
)

SELECT
    t0.*,
    IFNULL(t1.count_npi_with_billing_code, 0) AS count_npi_with_billing_code,
    IFNULL(t1.count_taxonomy_with_billing_code, 0) AS count_taxonomy_with_billing_code,
    IFNULL(t1.count_billing_code, 0) AS count_billing_code,
    IFNULL(t2.count_npi_with_procedure, 0) AS count_npi_with_procedure,
    IFNULL(t2.count_procedure, 0) AS count_procedure,
FROM
    t0
LEFT JOIN
    t1
ON
    t0.hospital_id = t1.hospital_id
LEFT JOIN
    t2
ON
    t0.hospital_id = t2.org_id
ORDER BY hospital_id
