# Frontend Page Map - Mario Health MVP

**Generated:** 2025-11-09 01:09:20  
**Project Path:** `/Users/az/Projects/mario-health/frontend`  
**Framework:** Next.js 14 (App Router)  
**Base Directory:** `/src/app/`

---

## Route Structure Overview

| Route Path | File | Purpose / Intended Function | Notes (from code comments or TODOs) |
|------------|------|----------------------------|-------------------------------------|
| `/` | `src/app/page.tsx` | Home page - landing/welcome screen | **Placeholder/Mock:** Minimal welcome message. No API calls. Needs full implementation per Figma design. |
| `/search` | `src/app/search/page.tsx` | Search procedures page - search and display procedure results | **Live API:** Uses `searchProcedures()` from `@/lib/api`. Requires authentication. Links to procedure detail pages. |
| `/login` | `src/app/login/page.tsx` | Authentication page - Google sign-in | **Live Auth:** Uses Firebase Auth via `useAuth()` hook. Handles login/logout. |
| `/procedures/[...slug]` | `src/app/procedures/[...slug]/page.tsx` | Procedure detail page - shows procedure info and providers | **Live API:** Uses `getProcedureBySlug()` and `getProcedureProviders()`. Requires authentication. Links to provider detail pages. Handles error if providers endpoint doesn't exist. |
| `/providers/[id]` | `src/app/providers/[id]/page.tsx` | Provider detail page (single ID) - shows provider info and procedures | **Live API:** Uses `getProviderDetail()` from `@/lib/api` (but **missing import** - needs fix). Requires authentication. |
| `/providers/[...id]` | `src/app/providers/[...id]/page.tsx` | Provider detail page (catch-all) - alternative route for provider details | **Live API:** Direct fetch to API endpoint. Has placeholder comment: "This endpoint may not exist yet in the backend. For now, we'll show a placeholder." |

---

## Layout & Special Files

| File | Purpose | Notes |
|------|---------|-------|
| `src/app/layout.tsx` | Root layout - wraps all pages | Contains navigation bar with links to Home, Search, Login. Wraps app with `AuthProvider`. |
| `src/app/globals.css` | Global styles | Tailwind CSS imports and global styles. |
| `src/app/(main)/providers/[id]/ProviderDetailClient.tsx` | Client component (route group) | **Empty file** - appears unused. |

---

## Detailed Page Analysis

### 1. Home Page (`/`)
- **File:** `src/app/page.tsx`
- **Status:** ⚠️ **Incomplete/Placeholder**
- **API Calls:** None
- **Authentication:** Not required
- **Notes:**
  - Minimal placeholder with "Welcome to the production build!" message
  - No navigation to key features
  - Needs full implementation per Figma design (Home flow)
  - Should include hero section, featured categories, search CTA, etc.

### 2. Search Page (`/search`)
- **File:** `src/app/search/page.tsx`
- **Status:** ✅ **Complete with Live API**
- **API Calls:** `searchProcedures(query)` from `@/lib/api`
- **Authentication:** Required (redirects to login if not authenticated)
- **Features:**
  - Search input with submit handler
  - Displays search results with procedure name, category, family, prices, provider count
  - Links to procedure detail pages (`/procedures/${procedure_slug}`)
  - Error handling and loading states
  - Empty state when no results
- **Notes:**
  - Fully functional with live API integration
  - Matches Figma: Search flow

### 3. Login Page (`/login`)
- **File:** `src/app/login/page.tsx`
- **Status:** ✅ **Complete with Live Auth**
- **API Calls:** None (uses Firebase Auth)
- **Authentication:** N/A (this is the auth page)
- **Features:**
  - Google sign-in button
  - Shows current user info when logged in
  - Sign out functionality
  - Loading states
- **Notes:**
  - Uses Firebase Authentication via `AuthContext`
  - Matches Figma: Login flow

### 4. Procedure Detail Page (`/procedures/[...slug]`)
- **File:** `src/app/procedures/[...slug]/page.tsx`
- **Status:** ✅ **Complete with Live API**
- **API Calls:**
  - `getProcedureBySlug(slug)` - fetches procedure details
  - `getProcedureProviders(slug)` - fetches providers for procedure
- **Authentication:** Required (redirects to login if not authenticated)
- **Features:**
  - Displays procedure name, category, family
  - Shows best price, average price, price range, provider count
  - Lists all providers with prices and distances
  - Links to provider detail pages (`/providers/${provider_id}`)
  - Error handling if providers endpoint doesn't exist
  - Back to search navigation
- **Notes:**
  - Fully functional with live API
  - Handles catch-all slug routes (supports nested paths)
  - Matches Figma: Procedure Detail flow

### 5. Provider Detail Page - Single ID (`/providers/[id]`)
- **File:** `src/app/providers/[id]/page.tsx`
- **Status:** ⚠️ **Has Bug - Missing Import**
- **API Calls:** `getProviderDetail(providerId)` - **BUT MISSING IMPORT**
- **Authentication:** Required (redirects to login if not authenticated)
- **Features:**
  - Displays provider name, address, phone, email, website
  - Lists available procedures with prices
  - Links to procedure detail pages
  - Error handling
- **Notes:**
  - **BUG:** Line 44 calls `getProviderDetail()` but doesn't import it from `@/lib/api`
  - Should add: `import { getProviderDetail } from '@/lib/api';`
  - Matches Figma: Provider Detail flow (once bug is fixed)

### 6. Provider Detail Page - Catch-All (`/providers/[...id]`)
- **File:** `src/app/providers/[...id]/page.tsx`
- **Status:** ⚠️ **Uses Direct Fetch (Not API Helper)**
- **API Calls:** Direct `fetch()` to `${API_BASE_URL}/api/v1/providers/${providerId}`
- **Authentication:** Required (redirects to login if not authenticated)
- **Features:**
  - Same UI as `/providers/[id]` route
  - Direct API call instead of using `@/lib/api` helper
  - Handles catch-all ID routes (supports nested paths)
