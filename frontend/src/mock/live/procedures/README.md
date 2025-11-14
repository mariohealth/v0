# Live Procedure Mock Data

**Purpose:** Fallback mock data for procedures when API returns 404 or is unavailable.

**Usage:** These files are used by `getProcedureBySlug()` in `lib/api.ts` when the backend API returns a 404 error or when the API is unavailable.

**File Structure:**
- Each procedure has its own JSON file named by slug (e.g., `mri_brain.json`)
- Files follow the `SearchResult` interface structure from `lib/api.ts`

**Adding New Procedures:**
1. Create a new JSON file with the procedure slug as the filename
2. Follow the structure of existing files
3. The `getProcedureBySlug()` function will automatically use it when the API fails

