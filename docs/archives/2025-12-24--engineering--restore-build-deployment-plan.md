# Restore Build & Deployment Pipeline

This plan focuses on reverting extraneous changes made during the CORS investigation and resolving the build blockers preventing a successful Firebase Hosting export.

## Proposed Changes

### [API & Logic Cleanup]

#### [MODIFY] [api.ts](file:///Users/az/Projects/mario-health/frontend/src/lib/api.ts)
- Revert `searchProcedures` to use standard fetch or simple `fetchWithAuth`.
- Remove the `fetchSmartAuth` fallback logic as it's considered extraneous.

#### [MODIFY] [mario-smart-search.tsx](file:///Users/az/Projects/mario-health/frontend/src/components/mario-smart-search.tsx)
- Remove all `[SmartSearch]` debug console logs.
- Maintain the robust mapping logic but keep it clean.

### [Build Fixes]

#### [MODIFY] [next.config.mjs](file:///Users/az/Projects/mario-health/frontend/next.config.mjs)
- Ensure `output: 'export'` is enabled.

#### [MODIFY] [page.tsx](file:///Users/az/Projects/mario-health/frontend/src/app/providers/hospital/[id]/page.tsx)
- Add `generateStaticParams()` to satisfy the static export requirement.

## Verification Plan

### Automated Tests
1. **Local Build**: Run `npm run build` in the `frontend` directory and verify the `out/` folder is generated successfully.
2. **Deployment**: Run `make deploy` to verify the latest code is live on Firebase Hosting.

### Manual Verification
- Test search on the live site to ensure results are visible to unauthenticated users.
