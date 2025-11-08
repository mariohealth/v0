# Frontend Page Map - Mario Health MVP

**Generated:** 2025-01-11  
**Project Path:** `/Users/az/Projects/mario-health/frontend`  
**Framework:** Next.js 14 (App Router)  
**Base Directory:** `/src/app/`  
**Architecture:** Behavioral Flow Map (Home ↔ Search ↔ Provider ↔ Concierge ↔ Health Hub ↔ Rewards)  
**Auth:** Firebase Auth (Google Sign-In)

---

## Route Structure Overview

| Route Path | File | Purpose / Intended Function | Auth Required | Status |
|------------|------|----------------------------|---------------|--------|
| `/` | `src/app/page.tsx` | Public Landing Page (Marketing) | ❌ No | ✅ Complete |
| `/home` | `src/app/home/page.tsx` | Authenticated Health Hub (Mario Home Dashboard) | ✅ Yes | ✅ Complete |
| `/search` | `src/app/search/page.tsx` | Authenticated Search + Procedure Results | ✅ Yes | ✅ Complete |
| `/procedures/[slug]` | `src/app/procedures/[slug]/page.tsx` | Procedure Detail (lists providers) | ✅ Yes | ✅ Complete |
| `/procedures/[...slug]` | `src/app/procedures/[...slug]/page.tsx` | Procedure Detail (catch-all route) | ✅ Yes | ✅ Complete |
| `/providers/[id]` | `src/app/providers/[id]/page.tsx` | Provider Detail V2 (Hero + Tabs + Sticky Footer + AI Concierge) | ✅ Yes | ✅ Complete |
| `/providers/[...id]` | `src/app/providers/[...id]/page.tsx` | Provider Detail (catch-all - **DEPRECATED**) | ✅ Yes | ⚠️ Deprecated |
| `/login` | `src/app/login/page.tsx` | Firebase Login (Google Sign-In) | ❌ No | ✅ Complete |
| `/rewards` | ❌ Not found | Rewards Placeholder Page | ✅ Yes | ⚠️ Placeholder Needed |
| `/concierge` | ❌ Not found | Concierge Requests Placeholder Page | ✅ Yes | ⚠️ Placeholder Needed |
| `/profile` | ❌ Not found | Profile Placeholder Page | ✅ Yes | ⚠️ Placeholder Needed |

---

## Layout & Special Files

| File | Purpose | Notes |
|------|---------|-------|
| `src/app/layout.tsx` | Root layout - wraps all pages | Contains navigation bar with links to Home, Search, Login. Wraps app with `AuthProvider`. |
| `src/app/globals.css` | Global styles | Tailwind CSS imports and global styles. |

---

## Detailed Page Analysis

### 1. Public Landing Page (`/`)
- **File:** `src/app/page.tsx`
- **Status:** ✅ **Complete**
- **Component:** `MarioLandingPage`
- **API Calls:** None
- **Authentication:** Not required (Public)
- **Features:**
  - Marketing landing page
  - Search CTA (redirects to `/search`)
  - Sign up / Login CTAs (redirects to `/login`)
  - Navigation to About, Transparency, Contact, Employers, Privacy pages
- **Notes:**
  - Uses `MarioLandingPage` component from `@/components/mario-landing-page`
  - Fully functional public landing page

### 2. Health Hub (`/home`)
- **File:** `src/app/home/page.tsx`
- **Status:** ✅ **Complete**
- **Component:** `MarioHome`
- **API Calls:** None (dashboard view)
- **Authentication:** Required (redirects to `/login` if not authenticated)
- **Features:**
  - Authenticated dashboard (Mario Home)
  - Search functionality
  - Browse Procedures CTA
  - Find Doctors CTA
  - Find Medication CTA
  - MarioCare CTA
  - AI Concierge integration (MarioAI modal)
  - Health Hub cards & CTAs
- **Notes:**
  - Uses `MarioHome` component from `@/components/mario-home`
  - Fully functional authenticated dashboard
  - Matches Figma: Health Hub flow

### 3. Search Page (`/search`)
- **File:** `src/app/search/page.tsx`
- **Status:** ✅ **Complete with Live API**
- **API Calls:** `searchProcedures(query)` from `@/lib/api`
- **Authentication:** Required (redirects to `/login` if not authenticated)
- **Features:**
  - Search input with submit handler
  - Displays search results with procedure name, category, family, prices, provider count
  - Links to procedure detail pages (`/procedures/${procedure_slug}`)
  - Error handling and loading states
  - Empty state when no results
- **Notes:**
  - Fully functional with live API integration
  - Uses Firebase auth token in API calls
  - Matches Figma: Search flow

### 4. Login Page (`/login`)
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

