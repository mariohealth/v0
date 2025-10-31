{{
  config(
    materialized='table'
  )
}}

SELECT
  zip_code,
  city,
  county,
  state_code,
  internal_point_lat AS latitude,
  internal_point_lon AS longitude,
  -- internal_point_geom AS location, -- this was painful to transfer from BQ to PG so I decided to have PG create the GEOGRAPHY locations with a PG trigger
FROM
  {{ source('bigquery-public-data', 'zip_codes') }}
