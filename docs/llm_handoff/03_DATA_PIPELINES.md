# 03_DATA_PIPELINES

This document describes ETL, scheduler, and sync pipeline flows.
It is constrained to workflow/script evidence and runtime findings.
Each major path includes trigger and output boundaries.
Unknown behavior is marked `NOT EVIDENCED`.

Last updated: `2026-02-27`  
Current git commit hash: `a365a22d`

## Trigger

- Manual/HTTP invocation of pipeline orchestrator. [source: `backend/mario-health-data-pipeline/orchestrate.py`]
- Cloud Scheduler cron `0 3 * * *` targeting pipeline deployment. [source: `backend/mario-health-data-pipeline/deploy.sh`]
- GitHub Actions triggers: push/PR, main push, weekly cron, and workflow dispatch. [source: `.github/workflows/playwright.yml`, `.github/workflows/firebase-hosting.yml`, `backend/bigquery-to-postgres/.github/workflows/sync-all-tables.yml`, `backend/bigquery-to-postgres/.github/workflows/sync-single-table.yml`]

## Inputs

- Ingestion scripts and dbt project config/models/seeds. [source: `backend/mario-health-data-pipeline/scripts/ingest_uhc_data.py`, `backend/mario-health-data-pipeline/dbt_project.yml`, `backend/mario-health-data-pipeline/models/sources.yml`, `backend/mario-health-data-pipeline/seeds/`]
- Sync table configuration and SQL schema/function files. [source: `backend/bigquery-to-postgres/config/tables.py`, `backend/bigquery-to-postgres/config/sql/`]

## Transformations

- Pipeline orchestration sequence runs ingest, deps, dbt run, dbt test. [source: `backend/mario-health-data-pipeline/orchestrate.py`]
- BigQuery-to-Postgres sync performs extract, validate, load, post-validate. [source: `backend/bigquery-to-postgres/scripts/sync_data.py`, `backend/bigquery-to-postgres/scripts/validate_data.py`, `backend/bigquery-to-postgres/scripts/sync_all.py`]

## Outputs

- BigQuery raw/staged/fact data updates via ingestion and dbt outputs. [source: `backend/mario-health-data-pipeline/scripts/ingest_uhc_data.py`, `backend/mario-health-data-pipeline/models/facts/fact_drug_prices.sql`]
- Postgres table updates and validation logs/artifacts from sync workflows. [source: `backend/bigquery-to-postgres/scripts/sync_all.py`, `backend/bigquery-to-postgres/.github/workflows/sync-all-tables.yml`]

## Failure Modes

- Sync validation errors for required columns/nulls/coordinates can stop or flag loads. [source: `backend/bigquery-to-postgres/scripts/sync_data.py`, `backend/bigquery-to-postgres/scripts/validate_data.py`]
- Runtime command success for full cloud-triggered flows is `NOT EVIDENCED` in local scan. [source: `docs/llm_handoff/_runtime_findings.md`]

## Retry / Backfill Logic

- `--full-refresh` backfill supported in scripts and workflows. [source: `backend/bigquery-to-postgres/run_sync.sh`, `backend/bigquery-to-postgres/scripts/sync_data.py`, `backend/bigquery-to-postgres/.github/workflows/sync-all-tables.yml`, `backend/bigquery-to-postgres/.github/workflows/sync-single-table.yml`]

## Observability

- Validation/report output is emitted by sync scripts and workflow artifact paths. [source: `backend/bigquery-to-postgres/scripts/validate_data.py`, `backend/bigquery-to-postgres/.github/workflows/sync-all-tables.yml`]
- Pipeline log shipping/metrics outside script output is `NOT EVIDENCED`. [source: `docs/llm_handoff/_evidence_index.md`]

## Known Risks

- Ingestion source replacement remains TODO in pipeline script. [source: `backend/mario-health-data-pipeline/scripts/ingest_uhc_data.py`, `docs/llm_handoff/_evidence_index.md`]
- Orchestrator includes TODO for Slack notification path. [source: `backend/mario-health-data-pipeline/orchestrate.py`, `docs/llm_handoff/_evidence_index.md`]

