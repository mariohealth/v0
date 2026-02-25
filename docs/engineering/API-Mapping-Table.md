# Frontend API Calls to Backend Routes Mapping

## Summary

This document maps all frontend API calls to backend FastAPI routes and identifies mismatches, missing routes, and fixes needed.

---

## API Mapping Table

| Frontend File | Frontend Endpoint | HTTP Method | Backend File | Backend Route | Match | Fix Suggestion |
|--------------|-------------------|-------------|--------------|---------------|-------|----------------|
| `frontend/lib/backend-api.ts:273`<br>`src/lib/api.ts:336` | `/api/v1/categories` | GET | `backend/.../endpoints/categories.py:9` | `/categories` | ✅ | Route exists - full path: `/api/v1/categories` |
| `frontend/lib/backend-api.ts:288`<br>`src/lib/api.ts:359` | `/api/v1/categories/{slug}/families` | GET | `backend/.../endpoints/categories.py:17` | `/categories/{slug}/families` | ✅ | Route exists - full path: `/api/v1/categories/{slug}/families` |
| `frontend/lib/backend-api.ts:307`<br>`src/lib/api.ts:374` | `/api/v1/families/{slug}/procedures` | GET | `backend/.../endpoints/families.py:10` | `/families/{slug}/procedures` | ✅ | Route exists - full path: `/api/v1/families/{slug}/procedures` |
| `frontend/lib/backend-api.ts:409`<br>`src/lib/api.ts:389` | `/api/v1/procedures/{slug}` | GET | `backend/.../endpoints/procedures.py:10` | `/procedures/{slug}` | ✅ | Route exists - full path: `/api/v1/procedures/{slug}` |
| `frontend/lib/backend-api.ts:345`<br>`src/lib/api.ts:419` | `/api/v1/search?q={query}&zip_code={zip}&radius={radius}` | GET | `backend/.../endpoints/search.py:10` | `/search?q={query}&zip_code={zip}&radius={radius}` | ⚠️ | **Query param mismatch**: Frontend uses `zip` but backend expects `zip_code`. Frontend should use `zip_code` in URLSearchParams. |
| `src/lib/api.ts:441` | `/api/v1/codes/{code}?code_type={type}` | GET | `backend/.../endpoints/billing_codes.py:10` | `/codes/{code}?code_type={type}` | ✅ | Route exists - full path: `/api/v1/codes/{code}` |
| `frontend/lib/api.ts:293`<br>`src/lib/api.ts:459` | `/api/v1/providers/{id}` | GET | `backend/.../endpoints/providers.py:10` | `/providers/{provider_id}` | ⚠️ | **Path param name mismatch**: Frontend uses `{id}` but backend expects `{provider_id}`. Both work but inconsistent naming. |
| `frontend/lib/preferences-api.ts:66` | `/api/v1/user/preferences` | GET | `backend/.../endpoints/user_preferences.py:25` | `/preferences` (mounted at `/api/v1/user`) | ✅ | Route exists - full path: `/api/v1/user/preferences` |
| `frontend/lib/preferences-api.ts:121` | `/api/v1/user/preferences` | PUT | `backend/.../endpoints/user_preferences.py:90` | `/preferences` (mounted at `/api/v1/user`) | ✅ | Route exists - full path: `/api/v1/user/preferences` |
| `frontend/lib/saved-searches-api.ts:52` | `/api/v1/user/saved-searches` | GET | `backend/.../endpoints/saved_searches.py:25` | `/saved-searches` (mounted at `/api/v1/user`) | ✅ | Route exists - full path: `/api/v1/user/saved-searches` |
| `frontend/lib/saved-searches-api.ts:90` | `/api/v1/user/saved-searches` | POST | `backend/.../endpoints/saved_searches.py:67` | `/saved-searches` (mounted at `/api/v1/user`) | ✅ | Route exists - full path: `/api/v1/user/saved-searches` |
| `frontend/lib/saved-searches-api.ts:129` | `/api/v1/user/saved-searches/{search_id}` | DELETE | `backend/.../endpoints/saved_searches.py:117` | `/saved-searches/{search_id}` (mounted at `/api/v1/user`) | ✅ | Route exists - full path: `/api/v1/user/saved-searches/{search_id}` |
| `frontend/lib/saved-searches.ts:110` | `/api/v1/saved-searches` | GET | ❌ | N/A | ❌ | **Wrong path**: Should be `/api/v1/user/saved-searches` |
| `frontend/lib/saved-searches.ts:142` | `/api/v1/saved-searches` | POST | ❌ | N/A | ❌ | **Wrong path**: Should be `/api/v1/user/saved-searches` |
| `frontend/lib/saved-searches.ts:176` | `/api/v1/saved-searches/{id}` | DELETE | ❌ | N/A | ❌ | **Wrong path**: Should be `/api/v1/user/saved-searches/{id}` |
| `frontend/lib/api.ts:241` | `/search?q={query}&...` | GET | `backend/.../endpoints/search.py:10` | `/search` (mounted at `/api/v1`) | ⚠️ | **Missing `/api/v1` prefix**: Frontend calls `/search` but should be `/api/v1/search`. Base URL handling may be incorrect. |
| `frontend/lib/api.ts:293` | `/providers/{id}` | GET | `backend/.../endpoints/providers.py:10` | `/providers/{provider_id}` | ⚠️ | **Missing `/api/v1` prefix**: Frontend calls `/providers/{id}` but should be `/api/v1/providers/{id}` |
| `frontend/lib/api.ts:309` | `/bookings` | POST | ❌ | N/A | ❌ | **Route doesn't exist**: Backend needs to implement booking endpoints |
| `frontend/lib/api.ts:329` | `/bookings/{bookingId}` | GET | ❌ | N/A | ❌ | **Route doesn't exist**: Backend needs to implement booking endpoints |
| `frontend/lib/api.ts:345` | `/bookings/{bookingId}/cancel` | DELETE | ❌ | N/A | ❌ | **Route doesn't exist**: Backend needs to implement booking cancellation |
| `frontend/lib/api.ts:363` | `/providers/{providerId}/time-slots?date={date}` | GET | ❌ | N/A | ❌ | **Route doesn't exist**: Backend needs to implement time slots endpoint |
| `frontend/lib/api.ts:382` | `/insurance/verify` | POST | ❌ | N/A | ❌ | **Route doesn't exist**: Backend needs to implement insurance verification |
| `frontend/lib/api.ts:399` | `/procedures?q={query}` | GET | ❌ | N/A | ❌ | **Route doesn't exist**: Backend has `/search` but not `/procedures`. Use `/api/v1/search` instead. |
| `frontend/lib/api.ts:411` | `/insurance/providers` | GET | ❌ | N/A | ❌ | **Route doesn't exist**: Backend needs to implement insurance providers endpoint |
| `frontend/lib/api.ts:431` | `/search?q={query}` | GET | `backend/.../endpoints/search.py:10` | `/search` (mounted at `/api/v1`) | ⚠️ | **Missing `/api/v1` prefix**: Should be `/api/v1/search` |
| `frontend/lib/api.ts:439` | `/procedure-categories` | GET | `backend/.../endpoints/categories.py:9` | `/categories` (mounted at `/api/v1`) | ❌ | **Wrong path**: Should be `/api/v1/categories`, not `/procedure-categories` |
| `frontend/lib/api-client.ts:66` | `/categories` | GET | `backend/.../endpoints/categories.py:9` | `/categories` (mounted at `/api/v1`) | ⚠️ | **Missing `/api/v1` prefix**: Should be `/api/v1/categories` |
| `frontend/lib/api-client.ts:75` | `/procedures?category={slug}` | GET | ❌ | N/A | ❌ | **Route doesn't exist**: Backend doesn't have category-filtered procedures endpoint |
| `frontend/lib/api-client.ts:85` | `/procedures/{id}` | GET | `backend/.../endpoints/procedures.py:10` | `/procedures/{slug}` | ⚠️ | **Path mismatch**: Frontend uses `{id}` but backend uses `{slug}`. Also missing `/api/v1` prefix. |
| `frontend/lib/api-client.ts:92` | `/procedures/search?q={query}` | GET | `backend/.../endpoints/search.py:10` | `/search` (mounted at `/api/v1`) | ⚠️ | **Wrong path**: Should be `/api/v1/search`, not `/procedures/search` |
| `frontend/lib/api-client.ts:100` | `/providers?procedure={id}` | GET | ❌ | N/A | ❌ | **Route doesn't exist**: Backend doesn't have procedure-filtered providers endpoint |
| `frontend/lib/api-client.ts:111` | `/providers/{id}` | GET | `backend/.../endpoints/providers.py:10` | `/providers/{provider_id}` | ⚠️ | **Missing `/api/v1` prefix**: Should be `/api/v1/providers/{id}` |

