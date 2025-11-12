# 🧭 Mario Health — API Origin Audit Report

**Generated:** $(date)  
**Purpose:** Detect if API endpoint or hosting source changed (Cloud Run → Firebase)

---

## 📋 Executive Summary

**Status:** ✅ **API ORIGIN CONFIRMED — CLOUD RUN (NOT FIREBASE FUNCTIONS)**

- ✅ **Frontend:** Deployed on Firebase Hosting
- ✅ **API Backend:** Running on Cloud Run (NOT Firebase Functions)
- ✅ **Routing:** Firebase Hosting rewrites `/api/**` → Cloud Run service
- ⚠️ **No Firebase Functions detected** — API is NOT on Firebase Functions

---

## 🔍 Detailed Findings

### 1️⃣ Firebase Configuration (`firebase.json`)

**Hosting Configuration:**
```json
{
  "hosting": {
    "site": "mario-mrf-data",
    "public": "frontend/out",
    "rewrites": [
      {
        "source": "/api/**",
        "run": {
          "serviceId": "mario-health-api",
          "region": "us-central1"
        }
      }
    ]
  }
}
```

**Key Finding:** 
- ✅ Rewrite rule routes `/api/**` to **Cloud Run service** (`mario-health-api`)
- ❌ **NOT** routing to Firebase Functions (would use `"function": "api"` or `"/__/functions/api"`)
- ✅ This confirms API is on **Cloud Run**, not Firebase Functions

---

### 2️⃣ Frontend API Configuration

#### Environment Variables
- **Code expects:** `NEXT_PUBLIC_API_URL`
- **Fallback default:** `https://mario-health-api-gateway-x5pghxd.uc.gateway.dev`
- **Next.js config exposes:** Both `NEXT_PUBLIC_API_BASE_URL` and `NEXT_PUBLIC_API_URL`

#### API Base URL Usage
```typescript
// frontend/src/lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  'https://mario-health-api-gateway-x5pghxd.uc.gateway.dev';
```

**Key Finding:**
- ✅ Frontend code uses **Cloud Run Gateway URL** as default
- ✅ No Firebase Functions URLs detected (`cloudfunctions.net` or `firebaseapp.com/api`)
- ✅ All API calls go directly to Cloud Run Gateway

---

### 3️⃣ Cloud Run Endpoint References

**Found in `frontend/next.config.mjs`:**
- ✅ `mario-health-api-ei5wbr4h5a-uc.a.run.app` (direct Cloud Run)
- ✅ `mario-health-api-gateway-x5pghxd.uc.gateway.dev` (API Gateway)

**Not Found:**
- ❌ No `cloudfunctions.net` URLs
- ❌ No `firebaseapp.com/api` URLs
- ❌ No Firebase Functions references

---

### 4️⃣ Firebase Functions Check

**Result:** ❌ **NO FIREBASE FUNCTIONS DEPLOYED**

- No `functions/` directory found
- No `backend/functions/` directory found
- No `exports.*` Firebase Functions code detected
- No Firebase Functions deployment artifacts

---

### 5️⃣ Next.js Configuration

**`frontend/next.config.mjs`:**
- ✅ Output mode: `standalone` (allows dynamic rendering)
- ✅ Image optimization: Unoptimized (for static export compatibility)
- ✅ Remote patterns include Cloud Run URLs
- ❌ No Next.js rewrites to Firebase Functions

**Key Finding:**
- Next.js is configured for Firebase Hosting deployment
- But API calls bypass Firebase and go directly to Cloud Run
- No proxy/rewrite layer in Next.js config

---

### 6️⃣ Git History Analysis

**Recent Changes:**
- `next.config.mjs` changed from `output: 'export'` to `output: 'standalone'` (Nov 10, 2025)
- This change enables dynamic routes but doesn't affect API origin
- No changes to Firebase Functions configuration

---

## 🎯 Conclusion

### Current Architecture

```
┌─────────────────┐
│  Firebase Hosting│  ← Frontend (Next.js static export)
│  (mario-mrf-data)│
└────────┬─────────┘
         │
         │ Rewrite: /api/** → Cloud Run
         │
         ▼
┌─────────────────┐
│   Cloud Run     │  ← API Backend
│ (mario-health-  │
│   api service)  │
└─────────────────┘
```

### API Origin Status

| Component | Status | Location |
|-----------|--------|----------|
| Frontend | ✅ Firebase Hosting | `mario-mrf-data.firebaseapp.com` |
| API Backend | ✅ Cloud Run | `mario-health-api` (us-central1) |
| API Gateway | ✅ Cloud Run Gateway | `mario-health-api-gateway-x5pghxd.uc.gateway.dev` |
| Firebase Functions | ❌ Not Used | N/A |

### Key Indicators

✅ **API is on Cloud Run:**
1. `firebase.json` rewrites `/api/**` to Cloud Run service
2. Frontend code uses Cloud Run Gateway URL
3. No Firebase Functions code or deployment found
4. No `cloudfunctions.net` URLs in codebase

❌ **API is NOT on Firebase Functions:**
1. No `functions/` directory
2. No Firebase Functions exports
3. No Firebase Functions URLs in environment variables
4. Rewrite rule uses `"run"` (Cloud Run) not `"function"` (Firebase Functions)

---

## 📊 Comparison: Cloud Run vs Firebase Functions

| Feature | Current (Cloud Run) | If Using Firebase Functions |
|---------|-------------------|----------------------------|
| Rewrite rule | `"run": { "serviceId": "..." }` | `"function": "api"` or `"/__/functions/api"` |
| API URL pattern | `*.run.app` or `*.gateway.dev` | `*.cloudfunctions.net` or `*.firebaseapp.com/__/functions/api` |
| Code location | `backend/mario-health-api/` | `functions/` or `backend/functions/` |
| Deployment | `gcloud run deploy` | `firebase deploy --only functions` |

---

## 🔧 Recommendations

### If You Want to Keep Cloud Run (Current Setup)
✅ **No changes needed** — Current architecture is correct:
- Frontend on Firebase Hosting
- API on Cloud Run
- Firebase Hosting rewrites handle routing

### If You Want to Migrate to Firebase Functions
⚠️ **Requires significant changes:**
1. Create `functions/` directory
2. Deploy API code as Firebase Functions
3. Update `firebase.json` rewrite rule to use `"function"` instead of `"run"`
4. Update frontend API URLs to use Firebase Functions endpoints
5. Redeploy both frontend and functions

---

## 📝 Notes

- The audit confirms API origin has **NOT changed** from Cloud Run to Firebase Functions
- Current setup uses **Firebase Hosting + Cloud Run** (hybrid approach)
- This is a valid architecture pattern
- No migration to Firebase Functions detected

---

**End of Audit Report**

