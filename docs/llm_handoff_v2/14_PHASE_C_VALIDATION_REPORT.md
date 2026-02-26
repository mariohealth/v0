# 14_PHASE_C_VALIDATION_REPORT

## Scope & inputs

- `docs/llm_handoff_v2/01_DOMAIN_MODEL.md`
- `docs/llm_handoff_v2/02_SERVICES_AND_APIS.md`
- `docs/llm_handoff_v2/03_DATA_PIPELINES.md`
- `docs/llm_handoff_v2/14_PHASE_C_VALIDATION_REPORT.md`
## What was validated (checklist)

- [x] Core entities are documented with explicit path anchors (`docs/llm_handoff_v2/01_DOMAIN_MODEL.md`).
- [x] Postgres/Supabase schema surface is documented via SQL/config paths (`docs/llm_handoff_v2/01_DOMAIN_MODEL.md`).
- [x] BigQuery/dbt lineage artifacts are documented via sources/models/orchestrator paths (`docs/llm_handoff_v2/01_DOMAIN_MODEL.md`).
- [x] Relationships section is present with evidenced links and explicit "Not evidenced in paths" markers (`docs/llm_handoff_v2/01_DOMAIN_MODEL.md`).
- [x] Identifiers/keys section is present with explicit evidence status (`docs/llm_handoff_v2/01_DOMAIN_MODEL.md`).
- [x] Validation/invariants section is present with dedup/constraints coverage and residual gap callout (`docs/llm_handoff_v2/01_DOMAIN_MODEL.md`).
- [x] FastAPI entrypoint + router wiring evidence is captured (`docs/llm_handoff_v2/02_SERVICES_AND_APIS.md`).
- [x] API endpoint module inventory is captured (`docs/llm_handoff_v2/02_SERVICES_AND_APIS.md`).
- [x] Auth/permissions evidence is captured for token verification/dependencies/guarded routes (`docs/llm_handoff_v2/02_SERVICES_AND_APIS.md`).
- [x] Frontend route-group auth gating evidence is captured (`docs/llm_handoff_v2/02_SERVICES_AND_APIS.md`).
- [x] BigQuery->Postgres sync jobs include triggers/inputs/outputs/commands (`docs/llm_handoff_v2/03_DATA_PIPELINES.md`).
- [x] Runtime findings summary and risk section are populated from runtime evidence (`docs/llm_handoff_v2/14_PHASE_C_VALIDATION_REPORT.md`).
## Runtime findings summary

- Runtime toolchain observed during scan: Node `v24.10.0`, Python `3.14.2`, npm `11.6.0` (`docs/llm_handoff/_runtime_findings.md`).
- Root test command failed: `npm run test` exited `1` with `Missing script: "test"` from `/Users/az/Projects/mario-health` (`docs/llm_handoff/_runtime_findings.md`, `package.json`).
- Root lint command failed: `npm run lint` exited `1` with `Missing script: "lint"` from `/Users/az/Projects/mario-health` (`docs/llm_handoff/_runtime_findings.md`, `package.json`).
- Backend test command failed: `python3 -m pytest` exited `1` with `No module named pytest` in `/Users/az/Projects/mario-health/backend/mario-health-api` (`docs/llm_handoff/_runtime_findings.md`, `backend/mario-health-api/TESTS.md`).
- Backend lint/typecheck command location was not found in scan (`docs/llm_handoff/_runtime_findings.md`, `backend/mario-health-api`).
- Frontend lint executed and failed with reported lint errors/warnings in app pages/components (`docs/llm_handoff/_runtime_findings.md`, `frontend/package.json`).
- Frontend e2e executed and failed (`npm run test:e2e`, exit `1`), with six smoke tests listed as failing (`docs/llm_handoff/_runtime_findings.md`, `frontend/package.json`, `frontend/tests/smoke.spec.ts`).
- Primary frontend e2e failure text was `page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/...` (`docs/llm_handoff/_runtime_findings.md`, `frontend/tests/smoke.spec.ts`).
## Evidence coverage summary

