{{
  config(
    materialized='table'
  )
}}

SELECT
    rxcui1, -- Unique identifier of first concept
    rxaui1, -- Unique identifier for first atom
    stype1, -- The name of the column in RXNCONSO.RRF that contains the identifier used for the first
    rel, -- Relationship of second concept or atom to first concept or atom
    rxcui2, -- Unique identifier of second concept
    rxaui2, -- Unique identifier for second atom
    stype2, -- The name of the column in RXNCONSO.RRF that contains the identifier used for the second
    rela, -- Additional (more specific) relationship label (optional)
    rui, -- Unique identifier for relationship
--    srui, -- Source asserted relationship identifier, if present (no value provided)
    sab, -- Abbreviation of the source of relationship
--    sl, -- Source of relationship labels (no value provided)
    rg, -- Machine generated and unverified indicator (optional)
--    dir, -- Source asserted directionality flag. (no value provided)
    suppress, -- Suppressible flag. Values = Y, E, or N. Reflects the suppressible status of the relationship; not yet in use.
    cvf, -- Content view flag. RxNorm includes one value, '4096', to denote inclusion in the Current Prescribable Content subset.
FROM
    {{ source('mario-mrf-data', 'rxn_rel_raw') }}
