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
    {{ ref('nucc_specialty') }} AS t
WHERE
    t.section = 'Individual'
