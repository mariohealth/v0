# 🔒 CORS + Firebase Auth Local Dev Audit Report

**Generated:** 2025-01-XX  
**Purpose:** Audit and ensure correct CORS + Firebase Auth settings for local development  
**Frontend:** `http://localhost:3000`  
**Backend:** Cloud Run (`https://<service>.<region>.run.app` OR gateway domain)

---

## 📋 Executive Summary

**Overall Status:** ✅ **MOSTLY CORRECT** with minor optimizations recommended

- ✅ Backend CORS allows `localhost:3000`
- ✅ Token verification path is correct (`Bearer <token>`)
- ✅ Frontend uses relative paths with Next.js rewrites
- ⚠️ `allow_credentials=True` may be unnecessary (only needed for cookies)
- ⚠️ Need to verify Firebase Console authorized domains include `localhost`

---

## 1️⃣ Backend CORS Configuration

### File Location
**`backend/mario-health-api/app/main.py`** (lines 77-135)

### Current Configuration

```77:135:backend/mario-health-api/app/main.py
# CORS middleware configuration
# Required origins for frontend access
REQUIRED_ORIGINS = [
    "http://localhost:3000",
    "https://mario-mrf-data.web.app",
    "https://mario-health-frontend.vercel.app",
    "https://mario-health-clean.vercel.app",
]

# Firebase Hosting origins
# Note: FastAPI CORSMiddleware doesn't support wildcards, so we'll use a custom handler
# For now, add specific Firebase Hosting origins via ALLOWED_ORIGINS env var
# Example: ALLOWED_ORIGINS=https://your-site.web.app,https://your-site.firebaseapp.com
FIREBASE_HOSTING_ORIGINS = []

# Get additional origins from environment variable
ALLOWED_ORIGINS_STR = os.getenv(
    "ALLOWED_ORIGINS",
    "http://127.0.0.1:3000,https://mario.health,https://www.mario.health,https://mario-health-ifzy.vercel.app,https://mario-mrf-data.web.app",
)

# Strip whitespace from each origin to prevent CORS issues
ALLOWED_ORIGINS = [
    origin.strip() for origin in ALLOWED_ORIGINS_STR.split(",") if origin.strip()
]

# Always add required origins (they take precedence)
for origin in REQUIRED_ORIGINS:
    if origin not in ALLOWED_ORIGINS:
        ALLOWED_ORIGINS.append(origin)
        logger.info(f"✅ Added required CORS origin: {origin}")

# Add Firebase Hosting origins from environment variable
# Since FastAPI CORSMiddleware doesn't support wildcards, add specific origins via ALLOWED_ORIGINS
# Example: ALLOWED_ORIGINS=https://your-site.web.app,https://your-site.firebaseapp.com
if FIREBASE_HOSTING_ORIGINS:
    ALLOWED_ORIGINS.extend(FIREBASE_HOSTING_ORIGINS)
    logger.info(f"✅ Added Firebase Hosting CORS origins: {FIREBASE_HOSTING_ORIGINS}")
else:
    logger.info(
        "ℹ️  Add Firebase Hosting origins via ALLOWED_ORIGINS env var (e.g., https://your-site.web.app)"
    )

# Firebase configuration
FIREBASE_PROJECT_ID = os.getenv("FIREBASE_PROJECT_ID", "")

logger.info(f"🔒 CORS configured with allowed origins: {ALLOWED_ORIGINS}")
if FIREBASE_PROJECT_ID:
    logger.info(f"🔐 Firebase Project ID: {FIREBASE_PROJECT_ID}")
else:
    logger.warning("⚠️  FIREBASE_PROJECT_ID not set - token verification will fail")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### ✅ What's Correct

1. **Origin:** ✅ `http://localhost:3000` is in `REQUIRED_ORIGINS` (line 80)
2. **Origin:** ✅ `http://127.0.0.1:3000` is in default `ALLOWED_ORIGINS` (line 95)
3. **Methods:** ✅ `allow_methods=["*"]` includes OPTIONS (line 133)
4. **Headers:** ✅ `allow_headers=["*"]` includes Authorization, Content-Type, etc. (line 134)
5. **OPTIONS Handling:** ✅ FastAPI CORSMiddleware automatically handles OPTIONS preflight requests

### ⚠️ Recommendations

1. **`allow_credentials=True`** (line 132)
   - **Current:** Set to `True`
   - **Issue:** Only needed if using cookies/session storage. Firebase Auth uses tokens in headers, not cookies.
   - **Recommendation:** Set to `False` unless cookies are explicitly used
   - **Impact:** Low - works correctly but slightly more permissive than needed

2. **Environment-aware CORS** (optional)
   - Consider making `allow_credentials` environment-aware:
     ```python
     allow_credentials=os.getenv("CORS_ALLOW_CREDENTIALS", "false").lower() == "true"
     ```

### Expected CORS Headers in Cloud Run Responses

When a request comes from `http://localhost:3000`, Cloud Run should return:

```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Authorization, Content-Type, Accept, Origin
Access-Control-Allow-Credentials: true  (or false if changed)
Access-Control-Max-Age: 600  (if configured)
```