---

## Key Issues Summary

### 🔴 Critical Issues (Route Doesn't Exist)

1. **Booking Endpoints** - Missing entirely:
   - `POST /api/v1/bookings` - Create booking
   - `GET /api/v1/bookings/{bookingId}` - Get booking details
   - `DELETE /api/v1/bookings/{bookingId}/cancel` - Cancel booking

2. **Time Slots Endpoint** - Missing:
   - `GET /api/v1/providers/{providerId}/time-slots` - Get available time slots

3. **Insurance Endpoints** - Missing entirely:
   - `POST /api/v1/insurance/verify` - Verify insurance coverage
   - `GET /api/v1/insurance/providers` - Get insurance providers list

4. **Procedure Search Endpoint** - Wrong path:
   - Frontend: `GET /procedures?q={query}` 
   - Should use: `GET /api/v1/search?q={query}`

5. **Procedure Categories Endpoint** - Wrong path:
   - Frontend: `GET /procedure-categories`
   - Should be: `GET /api/v1/categories`

### ⚠️ Warning Issues (Path/Method Mismatches)

1. **Search Query Parameter Mismatch**:
   - Frontend uses: `zip` in URLSearchParams
   - Backend expects: `zip_code` in query params
   - **Files affected**: `frontend/lib/backend-api.ts:340`, `src/lib/api.ts:415`

