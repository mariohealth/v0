# 05_INFRA_AND_DEPLOYMENT

This document summarizes CI/CD, containerization, and deployment configuration evidence.
It focuses on concrete workflows, scripts, and runtime deployment files.
Infrastructure claims without repo evidence are marked `NOT EVIDENCED`.
This is an implementation snapshot, not a desired-state architecture spec.

Last updated: `2026-02-27`  
Current git commit hash: `a365a22d`

## Trigger

- CI workflows triggered by push/PR/schedule/manual dispatch. [source: `.github/workflows/playwright.yml`, `.github/workflows/firebase-hosting.yml`, `backend/bigquery-to-postgres/.github/workflows/sync-all-tables.yml`, `backend/bigquery-to-postgres/.github/workflows/sync-single-table.yml`]
- Manual deployment through shell scripts for API and data pipeline. [source: `backend/mario-health-api/scripts/deploy.sh`, `backend/mario-health-data-pipeline/deploy.sh`]

## Inputs

- Docker build definitions for frontend, API, and pipeline services. [source: `frontend/Dockerfile`, `backend/mario-health-api/Dockerfile`, `backend/mario-health-data-pipeline/Dockerfile`]
- Hosting and rewrite configuration. [source: `firebase.json`, `frontend/next.config.mjs`]
- Environment variables and secret references in deploy scripts/workflows. [source: `backend/mario-health-api/scripts/deploy.sh`, `backend/mario-health-data-pipeline/deploy.sh`, `backend/bigquery-to-postgres/.github/workflows/sync-all-tables.yml`]

## Transformations

- Build/test/deploy orchestration in GitHub Actions. [source: `.github/workflows/firebase-hosting.yml`, `.github/workflows/playwright.yml`, `backend/bigquery-to-postgres/.github/workflows/sync-all-tables.yml`]
- Cloud Run deployment and API gateway configuration via scripts/config. [source: `backend/mario-health-api/scripts/deploy.sh`, `backend/mario-health-api/api-gateway-config.yaml`]

## Outputs

- Frontend hosting deployment artifacts. [source: `.github/workflows/firebase-hosting.yml`, `firebase.json`]
- API and pipeline Cloud Run services plus scheduler job wiring. [source: `backend/mario-health-api/scripts/deploy.sh`, `backend/mario-health-data-pipeline/deploy.sh`]
- Data sync workflow logs/artifacts for scheduled/manual sync jobs. [source: `backend/bigquery-to-postgres/.github/workflows/sync-all-tables.yml`]

## Failure Modes

- Infra job execution outcomes for cloud environments are `NOT EVIDENCED` in local runtime scan. [source: `docs/llm_handoff/_runtime_findings.md`]
- Local root test/lint scripts are missing, which weakens monorepo-level CI parity. [source: `package.json`, `docs/llm_handoff/_runtime_findings.md`]

## Retry / Backfill Logic

- Scheduled and manual rerun paths exist for sync workflows (`cron` + `workflow_dispatch`). [source: `backend/bigquery-to-postgres/.github/workflows/sync-all-tables.yml`]
- Single-table manual reruns are available in dispatch workflow. [source: `backend/bigquery-to-postgres/.github/workflows/sync-single-table.yml`]

## Observability

- API container includes healthcheck endpoint polling. [source: `backend/mario-health-api/Dockerfile`, `backend/mario-health-api/app/main.py`]
- Smoke script exists for production API checks. [source: `backend/mario-health-api/scripts/smoke-prod.sh`]

## Known Risks

- Terraform/Pulumi IaC assets are `NOT EVIDENCED`; infra is script/workflow driven from observed files. [source: `docs/llm_handoff/_evidence_index.md`]
