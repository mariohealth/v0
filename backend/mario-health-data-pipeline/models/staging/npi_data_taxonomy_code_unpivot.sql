{{
  config(
    materialized='table'
  )
}}

WITH
  t0 AS (
  SELECT
    npi,
    healthcare_provider_taxonomy_code,
    healthcare_provider_primary_taxonomy_switch,
    provider_license_number,
    provider_license_number_state_code,
    CAST(SPLIT(SPLIT(columns_names, 'healthcare_provider_taxonomy_code_')[
      OFFSET
        (1)], '_')[
    OFFSET
      (0)] AS INT) AS code_order,
  FROM
    {{ source('mario-mrf-data', 'npidata_pfile_20050523-20250907') }}
  UNPIVOT
    ( (healthcare_provider_taxonomy_code,
        provider_license_number,
        provider_license_number_state_code,
        healthcare_provider_primary_taxonomy_switch) FOR columns_names IN ( (healthcare_provider_taxonomy_code_1,
          provider_license_number_1,
          provider_license_number_state_code_1,
          healthcare_provider_primary_taxonomy_switch_1),
        (healthcare_provider_taxonomy_code_2,
          provider_license_number_2,
          provider_license_number_state_code_2,
          healthcare_provider_primary_taxonomy_switch_2),
        (healthcare_provider_taxonomy_code_3,
          provider_license_number_3,
          provider_license_number_state_code_3,
          healthcare_provider_primary_taxonomy_switch_3),
        (healthcare_provider_taxonomy_code_4,
          provider_license_number_4,
          provider_license_number_state_code_4,
          healthcare_provider_primary_taxonomy_switch_4),
        (healthcare_provider_taxonomy_code_5,
          provider_license_number_5,
          provider_license_number_state_code_5,
          healthcare_provider_primary_taxonomy_switch_5),
        (healthcare_provider_taxonomy_code_6,
          provider_license_number_6,
          provider_license_number_state_code_6,
          healthcare_provider_primary_taxonomy_switch_6),
        (healthcare_provider_taxonomy_code_7,
          provider_license_number_7,
          provider_license_number_state_code_7,
          healthcare_provider_primary_taxonomy_switch_7),
        (healthcare_provider_taxonomy_code_8,
          provider_license_number_8,
          provider_license_number_state_code_8,
          healthcare_provider_primary_taxonomy_switch_8),
        (healthcare_provider_taxonomy_code_9,
          provider_license_number_9,
          provider_license_number_state_code_9,
          healthcare_provider_primary_taxonomy_switch_9),
        (healthcare_provider_taxonomy_code_10,
          provider_license_number_10,
          provider_license_number_state_code_10,
          healthcare_provider_primary_taxonomy_switch_10),
        (healthcare_provider_taxonomy_code_11,
          provider_license_number_11,
          provider_license_number_state_code_11,
          healthcare_provider_primary_taxonomy_switch_11),
        (healthcare_provider_taxonomy_code_12,
          provider_license_number_12,
          provider_license_number_state_code_12,
          healthcare_provider_primary_taxonomy_switch_12),
        (healthcare_provider_taxonomy_code_13,
          provider_license_number_13,
          provider_license_number_state_code_13,
          healthcare_provider_primary_taxonomy_switch_13),
        (healthcare_provider_taxonomy_code_14,
          provider_license_number_14,
          provider_license_number_state_code_14,
          healthcare_provider_primary_taxonomy_switch_14),
        (healthcare_provider_taxonomy_code_15,
          provider_license_number_15,
          provider_license_number_state_code_15,
          healthcare_provider_primary_taxonomy_switch_15) ) ) )
SELECT
  *
FROM
  t0
WHERE
  healthcare_provider_taxonomy_code <> ''
