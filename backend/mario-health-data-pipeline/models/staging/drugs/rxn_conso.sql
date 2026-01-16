{{
  config(
    materialized='table'
  )
}}

SELECT
    rxcui,
--    term_language, -- removing because it's always 'ENG'
    atom_unique_id,
    source_asserted_atom_id,
    source_asserted_concept_id,
    source_abbreviation,
    source_term_type,
    code,
    string,
--    suppress, -- removing because it's always 'N'
--    content_view_flag, -- removing because it's always '4096'
FROM
    {{ source('mario-mrf-data', 'rxn_conso_raw') }}
