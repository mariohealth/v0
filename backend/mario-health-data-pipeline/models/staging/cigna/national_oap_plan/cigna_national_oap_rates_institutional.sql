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
    AND prices.negotiated_type IN ('fee schedule', 'derived')  -- removing negotiated_type='percentage' for now because they require
--    more joins
  )


SELECT
    provider_group_id,
    billing_code,
    billing_code_type,
    billing_code_type_version,

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
    billing_class,
    negotiated_type
