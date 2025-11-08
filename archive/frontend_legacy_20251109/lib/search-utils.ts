/**
 * Search Utilities
 * 
 * Helper functions for search functionality including:
 * - Fuzzy matching for spell check
 * - Search refinement
 * - Sort utilities
 */

/**
 * Calculate Levenshtein distance between two strings
 * Used for fuzzy matching and spell check
 */
export function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) {
    dp[i][0] = i;
  }

  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,     // deletion
        dp[i][j - 1] + 1,     // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return dp[m][n];
}

/**
 * Get similarity score between two strings (0-1)
 */
export function getSimilarity(str1: string, str2: string): number {
  const maxLen = Math.max(str1.length, str2.length);
  if (maxLen === 0) return 1;
  
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  return 1 - distance / maxLen;
}

/**
 * Find the closest match from a list of options using fuzzy matching
 * @param query - The search query
 * @param options - List of possible matches
 * @param threshold - Minimum similarity score (0-1)
 * @returns The closest match or null if none found
 */
export function findClosestMatch(
  query: string,
  options: string[],
  threshold: number = 0.7
): string | null {
  if (!query || options.length === 0) {
    return null;
  }

  let bestMatch: string | null = null;
  let bestScore = 0;

  for (const option of options) {
    const score = getSimilarity(query.toLowerCase(), option.toLowerCase());
    
    // Also check if query is a substring of option (higher weight)
    const substringBonus = option.toLowerCase().includes(query.toLowerCase()) ? 0.3 : 0;
    const totalScore = score + substringBonus;

    if (totalScore > bestScore && totalScore >= threshold) {
      bestScore = totalScore;
      bestMatch = option;
    }
  }

  return bestMatch;
}

/**
 * Highlight search terms in text
 */
export function highlightText(text: string, searchTerms: string[]): string {
  if (!text || searchTerms.length === 0) {
    return text;
  }

  let highlighted = text;
  searchTerms.forEach(term => {
    const regex = new RegExp(`(${term})`, 'gi');
    highlighted = highlighted.replace(regex, '<mark>$1</mark>');
  });

  return highlighted;
}

/**
 * Sort options for search results
 */
export type SortOption = 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'distance' | 'rating';

export interface SortConfig {
  option: SortOption;
  label: string;
}

export const SORT_OPTIONS: SortConfig[] = [
  { option: 'price-asc', label: 'Price (Low to High)' },
  { option: 'price-desc', label: 'Price (High to Low)' },
  { option: 'name-asc', label: 'Name (A-Z)' },
  { option: 'name-desc', label: 'Name (Z-A)' },
  { option: 'distance', label: 'Distance (Nearest)' },
  { option: 'rating', label: 'Rating (Highest)' },
];

/**
 * Get default sort option from localStorage
 */
export function getDefaultSortPreference(): SortOption {
  if (typeof window === 'undefined') {
    return 'price-asc';
  }

  try {
    const stored = localStorage.getItem('lastSortPreference');
    return (stored as SortOption) || 'price-asc';
  } catch {
    return 'price-asc';
  }
}

/**
 * Save sort preference to localStorage
 */
export function saveSortPreference(option: SortOption): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem('lastSortPreference', option);
  } catch (error) {
    console.error('Failed to save sort preference:', error);
  }
}

