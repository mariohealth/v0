# Facility Detail Page Research - Pre-Implementation Analysis

**Date:** 2025-01-11  
**Commit:** c5a13b6 (facility-level search results)  
**Issue:** Clicking on facility/org card in procedure results doesn't open detail page

---

## 1. Routing + Navigation

### Where is the procedure results page route defined?

**Route:** `/procedures/[slug]`  
**File:** `frontend/src/app/procedures/[slug]/page.tsx`  
**Component:** `ProcedureDetailClient` (client component)  
**Framework:** Next.js 14 App Router

**Key Files:**
- `frontend/src/app/procedures/[slug]/page.tsx` - Server component wrapper
- `frontend/src/app/procedures/[slug]/ProcedureDetailClient.tsx` - Client component (actual implementation)

### What happens when user clicks a provider/org card in procedure results?

**Current Implementation:**

In `ProcedureDetailClient.tsx` (line 156-158):
```typescript
const handleOrgClick = (group: OrgGroup) => {
  router.push(`/providers/${group.org_id}`);
};
```

**The Problem:**
- Org cards navigate to `/providers/${org_id}` 
- But `/providers/[id]` route expects a **provider ID**, not an **org ID**
- The `ProviderDetailClient` component calls `getProviderDetail(providerId)` which expects a provider, not an organization
- This causes the error when clicking org cards

**Org Card Component:**
- `frontend/src/components/OrgCard.tsx` - Uses `onClick` prop
- Called from `ProcedureDetailClient.tsx` line 260: `onClick={() => handleOrgClick(group)}`

### What is the existing route for org/facility detail pages?

**❌ NO DEDICATED ORG/FACILITY ROUTE EXISTS**

**Current Routes:**
- `/providers/[id]` - For **individual providers** (Type-1 NPIs)
- `/procedures/[slug]` - Procedure detail with org list
- `/procedures/[slug]/orgs` - API endpoint (not a page route)

**Missing Route:**
- `/orgs/[id]` or `/facilities/[id]` - **DOES NOT EXIST**

### Do we already have a detail page component for org Type-2 NPIs?

**❌ NO**

**Existing Component:**
- `frontend/src/components/mario-provider-hospital-detail.tsx` - **EXISTS BUT NOT USED**
- Currently, `/providers/[id]` uses `ProviderDetailClient.tsx` which is designed for individual providers

**Note:** The `mario-provider-hospital-detail.tsx` component exists in the codebase but is not currently wired up to any route.

---

## 2. Org API Integration

### Where is the org API client/hook implemented?

**Current API Functions:**

1. **`getProcedureOrgs(procedureSlug)`** - Gets orgs for a procedure
   - File: `frontend/src/lib/api.ts` (line 519-578)
   - Endpoint: `GET /api/v1/procedures/{slug}/orgs`
   - Returns: `ProcedureOrgsResponse` with `Org[]` array

2. **`getProviderDetail(providerId)`** - Gets individual provider detail
   - File: `frontend/src/lib/api.ts` (line 753-819)
   - Endpoint: `GET /api/v1/providers/{provider_id}`
   - Returns: `ProviderDetail`

**❌ MISSING:**
- `getOrgDetail(orgId)` - **DOES NOT EXIST**
- No API function to fetch a single organization's details

### What fields does the org API return today?

**From `getProcedureOrgs()` API response:**

**Backend Model:** `ProcedureOrg` (from `backend/mario-health-api/app/models/procedure.py`)

```typescript
interface Org {
    org_id: string;              // ✅ Primary identifier
    org_name: string;
    carrier_name?: string;
    min_price: number | string;
    max_price?: number | string;
    avg_price?: number | string;
    savings?: string;
    distance_miles?: number;     // ✅ Computed in backend
    count_provider: number;
    in_network?: boolean;        // ✅ From backend
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
}
```

**Backend Response Fields (from `ProcedureOrg` model):**
- `procedure_id: str`
- `org_id: str` ⭐ **This is the identifier**
- `carrier_id: str`
- `carrier_name: str`
- `count_provider: int`
- `min_price: Decimal`
- `max_price: Decimal`
- `avg_price: Decimal`
- `org_name: str`
- `org_type: str`
- `address: str`
- `city: str`
- `state: str`
- `zip_code: str`
- `latitude: float`
- `longitude: float`
- `phone: str`

**Sample JSON Response Structure:**
```json
{
  "procedure_name": "MRI Scan – Brain",
  "procedure_slug": "brain-mri",
  "orgs": [
    {
      "org_id": "1184602872",
      "org_name": "City Medical Imaging Center",
      "carrier_name": "Blue Cross Blue Shield",
      "count_provider": 3,
      "min_price": 850,
      "max_price": 1200,
      "avg_price": 1025,
      "org_type": "Type-2",
      "address": "123 Medical Center Dr",
      "city": "San Francisco",
      "state": "CA",
      "zip_code": "94143",
      "latitude": 37.7749,
      "longitude": -122.4194,
      "phone": "(555) 123-4567"
    }
  ]
}
```

