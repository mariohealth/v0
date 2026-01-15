# Frontend Development Guide

## Quick Start

```bash
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

---

## Switching Between Local and Deployed Backend

The frontend can point to either a **local backend** (for full-stack dev) or a **deployed backend** (for frontend-only work).

### Option 1: Use Local Backend (Default)

**When to use:** You're developing backend features or need to debug API logic locally.

**Setup:**
1. Ensure `.env.local` does NOT set `NEXT_PUBLIC_API_BASE_URL` (or comment it out)
2. Start the backend:
   ```bash
   cd backend/mario-health-api
   uvicorn app.main:app --reload --port 8000
   ```
3. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

**Result:** API calls go to `http://localhost:8000/api/v1`

---

### Option 2: Use Deployed Backend

**When to use:** You're developing frontend features only and don't need to run the backend locally.

**Setup:**
1. Create `frontend/.env.local` with:
   ```bash
   # Point to deployed backend (Cloud Run)
   NEXT_PUBLIC_API_BASE_URL=https://mario-health-api-ei5wbr4h5a-uc.a.run.app/api/v1
   ```
2. Restart the frontend dev server:
   ```bash
   npm run dev
   ```

**Result:** API calls go to the deployed Cloud Run backend.

**Note:** `.env.local` is gitignored, so your local config won't be committed.

---

## Verifying API Configuration

1. Open DevTools → Network tab
2. Trigger an API call (e.g., search for "brain")
3. Check the request URL:
   - **Local backend**: `http://localhost:8000/api/v1/...`
   - **Deployed backend**: `https://mario-health-api-ei5wbr4h5a-uc.a.run.app/api/v1/...`

---

## Production Build

```bash
NODE_ENV=production npm run build
```

This generates a static export in `frontend/out/` for Firebase Hosting.

**Note:** Production builds ignore `NEXT_PUBLIC_API_BASE_URL` if not explicitly set during build. Firebase Hosting rewrites handle API routing in production.

---

## Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base URL | `http://localhost:8000/api/v1` (dev) |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key | (required) |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | (required) |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID | (required) |

See `.env.local.example` for a complete template.
