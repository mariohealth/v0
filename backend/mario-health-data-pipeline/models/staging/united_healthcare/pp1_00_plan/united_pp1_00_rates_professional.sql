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
        source.description,
        source.name,
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
    t0.description,
    t0.name,
    prices.additional_information AS additional_information,
    prices.billing_class AS billing_class,
    prices.negotiated_rate AS negotiated_rate,
    prices.negotiated_type AS negotiated_type,
    prices.service_code AS service_code,
--    prices.billing_code_modifier AS billing_code_modifier,
  FROM t0
  , UNNEST(provider_references) AS provider_group_id
  , UNNEST(negotiated_prices) AS prices
  WHERE
    prices.billing_class = 'professional'
    AND prices.negotiated_type = 'negotiated' -- removing negotiated_type='percentage' for now because they require
--    more joins
    AND ARRAY_LENGTH(prices.billing_code_modifier) = 0 -- billing code modifiers can be "TC" or "26", we don't want those
  )

SELECT
    provider_group_id,
    billing_code,
    billing_code_type,
    billing_code_type_version,
    description,
    name,
    billing_class,
    negotiated_type,
    MAX(negotiated_rate) AS negotiated_rate, -- take the worst case scenario
    ARRAY_AGG(additional_information) AS additional_information_array,
--    ARRAY_AGG(ARRAY_TO_STRING(service_code)) AS service_code_array, -- this for QA and spot checking, but it doesn't
--work it's an array of INT not an array of STRING
FROM
    t1
GROUP BY
    provider_group_id,
    billing_code,
    billing_code_type,
    billing_code_type_version,
    description,
    name,
    billing_class,
    negotiated_type