2. **Missing `/api/v1` Prefix**:
   - Multiple files call endpoints without `/api/v1` prefix
   - **Files affected**: 
     - `frontend/lib/api.ts` (multiple endpoints)
     - `frontend/lib/api-client.ts` (multiple endpoints)
   - **Note**: These may rely on `baseUrl` configuration, but consistency is recommended

3. **Wrong Saved Searches Path**:
   - `frontend/lib/saved-searches.ts` uses `/api/v1/saved-searches`
   - Should be: `/api/v1/user/saved-searches`
   - **Files affected**: Lines 110, 142, 176

4. **Provider ID vs Provider Slug**:
   - Frontend uses: `{id}` in some places
   - Backend expects: `{provider_id}` 
   - This works but naming is inconsistent

### ✅ Working Routes (All Match)

- ✅ Categories: `GET /api/v1/categories`
- ✅ Category Families: `GET /api/v1/categories/{slug}/families`
- ✅ Family Procedures: `GET /api/v1/families/{slug}/procedures`
- ✅ Procedure Detail: `GET /api/v1/procedures/{slug}`
- ✅ Provider Detail: `GET /api/v1/providers/{id}` (works despite naming)
- ✅ Billing Code Detail: `GET /api/v1/codes/{code}`
- ✅ User Preferences: `GET /api/v1/user/preferences`, `PUT /api/v1/user/preferences`
- ✅ Saved Searches: `GET /api/v1/user/saved-searches`, `POST /api/v1/user/saved-searches`, `DELETE /api/v1/user/saved-searches/{search_id}`

---

## Recommended Fixes

### Priority 1: Fix Critical Path Issues

1. **Fix search query parameter** (`frontend/lib/backend-api.ts`, `src/lib/api.ts`):
   ```typescript
   // Change from:
   params.append('zip', zip);
   // To:
   params.append('zip_code', zip);
   ```

2. **Fix saved searches path** (`frontend/lib/saved-searches.ts`):
   ```typescript
   // Change from:
   const API_ENDPOINT = '/api/v1/saved-searches';
   // To:
   const API_ENDPOINT = '/api/v1/user/saved-searches';
   ```

3. **Fix procedure categories path** (`frontend/lib/api.ts`):
   ```typescript
   // Change from:
   '/procedure-categories'
   // To:
   '/api/v1/categories'
   ```

### Priority 2: Standardize API Base URLs

1. Ensure all API clients use consistent base URL configuration
2. Add `/api/v1` prefix to all endpoints that are missing it
3. Verify `API_BASE_URL` environment variable is set correctly

### Priority 3: Backend Implementation Needed

1. Implement booking endpoints:
   - `POST /api/v1/bookings`
   - `GET /api/v1/bookings/{bookingId}`
   - `DELETE /api/v1/bookings/{bookingId}/cancel`

2. Implement time slots endpoint:
   - `GET /api/v1/providers/{providerId}/time-slots`

3. Implement insurance endpoints:
   - `POST /api/v1/insurance/verify`
   - `GET /api/v1/insurance/providers`

### Priority 4: Code Cleanup

1. Remove duplicate/unused API client files
2. Consolidate API client implementations
3. Standardize error handling across all API clients

---

## Notes

- The backend router prefixes are mounted at `/api/v1` in `backend/mario-health-api/app/main.py`
- Some frontend files use base URL configuration that may include `/api/v1`, while others don't
- The `whoami` endpoint exists but is mainly for debugging authentication
- All user-facing endpoints (preferences, saved-searches) are mounted under `/api/v1/user`

