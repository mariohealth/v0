# 02_SERVICES_AND_APIS

This document maps service runtimes, API surfaces, and call boundaries.
It is restricted to evidence from Phase A/A2 docs and cited source paths.
It captures observed endpoints and execution contracts rather than intended design.
Any endpoint behavior not directly evidenced is marked `NOT EVIDENCED`.

Last updated: `2026-02-27`  
Current git commit hash: `a365a22d`

## Trigger

- HTTP requests enter the backend through FastAPI main app and v1 endpoint modules. [source: `backend/mario-health-api/app/main.py`, `backend/mario-health-api/app/api/v1/endpoints/`]
- Frontend UI and API client modules trigger endpoint calls. [source: `frontend/src/lib/api.ts`, `frontend/src/app/(authed)/home/page.tsx`]

## Inputs

- Request routing and middleware from app bootstrap. [source: `backend/mario-health-api/app/main.py`]
- Auth bearer tokens validated through auth dependencies. [source: `backend/mario-health-api/app/core/auth.py`, `backend/mario-health-api/app/auth/firebase_auth.py`]
- Frontend auth context and API base resolution. [source: `frontend/src/lib/contexts/AuthContext.tsx`, `frontend/src/lib/api-base.ts`]

## Transformations

- Endpoint handlers delegate to service modules for search/provider/specialty/bundle logic. [source: `backend/mario-health-api/app/api/v1/endpoints/`, `backend/mario-health-api/app/services/`]
- Search flow uses Supabase integration path and RPC-backed service logic. [source: `backend/mario-health-api/app/core/dependencies.py`, `backend/mario-health-api/app/services/search_service.py`, `backend/mario-health-api/app/api/v1/endpoints/search.py`]

## Outputs

- JSON API responses for categories/families/procedures/search/providers/doctors/bookings/insurance/specialties/bundles/whoami. [source: `backend/mario-health-api/app/api/v1/endpoints/`, `frontend/src/lib/api.ts`]
- Health response from `/health` includes status/version/environment/git SHA. [source: `backend/mario-health-api/app/main.py`]

## Failure Modes

- Frontend E2E tests fail with `ERR_CONNECTION_REFUSED` when local app endpoint is unavailable. [source: `docs/llm_handoff/_runtime_findings.md`]
- Backend tests fail in current runtime due missing pytest module. [source: `docs/llm_handoff/_runtime_findings.md`]
- Medications endpoint module path is `NOT EVIDENCED` on current branch. [source: `docs/llm_handoff/_evidence_index.md`]

## Retry / Backfill Logic

- Frontend `fetchSmartAuth` includes retry path on auth/network failures. [source: `frontend/src/lib/api.ts`]
- API request-level replay/backfill policy beyond client retry is `NOT EVIDENCED`. [source: `docs/llm_handoff/_evidence_index.md`]

## Observability

- API request/response telemetry is captured in structured logging middleware. [source: `backend/mario-health-api/app/middleware/logging.py`]
- Endpoint/service specific event logs exist for search/provider/doctor/specialty paths. [source: `backend/mario-health-api/app/api/v1/endpoints/search.py`, `backend/mario-health-api/app/api/v1/endpoints/providers.py`, `backend/mario-health-api/app/api/v1/endpoints/doctors.py`, `backend/mario-health-api/app/services/specialty_service.py`]

## Known Risks

- TODO-backed stub behavior exists in bookings and insurance endpoint modules. [source: `backend/mario-health-api/app/api/v1/endpoints/bookings.py`, `backend/mario-health-api/app/api/v1/endpoints/insurance.py`, `docs/llm_handoff/_evidence_index.md`]
