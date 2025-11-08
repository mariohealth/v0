/**
 * Fetch autocomplete suggestions from API
 * Returns procedure names that match the query
 */
import { search } from '@/lib/api';

export async function getAutocompleteSuggestions(
  query: string,
  limit: number = 5
): Promise<Array<{ id: string; name: string; slug: string }>> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    const response = await search(query.trim());

    if (!response.results || response.results.length === 0) {
      return [];
    }

    // Extract unique procedure names from results
    // Backend returns: { procedure_id, procedure_name, procedure_slug, ... }
    const uniqueProcedures = new Map<string, { id: string; name: string; slug: string }>();

    response.results.forEach((result: any) => {
      // Handle both backend format (procedure_id, procedure_name, procedure_slug) 
      // and frontend format (id, name, slug)
      const procedureId = result.procedure_id || result.id;
      const procedureName = result.procedure_name || result.name;
      const procedureSlug = result.procedure_slug || result.slug;

      if (procedureName && procedureId) {
        // Use procedure name as key to avoid duplicates
        const key = procedureName.toLowerCase();
        if (!uniqueProcedures.has(key)) {
          uniqueProcedures.set(key, {
            id: procedureId,
            name: procedureName,
            slug: procedureSlug || procedureId.toLowerCase().replace(/\s+/g, '-'),
          });
        }
      }
    });

    return Array.from(uniqueProcedures.values()).slice(0, limit);
  } catch (error) {
    // Return empty array on error - component will show "No results found"
    return [];
  }
}

