{{ config(materialized='table') }}

SELECT
  source_id,
  source_name,
  source_type,
  description
FROM {{ ref('drug_price_sources') }}
