{{ config(materialized='table') }}

SELECT
        -- 1. Identifiers
        -- Keeping ID as string to preserve leading zeros (e.g., '010001')
        CAST(`Facility ID` AS STRING) AS facility_id,

        -- 2. General Hospital Information
        `Facility Name` AS facility_name,
        `Hospital Type` AS hospital_type,
        `Hospital Ownership` AS hospital_ownership,

        -- 3. Location & Contact
        Address AS address,
        `City or Town` AS city,
        State AS state_code,
        CAST(`ZIP Code` AS STRING) AS zip_code,
        `County or Parish` AS county,
        `Telephone Number` AS phone_number,

        -- 4. Services & Designations (Booleans)
        CASE
            WHEN `Emergency Services` = 'Yes' THEN TRUE
            WHEN `Emergency Services` = 'No' THEN FALSE
            ELSE NULL
        END AS has_emergency_services,

        CASE
            WHEN `Meets criteria for birthing friendly designation` = 'Y' THEN TRUE
            WHEN `Meets criteria for birthing friendly designation` = 'N' THEN FALSE
            ELSE NULL
        END AS is_birthing_friendly,

        -- 5. Quality Ratings (Cleaning "Not Available" strings)
        SAFE_CAST(NULLIF(`Hospital overall rating`, 'Not Available') AS INT64) AS overall_rating,

        -- 6. Mortality (MORT) Measures
        SAFE_CAST(NULLIF(`Count of Facility MORT Measures`, 'Not Available') AS INT64) AS facility_mort_measures_count,
        SAFE_CAST(NULLIF(`Count of MORT Measures Better`, 'Not Available') AS INT64) AS mort_measures_better_count,
        SAFE_CAST(NULLIF(`Count of MORT Measures No Different`, 'Not Available') AS INT64) AS mort_measures_avg_count,
        SAFE_CAST(NULLIF(`Count of MORT Measures Worse`, 'Not Available') AS INT64) AS mort_measures_worse_count,

        -- 7. Safety Measures
        SAFE_CAST(NULLIF(`Count of Facility Safety Measures`, 'Not Available') AS INT64) AS facility_safety_measures_count,
        SAFE_CAST(NULLIF(`Count of Safety Measures Better`, 'Not Available') AS INT64) AS safety_measures_better_count,
        SAFE_CAST(NULLIF(`Count of Safety Measures No Different`, 'Not Available') AS INT64) AS safety_measures_avg_count,
        SAFE_CAST(NULLIF(`Count of Safety Measures Worse`, 'Not Available') AS INT64) AS safety_measures_worse_count,

        -- 8. Readmission (READM) Measures
        SAFE_CAST(NULLIF(`Count of Facility READM Measures`, 'Not Available') AS INT64) AS facility_readmission_measures_count,
        SAFE_CAST(NULLIF(`Count of READM Measures Better`, 'Not Available') AS INT64) AS readmission_measures_better_count,
        SAFE_CAST(NULLIF(`Count of READM Measures No Different`, 'Not Available') AS INT64) AS readmission_measures_avg_count,
        SAFE_CAST(NULLIF(`Count of READM Measures Worse`, 'Not Available') AS INT64) AS readmission_measures_worse_count,

        -- 9. Patient Experience & Timely Care
        SAFE_CAST(NULLIF(`Count of Facility Pt Exp Measures`, 'Not Available') AS INT64) AS facility_patient_exp_measures_count,
        SAFE_CAST(NULLIF(`Count of Facility TE Measures`, 'Not Available') AS INT64) AS facility_timely_care_measures_count

    FROM {{ ref('cms_hospitals_raw') }}
