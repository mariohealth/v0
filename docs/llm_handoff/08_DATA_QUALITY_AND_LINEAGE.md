# 08_DATA_QUALITY_AND_LINEAGE

This document captures data quality controls and lineage signals across ingestion, dbt, and sync.
It is based only on evidence indexed in Phase A and runtime findings in Phase A2.
Validation, deduplication, and backfill controls are listed when directly observed.
Unobserved lineage tooling is marked `NOT EVIDENCED`.

Last updated: `2026-02-27`  
Current git commit hash: `a365a22d`

## Trigger

- Pipeline orchestration and sync scripts trigger data quality checks. [source: `backend/mario-health-data-pipeline/orchestrate.py`, `backend/bigquery-to-postgres/scripts/sync_data.py`, `backend/bigquery-to-postgres/scripts/validate_data.py`]
- Verification scripts can be run manually for coverage and endpoint checks. [source: `backend/scripts/verify_procedure_coverage_supabase.py`, `backend/scripts/verify_provider_data_v2.py`, `backend/scripts/full_data_verification.py`, `backend/scripts/verify_api_endpoints.py`]

## Inputs

- dbt source declarations, models, and seed schema metadata. [source: `backend/mario-health-data-pipeline/models/sources.yml`, `backend/mario-health-data-pipeline/models/facts/fact_drug_prices.sql`, `backend/mario-health-data-pipeline/seeds/schema.yml`]
- Sync contracts and SQL functions/tables for destination schema. [source: `backend/bigquery-to-postgres/config/tables.py`, `backend/bigquery-to-postgres/config/sql/01_functions_search_v3.sql`, `backend/bigquery-to-postgres/config/sql/02_tables/`]

## Transformations

- Ingestion script performs cleaning and deduplication. [source: `backend/mario-health-data-pipeline/scripts/ingest_uhc_data.py`]
- Sync script enforces required columns, null checks, coordinate bounds, and duplicate removal. [source: `backend/bigquery-to-postgres/scripts/sync_data.py`]
- SQL search function applies dedup stage `candidates_dedup`. [source: `backend/bigquery-to-postgres/config/sql/01_functions_search_v3.sql`]

## Outputs

- Validated Postgres tables after sync and verification passes/failures. [source: `backend/bigquery-to-postgres/scripts/sync_all.py`, `backend/bigquery-to-postgres/scripts/validate_data.py`]
- Fact-level medication price output from staged inputs. [source: `backend/mario-health-data-pipeline/models/facts/fact_drug_prices.sql`]

## Failure Modes

- Validation checks can fail on row counts, nulls, coordinates, or orphan conditions. [source: `backend/bigquery-to-postgres/scripts/validate_data.py`]
- Runtime execution proof of successful full end-to-end data refresh is `NOT EVIDENCED` in current scan. [source: `docs/llm_handoff/_runtime_findings.md`]

## Retry / Backfill Logic

- Backfill/full-refresh supported via CLI flags and workflow inputs. [source: `backend/bigquery-to-postgres/run_sync.sh`, `backend/bigquery-to-postgres/scripts/sync_data.py`, `backend/bigquery-to-postgres/.github/workflows/sync-all-tables.yml`, `backend/bigquery-to-postgres/.github/workflows/sync-single-table.yml`]

## Observability

- Validation scripts emit quality signals through command output and workflow logs. [source: `backend/bigquery-to-postgres/scripts/validate_data.py`, `backend/bigquery-to-postgres/.github/workflows/sync-all-tables.yml`]

## Known Risks

- Some ingest/notification paths remain TODO-marked and can affect quality assurance completeness. [source: `backend/mario-health-data-pipeline/scripts/ingest_uhc_data.py`, `backend/mario-health-data-pipeline/orchestrate.py`, `docs/llm_handoff/_evidence_index.md`]