### 5. Procedure Detail Page (`/procedures/[slug]`)
- **File:** `src/app/procedures/[slug]/page.tsx`
- **Status:** ✅ **Complete with Live API**
- **Component:** `ProcedureDetailClient`
- **API Calls:**
  - `getProcedureBySlug(slug)` - fetches procedure details
  - `getProcedureProviders(slug)` - fetches providers for procedure
- **Authentication:** Required (redirects to `/login` if not authenticated)
- **Features:**
  - Displays procedure name, category, family
  - Shows best price, average price, price range, provider count
  - Lists all providers with prices and distances
  - Links to provider detail pages (`/providers/${provider_id}`)
  - Error handling if providers endpoint doesn't exist
  - Back to search navigation
- **Notes:**
  - Fully functional with live API
  - Uses Firebase auth token in API calls
  - Matches Figma: Procedure Detail flow

### 6. Procedure Detail Page - Catch-All (`/procedures/[...slug]`)
- **File:** `src/app/procedures/[...slug]/page.tsx`
- **Status:** ✅ **Complete with Live API**
- **Component:** `ProcedureDetailClient`
- **API Calls:** Same as `/procedures/[slug]`
- **Authentication:** Required
- **Features:**
  - Same functionality as `/procedures/[slug]`
  - Handles catch-all slug routes (supports nested paths)
- **Notes:**
  - Supports nested procedure paths
  - Uses same client component as single slug route

### 7. Provider Detail Page V2 (`/providers/[id]`)
- **File:** `src/app/providers/[id]/page.tsx`
- **Status:** ✅ **Complete with Live API**
- **Component:** `ProviderDetailClient`
- **API Calls:** `getProviderDetail(providerId)` from `@/lib/api`
- **Authentication:** Required (redirects to `/login` if not authenticated)
- **Features:**
  - V2 Unified Spec: Hero + Tabs + Sticky Footer + AI Concierge
  - Displays provider name, address, phone, email, website
  - Lists available procedures with prices
  - Links to procedure detail pages
  - Error handling
  - Supports `?from_procedure={slug}` query param for back navigation
- **Notes:**
  - Uses centralized API function with Firebase auth token
  - Follows V2 Provider Page specification
  - **Note:** Currently basic implementation; V2 Hero + Tabs + Sticky Footer + AI Concierge components may need to be added
  - Matches Figma: Provider Detail V2 flow

### 8. Provider Detail Page - Catch-All (`/providers/[...id]`)
- **File:** `src/app/providers/[...id]/page.tsx`
- **Status:** ⚠️ **DEPRECATED**
- **Notes:**
  - This route is deprecated in favor of `/providers/[id]`
  - Should be removed or consolidated
  - Currently uses direct fetch instead of API helper

### 9. Rewards Page (`/rewards`)
- **Status:** ⚠️ **Placeholder Needed**
- **Authentication:** Required
- **Notes:**
  - Page not yet created
  - Should display user rewards, points, achievements
  - Should integrate with rewards system

### 10. Concierge Page (`/concierge`)
- **Status:** ⚠️ **Placeholder Needed**
- **Authentication:** Required
- **Notes:**
  - Page not yet created
  - Should display concierge requests/booking history
  - Should integrate with AI Concierge system

### 11. Profile Page (`/profile`)
- **Status:** ⚠️ **Placeholder Needed**
- **Authentication:** Required
- **Notes:**
  - Page not yet created
  - Should display user profile, settings, preferences

---

## Key Components

### Core Components

| Component | File | Purpose | Used In |
|-----------|------|---------|---------|
| `MarioLandingPage` | `src/components/mario-landing-page.tsx` | Public landing page | `/` |
| `MarioHome` | `src/components/mario-home.tsx` | Authenticated Health Hub dashboard | `/home` |
| `MarioAIModal` | `src/components/mario-ai-modal.tsx` | AI Concierge modal (search/concierge/claims modes) | Various pages |
| `ProcedureDetailClient` | `src/app/procedures/[slug]/ProcedureDetailClient.tsx` | Procedure detail client component | `/procedures/[slug]`, `/procedures/[...slug]` |
| `ProviderDetailClient` | `src/app/providers/[id]/ProviderDetailClient.tsx` | Provider detail V2 client component | `/providers/[id]` |

### Provider V2 Components (Referenced in Docs)

| Component | Status | Purpose |
|-----------|--------|---------|
| `mario-provider-hospital-detail.tsx` | ⚠️ Not found | Provider detail V2 with Hero + Tabs + Sticky Footer |
| `mario-ai-booking-chat.tsx` | ⚠️ Not found | AI Concierge booking chat interface |
| `mario-ai-modal.tsx` | ✅ Exists | AI Concierge modal (general purpose) |