### How do we currently compute distance + in-network in the UI?

**Distance:**
- ✅ **Computed in backend** - `distance_miles` field comes from database query
- Backend uses PostGIS `ST_Distance()` function (see `backend/bigquery-to-postgres/config/sql/01_functions.sql`)
- Formula: `ST_Distance(search_location, org.location) * 0.000621371` (meters to miles)
- Passed through API response as `distance_miles` field

**In-Network:**
- ✅ **From backend** - `in_network` boolean field in API response
- Defaults to `true` if not specified (see `frontend/src/lib/api.ts` line 547)
- Displayed in UI via `Badge` component (see `OrgCard.tsx` line 108-110)

**Client-Side Computation:**
- ❌ **None** - All distance/network data comes from backend
- UI only formats and displays the values

---

## 3. Procedure Context

### How are procedures represented?

**Slug Format:**
- Procedures use **slugs** (e.g., `brain-mri`, `chest-x-ray-2-views`)
- Slug is URL-friendly version of procedure name

**Mapping:**
- **Slug → Display Name:** Handled in backend via `get_procedure_detail` RPC
- Frontend receives `procedure_name` and `procedure_slug` from API
- Example: `brain-mri` → `"MRI Scan – Brain"`

**Files:**
- `frontend/src/lib/api.ts` - `getProcedureBySlug()` function
- `backend/mario-health-api/app/services/procedure_service.py` - `get_procedure_by_slug()`

**Mock Data Example:**
```typescript
'brain-mri': {
    procedure_id: 'brain-mri',
    procedure_name: 'MRI Scan – Brain',
    procedure_slug: 'brain-mri',
    // ...
}
```

### How does the search results page know the procedure name?

**Current Flow:**
1. User navigates to `/procedures/[slug]`
2. `ProcedureDetailClient` extracts `slug` from URL params
3. Calls `getProcedureOrgs(slug)` API
4. API returns `procedure_name` in response
5. Component sets `procedureName` state (line 114)
6. Passed to `OrgCard` component as prop (line 251)

**Can we pass it into the detail route?**

✅ **YES** - Can use query params:
- Current: `/providers/${org_id}`
- Proposed: `/orgs/${org_id}?procedure=${procedureSlug}&procedureName=${procedureName}`

Or use Next.js route state (but requires client-side navigation).

---

## 4. Data Wiring + Caching

### Do we use React Query/SWR or plain fetch?

**✅ Plain `fetch()` - No React Query/SWR**

**Pattern:**
- All API calls use native `fetch()` API
- No caching layer
- No data synchronization library
- Each component manages its own state with `useState` + `useEffect`

**Example from `api.ts`:**
```typescript
export async function getProcedureOrgs(procedureSlug: string) {
    const url = `${getApiBaseUrl()}/procedures/${procedureSlug}/orgs`;
    const res = await fetch(url, { method: "GET" });
    // ... handle response
}
```

**No Hooks Found:**
- ❌ No `useQuery` (React Query)
- ❌ No `useSWR`
- ❌ No custom `useOrgDetail` hook

### What's the pattern for authenticated API calls?

**Current Pattern:**

**Public Endpoints (No Auth):**
- Simple `fetch(url, { method: "GET" })`
- No headers
- No Authorization token
- Examples: `getProcedureOrgs()`, `getProcedureBySlug()`

**Authenticated Endpoints (If Needed):**
- Would use `getAuthToken()` from `@/lib/api.ts`
- Function exists but not currently used for org/procedure endpoints
- Pattern: `fetch(url, { headers: { Authorization: `Bearer ${token}` } })`

**Note:** Current org/procedure endpoints are **public** and don't require auth.

---

## 5. UI + Component Reuse

### What shadcn/ui components are already in repo?

**Available Components** (`frontend/src/components/ui/`):
- ✅ `card.tsx` - Used in `OrgCard`
- ✅ `button.tsx` - Used extensively
- ✅ `badge.tsx` - Used for in-network badges
- ✅ `tabs.tsx` - Used in `ProviderDetailClient`
- ✅ `accordion.tsx` - Available
- ✅ `skeleton.tsx` - Available for loading states
- ✅ `dialog.tsx`, `sheet.tsx` - Available for modals
- ✅ `tabs.tsx` - Available
- ✅ `separator.tsx` - Available

**Mario-Specific Components:**
- ✅ `mario-badges.tsx` - `MarioPickBadge`, `SavingsBadge`, `MPSBadge`, `MarioPointsBadge`
- ✅ `OrgCard.tsx` - Reusable org card component
- ✅ `OrganizationCard.tsx` - Alternative org card (used in search page)

### Where are Mario's design tokens / global styles defined?

**Tailwind Config:**
- Colors defined via Tailwind utility classes
- Primary colors: `#2E5077` (dark blue), `#4DA1A9` (teal), `#79D7BE` (mint)

