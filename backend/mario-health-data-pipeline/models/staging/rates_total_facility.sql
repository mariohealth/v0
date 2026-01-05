{{
  config(
    materialized='table'
  )
}}
-- This table has one row per hospital per NPI type 1 per billing code per carrier plan.
-- This is where we combine different plans and we combine institutional with professional rates.
WITH t_prof AS (
    SELECT
        hospital_id,
        npi,
        healthcare_provider_taxonomy_code,
        billing_code,
        billing_code_type,
        billing_code_type_version,
        professional_rate,
        '1' AS carrier_id,
        '2' AS carrier_plan_id,
    FROM
        {{ ref('cigna_national_oap_rates_prof_facility') }}
    UNION ALL BY NAME
    SELECT
        hospital_id,
        npi,
        healthcare_provider_taxonomy_code,
        billing_code,
        billing_code_type,
        billing_code_type_version,
        professional_rate,
        '2' AS carrier_id,
        '1' AS carrier_plan_id,
    FROM
        {{ ref('united_pp1_00_rates_prof_facility') }}
),

t_inst AS (
    SELECT
        hospital_id,
        billing_code,
        billing_code_type,
        billing_code_type_version,
        institutional_rate,
        '1' AS carrier_id,
        '2' AS carrier_plan_id,
    FROM
        {{ ref('cigna_national_oap_rates_inst_facility') }}
    UNION ALL BY NAME
    SELECT
        hospital_id,
        billing_code,
        billing_code_type,
        billing_code_type_version,
        institutional_rate,
        '2' AS carrier_id,
        '1' AS carrier_plan_id,
    FROM
        {{ ref('united_pp1_00_rates_inst_facility') }}
)


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
    COALESCE(t_prof.carrier_id, t_inst.carrier_id) AS carrier_id,
    COALESCE(t_prof.carrier_plan_id, t_inst.carrier_plan_id) AS carrier_plan_id,
FROM
    t_prof
FULL OUTER JOIN
    t_inst
ON
    t_prof.hospital_id = t_inst.hospital_id
    AND t_prof.billing_code = t_inst.billing_code
    AND t_prof.billing_code_type = t_inst.billing_code_type
    AND t_prof.billing_code_type_version = t_inst.billing_code_type_version
    AND t_prof.carrier_id = t_inst.carrier_id
    AND t_prof.carrier_plan_id = t_inst.carrier_plan_id
