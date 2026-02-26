# 04_INTEGRATIONS_AND_DEPENDENCIES

This document inventories external integrations and dependency touchpoints.
It is limited to integrations explicitly evidenced in the Phase A/A2 outputs.
Authentication, retries, and integration triggers are listed when directly observed.
Missing details are marked `NOT EVIDENCED`.

Last updated: `2026-02-27`  
Current git commit hash: `a365a22d`

## Trigger

- API requests requiring auth, search, provider, and related data calls. [source: `frontend/src/lib/api.ts`, `backend/mario-health-api/app/api/v1/endpoints/`]
- Pipeline execution and sync jobs integrating with BigQuery/Postgres. [source: `backend/mario-health-data-pipeline/orchestrate.py`, `backend/bigquery-to-postgres/scripts/sync_data.py`]

## Inputs

- Supabase environment and client setup. [source: `backend/mario-health-api/app/core/dependencies.py`]
- Firebase client and admin auth configuration. [source: `frontend/src/lib/firebase.ts`, `backend/mario-health-api/app/auth/firebase_auth.py`, `backend/mario-health-api/app/core/auth.py`]
- API gateway forwarding specification. [source: `backend/mario-health-api/api-gateway-config.yaml`]
- dbt source declarations for external datasets. [source: `backend/mario-health-data-pipeline/models/sources.yml`]

## Transformations

- Frontend resolves local/prod API base path then dispatches endpoint calls. [source: `frontend/src/lib/api-base.ts`, `frontend/src/lib/api.ts`]
- Backend verifies bearer tokens and executes service-layer data access via Supabase. [source: `backend/mario-health-api/app/core/auth.py`, `backend/mario-health-api/app/core/dependencies.py`, `backend/mario-health-api/app/services/`]
- Pipeline ingest transforms input records and writes to BigQuery. [source: `backend/mario-health-data-pipeline/scripts/ingest_uhc_data.py`]

## Outputs

- Authenticated API responses and fallback/retry behavior on client side. [source: `frontend/src/lib/api.ts`]
- BigQuery dataset updates and downstream Postgres sync outputs. [source: `backend/mario-health-data-pipeline/scripts/ingest_uhc_data.py`, `backend/bigquery-to-postgres/scripts/sync_all.py`]

## Failure Modes

- Frontend retry path handles 401/403/network errors. [source: `frontend/src/lib/api.ts`]
- Rate-limit policy configuration on backend/provider integrations is `NOT EVIDENCED`. [source: `docs/llm_handoff/_evidence_index.md`]

## Retry / Backfill Logic

- Playwright test retries configured in test framework settings. [source: `frontend/playwright.config.ts`]
- Data backfill via `--full-refresh` for sync flows. [source: `backend/bigquery-to-postgres/scripts/sync_data.py`, `backend/bigquery-to-postgres/.github/workflows/sync-all-tables.yml`]

## Observability

- Integration-facing API routes are logged via middleware and endpoint/service logging. [source: `backend/mario-health-api/app/middleware/logging.py`, `backend/mario-health-api/app/api/v1/endpoints/search.py`, `backend/mario-health-api/app/services/search_service.py`]

## Known Risks

- External credentials and cloud secret bindings are required but values are redacted (`secret present here`). [source: `backend/mario-health-api/.env`, `frontend/.env.local`, `docs/llm_handoff/_evidence_index.md`]
- Full validation of integration health in production is `NOT EVIDENCED` without external credentials. [source: `docs/llm_handoff/_phase_gate.md`]
