# 10_TESTING_AND_QUALITY

This document summarizes testing and quality controls found in repository evidence.
It includes configured frameworks, scripts, and observed runtime results.
This is an evidence snapshot, not a pass/fail certification report.
Claims not directly supported are marked `NOT EVIDENCED`.

Last updated: `2026-02-27`  
Current git commit hash: `a365a22d`

## Trigger

- Quality checks run through pytest, lint, Playwright, and CI guard scripts. [source: `backend/mario-health-api/TESTS.md`, `frontend/package.json`, `backend/mario-health-api/scripts/ci_check_secrets.sh`, `backend/mario-health-api/scripts/ci_check_patterns.sh`]

## Inputs

- Backend tests under API/service/contracts/performance directories. [source: `backend/mario-health-api/tests/`, `pytest.ini`, `backend/mario-health-api/pytest.ini`]
- Frontend tests and lint/TS config. [source: `frontend/tests/smoke.spec.ts`, `frontend/playwright.config.ts`, `frontend/.eslintrc.json`, `frontend/tsconfig.json`]
- Build-time quality knobs in Next config. [source: `frontend/next.config.mjs`]

## Transformations

- Backend pytest command intended from docs (`pytest`), but local scan used `python3 -m pytest`. [source: `backend/mario-health-api/TESTS.md`, `docs/llm_handoff/_runtime_findings.md`]
- Frontend lint executes `next lint`; e2e executes `playwright test`. [source: `frontend/package.json`, `docs/llm_handoff/_runtime_findings.md`]

## Outputs

- Runtime scan outcomes:
  - Root `npm run test` and `npm run lint` failed (missing scripts). [source: `package.json`, `docs/llm_handoff/_runtime_findings.md`]
  - Backend pytest failed (module missing). [source: `docs/llm_handoff/_runtime_findings.md`]
  - Frontend lint failed with ESLint errors/warnings. [source: `docs/llm_handoff/_runtime_findings.md`]
  - Frontend e2e failed with `ERR_CONNECTION_REFUSED` and listed smoke test failures. [source: `docs/llm_handoff/_runtime_findings.md`]

## Failure Modes

- Missing test/lint scripts at monorepo root. [source: `package.json`, `docs/llm_handoff/_runtime_findings.md`]
- Missing backend `pytest` installation in scanned environment. [source: `docs/llm_handoff/_runtime_findings.md`]
- Frontend lint violations and dependency warnings block clean lint run. [source: `docs/llm_handoff/_runtime_findings.md`]

## Retry / Backfill Logic

- Playwright retry configuration exists for CI contexts. [source: `frontend/playwright.config.ts`]
- Backend lint/typecheck command is `NOT EVIDENCED` in API project files. [source: `docs/llm_handoff/_runtime_findings.md`]

## Observability

- Coverage artifact signals (`.coverage`, `htmlcov/`) are present. [source: `docs/llm_handoff/_evidence_index.md`]
- Smoke tests include listeners for console/network/page errors. [source: `frontend/tests/smoke.spec.ts`]

## Known Risks

- Next build ignores TS and ESLint errors by config flags. [source: `frontend/next.config.mjs`]
- Pre-commit hook configuration is `NOT EVIDENCED`. [source: `docs/llm_handoff/_evidence_index.md`]
