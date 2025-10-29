/**
 * Saved Searches API Client
 * 
 * Handles API calls for saved searches
 */

const SAVED_SEARCHES_ENDPOINT = '/api/v1/user/saved-searches';

export interface SavedSearch {
  id?: string;
  query: string;
  location?: string;
  radius?: number;
  filters?: {
    priceRange?: number[];
    types?: string[];
    minRating?: number;
    maxDistance?: number;
    insuranceProvider?: string;
  };
  sort_by?: string;
  alert_enabled?: boolean;
  created_at?: string;
  updated_at?: string;
  last_searched_at?: string;
}

export interface SavedSearchCreateRequest {
  query: string;
  location?: string;
  radius?: number;
  filters?: SavedSearch['filters'];
  sort_by?: string;
  alert_enabled?: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mario-health-api-72178908097.us-central1.run.app';

/**
 * Get all saved searches for current user
 */
export async function getSavedSearches(): Promise<SavedSearch[]> {
  try {
    const response = await fetch(`${API_URL}${SAVED_SEARCHES_ENDPOINT}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // TODO: Add authentication header
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch saved searches: ${response.statusText}`);
    }

    const data = await response.json();
    return data.saved_searches || [];
  } catch (error) {
    console.error('Failed to fetch saved searches:', error);
    throw error;
  }
}

/**
 * Create a new saved search
 */
export async function createSavedSearch(request: SavedSearchCreateRequest): Promise<SavedSearch> {
  try {
    const response = await fetch(`${API_URL}${SAVED_SEARCHES_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // TODO: Add authentication header
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Failed to create saved search: ${response.statusText}`);
    }

    const data = await response.json();
    return data.saved_search;
  } catch (error) {
    console.error('Failed to create saved search:', error);
    throw error;
  }
}

/**
 * Delete a saved search
 */
export async function deleteSavedSearch(searchId: string): Promise<void> {
  try {
    const response = await fetch(`${API_URL}${SAVED_SEARCHES_ENDPOINT}/${searchId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // TODO: Add authentication header
      },
    });

    if (!response.ok && response.status !== 204) {
      throw new Error(`Failed to delete saved search: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Failed to delete saved search:', error);
    throw error;
  }
}

/**
 * Execute a saved search (updates last_searched_at)
 */
export async function executeSavedSearch(searchId: string): Promise<SavedSearch> {
  try {
    const response = await fetch(`${API_URL}${SAVED_SEARCHES_ENDPOINT}/${searchId}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // TODO: Add authentication header
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to execute saved search: ${response.statusText}`);
    }

    const data = await response.json();
    return data.saved_search;
  } catch (error) {
    console.error('Failed to execute saved search:', error);
    throw error;
  }
}

