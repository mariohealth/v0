# 12_PROCESS_AND_RUNBOOKS

This document consolidates operational commands and runbook signals observed in-repo.
It is intended as a practical execution checklist for local and CI workflows.
Only evidenced commands and scripts are included.
Unverified operational steps are marked `NOT EVIDENCED`.

Last updated: `2026-02-27`  
Current git commit hash: `a365a22d`

## Trigger

- Developer setup, local dev/test runs, and deployment actions. [source: `README.md`, `Makefile`, `frontend/package.json`, `backend/mario-health-api/TESTS.md`, `docs/llm_handoff/_evidence_index.md`]

## Inputs

- Root orchestration targets for env/bootstrap/deploy. [source: `Makefile`]
- Frontend scripts for dev/build/lint/e2e. [source: `frontend/package.json`]
- Backend test/deploy scripts and docs. [source: `backend/mario-health-api/TESTS.md`, `backend/mario-health-api/scripts/deploy.sh`, `backend/mario-health-api/scripts/smoke-prod.sh`]
- Pipeline and sync commands for ingestion/dbt/validation. [source: `backend/mario-health-data-pipeline/orchestrate.py`, `backend/bigquery-to-postgres/scripts/sync_all.py`, `backend/bigquery-to-postgres/scripts/validate_data.py`]

## Transformations

- Local runbooks execute service startup, tests, lint, and pipeline jobs. [source: `README.md`, `frontend/package.json`, `backend/mario-health-api/TESTS.md`, `docs/llm_handoff/_evidence_index.md`]
- Deployment runbooks package and deploy to Cloud Run/Firebase and wire scheduler paths. [source: `backend/mario-health-api/scripts/deploy.sh`, `backend/mario-health-data-pipeline/deploy.sh`, `.github/workflows/firebase-hosting.yml`]

## Outputs

- Expected outputs include running local servers, test reports, and deployment artifacts/logs. [source: `frontend/package.json`, `backend/mario-health-api/scripts/smoke-prod.sh`, `backend/bigquery-to-postgres/.github/workflows/sync-all-tables.yml`]
- Runtime scan output confirms current state of command success/failure. [source: `docs/llm_handoff/_runtime_findings.md`]

## Failure Modes

- Root test/lint command wrappers absent. [source: `package.json`, `docs/llm_handoff/_runtime_findings.md`]
- Backend tests blocked by missing pytest module in scanned environment. [source: `docs/llm_handoff/_runtime_findings.md`]
- Frontend E2E blocked by localhost connection refused in scan run. [source: `docs/llm_handoff/_runtime_findings.md`]

## Retry / Backfill Logic

- Sync and workflow rerun support through `--full-refresh` and manual dispatch. [source: `backend/bigquery-to-postgres/scripts/sync_data.py`, `backend/bigquery-to-postgres/.github/workflows/sync-single-table.yml`]
- Process for failed deploy rollback is `NOT EVIDENCED`. [source: `docs/llm_handoff/_evidence_index.md`]

## Observability

- Runbook-level smoke health checks and curl probes are present. [source: `backend/mario-health-api/scripts/smoke-prod.sh`, `docs/llm_handoff/_evidence_index.md`]
- Logging setup helper exists for GCP pipeline. [source: `backend/mario-health-api/app/middleware/logging.py`, `docs/llm_handoff/_evidence_index.md`]

## Known Risks

- Env/credential prerequisites are required for production-like runs and are redacted. [source: `backend/mario-health-api/.env`, `frontend/.env.local`, `docs/llm_handoff/_evidence_index.md`]
