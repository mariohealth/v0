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

    FROM {{ ref('cigna_national_oap_rates_selected_codes') }} AS source
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
    prices.billing_code_modifier AS billing_code_modifier,
  FROM t0
  , UNNEST(provider_references) AS provider_group_id
  , UNNEST(negotiated_prices) AS prices
  WHERE
    prices.billing_class = 'professional'
    AND prices.negotiated_type IN ('negotiated', 'fee schedule') -- removing negotiated_type='percentage' AND 'per diem'
--     for now because they require more joins
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
        WHEN ARRAY_LENGTH(billing_code_modifier) = 0 THEN 'global'
        WHEN ARRAY_LENGTH(billing_code_modifier) = 1 AND billing_code_modifier[SAFE_OFFSET(0)] = 'TC' THEN 'technical'
        WHEN ARRAY_LENGTH(billing_code_modifier) = 1 AND billing_code_modifier[SAFE_OFFSET(0)] = '26' THEN 'professional'
        WHEN ARRAY_LENGTH(billing_code_modifier) = 2 AND billing_code_modifier[SAFE_OFFSET(0)] IN ('26', 'TC')
            AND billing_code_modifier[SAFE_OFFSET(1)] IN ('26', 'TC') THEN 'global' END AS billing_code_modifier,
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
-- There can be two rows per billing code per provider group. We take the max of the two.

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
