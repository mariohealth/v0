{{ config(materialized='table') }}

SELECT
  pharmacy_id,
  pharmacy_name,
  pharmacy_type,
  accepts_insurance,
  delivery_only,
  national,
  notes
FROM {{ ref('pharmacies') }}
