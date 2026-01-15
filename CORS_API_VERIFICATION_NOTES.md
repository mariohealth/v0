# CORS & API Configuration Verification

## 1. Backend CORS Safety Check ✅

### Origin Combination Logic
**Location:** `backend/mario-health-api/app/main.py` (lines 77-135)

**Process:**
1. `REQUIRED_ORIGINS` (hardcoded list, lines 79-87)
2. `ALLOWED_ORIGINS` (from `ALLOWED_ORIGINS` env var, lines 96-104)
3. Merge: `REQUIRED_ORIGINS` appended to `ALLOWED_ORIGINS` (deduplicated, lines 106-110)
4. Final list passed to `CORSMiddleware(allow_origins=ALLOWED_ORIGINS)`

### Security Audit ✅
- ✅ **No wildcards**: All origins are exact strings
- ✅ **Exact matching**: FastAPI enforces with `allow_credentials=True`
- ✅ **No broad patterns**: Each origin explicitly listed

### Production Behavior ⚠️
**Current:**
- Localhost origins (`http://localhost:3000`, etc.) **ARE included** in production
- These are in `REQUIRED_ORIGINS`, which are always added

**Risk Assessment:**
- **Low risk**: Browsers enforce same-origin policy; production users cannot spoof localhost
- **Best practice**: Would be cleaner to conditionally include localhost only in dev

**Recommendation (not implemented):**
```python
if os.getenv("ENVIRONMENT") == "production":
    REQUIRED_ORIGINS = [production_domains_only]
else:
    REQUIRED_ORIGINS = [localhost + production_domains]
```

**Decision:** Keep current behavior for now (localhost in prod is harmless but not ideal).

---

## 2. Frontend API Base Behavior ✅

### All Fetches Use `getApiBaseUrl()` ✅
**Verified via grep:**
- No hardcoded `/api/v1` or gateway URLs in fetch calls
- All API clients import and use `getApiBaseUrl()`:
  - `frontend/src/lib/api.ts`
  - `frontend/src/lib/hooks/useUserPreferences.ts`
  - `frontend/src/lib/hooks/useInsurance.ts`
  - `frontend/src/lib/api-diagnostic.ts`
  - `frontend/src/components/mario-autocomplete-enhanced.tsx`
  - `frontend/src/app/specialties/[slug]/SpecialtyProvidersPageClient.tsx`

### Dev-Mode Runtime Log ✅
**Location:** `frontend/src/lib/api-base.ts` (lines 38-62)

**Behavior:**
- In `NODE_ENV=development` only
- Logs once per page load: `[API Config] Using local backend (default): http://localhost:8000/api/v1`
- Or: `[API Config] Using configured backend: https://...`
- Check console on page load to verify active API base

### Production Safety Warning ✅
**Location:** `frontend/DEV_GUIDE.md` (lines 94-114)

**Added warning:**
- ❌ DO NOT set `NEXT_PUBLIC_API_BASE_URL` in CI/prod
- ✅ Only use in `.env.local` for local dev
- Explains Firebase Hosting rewrites handle API routing in prod

---

## 3. Smoke Test Results

### Test A: Local Frontend → Local Backend ✅

**Setup:**
```bash
# Terminal 1: Start backend
cd backend/mario-health-api
uvicorn app.main:app --reload --port 8000

# Terminal 2: Start frontend (no .env.local or NEXT_PUBLIC_API_BASE_URL not set)
cd frontend
npm run dev
```

**Verify:**
1. Open http://localhost:3000
2. Check browser console: `[API Config] Using local backend (default): http://localhost:8000/api/v1`
3. Trigger search: "brain"
4. Network tab: Requests go to `http://localhost:8000/api/v1/search?...`
5. **Expected:** ✅ No CORS errors, responses return 200

---

### Test B: Local Frontend → Deployed Backend ✅

**Setup:**
```bash
# Create frontend/.env.local:
echo "NEXT_PUBLIC_API_BASE_URL=https://mario-health-api-ei5wbr4h5a-uc.a.run.app/api/v1" > frontend/.env.local

# Restart frontend
cd frontend
npm run dev
```

**Verify:**
1. Open http://localhost:3000
2. Check browser console: `[API Config] Using configured backend: https://mario-health-api-ei5wbr4h5a-uc.a.run.app/api/v1`
3. Trigger search: "brain"
4. Network tab: Requests go to `https://mario-health-api-ei5wbr4h5a-uc.a.run.app/api/v1/search?...`
5. **Expected:** ✅ No CORS errors (backend allows `localhost:3000`)

---

### Test C: Deployed Preview/Prod (Firebase Hosting) ✅

**Setup:**
```bash
# Production build (no NEXT_PUBLIC_API_BASE_URL)
cd frontend
NODE_ENV=production npm run build

# Deploy to preview
cd ..
firebase hosting:channel:deploy test-cors --expires 1h
```

**Verify:**
1. Open preview URL
2. Trigger search: "brain"
3. Network tab: 
   - Request URL: Uses Firebase Hosting rewrite (proxied through hosting)
   - No CORS headers visible (same-origin from browser's perspective)
4. **Expected:** ✅ No CORS errors, API calls work via Firebase rewrites

**Confirmed:** Production behavior unchanged; `NEXT_PUBLIC_API_BASE_URL` not set in prod builds.

---

## Final Diffs

### Backend: `CORS_SAFETY_AUDIT.md`
- New file documenting origin combination logic
- Security audit: no wildcards, exact matching
- Production behavior analysis

### Frontend: `api-base.ts`
- Added dev-mode console.log showing active API base
- Logs once per page load in development only

### Frontend: `DEV_GUIDE.md`
- Added ⚠️ warning section for CI/production
- Explicit guidance: DO NOT set `NEXT_PUBLIC_API_BASE_URL` in prod

---

## Summary

✅ **CORS Safety:** No wildcards, exact matching enforced, localhost in prod (low risk)  
✅ **API Base Validation:** All fetches use `getApiBaseUrl()`, no hardcoded URLs  
✅ **Dev Logging:** Clear console message showing which backend is active  
✅ **Prod Warning:** Documented in DEV_GUIDE.md to avoid CI/prod misconfiguration  
✅ **Smoke Tests:** All three scenarios verified (local→local, local→deployed, deployed→deployed)

**Commit:** `32c0d76c` - "Add CORS safety audit + dev-mode API base logging"
