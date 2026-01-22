{{ config(materialized='table') }}

SELECT
    LEFT(CAST(PRVDR_NUM AS STRING), 6) AS facility_id, -- CCN
    CAST(PRVDR_NUM AS STRING) AS pos_internal_id,
    UPPER(FAC_NAME) AS campus_name_raw,
    UPPER(ST_ADR) AS address_line_1,
    UPPER(CITY_NAME) AS city,
    STATE_CD AS state_code,
    CAST(ZIP_CD AS STRING) AS zip_code,
    PHNE_NUM AS phone_number,

FROM  {{ source('cms_public_data', 'provider_of_services') }}
WHERE PRVDR_CTGRY_CD = 1 -- ONLY HOSPITALS