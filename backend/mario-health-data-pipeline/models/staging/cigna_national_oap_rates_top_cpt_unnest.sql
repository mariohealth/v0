{{
  config(
    materialized='table'
  )
}}

WITH t0 AS (
    SELECT
        top.* EXCEPT(negotiated_rates),
        rates.*,

    FROM {{ ref('cigna_national_oap_rates_top_cpt') }} AS top
        , UNNEST(negotiated_rates) AS rates
    WHERE
        ARRAY_LENGTH(negotiated_prices) <= 1 -- to start simple for now
),

t1 AS (
  SELECT
    t0.* EXCEPT(negotiated_prices, provider_references),
    negotiated_prices[OFFSET(0)].billing_class AS billing_class,
    negotiated_prices[OFFSET(0)].negotiated_rate AS negotiated_rate,
    negotiated_prices[OFFSET(0)].negotiated_type AS negotiated_type,
    provider_group_id,
  FROM t0, UNNEST(provider_references) AS provider_group_id
  WHERE 11 IN UNNEST(negotiated_prices[OFFSET(0)].service_code) -- this is the only service code we care about for now, 11 is in office
  ),

t2 AS ( -- for some reason there are still multiple prices for a given billing code and provider group id so we have to aggregate
      SELECT
        billing_code,
        billing_code_type,
        billing_code_type_version,
        description,
        name,
        provider_group_id,
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
        billing_code,
        billing_code_type,
        billing_code_type_version,
        description,
        name,
        provider_group_id,
        negotiation_arrangement
)

SELECT
    *
FROM
    t2