- **Notes:**
  - Has placeholder comment: "This endpoint may not exist yet in the backend. For now, we'll show a placeholder."
  - Should be consolidated with `/providers/[id]` or use the API helper function
  - Duplicate functionality with `/providers/[id]` route

---

## Summary Statistics

### Total Pages: **6**
- ✅ **Complete with Live API:** 3 pages (Search, Login, Procedure Detail)
- ⚠️ **Incomplete/Placeholder:** 1 page (Home)
- ⚠️ **Has Issues:** 2 pages (Provider Detail routes - missing import and duplicate)

### API Integration Status

| Page | API Status | Endpoint(s) Used |
|------|-----------|------------------|
| Home | ❌ No API | None |
| Search | ✅ Live API | `/api/v1/search` |
| Login | ✅ Live Auth | Firebase Auth |
| Procedure Detail | ✅ Live API | `/api/v1/search`, `/api/v1/procedures/{slug}/providers` |
| Provider Detail `[id]` | ⚠️ Live API (bug) | `/api/v1/providers/{id}` (missing import) |
| Provider Detail `[...id]` | ⚠️ Live API (direct) | `/api/v1/providers/{id}` (direct fetch) |

### Authentication Requirements

| Page | Auth Required | Redirect Behavior |
|------|--------------|-------------------|
| Home | ❌ No | None |
| Search | ✅ Yes | Redirects to `/login` |
| Login | N/A | Shows login/logout UI |
| Procedure Detail | ✅ Yes | Redirects to `/login` |
| Provider Detail `[id]` | ✅ Yes | Redirects to `/login` |
| Provider Detail `[...id]` | ✅ Yes | Redirects to `/login` |

---

## Issues & TODOs

### Critical Issues
1. **Missing Import in `/providers/[id]/page.tsx`**
   - Line 44 calls `getProviderDetail()` but doesn't import it
   - **Fix:** Add `import { getProviderDetail } from '@/lib/api';`

2. **Duplicate Provider Detail Routes**
   - Two routes handle provider details: `/providers/[id]` and `/providers/[...id]`
   - Both have similar functionality but different implementations
   - **Recommendation:** Consolidate into one route or clarify use case

### Incomplete Features
1. **Home Page (`/`)**
   - Currently just a placeholder
   - Needs full implementation per Figma design
   - Should include:
     - Hero section
     - Featured categories
     - Search CTA
     - Navigation to key features

2. **Provider Detail Route Consolidation**
   - `/providers/[...id]` uses direct fetch instead of API helper
   - Should use `getProviderDetail()` from `@/lib/api` for consistency

### Missing Pages (Per Figma Design Flows)
Based on typical healthcare platform flows, these pages may be missing:
- **Rewards Page** - Not found in codebase
- **Concierge Page** - Not found in codebase
- **Category Browse Page** - Not found (only search results)
- **Family Browse Page** - Not found (only search results)
- **Saved Searches Page** - Not found in codebase
- **User Profile/Dashboard** - Not found in codebase

---

## Route Groups & Special Routes

### Route Groups
- `(main)` - Contains `providers/[id]/ProviderDetailClient.tsx` (empty file, appears unused)

### Dynamic Routes
- `[...slug]` - Catch-all route for procedures (supports nested paths like `/procedures/mri/brain`)
- `[id]` - Single dynamic segment for provider IDs
- `[...id]` - Catch-all route for providers (supports nested paths)

---

## API Helper Functions Used

From `src/lib/api.ts`:
- ✅ `searchProcedures(query, location?, radius_miles?)` - Used in Search page
- ✅ `getProcedureBySlug(slug)` - Used in Procedure Detail page
- ✅ `getProcedureProviders(slug)` - Used in Procedure Detail page
- ✅ `getProviderDetail(providerId)` - **Defined but not imported in `/providers/[id]/page.tsx`**

---

## Navigation Structure

From `layout.tsx` navigation bar:
- **Home** → `/`
- **Search** → `/search`
- **Login** → `/login`

Internal navigation (from pages):
- Search → Procedure Detail (`/procedures/${slug}`)
- Procedure Detail → Provider Detail (`/providers/${id}`)
- Procedure Detail → Search (back link)
- Provider Detail → Procedure Detail (`/procedures/${slug}`)
- Provider Detail → Search (back link)

---

## Recommendations

1. **Fix Missing Import**
   - Add `getProviderDetail` import to `/providers/[id]/page.tsx`

2. **Consolidate Provider Routes**
   - Decide on single `[id]` vs catch-all `[...id]` route
   - Use consistent API helper functions

3. **Complete Home Page**
   - Implement full design per Figma
   - Add navigation to key features
   - Include hero section and CTAs

4. **Add Missing Pages**
   - Implement Rewards, Concierge, Category Browse, Saved Searches per Figma flows

5. **Add Error Boundaries**
   - Consider adding `error.tsx` files for better error handling

6. **Add Loading States**
   - Consider adding `loading.tsx` files for better UX

---

## Figma Design Flow Mapping

| Figma Flow | Route | Status |
|------------|-------|--------|
| Home | `/` | ⚠️ Placeholder |
| Search | `/search` | ✅ Complete |
| Procedure Detail | `/procedures/[...slug]` | ✅ Complete |
| Provider Detail | `/providers/[id]` or `/providers/[...id]` | ⚠️ Has issues |
| Login | `/login` | ✅ Complete |
| Rewards | ❌ Not found | ❌ Missing |
| Concierge | ❌ Not found | ❌ Missing |

---

*Last Updated: 2025-11-09 01:09:20*

