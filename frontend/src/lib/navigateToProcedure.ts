/**
 * Navigate to procedure search results page
 * 
 * This helper centralizes the logic for searching procedures and navigating
 * to the unified /home?procedure=${slug} flow. It handles API calls, error
 * handling, and user feedback via toast notifications.
 * 
 * @param query - The search query string (e.g., "MRI", "X-ray")
 * @param router - Next.js router instance for navigation
 * @param options - Optional configuration
 * @param options.silent - If true, suppress toast notifications (default: false)
 * @returns Promise<boolean> - Returns true if navigation occurred, false otherwise
 * 
 * @example
 * ```ts
 * import { useRouter } from 'next/navigation';
 * import { navigateToProcedure } from '@/lib/navigateToProcedure';
 * 
 * const router = useRouter();
 * await navigateToProcedure('MRI', router);
 * ```
 */

import { searchProcedures, type UnifiedResult, type SearchResult, type DoctorResult } from './api';
import { MarioToast } from '@/components/mario-toast-helper';

export async function navigateToProcedure(
  query: string,
  router: any,
  options?: { silent?: boolean }
): Promise<boolean> {
  if (!query || !query.trim()) {
    return false;
  }

  const trimmedQuery = query.trim();

  try {
    // Call the searchProcedures API to get matching results
    const response = await searchProcedures(trimmedQuery);

    if (response.results && response.results.length > 0) {
      // If there's only one result, or a very high quality match, navigate directly
      const bestMatch = response.results[0];

      if (bestMatch.type === 'doctor') {
        const doctor = bestMatch as DoctorResult;
        router.push(`/providers/${doctor.provider_id}`);
        return true;
      } else if (bestMatch.type === 'procedure') {
        const procedure = bestMatch as SearchResult;
        router.push(`/procedures/${procedure.procedure_slug}`);
        return true;
      }

    }

    // If no direct result or multiple results, go to search results page
    router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    return true;

  } catch (err) {
    console.error('[navigateToProcedure] Failed:', err);
    if (!options?.silent) {
      MarioToast.error('Search failed', 'Please try again or browse procedures');
    }
    return false;
  }
}

