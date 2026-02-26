# PHASE A2 — RUNTIME CONSISTENCY SCAN (EVIDENCE ONLY)

## 1) Tooling & Environment

- Node runtime (`node -v`): `v24.10.0`
- Python runtime (`python3 --version`): `Python 3.14.2`
- npm runtime (`npm -v`): `11.6.0`
- `.nvmrc`: `NOT EVIDENCED` (file not found)
- JS package manager lockfiles:
  - Root: `package-lock.json` present
  - Frontend: `frontend/package-lock.json` present
  - `yarn.lock`: `NOT EVIDENCED`
  - `pnpm-lock.yaml`: `NOT EVIDENCED`
- Python package manifests:
  - `backend/mario-health-api/requirements.txt` present
  - `pyproject.toml`: `NOT EVIDENCED` in backend API folder
  - `Pipfile`: `NOT EVIDENCED` in backend API folder
  - `poetry.lock`: `NOT EVIDENCED` in backend API folder

## 2) Command Execution Evidence

### 2.1 Root Scripts

#### Command
`npm run test`

- Working directory: `/Users/az/Projects/mario-health`
- Exit code: `1`
- Output (first lines):
```text
npm error Missing script: "test"
npm error
npm error To see a list of scripts, run:
npm error   npm run
npm error A complete log of this run can be found in: /Users/az/.npm/_logs/2026-02-25T20_34_40_898Z-debug-0.log
```

#### Command
`npm run lint`

- Working directory: `/Users/az/Projects/mario-health`
- Exit code: `1`
- Output (first lines):
```text
npm error Missing script: "lint"
npm error
npm error Did you mean this?
npm error   npm link # Symlink a package folder
npm error
npm error To see a list of scripts, run:
npm error   npm run
npm error A complete log of this run can be found in: /Users/az/.npm/_logs/2026-02-25T20_34_40_901Z-debug-0.log
```

### 2.2 Backend Commands

Located backend test command from repository files:
- `backend/mario-health-api/TESTS.md` lists `pytest`.

#### Command
`python3 -m pytest`

- Working directory: `/Users/az/Projects/mario-health/backend/mario-health-api`
- Exit code: `1`
- Output (first lines):
```text
/opt/homebrew/opt/python@3.14/bin/python3.14: No module named pytest
```

Located backend lint/typecheck command:
- Search pattern used: `ruff|mypy|flake8|pylint|pyright|typecheck|lint`
- Result: `NOT EVIDENCED` (no match in `backend/mario-health-api`)

### 2.3 Frontend Commands

Located frontend commands from repository files:
- `frontend/package.json` scripts include `lint` and `test:e2e`.

#### Command
`npm run lint`

- Working directory: `/Users/az/Projects/mario-health/frontend`
- Exit code: `1`
- Output (first ~40 lines):
```text
> frontend@0.1.0 lint
> next lint

 ⚠ Specified "rewrites" will not automatically work with "output: export". See more info here: https://nextjs.org/docs/messages/export-no-custom-routes

./src/app/(authed)/help/page.tsx
90:35  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
90:51  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities

./src/app/(authed)/orgs/[id]/OrgDetailClient.tsx
127:6  Warning: React Hook useEffect has a missing dependency: 'orgData'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps

./src/app/error.tsx
26:11  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities

./src/app/not-found.tsx
10:29  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
10:50  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities

./src/app/procedures/[slug]/ProcedureDetailClient.tsx
186:6  Warning: React Hook useEffect has a missing dependency: 'effectiveCarrier'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps

./src/app/specialties/[slug]/SpecialtyProvidersPageClient.tsx
275:6  Warning: React Hook useEffect has missing dependencies: 'router' and 'searchParamsHook'. Either include them or remove the dependency array.  react-hooks/exhaustive-deps
```

#### Command
`npm run test:e2e`

- Working directory: `/Users/az/Projects/mario-health/frontend`
- Exit code: `1`
- Output (first ~40 lines):
```text
> frontend@0.1.0 test:e2e
> playwright test

Running 7 tests using 1 worker
(node:91574) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:91574) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
...
```

Failing tests listed in output:
- `tests/smoke.spec.ts:50:5 › TEST 1: Home -> Autocomplete -> Specialty appears`
- `tests/smoke.spec.ts:103:5 › TEST 2: Home -> Autocomplete -> Procedure navigation`
- `tests/smoke.spec.ts:132:5 › TEST 3: Back navigation from procedure`
- `tests/smoke.spec.ts:143:5 › TEST 4: Specialty deep link page`
- `tests/smoke.spec.ts:159:5 › TEST 5: Login page loads safely`
- `tests/smoke.spec.ts:171:5 › TEST 6: Signup page loads safely`

Primary failure text observed:
- `page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/...`

### 2.4 Missing Env Vars Referenced During Runs

- Missing env var names in command output: `NOT EVIDENCED`.

## 3) Non-Execution / Failure Causes (Evidence Only)

- Root `npm run test` and `npm run lint` failed because scripts are not present in root `package.json`.
- Backend `python3 -m pytest` failed because `pytest` module is unavailable in current Python runtime.
- Frontend lint and e2e commands executed but failed with lint violations and Playwright `ERR_CONNECTION_REFUSED` failures.

Evidence paths:
- `package.json`
- `frontend/package.json`
- `backend/mario-health-api/TESTS.md`
- `frontend/tests/smoke.spec.ts`
