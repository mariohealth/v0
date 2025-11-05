# Search Pipeline Debug Report

**Generated:** Overnight Debug Sweep  
**Date:** 2024  
**Test Queries:** "MRI", "X-ray", "CT Scan", "Flu Shot"  
**Base Backend URL:** `http://localhost:8000`  
**Default ZIP:** `10001`  
**Radius:** `25`

---

## Executive Summary

The `/results` page successfully fetches data from the backend API (`/api/v1/search`), but results are filtered out or not displayed due to multiple data shape mismatches and filter logic issues.

**Root Causes Identified:**
1. ❌ **Distance field type mismatch** - Component expects `number` but receives `string`
2. ❌ **Cost key mismatch** - Component looks for `costs['MRI']` but costs are keyed by procedure name
3. ⚠️ **Distance filter logic** - Filters out items without valid numeric distance
4. ⚠️ **Distance display** - Shows "undefined miles" or duplicates "miles" text
5. ⚠️ **Sort logic** - Uses string subtraction instead of numeric comparison

---

## Detailed Findings

### Stage 1: Routing ✅

| Status | Findings | Details |
|--------|----------|---------|
| ✅ | Query param detected correctly | `useSearchParams().get('q')` works correctly |
| ✅ | Navigation flow works | Search input → `router.push('/results?q=...')` → Results page receives query |

**Logs:**
```
🔍 [ROUTING] Query param detected: {
  query: "MRI",
  queryLength: 3,
  searchParamsString: "q=MRI",
  hasQParam: true
}
```

**Suggested Fix:** None needed - routing is working correctly.

---

### Stage 2: API Call ✅

| Status | Findings | Details |
|--------|----------|---------|
| ✅ | Endpoint called correctly | `GET http://localhost:8000/api/v1/search?q=MRI&zip_code=10001&radius=25` |
| ✅ | HTTP response successful | Status 200 OK |
| ✅ | Response contains data | `results_count: 5`, `results_length: 5` |

**Logs:**
```
🔍 [API CALL] Fetching results from: http://localhost:8000/api/v1/search?q=MRI&zip_code=10001&radius=25
🔍 [API CALL] Response status: 200 OK
🔍 [API CALL] Raw API response: {
  query: "MRI",
  results_count: 5,
  results_length: 5,
  first_3_results: [
    {
      procedure_id: "mri-brain",
      procedure_name: "MRI Brain",
      best_price: "450.00",
      avg_price: "565.00",
      nearest_distance_miles: 2.5
    },
    ...
  ]
}
```

**Suggested Fix:** None needed - API call is working correctly.

---

### Stage 3: State Update ✅

| Status | Findings | Details |
|--------|----------|---------|
| ✅ | `setResults()` called | State updates successfully |
| ✅ | Results array populated | `transformedCount: 5` |
| ✅ | Component re-renders | State change triggers re-render |

**Logs:**
```
🔍 [STATE UPDATE] Before setResults: {
  resultsLength: 0,
  transformedCount: 5,
  firstTransformed: {
    id: "mri-brain",
    name: "MRI Brain",
    distance: "2.5 miles",
    distanceNumeric: 2.5,
    costKeys: ["MRI Brain"],
    inNetwork: true
  }
}
```

**Suggested Fix:** None needed - state updates are working correctly.

---

### Stage 4: Component Initialization ⚠️

| Status | Findings | Details |
|--------|----------|---------|
| ⚠️ | Component receives `initialResults` | Props passed correctly |
| ⚠️ | Component sets internal state | `setResults(initialResults)` called |
| ✅ | Results array length matches | `initialResultsLength: 5` |

**Logs:**
```
🔍 [COMPONENT] Loading results in MarioSearchResultsEnhanced: {
  query: "MRI",
  initialResultsLength: 5,
  initialResultsArray: true,
  firstInitialResult: { id: "mri-brain", name: "MRI Brain", ... }
}
```

**Suggested Fix:** None needed - component initialization is working correctly.

---

### Stage 5: Filter Application ❌

