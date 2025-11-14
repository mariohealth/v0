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

import { searchProcedures } from './api';
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
    // Call the searchProcedures API to get matching procedures
    const response = await searchProcedures(trimmedQuery);

    // Find best match (first procedure result - highest match score)
    if (response.results && response.results.length > 0) {
      const bestMatch = response.results[0];
      if (bestMatch.procedure_slug) {
        router.push(`/home?procedure=${encodeURIComponent(bestMatch.procedure_slug)}`);
        return true;
      }
    }

    // Fallback: if no match found
    if (!options?.silent) {
      console.warn('[navigateToProcedure] No matching procedure found for', trimmedQuery);
      MarioToast.error('No matching procedure found', 'Try searching for a specific procedure name');
    }
    return false;
  } catch (err) {
    console.error('[navigateToProcedure] Failed:', err);
    if (!options?.silent) {
      MarioToast.error('Search failed', 'Please try again or browse procedures');
    }
    return false;
  }
}

