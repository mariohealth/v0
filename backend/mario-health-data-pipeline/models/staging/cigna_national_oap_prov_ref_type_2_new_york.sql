{{
  config(
    materialized='table'
  )
}}

WITH t0 AS (
    SELECT
        npi
    FROM
        {{ source('mario-mrf-data', 'npidata_pfile_20050523-20250907') }}
    WHERE
        entity_type_code = '2'
        -- in the NPI file only entity_type = 2 have organization names, entity_type = 1 never have an org name
        AND provider_business_practice_location_address_country_code = 'US'
        -- some American providers are outside of the US
        AND provider_business_practice_location_address_city_name IN ('NEW YORK', 'NY', 'NYC', 'NEW YORK CITY')
        AND provider_business_practice_location_address_state_name = 'NY'
)

SELECT DISTINCT -- let's ignore TINs for now because a single NPI to provider group ID pair can have 2 TINs (see
-- provider group ID 3121447 with NPI 1407418379 for example)
    prov_ref.provider_group_id,
    prov_ref.npi
FROM
    {{ ref('cigna_national_oap_provider_reference_unnest') }} AS prov_ref
JOIN
    t0
ON
    CAST(prov_ref.npi AS STRING) = t0.npi


