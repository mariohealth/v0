# 03_DATA_PIPELINES

## BigQuery→Postgres sync jobs

- triggers: `backend/bigquery-to-postgres/.github/workflows/sync-all-tables.yml` (weekly cron `0 2 * * 0` + manual `workflow_dispatch`), `backend/bigquery-to-postgres/.github/workflows/sync-single-table.yml` (manual `workflow_dispatch`), push trigger Not evidenced in paths.
- inputs: `backend/bigquery-to-postgres/config/tables.py` (table sync contract), `backend/bigquery-to-postgres/config/sql/02_tables/` (table DDL), `backend/bigquery-to-postgres/.env.example` (sync env template).
- outputs: `backend/bigquery-to-postgres/config/sql/02_tables/` (destination Postgres table definitions), workflow outputs evidenced at `backend/bigquery-to-postgres/.github/workflows/sync-all-tables.yml` (Postgres sync + validation + logs artifact) and `backend/bigquery-to-postgres/.github/workflows/sync-single-table.yml` (single-table Postgres sync + validation).
- commands/scripts invoked: `backend/bigquery-to-postgres/scripts/sync_all.py`, `backend/bigquery-to-postgres/scripts/sync_data.py`, `backend/bigquery-to-postgres/scripts/validate_data.py`, `backend/bigquery-to-postgres/run_sync.sh`.
