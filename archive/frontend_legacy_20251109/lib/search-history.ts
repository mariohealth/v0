/**
 * Search History Manager
 * 
 * Handles localStorage operations for search history
 * Stores last 10 searches
 */

export interface SearchHistoryItem {
  query: string;
  location?: string;
  timestamp: number;
}

const SEARCH_HISTORY_KEY = 'searchHistory';
const MAX_HISTORY_ITEMS = 10;

/**
 * Get search history from localStorage
 */
export function getSearchHistory(): SearchHistoryItem[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to parse search history:', error);
    return [];
  }
}

/**
 * Add a search to history
 */
export function addToHistory(query: string, location?: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const history = getSearchHistory();
    
    // Remove any existing entry with the same query and location
    const filtered = history.filter(
      item => !(item.query === query && item.location === location)
    );

    // Add new entry at the beginning
    const newEntry: SearchHistoryItem = {
      query,
      location,
      timestamp: Date.now(),
    };

    const updated = [newEntry, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to add to search history:', error);
  }
}

/**
 * Clear search history
 */
export function clearSearchHistory(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear search history:', error);
  }
}

/**
 * Remove a specific history item by index
 */
export function removeHistoryItem(index: number): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const history = getSearchHistory();
    const updated = history.filter((_, i) => i !== index);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to remove history item:', error);
  }
}

