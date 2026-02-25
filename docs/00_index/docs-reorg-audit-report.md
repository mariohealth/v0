# Docs Reorg Audit Report

Date: 2026-02-26
Branch: feat/medications-pricing-bridge

## Inbound links changed (old -> new)

- `README.md`: `./docs/API_OVERVIEW.md` -> `./docs/engineering/API-Overview.md`
- `README.md`: `./docs/INTEGRATION_GUIDE.md` -> `./docs/engineering/Integration-Guide.md`
- `README.md`: `./docs/MONDAY_INTEGRATION.md` -> `./docs/archives/2025-10-29--engineering--monday-integration-handoff.md`
- `README.md`: `./docs/API_CONTRACT.md` -> `./docs/decisions/API-Contract.md`
- `README.md`: `./docs/ROUTING_ENTITY_IDENTITY_CONTRACT.md` -> `./docs/decisions/Routing-Entity-Identity-Contract.md`
- `README.md`: `./docs/DEPLOYMENT_CHECKLIST.md` -> `./docs/ops/Deployment-Checklist.md`
- `docs/engineering/API-Overview.md`: `../API_MAPPING_TABLE.md` -> `./API-Mapping-Table.md`
- `docs/engineering/API-Overview.md`: `./API_CONTRACT.md` -> `../decisions/API-Contract.md`
- `docs/engineering/API-Overview.md`: `./ROUTING_ENTITY_IDENTITY_CONTRACT.md` -> `../decisions/Routing-Entity-Identity-Contract.md`
- `docs/engineering/API-Overview.md`: `./INTEGRATION_GUIDE.md` -> `./Integration-Guide.md`
- `docs/ops/Deployment-Checklist.md`: `./INTEGRATION_GUIDE.md` -> `../engineering/Integration-Guide.md`
- `docs/ops/Deployment-Checklist.md`: `./TROUBLESHOOTING.md` -> `./Troubleshooting.md`

## `--v2` fallback usage

- None. No destination collision required `--v2` fallback.

## Non-md references updated (images/assets)

- `docs/archives/2025-12-24--engineering--walkthrough-live-search-deploy.md`:
  - `file:///Users/az/Projects/mario-health/docs/development/media/20251224_search_verification.png`
  - -> `./2025-12-24--engineering--walkthrough-live-search-deploy.media/20251224_search_verification.png`
- `docs/archives/2025-12-23--engineering--walkthrough-emergency-stability.md`:
  - `./media/brain_search_results_1766464009495.png`
  - -> `./2025-12-23--engineering--walkthrough-emergency-stability.media/brain_search_results_1766464009495.png`
- `docs/archives/2025-12-23--engineering--walkthrough-emergency-stability.md`:
  - `./media/verify_search_restoration_v2_1766502204265.webp`
  - -> `./2025-12-23--engineering--walkthrough-emergency-stability.media/verify_search_restoration_v2_1766502204265.webp`

## Structural follow-up on docs branch

- `docs/decisions/API-Contract.md` -> `docs/engineering/API-Contract.md` (git mv)
- `README.md`: `./docs/decisions/API-Contract.md` -> `./docs/engineering/API-Contract.md`
- `docs/engineering/API-Overview.md`: `../decisions/API-Contract.md` -> `./API-Contract.md`
- `docs/00_index/README.md`: `../decisions/API-Contract.md` -> `../engineering/API-Contract.md`
