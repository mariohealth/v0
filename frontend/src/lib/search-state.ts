/**
 * Search State Persistence
 * Manages localStorage for search queries and filters
 */

export interface SearchState {
    query: string;
    filters?: {
        category?: string;
        location?: string;
        priceRange?: string;
    };
    timestamp: number;
}

const STORAGE_KEY = 'marioRecentSearches';
const MAX_RECENT_SEARCHES = 10;

/**
 * Save search query to localStorage
 */
export function saveSearchQuery(query: string, filters?: SearchState['filters']): void {
    if (!query.trim()) return;

    const searches = getRecentSearches();
    const newSearch: SearchState = {
        query: query.trim(),
        filters,
        timestamp: Date.now(),
    };

    // Remove duplicates
    const filtered = searches.filter((s) => s.query !== newSearch.query);

    // Add to front
    filtered.unshift(newSearch);

    // Keep only last MAX_RECENT_SEARCHES
    const limited = filtered.slice(0, MAX_RECENT_SEARCHES);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
}

/**
 * Get recent searches from localStorage
 */
export function getRecentSearches(): SearchState[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

/**
 * Get last search query
 */
export function getLastSearchQuery(): string | null {
    const searches = getRecentSearches();
    return searches.length > 0 ? searches[0].query : null;
}

/**
 * Get last search state (query + filters)
 */
export function getLastSearchState(): SearchState | null {
    const searches = getRecentSearches();
    return searches.length > 0 ? searches[0] : null;
}

/**
 * Clear search history
 */
export function clearSearchHistory(): void {
    localStorage.removeItem(STORAGE_KEY);
}

