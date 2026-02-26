# PHASE A — EVIDENCE INDEX

## 1. Repo Structure

- `README.md` — Declares repository architecture (`frontend` Next.js, `backend` FastAPI, `docs`) and setup/test commands.
- `Makefile` — Defines root orchestration targets (`prereqs`, `init`, `link`, `env`, `frontend`, `backend`, `rewrites`, `validate`, `deploy`).
- `package.json` — Root Node package manifest (dependencies + devDependencies).
- `frontend/package.json` — Frontend scripts (`dev`, `build`, `start`, `lint`, `test:e2e`) and frontend dependency list.
- `backend/mario-health-api/requirements.txt` — Backend API Python dependencies.
- `backend/mario-health-data-pipeline/requirements.txt` — Data pipeline Python/dbt dependencies.
- `backend/bigquery-to-postgres/requirements.txt` — BigQuery/Postgres sync Python dependencies.
- Root directories from `ls -la`: `backend/`, `frontend/`, `docs/`, `scripts/`, `seed_data/`, `src/`.

Commands found:
- `cd frontend && npm install && npm run dev`
- `cd frontend && npm run build && npm run start`
- `cd backend/mario-health-api && pip install -r requirements.txt && uvicorn app.main:app --reload`
- `cd backend/mario-health-api && python -m pytest`

## 2. Runtime Components

- `backend/mario-health-api/app/main.py` — FastAPI app entrypoint, router mounting, middleware wiring, root and `/health` endpoints.
- `backend/mario-health-api/app/api/v1/endpoints/` — API endpoint modules (`categories`, `families`, `procedures`, `search`, `providers`, `doctors`, `bookings`, `insurance`, `specialties`, `bundles`, `whoami`, etc.).
- `backend/mario-health-api/app/services/` — Backend service modules (`search_service.py`, `provider_service.py`, `specialty_service.py`, etc.).
- `backend/mario-health-api/Dockerfile` — API runtime container (`uvicorn app.main:app --host 0.0.0.0 --port 8080`).
- `frontend/src/app/layout.tsx` — Frontend root app layout and provider wiring.
- `frontend/src/app/(authed)/layout.tsx` — Authenticated route-group layout using `AuthGuard`.
- `frontend/src/components/auth/AuthGuard.tsx` — Client route protection and redirect to `/login`.
- `backend/mario-health-data-pipeline/orchestrate.py` — Runtime orchestrator for ingestion + dbt + quality checks.
- `backend/mario-health-data-pipeline/Dockerfile` — Pipeline runtime image using HTTP wrapper (`server.py`) to invoke `orchestrate.py`.
- `backend/bigquery-to-postgres/scripts/sync_data.py` — Single-table sync CLI runtime.
- `backend/bigquery-to-postgres/scripts/sync_all.py` — Multi-table sync CLI runtime.
- `backend/bigquery-to-postgres/run_sync.sh` — Shell entrypoint for sync orchestration.
- `scripts/` — Root operational scripts (integration checks, deploy/verification helpers).

Commands found:
- `python backend/mario-health-data-pipeline/orchestrate.py`
- `python backend/bigquery-to-postgres/scripts/sync_data.py <table>`
- `python backend/bigquery-to-postgres/scripts/sync_all.py`
- `./backend/bigquery-to-postgres/run_sync.sh`

## 3. Data Layer

- `backend/bigquery-to-postgres/config/sql/00_extensions.sql` — Postgres extension setup.
- `backend/bigquery-to-postgres/config/sql/01_functions.sql` — SQL function definitions.
- `backend/bigquery-to-postgres/config/sql/01_functions_search_v3.sql` — Search SQL function (`search_procedures_v3`) with ranking/dedup/distance logic.
- `backend/bigquery-to-postgres/config/sql/02_tables/` — Table DDL files (provider/procedure/pricing/drugs/pharmacies/etc.).
- `backend/bigquery-to-postgres/config/sql/03_indexes.sql` and `backend/bigquery-to-postgres/config/sql/03_indexes/` — Index definitions.
- `backend/bigquery-to-postgres/config/sql/04_triggers.sql` — Trigger definitions.
- `backend/bigquery-to-postgres/config/sql/05_constraints.sql` — Constraint definitions.
- `backend/bigquery-to-postgres/config/sql/06_views.sql` — View definitions.
- `backend/bigquery-to-postgres/config/tables.py` — Table sync contract (source table, destination table, required columns, sync mode).
- `backend/mario-health-api/app/models/` — API/domain models.
- `backend/mario-health-api/app/core/dependencies.py` — Supabase client dependency requiring env vars.
- `backend/mario-health-data-pipeline/dbt_project.yml` — dbt project/model/seed config.
- `backend/mario-health-data-pipeline/models/sources.yml` — dbt source declarations.
- `backend/mario-health-data-pipeline/models/staging/` — Staging transform SQL models.
- `backend/mario-health-data-pipeline/models/facts/fact_drug_prices.sql` — Fact model combining medication price sources.
- `backend/mario-health-data-pipeline/models/dimensions/` — Dimension model SQL files.
- `backend/mario-health-data-pipeline/seeds/` and `seed_data/` — Seed CSV/JSON data inputs.
- `backend/database-loader/function/get_medication_prices.sql` — SQL function joining `drug_prices`, `pharmacies`, and `drug_price_sources`.