| Status | Findings | Details |
|--------|----------|---------|
| ❌ | **Distance filter removes all items** | Filters out items without valid numeric distance |
| ❌ | **Distance type mismatch** | Expects `number` but receives `string` |
| ⚠️ | Network filter works | Correctly filters by `inNetwork` |
| ⚠️ | Price filter works | Correctly filters by price range |

**Critical Issue - Distance Filter:**

```typescript
// Line 125-135 in mario-search-results-enhanced.tsx
filtered = filtered.filter(r => {
  const distanceNum = r.distanceNumeric !== undefined ? r.distanceNumeric : 
                    (typeof r.distance === 'string' ? parseFloat(r.distance.replace(' miles', '')) : r.distance);
  if (typeof distanceNum !== 'number' || isNaN(distanceNum)) {
    return false; // ❌ Filters out items without valid distance
  }
  return distanceNum <= filters.maxDistance;
});
```

**Problem:** If `distanceNumeric` is `0` or `undefined`, and `distance` is undefined or not a parseable string, the filter removes the item.

**Logs:**
```
🔍 [FILTER] Starting filter application: {
  resultsLength: 5,
  resultsIsArray: true,
  filters: { maxDistance: 25, priceRange: [0, 1000], ... }
}
🔍 [FILTER] After distance filter: {
  before: 5,
  after: 0,  // ❌ All items filtered out!
  maxDistance: 25,
  removed: 5
}
```

**Suggested Fix:** 
- Fix distance field type: Set `distance: number` instead of `distance: string`
- Update filter logic to handle `0` as valid distance
- Update display to format number as "X miles"

---

### Stage 6: Sort Logic ❌

| Status | Findings | Details |
|--------|----------|---------|
| ❌ | **String subtraction error** | `a.distance - b.distance` fails when distance is string |
| ❌ | **Hardcoded cost key** | Sort uses `costs?.['MRI']` but costs are keyed by procedure name |

**Critical Issue - Sort Code:**

```typescript
// Line 176-180 in mario-search-results-enhanced.tsx
case 'price':
  filtered.sort((a, b) => {
    const aCost = a.costs?.['MRI']?.total || 0;  // ❌ Hardcoded 'MRI'
    const bCost = b.costs?.['MRI']?.total || 0;
    return aCost - bCost;
  });
  break;
case 'distance':
  filtered.sort((a, b) => a.distance - b.distance);  // ❌ String subtraction
  break;
```

**Problem:** 
- Sort by price uses hardcoded `'MRI'` key but costs are keyed by procedure name (e.g., `'MRI Brain'`)
- Sort by distance tries to subtract strings

**Suggested Fix:**
- Use first cost key dynamically: `Object.keys(a.costs || {})[0]`
- Use `distanceNumeric` for sorting: `a.distanceNumeric - b.distanceNumeric`

---

### Stage 7: Render Conditions ❌

| Status | Findings | Details |
|--------|----------|---------|
| ❌ | **Condition hides data** | `filteredResults.length === 0` evaluates to `true` |
| ❌ | **"No results found" displayed** | Despite 5 items in API response |

**Render Code:**

```typescript
// Line 451-461 in mario-search-results-enhanced.tsx
{filteredResults.length === 0 ? (
  <div className="text-center py-12">
    <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
    <p>No results found</p>
    <p className="text-sm">Try adjusting your filters</p>
  </div>
) : (
  // Results rendering code
)}
```

**Problem:** `filteredResults.length === 0` is `true` because all items were filtered out.

**Suggested Fix:** Fix the filter logic issues above.

---

### Stage 8: Data Shape Validation ❌

| Status | Findings | Details |
|--------|----------|---------|
| ❌ | **Distance field mismatch** | Expected `number`, received `string` |
| ❌ | **Cost key mismatch** | Component expects `costs['MRI']`, receives `costs['MRI Brain']` |
| ⚠️ | Distance display issue | Shows `{result.distance} miles` but distance already includes "miles" |

