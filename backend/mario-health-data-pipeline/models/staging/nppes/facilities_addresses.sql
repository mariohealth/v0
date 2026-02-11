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
        AND provider_business_practice_location_address_state_name <> 'PR'
        AND healthcare_provider_taxonomy_group_1 = ''
        AND healthcare_provider_primary_taxonomy_switch_1 = 'Y'
        AND healthcare_provider_taxonomy_code_1 IN (
          "282N00000X",
          "283Q00000X",
          "283X00000X",
          "281P00000X",
          "282E00000X",
          "286500000X",
          "284300000X",
          "261QA1903X",
          "261QC1500X",
          "261QF0400X",
          "261QM0801X",
          "261QR0200X",
          "261QP2300X",
          "261QU0200X",
          "261Q00000X",
          "261QR0206X",
          "261QR0207X",
          "261QR0208X",
          "291U00000X",
          "261QX0100X",
          "261QP2000X",
          "261QP3300X",
          "261QR0400X"
        )

),

t1 AS (
    SELECT
    t0.* EXCEPT(healthcare_provider_taxonomy_code_1),

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