Commands found:
- `python backend/bigquery-to-postgres/scripts/setup_schemas.py`
- `cd backend/mario-health-data-pipeline && dbt run && dbt test`
- `python3 backend/database-loader/create_schema.py`
- `python3 backend/database-loader/load_csvs.py`
- `python3 backend/database-loader/create_function.py`

## 4. Pipelines & Jobs

- `backend/mario-health-data-pipeline/orchestrate.py` — ETL pipeline steps (`scripts/ingest_uhc_data.py`, `scripts/refresh_carriers.py`, `dbt deps`, `dbt run --fail-fast`, `dbt test`); trigger source: manual/HTTP job invocation; output destination: BigQuery tables + dbt outputs.
- `backend/mario-health-data-pipeline/deploy.sh` — Cloud Run deployment + Cloud Scheduler job (`0 3 * * *`); trigger source: Cloud Scheduler HTTP; output destination: Cloud Run execution and BigQuery updates.
- `backend/mario-health-data-pipeline/scripts/ingest_uhc_data.py` — Ingestion job; trigger source: script/orchestrator; output destination: `${GCP_PROJECT_ID}.analytics.raw_healthcare_prices`.
- `.github/workflows/playwright.yml` — CI workflow; trigger source: `push`/`pull_request`; output destination: Playwright report artifact.
- `.github/workflows/firebase-hosting.yml` — CI workflow; trigger source: `push` to `main`; output destination: Firebase Hosting deploy.
- `backend/bigquery-to-postgres/.github/workflows/sync-all-tables.yml` — Workflow; trigger source: weekly cron (`0 2 * * 0`) and `workflow_dispatch`; output destination: Postgres sync + validation + logs artifact.
- `backend/bigquery-to-postgres/.github/workflows/sync-single-table.yml` — Workflow; trigger source: `workflow_dispatch`; output destination: single-table Postgres sync + validation.
- `backend/bigquery-to-postgres/scripts/sync_all.py` — Multi-table sync orchestrator; trigger source: CLI/workflow; output destination: configured Postgres tables.
- `backend/bigquery-to-postgres/scripts/sync_data.py` — Single-table sync runner; trigger source: CLI/workflow; output destination: configured Postgres table.
- `backend/bigquery-to-postgres/scripts/validate_data.py` — Post-sync data checks; trigger source: CLI/workflow; output destination: validation report in command output/logs.

Commands found:
- `gcloud scheduler jobs run mario-data-pipeline-daily --location us-central1`
- `python backend/bigquery-to-postgres/scripts/sync_all.py`
- `python backend/bigquery-to-postgres/scripts/sync_all.py --full-refresh`
- `python backend/bigquery-to-postgres/scripts/sync_data.py <table> --full-refresh`
- `python backend/bigquery-to-postgres/scripts/validate_data.py`

## 5. Integrations & Dependencies