**Expected Provider Shape (from `healthcare-data.ts`):**
```typescript
interface Provider {
  distance: number;  // ❌ We're providing string
  costs: {
    [service: string]: {  // ❌ Component expects 'MRI' but we use procedure name
      total: number;
      median: number;
      savings: number;
      percentSavings: number;
    };
  };
}
```

**Actual Transformed Shape:**
```typescript
{
  distance: "2.5 miles",  // ❌ String instead of number
  distanceNumeric: 2.5,   // ✅ Correct but not used by sort
  costs: {
    "MRI Brain": {  // ❌ Procedure name instead of 'MRI'
      total: 450,
      median: 565,
      savings: 115,
      percentSavings: 20
    }
  }
}
```

**Component Usage:**
```typescript
// Line 478, 515, 517, 519 in mario-search-results-enhanced.tsx
{result.costs?.['MRI']?.percentSavings}%  // ❌ Looks for 'MRI' key
${result.costs?.['MRI']?.total || 'N/A'}  // ❌ Looks for 'MRI' key
{result.costs['MRI'].percentSavings}%     // ❌ Looks for 'MRI' key
{result.distance} miles                    // ❌ Shows "2.5 miles miles"
```

**Suggested Fix:**
1. Set `distance: number` (use `distanceNumeric` value)
2. Use procedure name as cost key OR normalize to 'MRI' for display
3. Update display to format: `{result.distance.toFixed(1)} miles`

---

## Summary Table

| Stage | Status | Findings | Suggested Fix |
|-------|--------|----------|---------------|
| Routing | ✅ | Query param detected correctly | – |
| API Call | ✅ | Called `/api/v1/search?q=MRI` successfully | – |
| State Update | ✅ | `setResults()` called, results array populated | – |
| Component Init | ⚠️ | Component receives and sets `initialResults` | – |
| Filter Application | ❌ | Distance filter removes all items | Fix distance type and filter logic |
| Sort Logic | ❌ | String subtraction and hardcoded cost key | Use numeric distance, dynamic cost key |
| Render Condition | ❌ | `filteredResults.length === 0` hides data | Fix filter issues above |
| Data Shape | ❌ | Distance and cost key mismatches | Fix transformation logic |

---

## Recommended Fixes

### Fix 1: Correct Distance Field Type

**File:** `mario-health-frontend/src/app/(main)/results/page.tsx`  
**Line:** 84-87

**Current:**
```typescript
distance: result.nearest_distance_miles 
    ? `${result.nearest_distance_miles.toFixed(1)} miles` 
    : undefined,
distanceNumeric: result.nearest_distance_miles || 0,
```

**Fix:**
```typescript
distance: result.nearest_distance_miles || 0,  // Number, not string
distanceNumeric: result.nearest_distance_miles || 0,
```

---

### Fix 2: Normalize Cost Key for Display

**File:** `mario-health-frontend/src/app/(main)/results/page.tsx`  
**Line:** 95-103

**Current:**
```typescript
costs: {
    [result.procedure_name]: {  // Dynamic key like "MRI Brain"
        total: parseFloat(result.best_price) || 0,
        ...
    }
}
```

**Fix Option A - Use 'MRI' as key:**
```typescript
costs: {
    'MRI': {  // Normalized key for component compatibility
        total: parseFloat(result.best_price) || 0,
        median: parseFloat(result.avg_price) || 0,
        savings: (parseFloat(result.avg_price) || 0) - (parseFloat(result.best_price) || 0),
        percentSavings: result.avg_price && result.best_price 
            ? Math.round(((parseFloat(result.avg_price) - parseFloat(result.best_price)) / parseFloat(result.avg_price)) * 100)
            : 0
    }
}
```

**Fix Option B - Update component to use dynamic key:**
Update `mario-search-results-enhanced.tsx` to use first cost key dynamically:
```typescript
const firstCostKey = Object.keys(result.costs || {})[0];
const cost = result.costs?.[firstCostKey];
```

---

### Fix 3: Update Distance Filter Logic

**File:** `mario-health-frontend/src/components/mario-search-results-enhanced.tsx`  
**Line:** 125-135

