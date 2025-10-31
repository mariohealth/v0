{{
  config(
    materialized='table'
  )
}}

-- joining on provider zip code because we don't have provider lat long yet
WITH
  t0 AS (
  SELECT
    npi AS id,
    npi AS provider_id,
    provider_organization_name AS provider_name,
    provider_first_line_business_practice_location_address AS address,
    -- provider_second_line_business_practice_location_address,
    provider_business_practice_location_address_city_name AS city,
    provider_business_practice_location_address_state_name AS state,
    -- provider_business_practice_location_address_postal_code, -- sometimes more than 5 digits so we use the LEFT function below
    LEFT(provider_business_practice_location_address_postal_code, 5) AS zip_code,
    provider_business_practice_location_address_telephone_number AS phone,
    -- provider_business_practice_location_address_fax_number, -- we are not in the 1800s anymore ;-)
  FROM
    {{ source('mario-mrf-data', 'npidata_pfile_20050523-20250907') }} AS t_npi
  WHERE
    entity_type_code = '2'
    -- in the NPI file only entity_type = 2 have organization names, entity_type = 1 never have an org name
    AND provider_business_practice_location_address_country_code = 'US'
    -- some American providers are outside of the US
    )
SELECT
  t0.*,
  t_zip.latitude,
  t_zip.longitude,
FROM
  t0
LEFT JOIN
  {{ ref('zip_codes') }} AS t_zip
  -- left join because I want to see how many zip codes are incorrect in the NPI data
ON
  t0.zip_code = t_zip.zip_code
