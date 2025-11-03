{{
  config(
    materialized='table'
  )
}}

WITH t0 AS (
    SELECT
        prov_ref.npi,
        rates.*
    FROM
        {{ ref('cigna_national_oap_prov_ref_type_2_new_york') }} AS prov_ref

    JOIN
        {{ ref('cigna_national_oap_rates_top_cpt_unnest') }} AS rates
    ON
        prov_ref.provider_group_id = rates.provider_group_id
)

-- some NPIs (even though they are all type 2) can appear in multiple provider groups so we have to aggregate (see
-- NPI 1437875564 which belongs to provider group ID 3016697 AND 3020135...
SELECT
    npi,
    billing_code ,
    billing_code_type,
    billing_code_type_version,
    description,
    name,
    ROUND(AVG(negotiated_rate_avg), 2) AS negotiated_rate_avg,
    ARRAY_AGG(provider_group_id) AS provider_group_id_array,
    ARRAY_AGG(negotiation_arrangement) AS negotiation_arrangement_array,
    ARRAY_AGG(negotiated_rate_avg) AS negotiated_rate_avg_array,
{#    ARRAY_AGG(billing_class_array) AS billing_class_array,#}
{#    ARRAY_AGG(negotiated_rate_array) AS negotiated_rate_array,#}
{#    ARRAY_AGG(negotiated_type_array) AS negotiated_type_array,#}
FROM
    t0
GROUP BY
    npi,
    billing_code ,
    billing_code_type,
    billing_code_type_version,
    description,
    name
