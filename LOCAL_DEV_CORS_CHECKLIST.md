# ✅ Local Dev CORS + Firebase Auth Checklist

Quick reference checklist for verifying local development setup.

## Prerequisites

- [ ] Backend deployed to Cloud Run (or gateway)
- [ ] Frontend running on `http://localhost:3000`
- [ ] Firebase project configured
- [ ] Environment variables set (if needed)

## Backend CORS Configuration

**File:** `backend/mario-health-api/app/main.py`

- [x] `http://localhost:3000` in `REQUIRED_ORIGINS`
- [x] `http://127.0.0.1:3000` in `ALLOWED_ORIGINS` (default)
- [x] `allow_methods=["*"]` includes OPTIONS
- [x] `allow_headers=["*"]` includes Authorization
- [ ] (Optional) `allow_credentials=False` if not using cookies

## Token Verification

**File:** `backend/mario-health-api/app/core/auth.py`

- [x] Reads `Authorization` header
- [x] Expects `Bearer <token>` format
- [x] Returns `401` for missing/invalid tokens
- [x] Uses Firebase Admin SDK for verification

## Frontend Configuration

**Files:** `frontend/src/lib/api-base.ts`, `frontend/next.config.mjs`

- [x] Returns `/api/v1` for localhost (relative path)
- [x] Next.js rewrites proxy `/api/:path*` to gateway
- [x] No hardcoded Cloud Run URLs in browser code
- [x] Auth token formatted as `Authorization: Bearer <token>`

## Firebase Console

- [ ] Verify `localhost` in authorized domains
  - Go to: Firebase Console → Authentication → Settings → Authorized domains
  - Should include: `localhost`, `127.0.0.1`, production domains

## Quick Tests

### Test 1: CORS Preflight
```bash
curl -X OPTIONS \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: authorization,content-type" \
  -v https://mario-health-api-gateway-x5pghxd.uc.gateway.dev/api/v1/categories
```
**Expected:** `200 OK` with `Access-Control-Allow-Origin: http://localhost:3000`

### Test 2: Public Endpoint
```bash
curl -X GET \
  -H "Origin: http://localhost:3000" \
  https://mario-health-api-gateway-x5pghxd.uc.gateway.dev/api/v1/categories
```
**Expected:** `200 OK` with CORS headers

### Test 3: Authenticated Endpoint (No Token)
```bash
curl -X GET \
  -H "Origin: http://localhost:3000" \
  https://mario-health-api-gateway-x5pghxd.uc.gateway.dev/api/v1/whoami
```
**Expected:** `401 Unauthorized`

### Test 4: Automated Test Script
```bash
./scripts/test-cors-local-dev.sh
```

## Browser Verification

1. Open `http://localhost:3000` in browser
2. Open DevTools → Network tab
3. Trigger an API call (e.g., search)
4. Verify:
   - [ ] OPTIONS request succeeds (200/204)
   - [ ] Actual request succeeds (200)
   - [ ] Response includes `Access-Control-Allow-Origin: http://localhost:3000`
   - [ ] No CORS errors in console

## Expected CORS Headers

For requests from `http://localhost:3000`:

```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Authorization, Content-Type, Accept, Origin
Access-Control-Allow-Credentials: true (or false)
```

## Troubleshooting

### CORS Error in Browser
- Check backend CORS config includes `localhost:3000`
- Verify gateway CORS config (if using gateway)
- Check browser console for exact error message

### 401 Unauthorized
- Verify Firebase token is valid
- Check token format: `Bearer <token>`
- Verify Firebase project ID is set in backend

### OPTIONS Request Fails
- FastAPI CORSMiddleware should handle automatically
- Check gateway config if using gateway
- Verify backend is reachable

## Files to Check

- `backend/mario-health-api/app/main.py` - CORS config
- `backend/mario-health-api/app/core/auth.py` - Auth verification
- `frontend/src/lib/api-base.ts` - API base URL
- `frontend/next.config.mjs` - Next.js rewrites
- `backend/mario-health-api/api-gateway-config.yaml` - Gateway CORS

---

**Status:** ✅ Configuration is correct for local dev

