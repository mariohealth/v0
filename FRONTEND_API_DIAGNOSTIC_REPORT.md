# 🧭 Mario Health — Frontend & API Deep Diagnostic Report

**Generated:** $(date)  
**Purpose:** Determine why `/search?q=mri` and procedure pages show no live data

---

## 📋 Executive Summary

**Status:** ⚠️ **PARTIAL ISSUES IDENTIFIED**

- ✅ **Search API endpoint is working** - Returns 5 results for "mri" query
- ❌ **Environment variable mismatch** - `.env.local` uses wrong variable name
- ❌ **Providers endpoint returns 404** - Slug format mismatch suspected
- ⚠️ **Mock fallback active** - `safeSearchProcedures` used in autocomplete component

---

## 🔍 Detailed Findings

### 1️⃣ Environment Configuration

#### Issue: Variable Name Mismatch
- **`.env.local` contains:** `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000`
- **Code expects:** `NEXT_PUBLIC_API_URL` (see `frontend/src/lib/api.ts:5`)
- **Current behavior:** Falls back to gateway URL: `https://mario-health-api-gateway-x5pghxd.uc.gateway.dev`

```5:5:frontend/src/lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mario-health-api-gateway-x5pghxd.uc.gateway.dev';
```

**Impact:** Frontend is using production gateway (which works) instead of local backend.

#### Next.js Config
- `next.config.mjs` correctly exposes both variables:
  - `NEXT_PUBLIC_API_BASE_URL`
  - `NEXT_PUBLIC_API_URL`

---

### 2️⃣ API Endpoint Testing

#### ✅ Search Endpoint: WORKING
```bash
GET https://mario-health-api-gateway-x5pghxd.uc.gateway.dev/api/v1/search?q=mri
```
**Response:** Returns 5 results including:
- `brain-mri` (procedure_slug)
- `lower-spinal-canal-mri`
- `upper-spinal-canal-mri`
- `arm-joint-mri`
- `leg-joint-mri`

**Status:** ✅ **FUNCTIONAL**

#### ❌ Providers Endpoint: NOT FOUND
```bash
GET https://mario-health-api-gateway-x5pghxd.uc.gateway.dev/api/v1/procedures/brain-mri/providers
```
**Response:** `{"detail":"Not Found"}`

**Tested variants:**
- `brain-mri` → 404
- `proc_brain_mri` → 404

**Status:** ❌ **NEEDS INVESTIGATION** - Slug format mismatch or endpoint issue

---

### 3️⃣ Frontend API Fetch Logic

#### Search Flow
1. **User searches** → `navigateToProcedure()` called
2. **Calls** → `searchProcedures()` (direct API, no mock fallback)
3. **On success** → Navigates to `/home?procedure={slug}`
4. **Home page** → Calls `getProcedureProviders(slug)` to fetch providers

```24:64:frontend/src/lib/navigateToProcedure.ts
import { searchProcedures } from './api';
import { MarioToast } from '@/components/mario-toast-helper';

export async function navigateToProcedure(
  query: string,
  router: any,
  options?: { silent?: boolean }
): Promise<boolean> {
  if (!query || !query.trim()) {
    return false;
  }

  const trimmedQuery = query.trim();

  try {
    // Call the searchProcedures API to get matching procedures
    const response = await searchProcedures(trimmedQuery);

    // Find best match (first procedure result - highest match score)
    if (response.results && response.results.length > 0) {
      const bestMatch = response.results[0];
      if (bestMatch.procedure_slug) {
        router.push(`/home?procedure=${encodeURIComponent(bestMatch.procedure_slug)}`);
        return true;
      }
    }

    // Fallback: if no match found
    if (!options?.silent) {
      console.warn('[navigateToProcedure] No matching procedure found for', trimmedQuery);
      MarioToast.error('No matching procedure found', 'Try searching for a specific procedure name');
    }
    return false;
  } catch (err) {
    console.error('[navigateToProcedure] Failed:', err);
    if (!options?.silent) {
      MarioToast.error('Search failed', 'Please try again or browse procedures');
    }
    return false;
  }
}
```

