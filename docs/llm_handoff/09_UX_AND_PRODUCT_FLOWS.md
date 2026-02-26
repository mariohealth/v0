# 09_UX_AND_PRODUCT_FLOWS

This document captures golden user flows from UI to API/data output.
Flows are drawn only from evidenced frontend routes, API client calls, and backend endpoint/service files.
Each flow lists trigger, path, and fallback states.
Steps not directly evidenced are marked `NOT EVIDENCED`.

Last updated: `2026-02-27`  
Current git commit hash: `a365a22d`

## Flow 1: Home Search to Specialty Results

### Trigger

- User interacts with authenticated home route search UX. [source: `frontend/src/app/(authed)/home/page.tsx`]

### Inputs

- Frontend search call through API client methods. [source: `frontend/src/lib/api.ts`]
- API base URL resolution for dev/prod/rewrite path. [source: `frontend/src/lib/api-base.ts`]

### Transformations (UI -> API -> DB -> Output)

1. UI captures search input on home page. [source: `frontend/src/app/(authed)/home/page.tsx`]
2. UI issues API call via client helper to search-related endpoints. [source: `frontend/src/lib/api.ts`]
3. Backend search endpoint handles request and calls search service. [source: `backend/mario-health-api/app/api/v1/endpoints/search.py`, `backend/mario-health-api/app/services/search_service.py`]
4. Search service uses Supabase integration and SQL search function path. [source: `backend/mario-health-api/app/core/dependencies.py`, `backend/bigquery-to-postgres/config/sql/01_functions_search_v3.sql`]
5. UI renders resulting suggestions/results and navigation options. [source: `frontend/src/app/(authed)/home/page.tsx`]

### Outputs

- Search suggestions and route transitions to specialty/procedure pages. [source: `frontend/src/app/(authed)/home/page.tsx`, `frontend/tests/smoke.spec.ts`]

### Error / Fallback States

- Global fallback UI via app error boundary and not-found pages. [source: `frontend/src/app/error.tsx`, `frontend/src/app/not-found.tsx`]
- Specialty route-specific loading/error boundaries. [source: `frontend/src/app/specialties/[slug]/loading.tsx`, `frontend/src/app/specialties/[slug]/error.tsx`]

## Flow 2: Provider Detail Retrieval

### Trigger

- User navigates to provider detail flow from search/procedure routes. [source: `frontend/src/lib/api.ts`, `frontend/tests/smoke.spec.ts`]

### Inputs

- Provider endpoint call from frontend API client. [source: `frontend/src/lib/api.ts`]

### Transformations (UI -> API -> DB -> Output)

1. UI requests provider detail data through client API. [source: `frontend/src/lib/api.ts`]
2. Backend providers endpoint receives request and delegates to provider service. [source: `backend/mario-health-api/app/api/v1/endpoints/providers.py`, `backend/mario-health-api/app/services/provider_service.py`]
3. Provider service uses primary query path with fallback to provider table when RPC returns empty. [source: `backend/mario-health-api/app/services/provider_service.py`, `docs/llm_handoff/_evidence_index.md`]
4. UI renders provider detail output. [source: `frontend/src/lib/api.ts`, `frontend/tests/smoke.spec.ts`]

### Error / Fallback States

- Provider flow contains TODO-marked time-slot path and multi-location limitation risk. [source: `backend/mario-health-api/app/api/v1/endpoints/providers.py`, `backend/mario-health-api/app/services/provider_service.py`, `docs/llm_handoff/_evidence_index.md`]

## Flow 3: Auth Gate and Session Routing

### Trigger

- User enters authenticated route group.

### Inputs

- Auth context state from Firebase client auth. [source: `frontend/src/lib/contexts/AuthContext.tsx`, `frontend/src/lib/firebase.ts`]

### Transformations (UI -> API -> DB -> Output)

1. Authed layout uses `AuthGuard` to enforce signed-in state. [source: `frontend/src/app/(authed)/layout.tsx`, `frontend/src/components/auth/AuthGuard.tsx`]
2. Unauthenticated user is redirected to login with return URL. [source: `frontend/src/components/auth/AuthGuard.tsx`]
3. Backend auth dependency validates bearer tokens for protected API requests. [source: `backend/mario-health-api/app/core/auth.py`]

### Outputs

- Access to authed routes and token-backed API calls.

### Error / Fallback States

- Login/signup page reachability is covered in smoke tests; both failed under connection-refused runtime conditions. [source: `frontend/tests/smoke.spec.ts`, `docs/llm_handoff/_runtime_findings.md`]

## Not Evidenced

- Full medications compare UI -> API -> DB flow on this branch is `NOT EVIDENCED` because medications endpoint module path is missing in evidence set for current branch. [source: `docs/llm_handoff/_evidence_index.md`]
