{{
  config(
    materialized='table'
  )
}}
 -- this is the model where we will union pricing from all different carriers and plans
SELECT
    id,
    procedure_id,
    org_id,
    provider_id,
    carrier_id,
    carrier_name,
    price,
FROM
    {{ ref('cigna_national_oap_proc_pricing') }}

UNION ALL

SELECT
    id,
    procedure_id,
    org_id,
    provider_id,
    carrier_id,
    carrier_name,
    price,
FROM
    {{ ref('united_pp1_00_proc_pricing') }}
