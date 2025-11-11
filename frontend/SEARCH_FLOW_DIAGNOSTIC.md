# Mario Frontend Search Flow Diagnostic

## Date: 2025-11-10

## Search for Navigation Patterns

### 1. Files with `/procedures?q=` Navigation

#### File: `frontend/src/app/home/page.tsx`
- **Line**: 92
- **Context**:
```typescript
55:  const handleSearch = async (query: string, suggestion?: any) => {
56:    if (!query || !query.trim()) {
57:      // Stay on home page if no query
58:      return;
59:    }
60:
61:    const trimmedQuery = query.trim();
62:    
63:    // Handle different suggestion types
64:    if (suggestion) {
65:      // Procedure - navigate to /home with procedure query param
66:      if (suggestion.procedureSlug) {
67:        router.push(`/home?procedure=${encodeURIComponent(suggestion.procedureSlug)}`);
68:        return;
69:      }
70:      
71:      // Doctor/Provider - navigate to provider detail page
72:      if (suggestion.doctor?.id) {
73:        router.push(`/providers/${suggestion.doctor.id}`);
74:        return;
75:      }
76:      
77:      // Medication - navigate to medications page
78:      if (suggestion.medication) {
79:        const medSlug = suggestion.medication.slug || suggestion.medication.name.toLowerCase().replace(/\s+/g, '-');
80:        router.push(`/medications/${medSlug}`);
81:        return;
82:      }
83:      
84:      // Specialty - navigate to doctors page filtered by specialty
85:      if (suggestion.specialty) {
86:        router.push(`/doctors?specialty=${encodeURIComponent(suggestion.specialty.id)}`);
87:        return;
88:      }
89:    }
90:    
91:    // Regular search - navigate to procedures page with query
92:    router.push(`/procedures?q=${encodeURIComponent(trimmedQuery)}`);
93:  };
```

#### File: `frontend/src/app/page.tsx`
- **Line**: 11
- **Context**:
```typescript
6:  export default function HomePage() {
7:    const router = useRouter()
8:
9:    const handleSearch = (query: string) => {
10:      if (query.trim()) {
11:        router.push(`/procedures?q=${encodeURIComponent(query)}`)
12:      } else {
13:        router.push('/procedures')
14:      }
15:    }
```

### 2. Files with `router.push('/procedures')` (without query)

#### File: `frontend/src/app/procedures/[slug]/ProcedureDetailClient.tsx`
- **Line**: 68
- **Context**:
```typescript
67:  const handleBack = () => {
68:    router.push('/procedures');
69:  };
```

#### File: `frontend/src/app/providers/[id]/ProviderDetailClient.tsx`
- **Line**: 106
- **Context**:
```typescript
104:                        <p className="text-gray-600">Provider not found.</p>
105:                        <button
106:                            onClick={() => router.push('/procedures')}
107:                            className="mt-4 inline-block text-blue-600 hover:text-blue-800"
108:                        >
109:                            ← Back to Procedures
110:                        </button>
```

#### File: `frontend/src/app/home/page.tsx`
- **Line**: 104
- **Context**:
```typescript
103:  const handleBrowseProcedures = () => {
104:    router.push('/procedures');
105:  };
```

#### File: `frontend/src/app/page.tsx`
- **Line**: 13
- **Context**:
```typescript
9:    const handleSearch = (query: string) => {
10:      if (query.trim()) {
11:        router.push(`/procedures?q=${encodeURIComponent(query)}`)
12:      } else {
13:        router.push('/procedures')
14:      }
15:    }
```

## Search Flow Analysis

### Component: `mario-smart-search.tsx`

#### When User Presses Enter:
- **Line**: 214-216 (no autocomplete shown)
- **Line**: 231-237 (with autocomplete shown)
- **Code**:
```typescript
212:  const handleKeyDown = (e: React.KeyboardEvent) => {
213:    if (!showAutocomplete || autocompleteSuggestions.length === 0) {
214:      if (e.key === 'Enter') {
215:        handleSearch(query);
216:      }
217:      return;
218:    }
219:
220:    switch (e.key) {
221:      // ... other cases ...
232:      case 'Enter':
233:        e.preventDefault();
234:        if (selectedIndex >= 0 && selectedIndex < autocompleteSuggestions.length) {
235:          handleAutocompleteSelect(autocompleteSuggestions[selectedIndex]);
236:        } else {
237:          handleSearch(query);
238:        }
239:        break;
240:    }
241:  };
```

