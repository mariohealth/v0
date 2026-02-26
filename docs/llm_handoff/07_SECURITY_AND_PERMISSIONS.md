# 07_SECURITY_AND_PERMISSIONS

This document records security controls and permissions patterns evidenced in-repo.
It includes auth flow, secret handling signals, and CI guard scripts.
Claims are restricted to observed files and runtime results.
Unknown or unverifiable controls are marked `NOT EVIDENCED`.

Last updated: `2026-02-27`  
Current git commit hash: `a365a22d`

## Trigger

- Protected API routes invoke bearer-token auth dependencies. [source: `backend/mario-health-api/app/core/auth.py`, `backend/mario-health-api/app/api/v1/endpoints/`]
- Frontend auth guard redirects unauthenticated users to login. [source: `frontend/src/components/auth/AuthGuard.tsx`, `frontend/src/app/(authed)/layout.tsx`]

## Inputs

- Firebase Admin verification and project identity config. [source: `backend/mario-health-api/app/auth/firebase_auth.py`, `backend/mario-health-api/app/main.py`]
- Frontend Firebase public config vars and auth context state. [source: `frontend/src/lib/firebase.ts`, `frontend/src/lib/contexts/AuthContext.tsx`]
- Secret/env references in deploy and CI workflows. [source: `backend/mario-health-api/scripts/deploy.sh`, `backend/bigquery-to-postgres/.github/workflows/sync-all-tables.yml`]

## Transformations

- API layer validates bearer token, extracts user claims, and gates request execution. [source: `backend/mario-health-api/app/core/auth.py`, `backend/mario-health-api/app/auth/firebase_auth.py`]
- CI scripts enforce prohibited secret/pattern checks. [source: `backend/mario-health-api/scripts/ci_check_secrets.sh`, `backend/mario-health-api/scripts/ci_check_patterns.sh`]

## Outputs

- Authorized request context and user identifiers for downstream services. [source: `backend/mario-health-api/app/core/auth.py`]
- Security guard failures in CI when prohibited patterns are detected. [source: `backend/mario-health-api/scripts/ci_check_secrets.sh`, `backend/mario-health-api/scripts/ci_check_patterns.sh`]

## Failure Modes

- Missing/invalid auth token behavior exists in auth dependency path; exact error payload matrix is `NOT EVIDENCED` in Phase A/A2 docs. [source: `backend/mario-health-api/app/core/auth.py`, `docs/llm_handoff/_evidence_index.md`]
- Runtime scan did not surface missing env-var names in executed command output (`NOT EVIDENCED`). [source: `docs/llm_handoff/_runtime_findings.md`]

## Retry / Backfill Logic

- Frontend retries unauthenticated fallback on 401/403/network failures. [source: `frontend/src/lib/api.ts`]
- Security incident response or key-rotation runbooks are `NOT EVIDENCED`. [source: `docs/llm_handoff/_evidence_index.md`]

## Observability

- Request/auth/origin logging occurs in API middleware and app-level handlers. [source: `backend/mario-health-api/app/main.py`, `backend/mario-health-api/app/middleware/logging.py`]

## Known Risks

- Env files containing secrets are present and redacted in evidence (`secret present here`). [source: `backend/mario-health-api/.env`, `frontend/.env.local`, `docs/llm_handoff/_evidence_index.md`]
- Cloud IAM/WIF effective permissions at runtime are `NOT EVIDENCED` without external access. [source: `docs/llm_handoff/_phase_gate.md`]
