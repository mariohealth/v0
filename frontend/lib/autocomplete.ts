/**
 * Fetch autocomplete suggestions from API
 * Returns procedure names that match the query
 */
import { searchProcedures, type SearchResult } from '@/lib/backend-api';

export async function getAutocompleteSuggestions(
  query: string,
  limit: number = 5
): Promise<Array<{ id: string; name: string; slug: string }>> {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    const results = await searchProcedures(query, undefined, 25);
    return results
      .slice(0, limit)
      .map(result => ({
        id: result.procedureId,
        name: result.procedureName,
        slug: result.procedureSlug,
      }));
  } catch (error) {
    console.error('Failed to fetch autocomplete suggestions:', error);
    return [];
  }
}