#### Autocomplete Flow (⚠️ Uses Mock Fallback)
- **Component:** `mario-smart-search.tsx`
- **Uses:** `safeSearchProcedures()` (has mock fallback)
- **Impact:** Autocomplete may show mock data if API fails

```10:10:frontend/src/components/mario-smart-search.tsx
import { safeSearchProcedures as searchProcedures } from '@/lib/api';
```

```176:193:frontend/src/lib/api.ts
export async function safeSearchProcedures(query: string): Promise<SearchResult[]> {
    try {
        const response = await searchProcedures(query);
        
        // If API returns results, use them
        if (response.results && response.results.length > 0) {
            return response.results;
        }
        
        // Empty API response - use mock fallback
        console.warn('[safeSearchProcedures] Empty API response, using mock fallback');
        return filterMockProcedures(query);
    } catch (err) {
        // API failed - use mock fallback
        console.warn('[safeSearchProcedures] API failed, using mock fallback:', err);
        return filterMockProcedures(query);
    }
}
```

#### Providers Fetch Flow
- **Called from:** `/home` page when `?procedure={slug}` query param present
- **Function:** `getProcedureProviders(procedureSlug)`
- **Current issue:** Returns 404 for `brain-mri` slug

```247:291:frontend/src/lib/api.ts
export async function getProcedureProviders(
    procedureSlug: string
): Promise<ProcedureProvidersResponse> {
    // === Restored core logic from b6d802c (last known-good) ===
    // Note: Keep current API_BASE_URL/fetchWithAuth utilities as-is
    const base = `${API_BASE_URL}/api/v1/procedures/${procedureSlug}/providers`;
    
    const res = await fetchWithAuth(base, { method: "GET" });
    
    if (!res.ok) {
        throw new Error(`Provider API failed: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json();
    
    // The working commit returned providers directly on data.providers
    // Preserve the original response structure
    const providers = Array.isArray(data?.providers) ? data.providers : [];
    
    // Dev log to confirm we are using LIVE data and from which URL
    if (process.env.NODE_ENV === "development") {
        console.log("[API:LIVE] providers url:", base, "count:", providers.length);
    }
    
    // === Apply modern Type-2 filtering AFTER validating the response ===
    const orgProviders = providers.filter((p: any) =>
        p?.entity_type === 2 ||
        p?.type === "organization" ||
        p?.npi_type === "type2" ||
        p?.provider_type === "organization" ||
        p?.provider_type === "hospital" ||
        p?.provider_type === "clinic"
    );
    
    // If Type-2 filter yields results, use them; otherwise use original providers
    const finalProviders = orgProviders.length > 0 ? orgProviders : providers;
    
    // Return the FULL original payload, just swapping providers to finalProviders
    return {
        ...data,
        providers: finalProviders as Provider[],
        total_count: finalProviders.length,
        _dataSource: "api" as const,
    } as ProcedureProvidersResponse;
}
```

---

### 4️⃣ React Components

#### Search Page
- **Route:** No dedicated `/search` route exists
- **Flow:** Search handled via `/home` page with `navigateToProcedure()`
- **URL pattern:** `/home?procedure={slug}`

#### Procedure Detail Page
- **Route:** `/procedures/[...slug]/ProcedureDetailClient.tsx`
- **Fetches:** Procedure details + providers
- **Uses:** `getProcedureBySlug()` and `getProcedureProviders()`

#### Home Page (Main Search Results)
- **Route:** `/home`
- **Component:** `MarioHome`
- **Fetches providers** when `?procedure={slug}` query param present

```30:72:frontend/src/app/home/page.tsx
  // Fetch providers when procedure query param is present
  useEffect(() => {
    const fetchProviders = async () => {
      if (!procedureSlug || !user) return;

      setLoadingProviders(true);
      setProvidersError(null);

      try {
        const data = await getProcedureProviders(procedureSlug);
        
        // Track data source for banner display
        setDataSource(data._dataSource || 'api');
        
        // Check if we got providers (rely on real API first during verification)
        if (data.providers && data.providers.length > 0) {
          setProviders(data.providers);
          setProcedureName(data.procedure_name || '');
          setProvidersError(null);
        } else {
          // No providers available - show empty state (no mock fallback during verification)
          setProviders([]);
          setProcedureName(data.procedure_name || '');
          setProvidersError(null); // Don't show error, just show empty state
        }
      } catch (error) {
        console.error('Error fetching procedure providers:', error);
        // During verification: show empty state instead of fallback
        setProviders([]);
        setProcedureName('');
        setProvidersError(null); // Don't show error message during verification
        setDataSource(null); // Clear data source on error during verification
      } finally {
        setLoadingProviders(false);
      }
    };

    if (procedureSlug && user) {
      fetchProviders();
    } else {
      setProviders([]);
      setProcedureName('');
    }
  }, [procedureSlug, user]);