---

## 2️⃣ Token Verification Path

### File Location
**`backend/mario-health-api/app/core/auth.py`** (lines 14-62)

### Current Implementation

```14:62:backend/mario-health-api/app/core/auth.py
async def require_auth(authorization: str = Header(None)) -> Dict[str, Any]:
    """
    Required dependency that enforces Firebase authentication.

    Use this for endpoints that must be authenticated.

    Args:
        authorization: Authorization header value (format: "Bearer <token>")

    Returns:
        Decoded Firebase token claims

    Raises:
        HTTPException: If no token or invalid token
    """
    from app.auth.firebase_auth import verify_token

    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please provide Authorization header."
        )

    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format. Expected: Bearer <token>",
        )

    token = authorization[7:]  # Remove "Bearer " prefix

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token is missing"
        )

    # Verify token using Firebase Admin SDK
    decoded = verify_token(token)

    if not decoded:
        logger.error("Token verification failed")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

    logger.info(f"User authenticated: {decoded.get('email', 'N/A')}")
    return decoded
```

### ✅ What's Correct

1. **Header Reading:** ✅ Reads `Authorization` header (line 14)
2. **Format:** ✅ Expects `"Bearer <token>"` format (line 37)
3. **Token Extraction:** ✅ Correctly extracts token after "Bearer " prefix (line 43)
4. **Error Handling:** ✅ Returns `401 UNAUTHORIZED` (not 403) for missing/invalid tokens
5. **Firebase Verification:** ✅ Uses Firebase Admin SDK to verify tokens (line 52)

### Endpoint Authentication Status

**Public Endpoints (No Auth Required):**
- ✅ `/api/v1/categories` - Get all categories
- ✅ `/api/v1/search` - Search procedures
- ✅ `/api/v1/whoami/test` - Test endpoint
- ✅ `/health` - Health check
- ✅ `/` - API root

**Authenticated Endpoints (Require Auth):**
- 🔒 `/api/v1/whoami` - Get current user info
- 🔒 `/api/v1/user/preferences` - User preferences CRUD
- 🔒 `/api/v1/user/saved-searches` - Saved searches CRUD

**Status:** ✅ Intentional - public endpoints for search/browse, authenticated for user data

---

## 3️⃣ Frontend Environment Configuration

### File Locations

1. **`frontend/src/lib/api-base.ts`** - API base URL helper
2. **`frontend/next.config.mjs`** - Next.js rewrites configuration

### Current Configuration

**API Base URL Helper:**

```17:38:frontend/src/lib/api-base.ts
export function getApiBaseUrl(): string {
    // 1. In browser on Firebase Hosting, ALWAYS use relative URL to leverage proxy
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if (hostname.includes('web.app') || hostname.includes('mariohealth.com') || hostname === 'localhost' || hostname === '127.0.0.1') {
            // For both production and local dev, relative paths are handled by proxies 
            // (Firebase rewrites in prod, Next.js rewrites in local dev)
            return '/api/v1';
        }
    }

    // 2. Fallback for SSR or other environments (should use relative whenever possible)
    const base = process.env.NEXT_PUBLIC_API_BASE || '/api/v1';

    // Safety check: strip protocol if it accidentally leaked into NEXT_PUBLIC_API_BASE in a browser environment
    if (typeof window !== 'undefined' && base.startsWith('http')) {
        console.warn('[API Base] Absolute URL detected in browser environment. Falling back to relative path to avoid CORS issues.');
        return '/api/v1';
    }

    return base.endsWith('/') ? base.slice(0, -1) : base;
}
```

**Next.js Rewrites:**

```48:56:frontend/next.config.mjs
    // Add rewrites for local development to proxy /api to the gateway
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://mario-health-api-gateway-x5pghxd.uc.gateway.dev/api/:path*',
            },
        ];
    },
```

### ✅ What's Correct

1. **Local Dev:** ✅ Returns `/api/v1` for `localhost` (line 24)
2. **Proxy:** ✅ Next.js rewrites proxy `/api/:path*` to gateway URL (lines 49-55)
3. **No Hardcoded URLs:** ✅ No absolute Cloud Run URLs in browser code
4. **Safety Check:** ✅ Strips absolute URLs if accidentally set (lines 32-34)

### ⚠️ Note

- The rewrite destination uses the **gateway URL** (`mario-health-api-gateway-x5pghxd.uc.gateway.dev`)
- This is correct for local dev - requests go through the gateway which handles CORS
- Gateway CORS config is in `backend/mario-health-api/api-gateway-config.yaml` (also allows `localhost:3000`)

### Frontend Auth Token Usage

**File:** `frontend/src/lib/api.ts` (lines 153-169)

```153:169:frontend/src/lib/api.ts
async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const token = await getAuthToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    // Add auth token if available
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(url, {
        ...options,
        headers,
    });
}
```

**Status:** ✅ Correctly formats `Authorization: Bearer <token>` header

---

## 4️⃣ Firebase Console Settings

### ⚠️ Manual Verification Required

