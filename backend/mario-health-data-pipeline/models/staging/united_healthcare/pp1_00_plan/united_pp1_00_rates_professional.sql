{{
  config(
    materialized='table'
  )
}}

-- This table should have one row per billing code per provider group ID.
-- This table only includes professional (no institutional rates included) and negotiated (no percentages) rates.

WITH t0 AS (
    SELECT
        source.billing_code,
        source.billing_code_type,
        source.billing_code_type_version,
        rates.negotiated_prices,
        rates.provider_references,

    FROM {{ ref('united_pp1_00_rates_selected_codes') }} AS source
        , UNNEST(negotiated_rates) AS rates
),

t1 AS (
  SELECT
    CAST(provider_group_id AS STRING) AS provider_group_id,
    CAST(t0.billing_code AS STRING) AS billing_code,
    t0.billing_code_type,
    CAST(t0.billing_code_type_version AS STRING) AS billing_code_type_version,
    prices.additional_information AS additional_information,
    prices.billing_class AS billing_class,
    prices.negotiated_rate AS negotiated_rate,
    prices.negotiated_type AS negotiated_type,
    prices.service_code AS service_code,
    prices.billing_code_modifier[SAFE_OFFSET(0)] AS billing_code_modifier, -- billing code modifiers can be [TC], [26] or []
  FROM t0
  , UNNEST(provider_references) AS provider_group_id
  , UNNEST(negotiated_prices) AS prices
  WHERE
    prices.billing_class = 'professional'
    AND prices.negotiated_type = 'negotiated' -- removing negotiated_type='percentage' for now because they require
--    more joins
  ),

t2 AS (
  SELECT
    provider_group_id,
    billing_code,
    billing_code_type,
    billing_code_type_version,
    additional_information,
    billing_class,
    negotiated_rate,
    negotiated_type,
    ARRAY(SELECT x FROM UNNEST(service_code) AS x ORDER BY x) AS service_code, -- this array needs to be ordered
--    otherwise the pivot below doesn't dedup some duplicate rows because they have service_code arrays in different orders
    CASE
    WHEN billing_code_modifier = '26' THEN 'professional'
    WHEN billing_code_modifier= 'TC' THEN 'technical'
    WHEN billing_code_modifier IS NULL THEN 'global' END AS billing_code_modifier,
FROM
  t1
),

t3 AS (
    SELECT
        provider_group_id,
        billing_code,
        billing_code_type,
        billing_code_type_version,
        additional_information,
        billing_class,
        negotiated_type,
        service_code,
        negotiated_rate_professional,
        negotiated_rate_technical,
        negotiated_rate_global,
    FROM t2
    PIVOT(SUM(negotiated_rate) AS negotiated_rate FOR billing_code_modifier IN ('professional', 'technical', 'global'))
)

-- There is usually two rows per billing code per provider group, one with service code [11] and another one with
--[1, 10, 14, 57, 65, 99]. We take the max of the two.


SELECT
    provider_group_id,
    billing_code,
    billing_code_type,
    billing_code_type_version,
    billing_class,
    negotiated_type,
    MAX(negotiated_rate_professional) AS negotiated_rate_professional, -- take the worst case scenario
    MAX(negotiated_rate_technical) AS negotiated_rate_technical, -- take the worst case scenario
    MAX(negotiated_rate_global) AS negotiated_rate_global, -- take the worst case scenario
    ARRAY_AGG(additional_information) AS additional_information_array,
--    ARRAY_AGG(ARRAY_TO_STRING(service_code)) AS service_code_array, -- this for QA and spot checking, but it doesn't
--work it's an array of INT not an array of STRING
FROM
    t3
GROUP BY
    provider_group_id,
    billing_code,
    billing_code_type,
    billing_code_type_version,
    billing_class,
    negotiated_type
