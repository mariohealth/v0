{{
  config(
    materialized='table'
  )
}}
-- This table has one row per hospital per NPI type 1 per billing code.
-- This is where we combine institutional with professional rates.

SELECT
    COALESCE(t_prof.hospital_id, t_inst.hospital_id) AS hospital_id,
    COALESCE(t_prof.billing_code, t_inst.billing_code) AS billing_code,
    COALESCE(t_prof.billing_code_type, t_inst.billing_code_type) AS billing_code_type,
    COALESCE(t_prof.billing_code_type_version, t_inst.billing_code_type_version) AS billing_code_type_version,
    t_prof.npi,
    t_prof.healthcare_provider_taxonomy_code,
    t_prof.professional_rate,
    t_inst.institutional_rate,
    COALESCE(t_prof.professional_rate, 0) + COALESCE(t_inst.institutional_rate, 0) AS total_rate,
FROM
    {{ ref('united_pp1_00_rates_prof_facility') }} AS t_prof
FULL OUTER JOIN
    {{ ref('united_pp1_00_rates_inst_facility') }} AS t_inst
ON
    t_prof.hospital_id = t_inst.hospital_id
    AND t_prof.billing_code = t_inst.billing_code
    AND t_prof.billing_code_type = t_inst.billing_code_type
    AND t_prof.billing_code_type_version = t_inst.billing_code_type_version