- `backend/mario-health-api/app/core/dependencies.py` — Supabase integration (`create_client`).
- `backend/mario-health-api/app/auth/firebase_auth.py` — Firebase Admin SDK token verification with ADC.
- `backend/mario-health-api/app/core/auth.py` — Bearer-token auth dependency (`require_auth`).
- `frontend/src/lib/firebase.ts` — Firebase client initialization from `NEXT_PUBLIC_FIREBASE_*`.
- `frontend/src/lib/api.ts` — Frontend API integrations (`/search`, `/providers`, `/bookings`, `/insurance`, `/whoami`, etc.).
- `frontend/src/lib/api-base.ts` — API base URL resolution for browser/SSR/local/prod.
- `backend/mario-health-data-pipeline/models/sources.yml` — External/source dataset definitions for dbt.
- `backend/mario-health-data-pipeline/scripts/ingest_uhc_data.py` — BigQuery client ingestion integration.
- `backend/mario-health-api/api-gateway-config.yaml` — Google API Gateway forwarding and CORS config.
- `backend/database-loader/function/get_medication_prices.sql` — Database integration function for medication prices.

Rate-limit/retry/auth evidence:
- `frontend/src/lib/api.ts` — `fetchSmartAuth` retry path on 401/403 and fetch errors.
- `frontend/playwright.config.ts` — Retry count and timeout configuration (`retries`, `timeout`).
- `backend/mario-health-api/app/core/auth.py` — Auth pattern `Authorization: Bearer <token>`.

Commands found:
- `gcloud auth application-default login`
- `curl http://localhost:8000/api/v1/categories`
- `curl http://localhost:8000/api/v1/search?q=chest`

## 6. Infrastructure & Deployment

- `.github/workflows/firebase-hosting.yml` — Frontend build/deploy workflow to Firebase Hosting.
- `.github/workflows/playwright.yml` — Frontend Playwright test workflow.
- `backend/bigquery-to-postgres/.github/workflows/sync-all-tables.yml` — Scheduled/manual BigQuery-to-Postgres sync workflow.
- `backend/bigquery-to-postgres/.github/workflows/sync-single-table.yml` — Manual per-table sync workflow.
- `firebase.json` — Firebase Hosting rewrites (`/api/v1/**` to Cloud Run `mario-health-api`) and static hosting config.
- `frontend/Dockerfile` — Next.js container build.
- `backend/mario-health-api/Dockerfile` — FastAPI container build and healthcheck.
- `backend/mario-health-data-pipeline/Dockerfile` — Data pipeline container build.
- `backend/mario-health-api/scripts/deploy.sh` — Cloud Run deployment script with env/secrets wiring.
- `backend/mario-health-api/api-gateway-config.yaml` — API Gateway OpenAPI forwarding/CORS config.
- `backend/mario-health-data-pipeline/deploy.sh` — Cloud Run + Scheduler deployment script.
- `backend/mario-health-data-pipeline/setup-gcp.sh` — GCP setup script for pipeline resources.
- `backend/mario-health-data-pipeline/profiles.yml` — `dev` target active; `prod` target block commented.

IaC signals:
- Terraform/Pulumi files are `NOT EVIDENCED` in repository scan.

Commands found:
- `./backend/mario-health-api/scripts/deploy.sh`
- `./backend/mario-health-data-pipeline/deploy.sh`
- `firebase deploy --only hosting --project mario-mrf-data`

## 7. Configuration

- `backend/mario-health-api/.env` — Backend env file; secret present here.
- `frontend/.env.local` — Frontend env file; secret present here.
- `.env.firebase` — Firebase deployment env file.
- `backend/bigquery-to-postgres/.env.example` — Sync env template.
- `backend/mario-health-api/app/main.py` — Env names: `SUPABASE_URL`, `SUPABASE_KEY`, `ENVIRONMENT`, `ALLOWED_ORIGINS`, `FIREBASE_PROJECT_ID`, `DEBUG`, `GIT_SHA`.
- `backend/mario-health-api/app/core/dependencies.py` — Env names: `SUPABASE_URL`, `SUPABASE_KEY`.
- `backend/mario-health-api/app/auth/firebase_auth.py` — Env name: `FIREBASE_PROJECT_ID`.
- `backend/mario-health-api/app/services/search_service.py` — Env name: `SEARCH_RPC_NAME`.
- `backend/mario-health-api/app/services/specialty_service.py` — Feature flag env name: `USE_PROVIDER_SEARCH_MV`.
- `backend/bigquery-to-postgres/scripts/sync_data.py` — Env names: `LOG_LEVEL`, `GCP_PROJECT_ID`, `POSTGRES_DB_URL`, `BIGQUERY_DATASET`.
- `backend/bigquery-to-postgres/scripts/validate_data.py` — Env name: `POSTGRES_DB_URL`.
- `backend/bigquery-to-postgres/scripts/setup_schemas.py` — Env name: `POSTGRES_DB_URL`.
- `backend/mario-health-data-pipeline/scripts/ingest_uhc_data.py` — Env name: `GCP_PROJECT_ID`.
- `backend/mario-health-data-pipeline/deploy.sh` — Env names used in deploy command (`ENVIRONMENT` and secret mount path).
- `frontend/next.config.mjs` — Env names: `NEXT_PUBLIC_API_BASE`, `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_API_URL`.
- `frontend/src/lib/api-base.ts` — Env names: `API_BASE_URL`, `NEXT_PUBLIC_API_BASE_URL`, `NODE_ENV`.
- `frontend/src/lib/firebase.ts` — Env names: `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`.
- `frontend/playwright.config.ts` — Env names: `CI`, `PLAYWRIGHT_BASE_URL`.
- `.github/workflows/playwright.yml` — Env names: `NEXT_PUBLIC_API_BASE_URL`, `PLAYWRIGHT_BASE_URL`, `CI`.
- `backend/bigquery-to-postgres/.github/workflows/sync-all-tables.yml` and `sync-single-table.yml` — Env/secrets names: `GCP_PROJECT_ID`, `BIGQUERY_DATASET`, `POSTGRES_DB_URL`, `WIF_PROVIDER`, `WIF_SERVICE_ACCOUNT`.

