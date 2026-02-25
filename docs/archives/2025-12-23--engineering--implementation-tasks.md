# Mario Health Implementation Tasks

## Phase 0: Emergency Search & Routing Fixes [COMPLETED]
- [x] **Restore Autocomplete Functionality**
    - [x] Implement local fallbacks for "knee", "mri", "colonoscopy" in `lib/api.ts`
    - [x] Merge API results with local suggestions in `mario-smart-search.tsx`
    - [x] Prioritize procedure results in suggestions
- [x] **Fix Search Routing & Behavior**
    - [x] Ensure `/doctors/?procedure=xxx` redirects to procedure pricing as per requirement
    - [x] Fix navigation from autocomplete to correct detail pages
    - [x] Correctly handle `UnifiedResult` (Doctor vs Procedure) in Search results
- [x] **Code Health & Type Safety**
    - [x] Resolve lint errors in `mario-smart-search.tsx` and `mario-autocomplete-enhanced.tsx`
    - [x] Define and export `Doctor` interface in `mario-doctors-data.ts`
    - [x] Implement `getSpecialties` in `lib/api.ts`

## Week 1: Internal QA (Dec 23-29) - COMPLETED
- [x] Task 1.1: Fix Provider Routing Bug <!-- id: 0 -->
- [x] Task 1.2: Add Price Display to Search Results <!-- id: 5 -->
- [x] Task 2.1: Frontend Organization Grouping <!-- id: 7 -->
- [x] Task 2.2: Remove Mock Data <!-- id: 8 -->
- [x] Task 3.1: Add Mario Price Score (MPS) badge to cards <!-- id: 9 -->
- [x] Task 4.1: Improve Doctor Search filter UI <!-- id: 11 -->
- [x] Fix Prerender errors (Suspense boundaries) <!-- id: 13 -->
- [x] **Search Data & UX Restoration**
    - [x] Refactor `api.ts` with real API placeholders and types
    - [x] Remove 3-result limit in `mario-smart-search.tsx`
    - [x] Remove all fake doctor data from `mario-doctors-data.ts`
    - [x] Handle doctor/specialty results from API in autocomplete mapping
    - [x] Ensure "cardiology" routes correctly to provider results (even when API is empty)


## Week 2: Insurance & Costs (Dec 30-Jan 5)
...

