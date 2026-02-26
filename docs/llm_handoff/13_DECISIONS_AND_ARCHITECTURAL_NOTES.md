# 13_DECISIONS_AND_ARCHITECTURAL_NOTES

This document records architecture and process decisions inferable from repository evidence.
It is intentionally conservative and cites only Phase A/A2-backed signals.
Where a rationale is not directly documented, it is marked `NOT EVIDENCED`.
Use this file to track current-state design constraints and ambiguities.

Last updated: `2026-02-27`  
Current git commit hash: `a365a22d`

## Decision: Monorepo with separated frontend/backend/data units

- Evidence: root structure and per-unit manifests/scripts show independently runnable workspaces. [source: `README.md`, `frontend/package.json`, `backend/mario-health-api/requirements.txt`, `backend/mario-health-data-pipeline/requirements.txt`, `backend/bigquery-to-postgres/requirements.txt`]
- Rationale: `NOT EVIDENCED` (explicit ADR not found in evidence set).

## Decision: FastAPI API + Next.js frontend + Supabase/Firebase integration

- Evidence: API bootstrap/auth/dependency files plus frontend API/auth files and package manifests. [source: `backend/mario-health-api/app/main.py`, `backend/mario-health-api/app/core/dependencies.py`, `backend/mario-health-api/app/core/auth.py`, `frontend/src/lib/api.ts`, `frontend/src/lib/firebase.ts`, `frontend/package.json`]
- Rationale: `NOT EVIDENCED` as explicit decision record.

## Decision: Data pipeline + dbt + BigQuery-to-Postgres sync pattern

- Evidence: orchestrator/dbt project and sync scripts/workflows encode staged flow. [source: `backend/mario-health-data-pipeline/orchestrate.py`, `backend/mario-health-data-pipeline/dbt_project.yml`, `backend/bigquery-to-postgres/scripts/sync_all.py`, `backend/bigquery-to-postgres/.github/workflows/sync-all-tables.yml`]
- Rationale: `NOT EVIDENCED` in ADR-style docs from the evidence pack.

## Decision: Deployment via scripts and GitHub Actions, not visible IaC modules

- Evidence: deploy scripts, workflow configs, and IaC `NOT EVIDENCED` note. [source: `backend/mario-health-api/scripts/deploy.sh`, `backend/mario-health-data-pipeline/deploy.sh`, `.github/workflows/firebase-hosting.yml`, `docs/llm_handoff/_evidence_index.md`]
- Rationale: `NOT EVIDENCED`.

## Decision: Client-side retry fallback for API auth/network failures

- Evidence: `fetchSmartAuth` retry path in frontend API module. [source: `frontend/src/lib/api.ts`]
- Rationale: `NOT EVIDENCED` beyond implementation.

## Decision: Build-time tolerance for frontend TS/ESLint errors

- Evidence: Next config sets `eslint.ignoreDuringBuilds` and `typescript.ignoreBuildErrors`. [source: `frontend/next.config.mjs`]
- Rationale: `NOT EVIDENCED`.

## Open Architectural Questions

- Medications endpoint branch state is inconsistent with earlier references and is `NOT EVIDENCED` as present on this branch. [source: `docs/llm_handoff/_evidence_index.md`]
- Production observability quality and cloud permission posture remain `NOT EVIDENCED` without external access. [source: `docs/llm_handoff/_phase_gate.md`]