Commands found:
- `cp backend/bigquery-to-postgres/.env.example backend/bigquery-to-postgres/.env`
- `make env`

## 8. Observability

- `backend/mario-health-api/app/middleware/logging.py` — Structured JSON request logging with latency and severity; slow-request warning threshold `>1000ms`.
- `backend/mario-health-api/app/main.py` — Request/auth/origin logging middleware and global exception handlers.
- `backend/mario-health-api/app/api/v1/endpoints/search.py` — Search endpoint structured logging.
- `backend/mario-health-api/app/api/v1/endpoints/providers.py` — Provider view event logging.
- `backend/mario-health-api/app/api/v1/endpoints/doctors.py` — Doctor search event logging.
- `backend/mario-health-api/app/services/search_service.py` — Search completion/error logging.
- `backend/mario-health-api/app/services/specialty_service.py` — Funnel/pricing coverage logging in specialty provider flow.
- `backend/mario-health-api/app/main.py` — `/health` endpoint with status/version/environment/git SHA.
- `backend/mario-health-api/Dockerfile` — Container healthcheck to `/health`.
- `backend/mario-health-api/scripts/smoke-prod.sh` — Smoke script for production health/API checks.
- `frontend/src/lib/analytics.ts` — Frontend analytics helper with console logging and TODO integration note.
- `frontend/src/app/error.tsx` and `frontend/src/app/specialties/[slug]/error.tsx` — Client error handling with console logging.
- `frontend/tests/smoke.spec.ts` — Test-level listeners capture console/network/page errors.

Commands found:
- `curl http://localhost:8080/health`
- `./backend/mario-health-api/scripts/smoke-prod.sh`

## 9. Performance Signals

- `backend/bigquery-to-postgres/config/sql/01_functions_search_v3.sql` — Search query uses candidate union, dedup CTE (`candidates_dedup`), and `LIMIT`.
- `backend/bigquery-to-postgres/config/sql/03_indexes/provider_name_search.sql` — Search-related index definitions.
- `backend/bigquery-to-postgres/config/sql/03_indexes/provider_location_lat_lng.sql` — Location index definitions.
- `backend/mario-health-api/app/services/specialty_service.py` — Bounding box prefilter + haversine distance + result limit.
- `backend/mario-health-api/app/middleware/logging.py` — Latency measurement and slow request warning.
- `backend/scripts/verify_search_perf.sh` — Search performance probe script.
- `backend/mario-health-api/tests/performance/test_api_performance.py` — API response-time and concurrent-request tests.
- `frontend/playwright.config.ts` — Timeout and worker settings for e2e execution.
- `.github/workflows/playwright.yml` — `wait-on` timeout (`60000` ms).
- `backend/mario-health-api/scripts/deploy.sh` — Cloud Run runtime caps (`--max-instances 10`, `--timeout 60`).
- `backend/mario-health-api/Dockerfile` — Healthcheck timeout/retry settings.
- `frontend/src/lib/api.ts` — Auth/network retry fallback in `fetchSmartAuth`.

