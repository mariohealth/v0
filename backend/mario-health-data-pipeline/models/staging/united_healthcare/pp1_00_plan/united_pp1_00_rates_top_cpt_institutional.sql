{{
  config(
    materialized='table'
  )
}}

-- this table only includes institutional rates (no professional rates included)

WITH t0 AS (
    SELECT
        source.billing_code,
        source.billing_code_type,
        source.billing_code_type_version,
        source.description,
        source.name,
        rates.negotiated_prices,
        rates.provider_references,

    FROM {{ ref('united_pp1_00_rates_top_cpt') }} AS source -- when using this smaller input the resulting table is 180k rows 1.7 GiB, good enough for MVP
--    FROM {{ source('mario-mrf-data', 'uhc_apple_in_network_rates') }} AS source -- when using the full input the resulting table is 45.9m rows 73.2 GiB, too big for MVP
        , UNNEST(negotiated_rates) AS rates
),

t1 AS (
  SELECT
    provider_group_id,
    t0.billing_code,
    t0.billing_code_type,
    t0.billing_code_type_version,
    t0.description,
    t0.name,
    -- prices.additional_information AS additional_information, -- not needed because only 5 rows have it different than ''
    prices.billing_class AS billing_class,
    prices.negotiated_rate AS negotiated_rate,
    prices.negotiated_type AS negotiated_type,
--    prices.service_code AS service_code, -- not needed because it is always an empty array
--    prices.billing_code_modifier AS billing_code_modifier, -- not needed because it is always an empty array
  FROM t0
  , UNNEST(provider_references) AS provider_group_id
  , UNNEST(negotiated_prices) AS prices
  WHERE prices.billing_class = 'institutional'
  )

SELECT
    *
FROM
    t1
