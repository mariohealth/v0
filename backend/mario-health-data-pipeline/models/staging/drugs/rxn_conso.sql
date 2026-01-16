{{
  config(
    materialized='table'
  )
}}

SELECT
    rxcui,
    term_language,
    atom_unique_id,
    source_asserted_atom_id,
    source_asserted_concept_id,
    source_abbreviation,
    source_term_type,
    code,
    string,
    suppress,
    content_view_flag,
FROM
    {{ source('mario-mrf-data', 'rxn_conso_raw') }}
