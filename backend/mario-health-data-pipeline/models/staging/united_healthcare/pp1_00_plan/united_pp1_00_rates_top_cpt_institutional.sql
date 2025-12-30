{{
  config(
    materialized='table'
  )
}}

-- this table only includes institutional rates (no professional rates included)

WITH t0 AS (
    SELECT
        source.* EXCEPT(negotiated_rates),
        rates.*,

    FROM {{ ref('united_pp1_00_rates_top_cpt') }} AS source -- when using this smaller input the resulting table is 180k rows 1.7 GiB, good enough for MVP
--    FROM {{ source('mario-mrf-data', 'uhc_apple_in_network_rates') }} AS source -- when using the full input the resulting table is 45.9m rows 73.2 GiB, too big for MVP
        , UNNEST(negotiated_rates) AS rates
),

t1 AS (
  SELECT
    provider_group_id,
    t0.* EXCEPT(negotiated_prices, provider_references),
    prices.additional_information AS additional_information,
    prices.billing_class AS billing_class,
    prices.negotiated_rate AS negotiated_rate,
    prices.negotiated_type AS negotiated_type,
    prices.service_code AS service_code,
    prices.billing_code_modifier AS billing_code_modifier,
  FROM t0, UNNEST(provider_references) AS provider_group_id, UNNEST(negotiated_prices) AS prices
  WHERE prices.billing_class = 'institutional'
  )

SELECT
    *
FROM
    t1
