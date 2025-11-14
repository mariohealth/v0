{{
  config(
    materialized='table'
  )
}}
SELECT DISTINCT
    t.code AS id,
    t.grouping,
    t.display_name,
    t.definition,
FROM
    {{ source('mario-mrf-data', 'nucc_taxonomy_251_raw') }} AS t
WHERE
    t.section = 'Individual'
