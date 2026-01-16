{{
  config(
    materialized='table'
  )
}}

SELECT
    rxcui,
--    term_language, -- removing because it's always 'ENG'
    rxaui, -- Unique identifier for atom (RxNorm Atom ID)
    saui, -- Source asserted atom identifier [optional]
    scui, -- Source asserted concept identifier [optional]
    sdui, -- Source asserted descriptor identifier [optional] -- all NULLs as of Jan 2026
    sab, -- Source abbreviation
    tty, -- Term type in source
    code, -- "Most useful" source asserted identifier (if the source vocabulary has more than one identifier), or a
--    RxNorm-generated source entry identifier (if the source vocabulary has none.)
    str, -- String
--    suppress, -- removing because it's always 'N'
--    content_view_flag, -- removing because it's always '4096'
FROM
    {{ source('mario-mrf-data', 'rxn_conso_raw') }}