- **Function Called**: `handleSearch(query)` (line 263-269)
- **Which Calls**: `onSearch(searchQuery.trim())` (line 268)
- **Navigation**: Depends on `onSearch` handler passed from parent

#### When User Clicks Autocomplete Suggestion:
- **Line**: 248-260
- **Code**:
```typescript
247:  // Handle autocomplete selection
248:  const handleAutocompleteSelect = (suggestion: AutocompleteSuggestion) => {
249:    setQuery(suggestion.primaryText);
250:    setShowAutocomplete(false);
251:    setSelectedIndex(-1);
252:    
253:    // Call the onSearch with the suggestion so App.tsx can route appropriately
254:    onSearch(suggestion.primaryText, suggestion);
255:    
256:    // Also call the dedicated callback if provided
257:    if (onAutocompleteSelect) {
258:      onAutocompleteSelect(suggestion);
259:    }
260:  };
```

- **Function Called**: `onSearch(suggestion.primaryText, suggestion)` (line 254)
- **Navigation**: Depends on `onSearch` handler passed from parent

### Component: `mario-home.tsx`

- **Line**: 354-357
- **Code**:
```typescript
353:          <div className="space-y-3">
354:            <MarioSmartSearch 
355:              onSearch={onSearch || ((query) => console.log('Search:', query))}
356:              autoFocus={!isReturningUser}
357:            />
```

- **Passes**: `onSearch` prop to `MarioSmartSearch`
- **Navigation**: Handled by parent component (`/app/home/page.tsx`)

## Diagnostic Table

| File | Function | Current Navigation Path | Expected Navigation Path | Issue |
|------|----------|----------------------|------------------------|-------|
| `frontend/src/app/home/page.tsx` | `handleSearch()` (line 92) | `/procedures?q=${query}` | `/home?procedure=${slug}` (for procedures) | ❌ **OUTDATED**: Regular search without suggestion routes to `/procedures?q=` instead of staying on `/home` |
| `frontend/src/app/page.tsx` | `handleSearch()` (line 11) | `/procedures?q=${query}` | `/home?procedure=${slug}` (for procedures) | ❌ **OUTDATED**: Landing page search routes to `/procedures?q=` instead of `/home` |
| `frontend/src/app/home/page.tsx` | `handleSearch()` (line 66-68) | `/home?procedure=${slug}` | `/home?procedure=${slug}` | ✅ **CORRECT**: Procedure suggestions route correctly |
| `frontend/src/components/mario-smart-search.tsx` | `handleSearch()` (line 263-269) | Calls `onSearch(query)` | Depends on parent | ✅ **CORRECT**: Component delegates to parent handler |
| `frontend/src/components/mario-smart-search.tsx` | `handleAutocompleteSelect()` (line 248-260) | Calls `onSearch(query, suggestion)` | Depends on parent | ✅ **CORRECT**: Component delegates to parent handler |
| `frontend/src/app/home/page.tsx` | `handleBrowseProcedures()` (line 104) | `/procedures` | `/procedures` | ✅ **CORRECT**: Browse button routes correctly |
| `frontend/src/app/procedures/[slug]/ProcedureDetailClient.tsx` | `handleBack()` (line 68) | `/procedures` | `/procedures` | ✅ **CORRECT**: Back button routes correctly |

## Summary

### Issues Found:

1. **`/app/home/page.tsx` line 92**: When user presses Enter without selecting an autocomplete suggestion, it routes to `/procedures?q=${query}` instead of staying on `/home` and showing provider results.

2. **`/app/page.tsx` line 11**: Landing page search routes to `/procedures?q=${query}` instead of `/home?procedure=${slug}` for procedure searches.

### Expected Behavior:

- When user searches for a procedure (e.g., "MRI") and presses Enter:
  - Should route to `/home?procedure=mri_brain` (or similar slug)
  - Should show provider results inline on `/home` page
  
- When user clicks a procedure autocomplete suggestion:
  - ✅ Already routes correctly to `/home?procedure=${slug}`

- When user searches for non-procedure items (doctors, medications, specialties):
  - ✅ Already routes correctly to respective pages

### Root Cause:

The `handleSearch()` function in `/app/home/page.tsx` has a fallback that routes to `/procedures?q=` when:
- No suggestion is provided (user presses Enter without selecting autocomplete)
- The query doesn't match any specific suggestion type

This fallback should instead:
- Try to match the query to a procedure (via API search)
- If a procedure is found, route to `/home?procedure=${slug}`
- If no procedure is found, show an error or stay on `/home` with empty results

