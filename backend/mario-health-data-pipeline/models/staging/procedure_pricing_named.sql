{{
  config(
    materialized='table'
  )
}}

SELECT
    pp.id AS pricing_id,
    pp.procedure_id,
    pp.org_id,
    pp.provider_id,
    pp.provider_location_id,
    pp.carrier_id,
    pp.carrier_name,
    pp.price,
    pp.provider_name,
    pr.name AS procedure_name,
    pr.common_name AS procedure_common_name,
    ho.hospital_name,
    ho.address AS hospital_address,
    ho.city AS hospital_city,
    ho.state AS hospital_state,
    ho.zip_code AS hospital_zip_code,
--    ho.latitude,
--    ho.longitude,
    ho.phone AS hospital_phone,
FROM {{ ref('procedure_pricing') }} AS pp
LEFT JOIN
    {{ ref('procedure') }} AS pr
ON
    pp.procedure_id = pr.id
LEFT JOIN
    {{ ref('hospitals') }} AS ho
ON
    pp.org_id = ho.hospital_id

