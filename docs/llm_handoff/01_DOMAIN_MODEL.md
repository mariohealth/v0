# 01_DOMAIN_MODEL

This document captures domain entities and data contracts used by API, sync, and pipeline layers.
It is evidence-grounded and limited to discovered schema/model files and runtime findings.
Use this as the reference for core business objects and data boundaries.
Any inferred domain relation not directly present in evidence is labeled `NOT EVIDENCED`.

Last updated: `2026-02-27`  
Current git commit hash: `a365a22d`

## Trigger

- Domain objects are materialized during schema setup, sync runs, and API request handling. [source: `backend/bigquery-to-postgres/scripts/setup_schemas.py`, `backend/bigquery-to-postgres/scripts/sync_data.py`, `backend/mario-health-api/app/main.py`]

## Inputs

- SQL DDL/function/view definitions from `config/sql` files. [source: `backend/bigquery-to-postgres/config/sql/00_extensions.sql`, `backend/bigquery-to-postgres/config/sql/01_functions.sql`, `backend/bigquery-to-postgres/config/sql/02_tables/`, `backend/bigquery-to-postgres/config/sql/06_views.sql`]
- Table sync contracts with required columns and sync mode. [source: `backend/bigquery-to-postgres/config/tables.py`]
- API/domain model modules in backend app models directory. [source: `backend/mario-health-api/app/models/`]
- dbt source/staging/fact/dimension models and seeds. [source: `backend/mario-health-data-pipeline/models/sources.yml`, `backend/mario-health-data-pipeline/models/staging/`, `backend/mario-health-data-pipeline/models/facts/fact_drug_prices.sql`, `backend/mario-health-data-pipeline/models/dimensions/`, `backend/mario-health-data-pipeline/seeds/`]

## Transformations

- Search domain logic includes ranking/dedup/distance in `search_procedures_v3`. [source: `backend/bigquery-to-postgres/config/sql/01_functions_search_v3.sql`]
- Medication price domain logic joins price/source/pharmacy entities in SQL function. [source: `backend/database-loader/function/get_medication_prices.sql`]
- dbt composes raw/staged medication sources into fact output. [source: `backend/mario-health-data-pipeline/models/facts/fact_drug_prices.sql`]

## Outputs

- Postgres tables/views/functions for API and search usage. [source: `backend/bigquery-to-postgres/config/sql/02_tables/`, `backend/bigquery-to-postgres/config/sql/01_functions.sql`, `backend/bigquery-to-postgres/config/sql/06_views.sql`]
- API responses shaped by backend model and service layers. [source: `backend/mario-health-api/app/models/`, `backend/mario-health-api/app/services/`]

## Failure Modes

- Missing required sync columns and validation failures during ETL are handled in sync scripts. [source: `backend/bigquery-to-postgres/scripts/sync_data.py`, `backend/bigquery-to-postgres/scripts/validate_data.py`]
- Backend tests currently fail to run in scanned runtime due missing `pytest` module. [source: `docs/llm_handoff/_runtime_findings.md`]

## Retry / Backfill Logic

- Full refresh supported by sync scripts and workflow inputs. [source: `backend/bigquery-to-postgres/scripts/sync_data.py`, `backend/bigquery-to-postgres/run_sync.sh`, `backend/bigquery-to-postgres/.github/workflows/sync-all-tables.yml`, `backend/bigquery-to-postgres/.github/workflows/sync-single-table.yml`]

## Observability

- Data and search behavior logged through API middleware and service logs. [source: `backend/mario-health-api/app/middleware/logging.py`, `backend/mario-health-api/app/services/search_service.py`]

## Known Risks

- Medications API endpoint file is `NOT EVIDENCED` on this branch. [source: `docs/llm_handoff/_evidence_index.md`]
- Contract mismatch risk is flagged in known issues evidence (`total_results` vs `results_count`). [source: `docs/llm_handoff/_evidence_index.md`]