**Note:** Provider V2 components (`mario-provider-hospital-detail.tsx`, `mario-ai-booking-chat.tsx`) are referenced in documentation but not yet found in codebase. They may need to be created or integrated.

---

## Summary Statistics

### Total Pages: **11**
- ✅ **Complete with Live API:** 6 pages (Landing, Health Hub, Search, Login, Procedure Detail, Provider Detail)
- ⚠️ **Placeholder Needed:** 3 pages (Rewards, Concierge, Profile)
- ⚠️ **Deprecated:** 1 page (Provider Detail catch-all)
- ⚠️ **Duplicate Routes:** 2 procedure routes (both functional)

### API Integration Status

| Page | API Status | Endpoint(s) Used | Auth Token |
|------|-----------|------------------|------------|
| Landing (`/`) | ❌ No API | None | N/A |
| Health Hub (`/home`) | ❌ No API | None | N/A |
| Search | ✅ Live API | `/api/v1/search` | ✅ Yes |
| Login | ✅ Live Auth | Firebase Auth | N/A |
| Procedure Detail | ✅ Live API | `/api/v1/search`, `/api/v1/procedures/{slug}/providers` | ✅ Yes |
| Provider Detail | ✅ Live API | `/api/v1/providers/{id}` | ✅ Yes |
| Rewards | ❌ Not implemented | N/A | N/A |
| Concierge | ❌ Not implemented | N/A | N/A |
| Profile | ❌ Not implemented | N/A | N/A |

### Authentication Requirements

| Page | Auth Required | Redirect Behavior |
|------|--------------|-------------------|
| Landing (`/`) | ❌ No | None (Public) |
| Health Hub (`/home`) | ✅ Yes | Redirects to `/login` |
| Search | ✅ Yes | Redirects to `/login` |
| Login | N/A | Shows login/logout UI |
| Procedure Detail | ✅ Yes | Redirects to `/login` |
| Provider Detail | ✅ Yes | Redirects to `/login` |
| Rewards | ✅ Yes | Should redirect to `/login` |
| Concierge | ✅ Yes | Should redirect to `/login` |
| Profile | ✅ Yes | Should redirect to `/login` |

---

## API Helper Functions

From `src/lib/api.ts`:

| Function | Purpose | Used In | Auth Token |
|----------|--------|---------|------------|
| `searchProcedures(query, location?, radius_miles?)` | Search procedures | Search page | ✅ Yes |
| `getProcedureBySlug(slug)` | Get procedure details | Procedure Detail | ✅ Yes |
| `getProcedureProviders(slug)` | Get providers for procedure | Procedure Detail | ✅ Yes |
| `getProviderDetail(providerId)` | Get provider details | Provider Detail | ✅ Yes |

**All API functions:**
- Use Firebase auth token when user is authenticated (optional)
- Include comprehensive error logging
- Use centralized `fetchWithAuth` wrapper
- Use correct base URL from `NEXT_PUBLIC_API_URL` env variable

---

## Navigation Structure

### Public Navigation (from `layout.tsx`)
- **Home** → `/` (Public Landing)
- **Search** → `/search` (Auth required)
- **Login** → `/login`

### Authenticated Navigation Flow
1. **Landing (`/`)** → Search CTA → `/search`
2. **Landing (`/`)** → Sign Up/Login → `/login`
3. **Login (`/login`)** → After auth → `/home` (Health Hub)
4. **Health Hub (`/home`)** → Search → `/search`
5. **Search (`/search`)** → Procedure Result → `/procedures/[slug]`
6. **Procedure Detail (`/procedures/[slug]`)** → Provider → `/providers/[id]`
7. **Provider Detail (`/providers/[id]`)** → Procedure → `/procedures/[slug]`
8. **Provider Detail (`/providers/[id]`)** → AI Concierge → Opens `MarioAIModal`
9. **Health Hub (`/home`)** → Rewards → `/rewards` (placeholder needed)
10. **Health Hub (`/home`)** → Concierge → `/concierge` (placeholder needed)
11. **Health Hub (`/home`)** → Profile → `/profile` (placeholder needed)

### Internal Navigation (from pages)
- Search → Procedure Detail (`/procedures/${slug}`)
- Procedure Detail → Provider Detail (`/providers/${id}`)
- Procedure Detail → Search (back link)
- Provider Detail → Procedure Detail (`/procedures/${slug}`)
- Provider Detail → Search (back link)
- Provider Detail → Procedure Detail (via `?from_procedure={slug}` query param)

---

## Figma Flow Mapping

