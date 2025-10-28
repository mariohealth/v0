# API Integration Summary

This document summarizes the changes needed to update page components to use the real backend API.

## Files Created

### 1. `frontend/lib/backend-api.ts`
- New API client for backend integration
- Provides: `getCategories()`, `getFamiliesByCategory()`, `getProceduresByFamily()`
- Automatic snake_case → camelCase transformation
- Built-in analytics tracking and CORS error detection

### 2. `frontend/lib/analytics.ts`
- Performance monitoring for API calls
- Tracks response times, errors, and slow requests
- Exports: `trackApiCall()`, `trackError()`, `getApiPerformanceStats()`

## Files Updated

### 1. `frontend/app/page.tsx` (Homepage) ✅
**Changes:**
- Removed: `import { MOCK_CATEGORIES } from '@/lib/mock-data'`
- Added: `import { getCategories, type Category } from '@/lib/backend-api'`
- Updated `fetchCategories()` to use real API: `GET /api/v1/categories`
- Changed `category.icon` to `category.emoji`
- Changed `category.procedureCount` to `category.familyCount`

## Remaining Files to Update

### 2. `frontend/app/search/page.tsx`
**Current State:**
- Uses `mockProviders` from `@/lib/mockData`
- Filters mock data client-side

**Needed Changes:**
```typescript
// Remove:
import { mockProviders, filterProviders, Provider } from '@/lib/mock-data';

// Add:
import { searchProcedures } from '@/lib/backend-api';

// Replace fetch logic:
const results = await searchProcedures(query, zip, radius);
```

**Endpoint:** `GET /api/v1/search?q={query}&zip={zip}&radius={radius}`

**Note:** Search returns procedures, not providers. UI may need adjustment.

---

### 3. `frontend/app/category/[slug]/page.tsx`
**Current State:**
- Uses `mockApi.getFamilies(categorySlug)`
- Fetches from `MOCK_CATEGORIES`

**Needed Changes:**
```typescript
// Remove:
import { mockApi, type ProcedureFamily, type Category, MOCK_CATEGORIES } from '@/lib/mock-data';

// Add:
import { getFamiliesByCategory, type Family } from '@/lib/backend-api';

// Replace fetch logic:
const data = await getFamiliesByCategory(categorySlug);
setCategory({ slug: data.categorySlug }); // Simplified
setFamilies(data.families);
```

**Endpoint:** `GET /api/v1/categories/{slug}/families`

**Type Changes:**
- `ProcedureFamily` → `Family`
- Backend doesn't return full category object, may need separate fetch

---

### 4. `frontend/app/family/[slug]/page.tsx`
**Current State:**
- Uses `mockApi.getFamilyBySlug(slug)` and `mockApi.getProcedures(slug)`
- References `MOCK_CATEGORIES` for breadcrumbs

**Needed Changes:**
```typescript
// Remove:
import { mockApi, type ProcedureFamily, type Procedure, MOCK_CATEGORIES } from '@/lib/mock-data';

// Add:
import { getProceduresByFamily, type Family, type Procedure } from '@/lib/backend-api';

// Replace fetch logic:
const data = await getProceduresByFamily(slug);
setFamily({ slug: data.familySlug, name: data.familyName }); // Simplified
setProcedures(data.procedures);
```

**Endpoint:** `GET /api/v1/families/{slug}/procedures`

**Type Changes:**
- `Procedure.category` → Need to fetch category separately
- `ProcedureFamily` → `Family`

---

### 5. `frontend/app/procedure/[id]/page.tsx`
**Current State:**
- Uses `getProcedureById(procedureId)` from mock data
- Uses `getQuotesForProcedure(procedureId)` from mock data

**Needed Changes:**
```typescript
// Remove:
import { getProcedureById, getQuotesForProcedure, MOCK_CATEGORIES, type Procedure, type PriceQuote } from '@/lib/mock-data';

// Add backend API call (needs implementation):
// API endpoint: GET /api/v1/procedures/{slug}
// Note: Backend uses slug, not ID. Need to map or update routing.
```

**Endpoint:** `GET /api/v1/procedures/{slug}` (needs to be added to backend-api.ts)

**Major Changes Needed:**
1. Procedure lookup by slug instead of ID
2. Provider quotes API not implemented yet
3. Price visualization may need adjustment for backend data structure

---

## Type Mapping Reference

### Backend (snake_case) → Frontend (camelCase)

```typescript
// Categories
{
  id: string;
  name: string;
  slug: string;
  emoji: string;           // "icon" in mock
  description: string;
  family_count: number;   // "procedureCount" in mock
}

// Families
{
  id: string;
  name: string;
  slug: string;
  description: string;
  procedure_count: number;
}

// Procedures
{
  id: string;
  name: string;
  description: string;
  min_price: number;
  max_price: number;
  avg_price: number;
  price_count: number;
}
```

## Testing Checklist

After updating each page, test:

- [ ] Homepage: Categories load from API
- [ ] Category page: Families load for selected category
- [ ] Family page: Procedures load for selected family
- [ ] Search page: Search results display
- [ ] Error handling: Shows proper error messages
- [ ] Loading states: Spinner appears during fetch
- [ ] Empty states: Shows "no results" message when applicable

## Environment Variables

Ensure these are set in `.env.local`:

```bash
NEXT_PUBLIC_API_URL=https://mario-health-api-72178908097.us-central1.run.app
NEXT_PUBLIC_USE_MOCK_API=false  # Not used yet, but should be implemented
```

## Common Issues

1. **CORS Errors**: Backend needs to allow frontend domain
2. **404 Errors**: Check endpoint paths match backend exactly
3. **Type Mismatches**: Ensure snake_case is transformed to camelCase
4. **Missing Data**: Backend may not return all fields from mock data

## Next Steps

1. Update remaining page components (search, category, family, procedure)
2. Implement remaining API client functions (procedure detail, search)
3. Add error boundaries for API failures
4. Test all pages with real backend
5. Handle data structure differences between mock and real API
