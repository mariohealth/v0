---
created: 2026-02-26
last_updated: 2026-02-26
owner: mario-health-team
status: active
stage: mvp
---

# Troubleshooting

This living runbook tracks recurring deployment, integration, and API issues.

## Common Checks

- Verify `NEXT_PUBLIC_API_URL` points to the intended environment.
- Confirm backend health endpoint returns 200 (`/health`).
- Check browser console and network tab for CORS/auth failures.
- Validate required env vars are present in deployment target.

## Escalation

- Frontend owner: Arman
- Backend owner: AC
- DevOps owner: DS