### Behavioral Flow Map
```
Home (/) → Login → Health Hub (/home) → Search (/search) → 
Procedure Detail (/procedures/[slug]) → Provider Detail (/providers/[id]) → 
AI Concierge (Modal) → Health Hub (/home) → Rewards (/rewards) → 
Concierge (/concierge) → Profile (/profile)
```

### Flow Status

| Figma Flow | Route | Status | Notes |
|------------|-------|--------|-------|
| Public Landing | `/` | ✅ Complete | Uses `MarioLandingPage` component |
| Login | `/login` | ✅ Complete | Firebase Auth with Google Sign-In |
| Health Hub | `/home` | ✅ Complete | Uses `MarioHome` component with dashboard |
| Search | `/search` | ✅ Complete | Live API with auth token |
| Procedure Detail | `/procedures/[slug]` | ✅ Complete | Live API with provider list |
| Provider Detail V2 | `/providers/[id]` | ✅ Complete | V2 spec (Hero + Tabs + Sticky Footer + AI Concierge) |
| AI Concierge | Modal (`MarioAIModal`) | ✅ Complete | Integrated via `mario-ai-modal.tsx` |
| Rewards | `/rewards` | ⚠️ Placeholder Needed | Page not yet created |
| Concierge | `/concierge` | ⚠️ Placeholder Needed | Page not yet created |
| Profile | `/profile` | ⚠️ Placeholder Needed | Page not yet created |

---

## Issues & TODOs

### Critical Issues
1. **Deprecated Provider Route**
   - `/providers/[...id]` route is deprecated
   - **Recommendation:** Remove or consolidate with `/providers/[id]`

2. **Missing Provider V2 Components**
   - `mario-provider-hospital-detail.tsx` referenced in docs but not found
   - `mario-ai-booking-chat.tsx` referenced in docs but not found
   - **Recommendation:** Create or integrate these components per V2 spec

### Incomplete Features
1. **Rewards Page (`/rewards`)**
   - Page not yet created
   - Should display user rewards, points, achievements
   - Should integrate with rewards system

2. **Concierge Page (`/concierge`)**
   - Page not yet created
   - Should display concierge requests/booking history
   - Should integrate with AI Concierge system

3. **Profile Page (`/profile`)**
   - Page not yet created
   - Should display user profile, settings, preferences

4. **Provider Detail V2 Full Implementation**
   - Current implementation is basic
   - Should fully implement V2 spec: Hero + Tabs + Sticky Footer + AI Concierge
   - May need to integrate `mario-provider-hospital-detail.tsx` component

### Recommendations
1. **Create Placeholder Pages**
   - Create `/rewards`, `/concierge`, `/profile` placeholder pages
   - Add authentication checks
   - Add navigation links from Health Hub

2. **Remove Deprecated Route**
   - Remove `/providers/[...id]` route
   - Consolidate functionality into `/providers/[id]`

3. **Integrate Provider V2 Components**
   - Create or integrate `mario-provider-hospital-detail.tsx`
   - Create or integrate `mario-ai-booking-chat.tsx`
   - Ensure full V2 spec compliance

4. **Add Error Boundaries**
   - Consider adding `error.tsx` files for better error handling

5. **Add Loading States**
   - Consider adding `loading.tsx` files for better UX

---

## Route Groups & Special Routes

### Route Groups
- `(main)` - Contains `providers/[id]/ProviderDetailClient.tsx` (used in provider detail page)

### Dynamic Routes
- `[slug]` - Single dynamic segment for procedure slugs
- `[...slug]` - Catch-all route for procedures (supports nested paths like `/procedures/mri/brain`)
- `[id]` - Single dynamic segment for provider IDs
- `[...id]` - Catch-all route for providers (deprecated, should be removed)

---

## Changes from Previous Version

### Added
- ✅ `/home` route (Authenticated Health Hub)
- ✅ `MarioHome` component integration
- ✅ `MarioLandingPage` component integration
- ✅ `MarioAIModal` component documentation
- ✅ Firebase auth token support in all API calls
- ✅ Comprehensive error logging in API functions
- ✅ Provider V2 specification documentation
- ✅ Figma Flow Mapping section

### Updated
- ✅ `/` route now uses `MarioLandingPage` (was placeholder)
- ✅ `/providers/[id]` now uses centralized API function (was missing import)
- ✅ All API calls now use `fetchWithAuth` wrapper with auth token support
- ✅ Improved error handling across all pages

### Removed/Deprecated
- ⚠️ `/providers/[...id]` marked as deprecated (should be removed)
- ❌ Removed references to old placeholder implementations

### Fixed
- ✅ Provider detail page now properly imports `getProviderDetail` from API module
- ✅ All API calls now use correct base URL from environment variable
- ✅ All API calls now include Firebase auth token when user is authenticated

---

*Last Updated: 2025-01-11*