- Strong coverage: domain entities and storage/lineage paths are explicitly cited (`docs/llm_handoff_v2/01_DOMAIN_MODEL.md`).
- Strong coverage: backend API entrypoint/router/auth evidence is explicitly cited (`docs/llm_handoff_v2/02_SERVICES_AND_APIS.md`).
- Strong coverage: BigQuery->Postgres pipeline operational surface (triggers/inputs/outputs/scripts) is explicitly cited (`docs/llm_handoff_v2/03_DATA_PIPELINES.md`).
- Medium coverage: relationships are partially evidenced; some remain explicitly "Not evidenced in paths" (`docs/llm_handoff_v2/01_DOMAIN_MODEL.md`).
- Medium coverage: identifier/key specifics remain "Not evidenced in paths" (`docs/llm_handoff_v2/01_DOMAIN_MODEL.md`).
- Medium coverage: API endpoint purposes are partial; several surfaces remain unresolved (`docs/llm_handoff_v2/02_SERVICES_AND_APIS.md`).
- Light coverage: API client boundary/contracts/known-gaps sections remain placeholder-level in services/APIs doc (`docs/llm_handoff_v2/02_SERVICES_AND_APIS.md`).
- Strong runtime coverage: execution outcomes and primary failures are explicitly summarized (`docs/llm_handoff_v2/14_PHASE_C_VALIDATION_REPORT.md`).
## Known gaps / remaining risks

- Severity: High; Repro command: `npm run test`; Suspected root cause: root `package.json` has no `test` script (evidenced); Next step: add/define root test script or run package-scoped test command from documented package; Paths: `docs/llm_handoff/_runtime_findings.md`, `package.json`.
- Severity: High; Repro command: `npm run lint`; Suspected root cause: root `package.json` has no `lint` script (evidenced); Next step: add/define root lint script or run package-scoped lint command from documented package; Paths: `docs/llm_handoff/_runtime_findings.md`, `package.json`.
- Severity: High; Repro command: `python3 -m pytest`; Suspected root cause: `pytest` module unavailable in current backend runtime (evidenced); Next step: install backend test dependencies before running backend tests; Paths: `docs/llm_handoff/_runtime_findings.md`, `backend/mario-health-api/TESTS.md`, `backend/mario-health-api/requirements.txt`.
- Severity: Critical; Repro command: `npm run test:e2e`; Suspected root cause: `page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/...` (evidenced); Next step: ensure the frontend target at `http://localhost:3000` is reachable before Playwright execution; Paths: `docs/llm_handoff/_runtime_findings.md`, `frontend/package.json`, `frontend/tests/smoke.spec.ts`.
## Next steps (priority-ordered)

- P1 — Owner: AC — Replace the `API client boundary` placeholder with evidence-cited statements; driver: unresolved section in `docs/llm_handoff_v2/02_SERVICES_AND_APIS.md`.
- P1 — Owner: AC — Replace the `Contracts / schemas` placeholder with evidence-cited statements; driver: unresolved section in `docs/llm_handoff_v2/02_SERVICES_AND_APIS.md`.
- P1 — Owner: AC — Replace the `Known gaps` placeholder with evidence-cited statements tied to runtime outcomes; driver: unresolved section in `docs/llm_handoff_v2/02_SERVICES_AND_APIS.md`.
- P2 — Owner: AC — Tighten relationship mappings where still marked "Not evidenced in paths"; driver: partial mapping in `docs/llm_handoff_v2/01_DOMAIN_MODEL.md`.
- P2 — Owner: AC — Tighten identifier/key mappings where still marked "Not evidenced in paths"; driver: unresolved key specifics in `docs/llm_handoff_v2/01_DOMAIN_MODEL.md`.
- P2 — Owner: AZ — Review and accept/revise severity and remediation bullets already captured from runtime outputs; driver: risk section in `docs/llm_handoff_v2/14_PHASE_C_VALIDATION_REPORT.md`.
- P3 — Owner: AZ — Decide whether to add missing optional v2 docs (`00_INDEX.md`, `11_BUGS_GAPS_AND_RISKS.md`) for fuller phase reporting scope; driver: absent files in current v2 set referenced by this task.
