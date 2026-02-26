# 01_DOMAIN_MODEL

This document describes the domain model as evidenced in the repository.
It is intended to help an engineer/LLM understand core entities, relationships, and invariants.
Claims must be grounded in file paths. Anything not directly evidenced is labeled **EVIDENCE TBD**.

Last updated: `2026-02-27`  
Current git commit hash: `67969a83`

## Evidence sources used
- `docs/llm_handoff/_evidence_index.md` (Phase A evidence index)
- `docs/llm_handoff/_runtime_findings.md` (Phase A2 runtime evidence)

> NOTE: This v2 document is intentionally conservative to avoid hallucination under unstable tooling.
> Fill in specific entities/relationships only when you can point to concrete evidence paths (models/migrations/sql/seeds).

## Core entities
- Provider — provider-facing records and lookup flows are evidenced in `backend/mario-health-api/app/api/v1/endpoints/providers.py`, `backend/mario-health-api/app/services/provider_service.py`, and table DDL scope at `backend/bigquery-to-postgres/config/sql/02_tables/`.
- Specialty — specialty-specific provider flow is evidenced in `backend/mario-health-api/app/services/specialty_service.py` and `backend/mario-health-api/app/api/v1/endpoints/specialties.py`.
- Procedure — procedure search domain is evidenced in `backend/bigquery-to-postgres/config/sql/01_functions_search_v3.sql` and endpoint/module presence at `backend/mario-health-api/app/api/v1/endpoints/procedures.py`.
- Bundle — bundle estimate flow is evidenced in `backend/mario-health-api/app/api/v1/endpoints/bundles.py` and `backend/mario-health-api/app/services/bundle_service.py`.
- Drug pricing — medication/drug pricing domain is evidenced in `backend/mario-health-data-pipeline/models/facts/fact_drug_prices.sql`, `backend/database-loader/function/get_medication_prices.sql`, and DDL scope at `backend/bigquery-to-postgres/config/sql/02_tables/`.

## Data stores and schemas (evidence required)
### Postgres / Supabase
- Postgres schema primitives are defined in `backend/bigquery-to-postgres/config/sql/00_extensions.sql`, `backend/bigquery-to-postgres/config/sql/01_functions.sql`, `backend/bigquery-to-postgres/config/sql/04_triggers.sql`, `backend/bigquery-to-postgres/config/sql/05_constraints.sql`, and `backend/bigquery-to-postgres/config/sql/06_views.sql`.
- Postgres table/index contracts are defined in `backend/bigquery-to-postgres/config/sql/02_tables/`, `backend/bigquery-to-postgres/config/sql/03_indexes.sql`, `backend/bigquery-to-postgres/config/sql/03_indexes/`, and `backend/bigquery-to-postgres/config/tables.py`; Supabase client dependency is evidenced in `backend/mario-health-api/app/core/dependencies.py`.

### BigQuery
- Source declarations for BigQuery-facing lineage are defined in `backend/mario-health-data-pipeline/models/sources.yml`.
- Project-level model/seed lineage configuration is defined in `backend/mario-health-data-pipeline/dbt_project.yml`.
- Staging-layer table lineage artifacts are defined in `backend/mario-health-data-pipeline/models/staging/`.
- Fact-layer table lineage artifact is defined in `backend/mario-health-data-pipeline/models/facts/fact_drug_prices.sql`.
- Ingestion/orchestration lineage entrypoints are defined in `backend/mario-health-data-pipeline/scripts/ingest_uhc_data.py` and `backend/mario-health-data-pipeline/orchestrate.py`.

## Relationships (EVIDENCE TBD until mapped)
- Provider ↔ Locations — evidenced by provider/location search artifacts in `backend/mario-health-api/app/services/specialty_service.py` and `backend/bigquery-to-postgres/config/sql/03_indexes/provider_location_lat_lng.sql`.
- Provider ↔ Specialties — evidenced by specialty-provider flow artifacts in `backend/mario-health-api/app/services/specialty_service.py` and `backend/mario-health-api/app/api/v1/endpoints/specialties.py`.
- Procedure ↔ Bundles — **Not evidenced in paths** (`backend/mario-health-api/app/api/v1/endpoints/procedures.py`, `backend/mario-health-api/app/api/v1/endpoints/bundles.py`, `backend/mario-health-api/app/services/bundle_service.py`).
- Specialty ↔ Procedures — **Not evidenced in paths** (`backend/mario-health-api/app/api/v1/endpoints/specialties.py`, `backend/mario-health-api/app/api/v1/endpoints/procedures.py`, `backend/bigquery-to-postgres/config/sql/01_functions_search_v3.sql`).

## Identifiers and keys (EVIDENCE TBD until mapped)
- Provider IDs — **Not evidenced in paths** (`backend/bigquery-to-postgres/config/sql/02_tables/`, `backend/bigquery-to-postgres/config/tables.py`, `backend/mario-health-api/app/api/v1/endpoints/providers.py`).
- Specialty slugs — **Not evidenced in paths** (`backend/mario-health-api/app/api/v1/endpoints/specialties.py`, `backend/mario-health-api/app/services/specialty_service.py`, `backend/mario-health-api/app/api/v1/endpoints/`).
- Bundle IDs — **Not evidenced in paths** (`backend/mario-health-api/app/api/v1/endpoints/bundles.py`, `backend/mario-health-api/app/services/bundle_service.py`, `backend/bigquery-to-postgres/config/sql/02_tables/`).

## Validation and invariants (EVIDENCE TBD until mapped)
- Deduplication rules — evidenced in `backend/bigquery-to-postgres/scripts/sync_data.py` (duplicate removal), `backend/mario-health-data-pipeline/scripts/ingest_uhc_data.py` (ingestion deduplication), and `backend/bigquery-to-postgres/config/sql/01_functions_search_v3.sql` (`candidates_dedup` logic).
- Required fields / constraints — evidenced in `backend/bigquery-to-postgres/config/tables.py` (required columns contract) and `backend/bigquery-to-postgres/config/sql/05_constraints.sql` (constraint definitions).
- Search ranking weights — **Not evidenced in paths** (`backend/bigquery-to-postgres/config/sql/01_functions_search_v3.sql` shows ranking/distance logic but no explicit weights in evidence index text).

## Next step to complete this doc (manual/evidence-driven)
1) Open `docs/llm_handoff/_evidence_index.md`
2) Extract explicit schema/model paths (SQL tables, dbt models, seeds, migrations)
3) Replace each **EVIDENCE TBD** block with:
   - concrete entity definition
   - file path citations
   - relationship + join keys