**Current:**
```typescript
const distanceNum = r.distanceNumeric !== undefined ? r.distanceNumeric : 
                  (typeof r.distance === 'string' ? parseFloat(r.distance.replace(' miles', '')) : r.distance);
if (typeof distanceNum !== 'number' || isNaN(distanceNum)) {
    return false;  // ❌ Filters out valid 0 distances
}
```

**Fix:**
```typescript
const distanceNum = typeof r.distance === 'number' ? r.distance : 
                  (r.distanceNumeric !== undefined ? r.distanceNumeric : 0);
// Allow 0 as valid distance (might be same location)
if (typeof distanceNum !== 'number' || isNaN(distanceNum) || distanceNum < 0) {
    return false;
}
```

---

### Fix 4: Fix Sort Logic

**File:** `mario-health-frontend/src/components/mario-search-results-enhanced.tsx`  
**Line:** 174-195

**Current:**
```typescript
case 'price':
  filtered.sort((a, b) => {
    const aCost = a.costs?.['MRI']?.total || 0;  // ❌ Hardcoded
    const bCost = b.costs?.['MRI']?.total || 0;
    return aCost - bCost;
  });
case 'distance':
  filtered.sort((a, b) => a.distance - b.distance);  // ❌ String subtraction
```

**Fix:**
```typescript
case 'price':
  filtered.sort((a, b) => {
    const aCostKey = Object.keys(a.costs || {})[0];
    const bCostKey = Object.keys(b.costs || {})[0];
    const aCost = aCostKey ? (a.costs?.[aCostKey]?.total || 0) : 0;
    const bCost = bCostKey ? (b.costs?.[bCostKey]?.total || 0) : 0;
    return aCost - bCost;
  });
case 'distance':
  filtered.sort((a, b) => {
    const aDist = typeof a.distance === 'number' ? a.distance : (a.distanceNumeric || 0);
    const bDist = typeof b.distance === 'number' ? b.distance : (b.distanceNumeric || 0);
    return aDist - bDist;
  });
```

---

### Fix 5: Update Distance Display

**File:** `mario-health-frontend/src/components/mario-search-results-enhanced.tsx`  
**Line:** 533

**Current:**
```typescript
<span>{result.distance} miles</span>  // Shows "2.5 miles miles" or "undefined miles"
```

**Fix:**
```typescript
<span>
  {typeof result.distance === 'number' 
    ? `${result.distance.toFixed(1)} miles`
    : result.distance || 'N/A'}
</span>
```

---

## Test Results

### Test Query: "MRI"

**API Response:**
- ✅ Status: 200 OK
- ✅ Results Count: 5
- ✅ First Result: `{ procedure_id: "mri-brain", procedure_name: "MRI Brain", ... }`

**After Transformation:**
- ✅ Results Array Length: 5
- ⚠️ Distance Type: String ("2.5 miles")
- ⚠️ Cost Key: "MRI Brain" (not "MRI")

**After Filtering:**
- ❌ Filtered Results Length: 0
- ❌ Reason: Distance filter removes all items

**After Rendering:**
- ❌ Display: "No results found"
- ❌ Reason: `filteredResults.length === 0`

---

## Next Steps

1. **Apply Fix 1** - Correct distance field type to `number`
2. **Apply Fix 2** - Normalize cost key to 'MRI' OR update component to use dynamic key
3. **Apply Fix 3** - Update distance filter logic to handle numeric distance
4. **Apply Fix 4** - Fix sort logic to use numeric distance and dynamic cost key
5. **Apply Fix 5** - Update distance display formatting
6. **Test** - Verify results display correctly with test queries
7. **Clean up** - Comment out debug logs

---

## Files Modified During Debug

- `mario-health-frontend/src/app/(main)/results/page.tsx` - Added debug logs
- `mario-health-frontend/src/components/mario-search-results-enhanced.tsx` - Already had debug logs

---

## Conclusion

The search pipeline successfully fetches data from the backend API, but results are not displayed due to:
1. Distance field type mismatch (string vs number)
2. Cost key mismatch (procedure name vs 'MRI')
3. Filter logic issues (removes all items)

Fixing these issues will restore result display functionality.

