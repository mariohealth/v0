# Search Result Restoration and UX Fix

This plan details how to restore the search autocomplete functionality that was affected by the recent cleanup, specifically addressing the doctor result limits and the mapping of API results.

## Proposed Changes

### [Logic and Data]

#### [MODIFY] [mario-doctors-data.ts](file:///Users/az/Projects/mario-health/frontend/src/lib/data/mario-doctors-data.ts)
- Empty the `doctors` array to remove all fake doctors (e.g., Dr. Angela Patel).
- Keep interfaces and `specialties` list for UI navigation, but mark them for future API replacement.
- Ensure helper functions like `getSpecialtyById` return empty data safely.

#### [MODIFY] [api.ts](file:///Users/az/Projects/mario-health/frontend/src/lib/api.ts)
- Add a placeholder `searchSpecialties` function that is ready for a real backend endpoint.
- Ensure `searchProcedures` (the main search entrance) handles empty results without falling back to local fake doctors.

### [Frontend Components]

#### [MODIFY] [mario-smart-search.tsx](file:///Users/az/Projects/mario-health/frontend/src/components/mario-smart-search.tsx)
- Remove all local doctor/medication fallback paths that pollute the results with fake data.
- Update mapping logic to prioritize API-returned `doctor` and `procedure` results.
- Implement clear "Loading" and "No Results" visual states.


## Verification Plan

### Automated Tests (Manual Verification via Browser)
1. **Search for "Cardiology"**:
   - Verify that more than 3 doctors are shown in the suggestions.
   - Verify that clicking a doctor routes to the provider profile.
   - Verify that the "Cardiology" specialty card appears and routes to the doctors page with the correct specialty filter.

2. **Search for "Brain"**:
   - Verify that "MRI - Brain" appears as a procedure suggestion.

3. **Search for "Blood"**:
   - Verify that "Blood Test – Basic Panel" or similar appears as a procedure suggestion.

### Manual Verification
- I will use the browser subagent to record and confirm that searching for "cardiology" now yields a comprehensive list of doctors and that the "3 doctor limit" is gone.