Commands found:
- `./backend/scripts/verify_search_perf.sh [URL] [COUNT]`
- `pytest backend/mario-health-api/tests/performance/test_api_performance.py`

## 10. Quality & Testing

- `pytest.ini` — Root pytest config with backend test path.
- `backend/mario-health-api/pytest.ini` — Backend pytest config and excluded directories.
- `backend/mario-health-api/TESTS.md` — Backend test and coverage commands.
- `backend/mario-health-api/tests/` — Backend API/service/contracts/performance tests.
- `backend/mario-health-api/tests/performance/test_api_performance.py` — Performance tests.
- `frontend/playwright.config.ts` — Playwright config for frontend tests.
- `frontend/tests/smoke.spec.ts` — Playwright smoke tests.
- `frontend/package.json` — Frontend lint/test/build scripts.
- `frontend/.eslintrc.json` — ESLint baseline (`next/core-web-vitals`).
- `frontend/tsconfig.json` — TS config (`strict: true`, `noEmit: true`).
- `frontend/next.config.mjs` — Build configured with `eslint.ignoreDuringBuilds` and `typescript.ignoreBuildErrors`.
- `backend/mario-health-api/scripts/ci_check_secrets.sh` — CI script checking secret pattern usage.
- `backend/mario-health-api/scripts/ci_check_patterns.sh` — CI script checking forbidden pattern usage.
- `.coverage` and `htmlcov/` — Coverage artifact signals present.

Pre-commit/hook evidence:
- `.pre-commit-config.yaml` is `NOT EVIDENCED` in repository scan.

Commands found:
- `cd backend/mario-health-api && pytest`
- `cd backend/mario-health-api && pytest --cov=app --cov-report=html`
- `cd frontend && npm run lint`
- `cd frontend && npm run test:e2e`
- `cd frontend && npm run build`

## 11. Data Quality & Lineage Signals

- `backend/bigquery-to-postgres/scripts/validate_data.py` — Post-sync checks (row counts, null checks, coordinate validity, orphan checks for specific tables).
- `backend/bigquery-to-postgres/scripts/sync_data.py` — Validation rules (required columns, null checks, coordinate bounds, duplicate removal).
- `backend/bigquery-to-postgres/scripts/sync_all.py` — Multi-table sync sequencing and success/failure summary.
- `backend/bigquery-to-postgres/config/tables.py` — Required columns and sync mode contracts per table.
- `backend/mario-health-data-pipeline/models/facts/fact_drug_prices.sql` — Transformation lineage from staged medication data to fact table.
- `backend/mario-health-data-pipeline/scripts/ingest_uhc_data.py` — Ingestion cleaning and deduplication.
- `backend/database-loader/function/get_medication_prices.sql` — SQL filters for numeric price and normalized quantity match.
- `backend/bigquery-to-postgres/config/sql/01_functions_search_v3.sql` — Search dedup logic in `candidates_dedup`.
- `backend/mario-health-data-pipeline/dbt_project.yml` — dbt vars and run hooks.
- `backend/mario-health-data-pipeline/models/sources.yml` — Source declarations for lineage.
- `backend/mario-health-data-pipeline/seeds/schema.yml` — Seed test/schema metadata.
- `backend/scripts/verify_procedure_coverage_supabase.py` — Procedure coverage verification script.
- `backend/scripts/verify_provider_data_v2.py` — Provider data verification script.
- `backend/scripts/full_data_verification.py` — Composite data verification script.
- `backend/scripts/verify_api_endpoints.py` — API/data availability verification script.

Backfill/full-refresh evidence:
- `backend/bigquery-to-postgres/run_sync.sh` — Supports `--full-refresh`.
- `backend/bigquery-to-postgres/scripts/sync_data.py` — Supports `--full-refresh`.
- `backend/bigquery-to-postgres/.github/workflows/sync-all-tables.yml` — `full_refresh` dispatch input.
- `backend/bigquery-to-postgres/.github/workflows/sync-single-table.yml` — `full_refresh` dispatch input.

Commands found:
- `python backend/bigquery-to-postgres/scripts/validate_data.py`
- `python backend/scripts/verify_procedure_coverage_supabase.py`
- `python backend/scripts/verify_provider_data_v2.py`
- `python backend/scripts/full_data_verification.py`

## 12. UX / Product Flow Signals

