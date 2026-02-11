{{
  config(
    materialized='table'
  )
}}

WITH t0 AS (
    SELECT
        npi,
        provider_organization_name AS name,
        provider_first_line_business_practice_location_address AS address_first_line,
        provider_second_line_business_practice_location_address AS address_second_line,
        provider_business_practice_location_address_city_name AS city,
        provider_business_practice_location_address_state_name AS state,
        LEFT(provider_business_practice_location_address_postal_code, 5) AS zip,
        provider_business_practice_location_address_telephone_number AS phone,
        healthcare_provider_taxonomy_code_1,
        is_organization_subpart,
        parent_organization_lbn,
    FROM
        {{ source('mario-mrf-data', 'npidata_pfile_20050523-20250907') }}
    WHERE
        entity_type_code = '2'
        AND provider_business_practice_location_address_country_code = 'US'
        AND provider_business_practice_location_address_state_name NOT IN ('AA', 'AE', 'AP', 'AS', 'GU', 'MP', 'PR', 'VI')
        AND healthcare_provider_taxonomy_group_1 = ''
        AND healthcare_provider_primary_taxonomy_switch_1 = 'Y'
        AND LEFT(healthcare_provider_taxonomy_code_1, 2) IN (
        "26", -- Ambulatory Health Care Facilities
        "28", -- Hospitals
        "29" -- Laboratories
        )

),

t1 AS (
    SELECT
    t0.* EXCEPT(healthcare_provider_taxonomy_code_1),
    CONCAT(t0.address_first_line, ', ', t0.city, ', ', t0.state, ' ', t0.zip, ', USA') AS full_address,
    nucc_specialty.display_name AS healthcare_provider_taxonomy,
    FROM
        t0
    LEFT JOIN
        {{ ref('nucc_specialty') }}
    ON t0.healthcare_provider_taxonomy_code_1 = nucc_specialty.code
)

SELECT
    *
FROM
    t1
