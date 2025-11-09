# Home Search v1 - Mock Data Archive

**Archive Date:** November 10, 2024

**Context:** This archive contains mock data that was previously used in the home page and procedure listings before migrating to live API calls.

## Files Archived

- `mario-search-data.ts` - Mock search data including:
  - Demo controls
  - Doctors data
  - Specialties list
  - Hospitals data
  - Procedures data
  - Medications data

## Migration Notes

- Mock data was replaced with live API calls:
  - `mario-smart-search.tsx` → `searchProcedures` API
  - `mario-home.tsx` → `getProcedureProviders(slug)` API
- The `/home` route now shows provider results inline when a procedure is selected
- The `/browse-procedures` route remains as a separate discovery route

## Usage

This data is preserved for reference only. Do not import or use in production code.