- `frontend/src/app/page.tsx` — Public entry route.
- `frontend/src/app/(authed)/home/page.tsx` — Authenticated home flow and search-routing behavior.
- `frontend/src/app/(authed)/layout.tsx` + `frontend/src/components/auth/AuthGuard.tsx` — Auth route guard and login redirect with return URL.
- `frontend/src/lib/contexts/AuthContext.tsx` — Auth state/profile flow with Firebase and local ZIP persistence.
- `frontend/src/lib/api.ts` — UI-to-API contracts for search, providers, orgs, bundles, bookings, insurance, whoami, and additional flows.
- `frontend/src/lib/api-base.ts` — Routing of frontend API calls to local/deployed/rewrite paths.
- `backend/mario-health-api/app/api/v1/endpoints/search.py` + `backend/mario-health-api/app/services/search_service.py` — Search API chain to Supabase RPC.
- `backend/mario-health-api/app/api/v1/endpoints/providers.py` + `backend/mario-health-api/app/services/provider_service.py` — Provider detail chain and fallback path to provider table.
- `backend/mario-health-api/app/api/v1/endpoints/doctors.py` + `backend/mario-health-api/app/services/provider_service.py` — Doctor search/autocomplete chain.
- `backend/mario-health-api/app/api/v1/endpoints/bundles.py` + `backend/mario-health-api/app/services/bundle_service.py` — Bundle estimate flow.
- `frontend/src/app/error.tsx` — Global UI error fallback.
- `frontend/src/app/specialties/[slug]/error.tsx` — Specialty error fallback.
- `frontend/src/app/specialties/[slug]/loading.tsx` — Specialty loading state.
- `frontend/src/app/not-found.tsx` — 404 fallback.
- `frontend/src/app/search/SearchRedirectClient.tsx` — Deprecated route redirect behavior.
- `frontend/tests/smoke.spec.ts` — E2E golden-path checks for `/home`, procedure navigation, specialty deep links, `/login`, `/signup`.

Commands found:
- `cd frontend && npm run dev`
- `cd frontend && npm run test:e2e`

## 13. Known Issues

- `backend/mario-health-api/app/api/v1/endpoints/bookings.py` — TODO markers; stub responses in booking routes.
- `backend/mario-health-api/app/api/v1/endpoints/insurance.py` — TODO marker; verification route is stubbed and providers list is static in file.
- `backend/mario-health-api/app/api/v1/endpoints/providers.py` — TODO marker on `/time-slots` endpoint implementation.
- `backend/mario-health-api/app/services/provider_service.py` — TODO marker on multi-location provider handling in procedure detail query.
- `backend/mario-health-api/app/services/bundle_service.py` — TODO marker on facility/professional subtotal split.
- `backend/mario-health-data-pipeline/scripts/ingest_uhc_data.py` — TODO marker for replacing mock ingestion source.
- `backend/mario-health-data-pipeline/orchestrate.py` — TODO marker for Slack notification.
- `frontend/tests/smoke.spec.ts` — TODO marker in skipped smoke test.
- `frontend/src/app/(authed)/orgs/[id]/OrgDetailClient.tsx` — TODO marker for pricing subtotal split handling.
- `frontend/src/app/procedures/[slug]/ProcedureDetailClient.tsx` — TODO marker for API slice optimization.
- `frontend/src/components/mario-rewards-redesigned.tsx` — TODO marker for redemption logic.
- `frontend/src/components/mario-provider-detail-complete.tsx` — TODO marker for saved-provider action.
- `frontend/src/lib/analytics.ts` — TODO marker for external analytics integration.
- `frontend/src/components/archive-v1-mario-provider-detail-compact.tsx` — Archived/deprecated component marker.
- `frontend/src/app/search/SearchRedirectClient.tsx` — Deprecated route behavior marker.
- `test_results.log` — Prior run log contains backend health failure and token output; secret present here.
- Phase A2 runtime command evidence (current branch): root `npm run test`/`npm run lint` missing scripts, backend `python3 -m pytest` missing module, frontend lint/e2e failures (see `docs/llm_handoff/_runtime_findings.md`).
- Backend medications endpoint file `backend/mario-health-api/app/api/v1/medications.py` — NOT EVIDENCED on this branch.

Commands found:
- `cd frontend && npm run test:e2e`
- `cd backend/mario-health-api && python3 -m pytest`
- `./test_e2e_cors_auth.sh`
