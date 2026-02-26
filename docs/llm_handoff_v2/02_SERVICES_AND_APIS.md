# 02_SERVICES_AND_APIS

This document enumerates runtime services and API surface areas evidenced in the repository.
- Evidence baseline for runtime/API claims: `backend/mario-health-api/app/main.py`, `backend/mario-health-api/app/api/v1/endpoints/`, `backend/mario-health-api/app/services/`.
- Evidence baseline for client/integration claims: `frontend/src/lib/api.ts`, `frontend/src/lib/api-base.ts`, `backend/mario-health-api/app/core/auth.py`, `backend/mario-health-api/app/core/dependencies.py`.

Last updated: `2026-02-27`  
Current git commit hash: `63cb3073`

## Evidence sources used
- `docs/llm_handoff/_evidence_index.md`
- `docs/llm_handoff/_runtime_findings.md`

## Service inventory (evidence required)
- Frontend (Next.js) — see evidence index for routes/layouts/API client paths.
- Backend API (FastAPI) — see evidence index for app entrypoint and `app/api/v1/endpoints/`.
- Data pipeline (dbt/Python) — see evidence index for orchestrator and dbt project.
- BigQuery→Postgres sync jobs — see evidence index for scripts + workflow triggers.

## Backend API (FastAPI)
### Entrypoint and app wiring
- Evidence (`docs/llm_handoff/_evidence_index.md`): `backend/mario-health-api/app/main.py` is the FastAPI app entrypoint and includes router mounting plus middleware wiring (`FastAPI app entrypoint, router mounting, middleware wiring, root and /health endpoints`).
- Supporting runtime wiring evidence (`docs/llm_handoff/_evidence_index.md`): `backend/mario-health-api/app/api/v1/endpoints/` is the mounted API endpoint module directory, and `backend/mario-health-api/Dockerfile` runs `uvicorn app.main:app --host 0.0.0.0 --port 8080`.

### API v1 endpoints
- Evidence (`docs/llm_handoff/_evidence_index.md`): endpoint modules under `backend/mario-health-api/app/api/v1/endpoints/` include `categories`, `families`, `procedures`, `search`, `providers`, `doctors`, `bookings`, `insurance`, `specialties`, `bundles`, `whoami`; evidenced purposes: `search.py` + `app/services/search_service.py` (search API chain to Supabase RPC), `providers.py` + `app/services/provider_service.py` (provider detail chain with fallback path), `doctors.py` + `app/services/provider_service.py` (doctor search/autocomplete), `bundles.py` + `app/services/bundle_service.py` (bundle estimate flow), `bookings.py` (stub responses/TODO), `insurance.py` (verification stub + static providers list); purpose details for `categories`, `families`, `procedures`, `specialties`, and `whoami` are NOT EVIDENCED beyond module presence in the index.

### Auth / permissions
- Token validation is evidenced in `backend/mario-health-api/app/auth/firebase_auth.py` (Firebase Admin SDK token verification with ADC) and `backend/mario-health-api/app/core/auth.py` (Bearer-token auth dependency).
- Dependency injection for backend integrations is evidenced in `backend/mario-health-api/app/core/dependencies.py` (Supabase client dependency).
- Protected-route behavior is evidenced in `frontend/src/components/auth/AuthGuard.tsx` and `frontend/src/app/(authed)/layout.tsx` (auth guard and redirect flow).

## Frontend (Next.js)
### Route groups and auth gating
- Authenticated route-group layout is evidenced at `frontend/src/app/(authed)/layout.tsx`.
- Auth guard component is evidenced at `frontend/src/components/auth/AuthGuard.tsx`.
- Login redirect behavior with return URL is evidenced by `frontend/src/app/(authed)/layout.tsx` + `frontend/src/components/auth/AuthGuard.tsx`.

### API client boundary
- **NOT EVIDENCED until cited**: API base URL logic, fetch wrapper, auth header injection.

## Contracts / schemas
- **NOT EVIDENCED until cited**: response models, OpenAPI exposure, contract tests.

## Known gaps (from runtime evidence)
- **NOT EVIDENCED until cited**: failing tests, missing scripts, connection refused in E2E.

