# 02_SERVICES_AND_APIS

This document enumerates runtime services and API surface areas evidenced in the repository.
All claims must be grounded in file paths from Phase A evidence. Anything not directly evidenced is **NOT EVIDENCED**.

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
- **NOT EVIDENCED until cited**: backend entrypoint path, router registration, middleware stack.

### API v1 endpoints
- **NOT EVIDENCED until cited**: list of endpoint modules and their routes.

### Auth / permissions
- **NOT EVIDENCED until cited**: token validation, dependency injection, protected routes.

## Frontend (Next.js)
### Route groups and auth gating
- **NOT EVIDENCED until cited**: authed route group, AuthGuard, login redirect.

### API client boundary
- **NOT EVIDENCED until cited**: API base URL logic, fetch wrapper, auth header injection.

## Contracts / schemas
- **NOT EVIDENCED until cited**: response models, OpenAPI exposure, contract tests.

## Known gaps (from runtime evidence)
- **NOT EVIDENCED until cited**: failing tests, missing scripts, connection refused in E2E.

