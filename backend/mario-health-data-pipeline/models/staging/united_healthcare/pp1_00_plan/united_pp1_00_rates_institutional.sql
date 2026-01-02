{{
  config(
    materialized='table'
  )
}}

-- This table should have one row per billing code per provider group ID.
-- This table only includes institutional (no professional rates included) and negotiated (no percentages) rates.

WITH t0 AS (
    SELECT
        source.billing_code,
        source.billing_code_type,
        source.billing_code_type_version,
        source.description,
        source.name,
        rates.negotiated_prices,
        rates.provider_references,

    FROM {{ ref('united_pp1_00_rates_selected_codes') }} AS source -- when using this smaller input the resulting table is 180k rows 918 MiB, good enough for MVP
--    FROM {{ source('mario-mrf-data', 'uhc_apple_in_network_rates') }} AS source -- when using the full input the resulting table is 45.9m rows 73.2 GiB, too big for MVP
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
    prices.additional_information AS additional_information, -- unlike I previously thought some rows have data for this
    prices.billing_class AS billing_class,
    prices.negotiated_rate AS negotiated_rate,
    prices.negotiated_type AS negotiated_type,
--    prices.service_code AS service_code, -- not needed because it is always an empty array
--    prices.billing_code_modifier AS billing_code_modifier, -- not needed because it is always an empty array
  FROM t0
  , UNNEST(provider_references) AS provider_group_id
  , UNNEST(negotiated_prices) AS prices
  WHERE
    prices.billing_class = 'institutional'
    AND prices.negotiated_type = 'negotiated' -- removing negotiated_type='percentage' for now because they require
--    more joins and only represent ~2% of institutional rates
  )

-- Billing codes MS-DRG 0805, 0806, 0807 have multiple rows with different additional information for a single
-- provider group id so we have to do a GROUP BY
SELECT
    provider_group_id,
    billing_code,
    billing_code_type,
    billing_code_type_version,
    description,
    name,
    billing_class,
    negotiated_type,
    MAX(negotiated_rate) AS negotiated_rate, -- using MAX to cover for the worst case
    ARRAY_AGG(negotiated_rate) AS negotiated_rate_agg, -- for our own QA purposes
    ARRAY_AGG(additional_information) AS additional_information_array,
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
