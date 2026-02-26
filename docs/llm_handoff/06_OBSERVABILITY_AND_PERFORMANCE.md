# 06_OBSERVABILITY_AND_PERFORMANCE

This document captures evidence for logs, health probes, and performance controls.
It includes only observed middleware, scripts, tests, and config signals.
Runtime performance claims are limited to measured test evidence and config values.
Unverified production telemetry behavior is marked `NOT EVIDENCED`.

Last updated: `2026-02-27`  
Current git commit hash: `a365a22d`

## Trigger

- API requests emit structured logs through middleware and endpoint/service log calls. [source: `backend/mario-health-api/app/middleware/logging.py`, `backend/mario-health-api/app/api/v1/endpoints/search.py`, `backend/mario-health-api/app/services/search_service.py`]
- Performance checks are triggered by scripts and performance test suite. [source: `backend/scripts/verify_search_perf.sh`, `backend/mario-health-api/tests/performance/test_api_performance.py`]

## Inputs

- Request metadata, response status, and timing fields in middleware. [source: `backend/mario-health-api/app/middleware/logging.py`]
- Search SQL/index definitions and service-level query shaping logic. [source: `backend/bigquery-to-postgres/config/sql/01_functions_search_v3.sql`, `backend/bigquery-to-postgres/config/sql/03_indexes/provider_name_search.sql`, `backend/mario-health-api/app/services/specialty_service.py`]
- Test timeout/retry configs for frontend and CI runner. [source: `frontend/playwright.config.ts`, `.github/workflows/playwright.yml`]

## Transformations

- Middleware computes duration, severity, and slow-request warnings. [source: `backend/mario-health-api/app/middleware/logging.py`]
- Query paths apply dedup/limit/bounding-box filters and distance logic. [source: `backend/bigquery-to-postgres/config/sql/01_functions_search_v3.sql`, `backend/mario-health-api/app/services/specialty_service.py`]

## Outputs

- Structured JSON logs and health endpoint responses. [source: `backend/mario-health-api/app/middleware/logging.py`, `backend/mario-health-api/app/main.py`]
- Performance test outputs and script-level latency probes. [source: `backend/mario-health-api/tests/performance/test_api_performance.py`, `backend/scripts/verify_search_perf.sh`]

## Failure Modes

- Frontend lint and e2e commands fail in runtime scan; e2e failures show connection refused. [source: `docs/llm_handoff/_runtime_findings.md`]
- End-to-end performance with all services live is `NOT EVIDENCED` from current local runs. [source: `docs/llm_handoff/_runtime_findings.md`]

## Retry / Backfill Logic

- Playwright retries and timeout constraints are configured in test config. [source: `frontend/playwright.config.ts`]
- API automatic retry beyond frontend client fallback is `NOT EVIDENCED`. [source: `docs/llm_handoff/_evidence_index.md`]

## Observability

- Health endpoint and Docker healthcheck are implemented. [source: `backend/mario-health-api/app/main.py`, `backend/mario-health-api/Dockerfile`]
- Smoke probe script covers `/health` and key endpoints. [source: `backend/mario-health-api/scripts/smoke-prod.sh`]
- Frontend analytics module logs locally with TODO for external integration. [source: `frontend/src/lib/analytics.ts`, `docs/llm_handoff/_evidence_index.md`]

## Known Risks

- Production alerting/dashboard behavior is `NOT EVIDENCED` without live cloud access. [source: `docs/llm_handoff/_phase_gate.md`]
