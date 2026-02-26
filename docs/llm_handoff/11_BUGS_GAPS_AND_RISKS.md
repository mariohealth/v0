# 11_BUGS_GAPS_AND_RISKS

This document prioritizes known bugs, gaps, and delivery risks from Phase A/A2 evidence.
It does not introduce new findings beyond cited sources.
Each issue includes severity, reproduction path, suspected root cause, and suggested next step.
Items are ordered by likely impact to correctness or release readiness.

Last updated: `2026-02-27`  
Current git commit hash: `a365a22d`

## 1) Frontend E2E suite fails due app unreachability

- Severity: `high`
- Reproduction path: run `cd frontend && npm run test:e2e`; observe `page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/...` and failing smoke tests. [source: `docs/llm_handoff/_runtime_findings.md`, `frontend/tests/smoke.spec.ts`]
- Suspected root cause: local frontend service not reachable at configured Playwright base URL during execution. [source: `docs/llm_handoff/_runtime_findings.md`, `frontend/playwright.config.ts`]
- Suggested next step: validate app startup path and base URL alignment before rerunning E2E. [source: `frontend/package.json`, `frontend/playwright.config.ts`]

## 2) Backend tests cannot run in scanned runtime

- Severity: `high`
- Reproduction path: run `cd backend/mario-health-api && python3 -m pytest`; observe `No module named pytest`. [source: `docs/llm_handoff/_runtime_findings.md`]
- Suspected root cause: backend test dependency not installed in active Python environment. [source: `backend/mario-health-api/requirements.txt`, `docs/llm_handoff/_runtime_findings.md`]
- Suggested next step: install requirements in the runtime used for tests, then rerun pytest commands from `TESTS.md`. [source: `backend/mario-health-api/TESTS.md`, `backend/mario-health-api/requirements.txt`]

## 3) Lint failures in frontend block clean quality gate

- Severity: `medium`
- Reproduction path: run `cd frontend && npm run lint`; observe `react/no-unescaped-entities` errors and hook dependency warnings. [source: `docs/llm_handoff/_runtime_findings.md`]
- Suspected root cause: current frontend code contains unresolved ESLint violations. [source: `docs/llm_handoff/_runtime_findings.md`, `frontend/.eslintrc.json`]
- Suggested next step: clear lint errors/warnings in reported files to restore lint pass state. [source: `docs/llm_handoff/_runtime_findings.md`]

## 4) Monorepo root test/lint scripts missing

- Severity: `medium`
- Reproduction path: run `npm run test` or `npm run lint` from repo root; observe missing-script errors. [source: `docs/llm_handoff/_runtime_findings.md`, `package.json`]
- Suspected root cause: root manifest does not define `test`/`lint` scripts. [source: `package.json`, `docs/llm_handoff/_runtime_findings.md`]
- Suggested next step: keep checks scoped to frontend/backend commands or define root wrappers. [source: `frontend/package.json`, `backend/mario-health-api/TESTS.md`]

## 5) API behavior gaps in TODO/stub endpoints

- Severity: `medium`
- Reproduction path: inspect TODO-marked bookings/insurance/providers endpoints and provider/bundle services. [source: `backend/mario-health-api/app/api/v1/endpoints/bookings.py`, `backend/mario-health-api/app/api/v1/endpoints/insurance.py`, `backend/mario-health-api/app/api/v1/endpoints/providers.py`, `backend/mario-health-api/app/services/provider_service.py`, `backend/mario-health-api/app/services/bundle_service.py`, `docs/llm_handoff/_evidence_index.md`]
- Suspected root cause: implementation backlog tracked inline with TODO comments and stub responses. [source: `docs/llm_handoff/_evidence_index.md`]
- Suggested next step: convert TODOs to tracked implementation tasks with acceptance criteria. [source: `docs/llm_handoff/_evidence_index.md`]

## 6) Medications endpoint path missing on current branch

- Severity: `medium`
- Reproduction path: Phase A evidence records `backend/mario-health-api/app/api/v1/medications.py` as not present on this branch. [source: `docs/llm_handoff/_evidence_index.md`]
- Suspected root cause: branch divergence or file removal relative to earlier references. [source: `docs/llm_handoff/_evidence_index.md`]
- Suggested next step: confirm intended branch behavior for medication API coverage before relying on this route. [source: `docs/llm_handoff/_evidence_index.md`]

## 7) Contract mismatch signals in tests vs service response fields

- Severity: `medium`
- Reproduction path: known-issues evidence notes tests asserting `total_results` while service path references `results_count`. [source: `docs/llm_handoff/_evidence_index.md`]
- Suspected root cause: schema drift between contract tests and service response model shape. [source: `docs/llm_handoff/_evidence_index.md`]
- Suggested next step: reconcile API response contract and test assertions. [source: `backend/mario-health-api/tests/contracts/test_response_schemas.py`, `backend/mario-health-api/tests/services/test_search_service.py`, `docs/llm_handoff/_evidence_index.md`]

## Residual Ambiguities

- Live cloud behavior, IAM effectiveness, and production alert validity are `NOT EVIDENCED` without external credentials/access. [source: `docs/llm_handoff/_phase_gate.md`]