**Firebase Console → Authentication → Settings → Authorized domains**

Must include:
- ✅ `localhost` (for local development)
- ✅ `127.0.0.1` (alternative localhost)
- ✅ Production domains (already configured)

**How to Verify:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `mario-mrf-data` (or your project)
3. Navigate to: **Authentication → Settings → Authorized domains**
4. Verify `localhost` is listed

**If Missing:**
- Click "Add domain"
- Enter `localhost`
- Save

**Note:** Firebase Auth automatically allows `localhost` in most cases, but verify to be sure.

---

## 5️⃣ Local Dev Checklist & Test Commands

### Prerequisites

1. ✅ Backend deployed to Cloud Run (or gateway)
2. ✅ Frontend running on `http://localhost:3000`
3. ✅ Firebase project configured
4. ✅ Environment variables set (if needed)

### Test 1: CORS Preflight (OPTIONS)

```bash
# Test OPTIONS request from localhost:3000
curl -X OPTIONS \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: authorization,content-type" \
  -v \
  https://mario-health-api-gateway-x5pghxd.uc.gateway.dev/api/v1/categories

# Expected response:
# < HTTP/2 200
# < access-control-allow-origin: http://localhost:3000
# < access-control-allow-methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
# < access-control-allow-headers: authorization, content-type
```

### Test 2: Public Endpoint (No Auth)

```bash
# Test GET request without auth
curl -X GET \
  -H "Origin: http://localhost:3000" \
  -H "Content-Type: application/json" \
  -v \
  https://mario-health-api-gateway-x5pghxd.uc.gateway.dev/api/v1/categories

# Expected response:
# < HTTP/2 200
# < access-control-allow-origin: http://localhost:3000
# < Content-Type: application/json
# { "categories": [...] }
```

### Test 3: Authenticated Endpoint (With Token)

```bash
# Get Firebase ID token (from browser console after login)
# In browser console: firebase.auth().currentUser.getIdToken()

# Test authenticated request
curl -X GET \
  -H "Origin: http://localhost:3000" \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN" \
  -H "Content-Type: application/json" \
  -v \
  https://mario-health-api-gateway-x5pghxd.uc.gateway.dev/api/v1/whoami

# Expected response (if token valid):
# < HTTP/2 200
# < access-control-allow-origin: http://localhost:3000
# { "authenticated": true, "user_info": {...} }

# Expected response (if token invalid/missing):
# < HTTP/2 401
# { "detail": "Authentication required..." }
```

### Test 4: Browser Network Tab Verification

1. Open `http://localhost:3000` in browser
2. Open DevTools → Network tab
3. Perform an action that triggers an API call (e.g., search)
4. Verify:
   - ✅ OPTIONS request succeeds (200/204)
   - ✅ Actual request succeeds (200)
   - ✅ Response headers include `Access-Control-Allow-Origin: http://localhost:3000`
   - ✅ No CORS errors in console

### Test 5: Firebase Auth Flow

1. Open `http://localhost:3000` in browser
2. Attempt to sign in with Firebase Auth
3. Verify:
   - ✅ Sign-in popup/redirect works
   - ✅ Token is obtained
   - ✅ Authenticated API calls succeed

---

## 6️⃣ Summary & Action Items

### ✅ What's Correct

1. ✅ Backend CORS allows `localhost:3000`
2. ✅ Token verification accepts `Bearer <token>` format
3. ✅ Frontend uses relative paths with Next.js rewrites
4. ✅ OPTIONS preflight handled automatically by FastAPI
5. ✅ Public vs authenticated endpoints are intentional

### ⚠️ Recommendations (Optional Optimizations)

1. **Consider setting `allow_credentials=False`** in CORS middleware (line 132 of `main.py`)
   - Only needed if using cookies
   - Firebase Auth uses tokens, not cookies
   - **Impact:** Low - current config works fine

2. **Verify Firebase Console authorized domains** include `localhost`
   - Manual check required
   - Usually auto-allowed, but verify

### 🔧 No Changes Required

The current configuration is **correct and functional** for local development. The recommendations above are optional optimizations.

---

## 7️⃣ Expected CORS Header Set (Reference)

For requests from `http://localhost:3000` to Cloud Run, responses should include:

```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Authorization, Content-Type, Accept, Origin
Access-Control-Allow-Credentials: true  (or false if optimized)
```

**Status Code for OPTIONS:** `200 OK` or `204 No Content`

---

## 📝 Files Referenced

- `backend/mario-health-api/app/main.py` - CORS configuration
- `backend/mario-health-api/app/core/auth.py` - Token verification
- `backend/mario-health-api/app/auth/firebase_auth.py` - Firebase Admin SDK
- `frontend/src/lib/api-base.ts` - API base URL helper
- `frontend/next.config.mjs` - Next.js rewrites
- `frontend/src/lib/api.ts` - API client with auth
- `backend/mario-health-api/api-gateway-config.yaml` - Gateway CORS config

---

**Report Status:** ✅ **AUDIT COMPLETE**  
**Action Required:** None (optional optimizations available)  
**Local Dev Ready:** ✅ **YES**