**Global Styles:**
- `frontend/src/app/globals.css` - Likely contains global styles
- Tailwind CSS with custom color classes

**Design Tokens (from code):**
- Primary: `#2E5077`
- Secondary: `#4DA1A9`
- Accent: `#79D7BE`
- Background: `#F8FAFC`

### Is there an existing "placeholder / skeleton / empty-state" component?

**Loading States:**
- ✅ `skeleton.tsx` - Available from shadcn/ui
- Current pattern: Simple `<p>Loading...</p>` text (see `ProcedureDetailClient.tsx` line 142-144)

**Empty States:**
- Current pattern: Simple text message (see `ProcedureDetailClient.tsx` line 233-235)
- No dedicated empty state component

**Error States:**
- Current pattern: Error message + Retry button (see `ProcedureDetailClient.tsx` line 225-231)

---

## 6. Build Constraints / Deployment

### What environment is this running on?

**Deployment:**
- ✅ **Firebase Hosting** (static hosting)
- ✅ **Next.js Static Export** (`output: 'export'` in production)

**Config File:** `frontend/next.config.mjs`

**Key Settings:**
```javascript
output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
images: { unoptimized: true },
trailingSlash: false,
```

### Are dynamic routes supported in current hosting config?

**✅ YES - With Limitations**

**Current Pattern:**
- Uses `generateStaticParams()` to pre-render routes
- `dynamicParams = true` allows runtime routes
- **BUT:** `dynamicParams` doesn't work with `output: 'export'` in production

**Current Workaround:**
- `ProviderDetailClient` extracts ID from URL pathname client-side (line 49-56)
- Falls back to URL parsing when params are 'placeholder'

**For Org Detail Route:**
- Need to follow same pattern as `/providers/[id]`
- Use `generateStaticParams()` with placeholder
- Extract `org_id` from URL client-side

---

## 7. Acceptance Checks

### List the exact URLs for:

**Procedure Results Page (Brain MRI):**
- URL: `/procedures/brain-mri`
- Route: `frontend/src/app/procedures/[slug]/page.tsx`
- Component: `ProcedureDetailClient`

**Org Detail Page Example:**
- ❌ **DOES NOT EXIST YET**
- Proposed: `/orgs/[org_id]` or `/facilities/[org_id]`
- Current broken flow: `/providers/[org_id]` (wrong route)

**Current Broken Flow:**
1. User on `/procedures/brain-mri`
2. Clicks org card
3. Navigates to `/providers/1184602872` (org_id)
4. ❌ **ERROR** - ProviderDetailClient expects provider, not org

### Confirm the "org identifier" used end-to-end

**Org Identifier: `org_id`**

**End-to-End Flow:**
1. **Database:** `procedure_org_pricing.org_id` (string, e.g., `"1184602872"`)
2. **Backend API:** `ProcedureOrg.org_id` (str)
3. **Frontend API:** `Org.org_id` (string)
4. **UI Component:** `OrgGroup.org_id` (string)
5. **Navigation:** `router.push(\`/providers/${group.org_id}\`)` ⚠️ **WRONG ROUTE**

**Note:** `org_id` appears to be an NPI (National Provider Identifier) for Type-2 organizations.

**Type-2 NPI:**
- Organizations/facilities have Type-2 NPIs
- Individual providers have Type-1 NPIs
- Current code checks `npi_type === "type2"` in some places (see `api.ts` line 497)

---

## 8. Summary & Recommendations

### What Needs to Be Built

1. **New Route:** `/orgs/[id]` or `/facilities/[id]`
   - File: `frontend/src/app/orgs/[id]/page.tsx`
   - Component: `OrgDetailClient.tsx`

2. **New API Function:** `getOrgDetail(orgId: string)`
   - File: `frontend/src/lib/api.ts`
   - Endpoint: `GET /api/v1/orgs/{org_id}` (needs backend implementation)

3. **Backend Endpoint:** `GET /api/v1/orgs/{org_id}`
   - File: `backend/mario-health-api/app/api/v1/endpoints/orgs.py` (new file)
   - Service: `OrgService.get_org_detail(org_id)`

4. **Fix Navigation:** Update `handleOrgClick` in `ProcedureDetailClient.tsx`
   - Change from: `router.push(\`/providers/${group.org_id}\`)`
   - Change to: `router.push(\`/orgs/${group.org_id}\`)`

### Key Findings

- ✅ Procedure results page exists and works
- ✅ Org API returns org data with `org_id`
- ✅ Distance and in-network computed in backend
- ❌ No org detail page exists
- ❌ No org detail API endpoint exists
- ❌ Navigation goes to wrong route (`/providers/` instead of `/orgs/`)
- ✅ Static export pattern established (can reuse from `/providers/[id]`)

### Next Steps

1. Create backend org detail endpoint
2. Create frontend API function `getOrgDetail()`
3. Create `/orgs/[id]` route and component
4. Update `handleOrgClick` to navigate to `/orgs/[id]`
5. Pass procedure context via query params if needed

