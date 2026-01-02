{{
  config(
    materialized='table'
  )
}}
-- This table has one row per billing code per provider group ID.
-- As of Nov 10 2025 that table has 5.7m rows.

WITH t0 AS (
    SELECT
        top.* EXCEPT(negotiated_rates),
        rates.*,

    FROM {{ ref('united_pp1_00_rates_selected_codes') }} AS top
        , UNNEST(negotiated_rates) AS rates
    --WHERE
    --    ARRAY_LENGTH(negotiated_prices) <= 1 -- !!!! we can't do that for United because most rates have more than 1 price
),

t1 AS (
  SELECT
    t0.* EXCEPT(negotiated_prices, provider_references),
    prices.billing_class AS billing_class,
    prices.negotiated_rate AS negotiated_rate,
    prices.negotiated_type AS negotiated_type,
    provider_group_id,
  FROM t0, UNNEST(provider_references) AS provider_group_id, UNNEST(negotiated_prices) AS prices
  WHERE 11 IN UNNEST(prices.service_code) -- this is the only service code we care about for now, 11 is "in office"
      AND ARRAY_LENGTH(prices.billing_code_modifier) = 0 -- billing code modifiers can be "TC" or "26", we don't want those
  ),

t2 AS ( -- for some reason there are still multiple prices for a given billing code and provider group id so we have to aggregate
      SELECT
        CAST(billing_code AS STRING) AS billing_code,
        billing_code_type,
        CAST(billing_code_type_version AS STRING) AS billing_code_type_version,
        description,
        name,
        CAST(provider_group_id AS STRING) AS provider_group_id,
        negotiation_arrangement,
        ROUND(AVG(negotiated_rate), 2) AS negotiated_rate_avg,
        ARRAY_AGG(billing_class) AS billing_class_array,
        ARRAY_AGG(negotiated_rate) AS negotiated_rate_array,
        ARRAY_AGG(negotiated_type) AS negotiated_type_array,
      FROM
        t1
      WHERE
          negotiated_type <> 'percentage' -- percentages are not dollar amounts so we exclude them
      GROUP BY
        1,
        2,
        3,
        4,
        5,
        6,
        7
)

SELECT
    *
FROM
    t2
