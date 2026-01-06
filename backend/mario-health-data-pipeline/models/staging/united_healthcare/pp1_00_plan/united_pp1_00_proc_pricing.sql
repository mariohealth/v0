{{
  config(
    materialized='table'
  )
}}
-- Purpose: Aggregate professional + institutional components into total procedure pricing
-- Key design: Sum components BEFORE selecting MIN across codes
-- STEP 1: Extract professional rates (per doctor, per code)
WITH prof_by_code AS (
    SELECT
        map.procedure_id,
        rates.hospital_id,
        rates.npi,
        rates.billing_code,
        rates.negotiated_rate_avg AS prof_rate
    FROM {{ ref('united_pp1_00_rates_professional_hospital') }} AS rates
    JOIN {{ ref('procedure_billing_code') }} AS map
        ON rates.billing_code = map.code
        AND rates.billing_code_type = map.code_type
        AND CAST(rates.billing_code_type_version AS STRING) = '2025'
),
-- STEP 2: Extract institutional rates (per hospital, per code - no NPI dimension)
inst_by_code AS (
    SELECT
        map.procedure_id,
        rates.hospital_id,
        rates.billing_code,
        rates.inst_rate_avg AS inst_rate
    FROM {{ ref('united_pp1_00_rates_institutional_hospital') }} AS rates
    JOIN {{ ref('procedure_billing_code') }} AS map
        ON rates.billing_code = map.code
        AND rates.billing_code_type = map.code_type
        AND CAST(rates.billing_code_type_version AS STRING) = '2025'
),
-- STEP 3: Combine professional + institutional
-- CRITICAL DESIGN DECISION:
--   - Institutional fees are facility-level (no NPI), so they will replicate across all NPIs at that hospital
--   - This is intentional: the total price for Doctor X at Hospital Y includes Hospital Y's facility fee
--   - FULL OUTER JOIN ensures we capture:
--     a) Professional-only scenarios (outpatient office visits)
--     b) Institutional-only scenarios (inpatient facility fees without provider-specific rates)
--     c) Combined scenarios (most hospital-based procedures)
combined_by_code AS (
    SELECT
        COALESCE(p.procedure_id, i.procedure_id) AS procedure_id,
        COALESCE(p.hospital_id, i.hospital_id) AS hospital_id,
        p.npi, -- May be NULL if only institutional rate exists
        COALESCE(p.billing_code, i.billing_code) AS billing_code,
        COALESCE(p.prof_rate, 0) AS prof_rate,
        COALESCE(i.inst_rate, 0) AS inst_rate,
        (COALESCE(p.prof_rate, 0) + COALESCE(i.inst_rate, 0)) AS total_rate_for_code,
        CASE WHEN p.prof_rate IS NOT NULL THEN 1 ELSE 0 END AS has_prof,
        CASE WHEN i.inst_rate IS NOT NULL THEN 1 ELSE 0 END AS has_inst
    FROM prof_by_code p
    FULL OUTER JOIN inst_by_code i
        ON p.hospital_id = i.hospital_id
        AND p.billing_code = i.billing_code
        AND p.procedure_id = i.procedure_id
        -- Intentionally NOT joining on NPI - institutional fee replicates across all doctors
),
-- STEP 4: Apply existing MIN logic across codes (using summed total_rate, not individual components)
final_agg AS (
    SELECT
        procedure_id,
        hospital_id,
        npi,
        MIN(total_rate_for_code) AS min_total_price, -- Preserves existing "cheapest code" logic
        -- Debug fields: extract components from the row with the minimum total_rate
        ARRAY_AGG(prof_rate ORDER BY total_rate_for_code LIMIT 1)[OFFSET(0)] AS prof_price_debug,
        ARRAY_AGG(inst_rate ORDER BY total_rate_for_code LIMIT 1)[OFFSET(0)] AS inst_price_debug,
        MAX(has_prof) AS has_prof, -- At least one code had professional rate
        MAX(has_inst) AS has_inst  -- At least one code had institutional rate
    FROM combined_by_code
    GROUP BY 1,2,3
)
-- STEP 5: Format output to match existing schema
SELECT
    CONCAT(procedure_id, '_', hospital_id, '_', npi, '_', 'united_pp1_00') AS id,
    procedure_id,
    hospital_id AS org_id,
    npi AS provider_id,
    CONCAT(hospital_id, "_", npi) AS provider_location_id,
    'united_pp1_00' AS carrier_id,
    'united' AS carrier_name,
    {{ round_price('min_total_price') }} AS price, -- Final price = prof + inst
    prof_price_debug, -- NEW: Component breakdown for validation
    inst_price_debug, -- NEW: Component breakdown for validation
    has_prof,         -- NEW: Flag indicating professional component exists
    has_inst          -- NEW: Flag indicating institutional component exists
FROM final_agg
WHERE npi IS NOT NULL -- Filter out institutional-only rows that lack a specific provider
