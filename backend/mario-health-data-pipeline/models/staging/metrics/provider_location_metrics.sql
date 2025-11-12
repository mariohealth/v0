{{
  config(
    materialized='table'
  )
}}

WITH t_match AS (
SELECT
    pl.state,
    pl.city,
    pl.org_name,
    CASE WHEN
        UPPER(pl.city) LIKE CONCAT('%', UPPER(t_npi.provider_business_practice_location_address_city_name),'%')
        OR UPPER(t_npi.provider_business_practice_location_address_city_name) LIKE CONCAT('%', UPPER(pl.city),'%')
    THEN 1 ELSE 0 END AS city_match,
    FROM
        {{ ref('provider_location') }} AS pl
    LEFT JOIN
      {{ source('mario-mrf-data', 'npidata_pfile_20050523-20250907') }} AS t_npi
    ON
        pl.provider_id=t_npi.npi
)

SELECT
    state,
    city,
    org_name,

    SUM(city_match) AS city_match_count,
    COUNT(*) AS provider_location_count,
    ROUND(SUM(city_match)/COUNT(*), 2) AS prct_city_match
FROM
    t_match
GROUP BY
    state, city, org_name
ORDER BY
    state, city, org_name