```

---

### 5️⃣ Mock/Stub Data Status

#### Mock Fallback Functions
- ✅ `safeSearchProcedures()` - Has mock fallback (used in autocomplete)
- ✅ `getProcedureBySlug()` - Has mock fallback
- ❌ `getProcedureProviders()` - **No mock fallback** (throws error on 404)
- ❌ `searchProcedures()` - **No mock fallback** (throws error)

#### Mock Data Sources
- `@/mock/live/searchProceduresFallback` - Procedure search fallback
- `@/mock/live/providersFallback` - Provider fallback

**Impact:** When providers endpoint returns 404, frontend shows empty state (no providers).

---

## 🐛 Root Causes

### Primary Issues

1. **Environment Variable Mismatch**
   - `.env.local` has `NEXT_PUBLIC_API_BASE_URL` but code uses `NEXT_PUBLIC_API_URL`
   - **Fix:** Update `.env.local` to use `NEXT_PUBLIC_API_URL`

2. **Providers Endpoint 404**
   - Search returns `brain-mri` as slug, but providers endpoint returns 404
   - **Possible causes:**
     - Slug format mismatch (hyphens vs underscores)
     - Backend endpoint not implemented for this slug format
     - Database missing procedure data

3. **No Mock Fallback for Providers**
   - `getProcedureProviders()` throws error on 404
   - Frontend shows empty state instead of mock data
   - **Impact:** Users see no providers even if search works

---

## 🔧 Recommended Fixes

### Fix 1: Environment Variable
```bash
# Update frontend/.env.local
NEXT_PUBLIC_API_URL=https://mario-health-api-gateway-x5pghxd.uc.gateway.dev
# OR for local development:
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Fix 2: Verify Providers Endpoint Slug Format
- Check backend logs for expected slug format
- Test with actual procedure slugs from database
- Verify endpoint implementation in `backend/mario-health-api/app/api/v1/endpoints/procedures.py`

### Fix 3: Add Error Handling for Providers
- Consider adding mock fallback for providers endpoint (if appropriate)
- Or improve error messaging to user

### Fix 4: Test Search Flow End-to-End
1. Search for "mri" → Should return results ✅
2. Click result → Navigate to `/home?procedure=brain-mri`
3. Fetch providers → Currently fails with 404 ❌

---

## 📊 Test Results Summary

| Endpoint | Status | Response |
|----------|--------|----------|
| `/api/v1/search?q=mri` | ✅ WORKING | 5 results returned |
| `/api/v1/procedures/brain-mri/providers` | ❌ 404 | `{"detail":"Not Found"}` |
| `/api/v1/procedures/proc_brain_mri/providers` | ❌ 404 | `{"detail":"Not Found"}` |
| Environment Variable | ⚠️ MISMATCH | Wrong variable name in `.env.local` |

---

## 🎯 Next Steps

1. **Fix environment variable** in `.env.local`
2. **Investigate providers endpoint** - Check backend for correct slug format
3. **Test with working procedure slug** from database
4. **Verify backend is running** if using localhost URL
5. **Check browser console** for actual API errors when testing in dev

---

## 📝 Notes

- Search functionality appears to work correctly
- Main issue is providers endpoint returning 404
- Frontend code structure is correct, issue is likely backend/data related
- Mock fallback is intentionally disabled for providers (see comments in code)

---

**End of Diagnostic Report**

