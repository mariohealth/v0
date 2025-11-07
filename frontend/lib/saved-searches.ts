/**
 * Saved Searches Manager
 * 
 * Handles saved searches for authenticated users
 * Falls back to localStorage for guest users
 */

import { UserPreferences } from '../types/preferences';
import { API_BASE_URL } from './config';

export interface SavedSearch {
    id: string;
    query: string;
    location?: string;
    filters?: {
        priceRange?: [number, number];
        types?: string[];
        minRating?: number;
    };
    timestamp: number;
    alertEnabled?: boolean;
}

const SAVED_SEARCHES_KEY = 'savedSearches';
const API_ENDPOINT = '/api/v1/user/saved-searches';

/**
 * Get saved searches from localStorage (guest users)
 */
export function getSavedSearchesFromStorage(): SavedSearch[] {
    if (typeof window === 'undefined') {
        return [];
    }

    try {
        const stored = localStorage.getItem(SAVED_SEARCHES_KEY);
        if (!stored) {
            return [];
        }

        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error('Failed to parse saved searches:', error);
        return [];
    }
}

/**
 * Save search to localStorage (guest users)
 */
export function saveSearchToStorage(search: Omit<SavedSearch, 'id' | 'timestamp'>): string {
    if (typeof window === 'undefined') {
        return '';
    }

    try {
        const searches = getSavedSearchesFromStorage();
        const newSearch: SavedSearch = {
            ...search,
            id: Date.now().toString(),
            timestamp: Date.now(),
        };

        const updated = [newSearch, ...searches];
        localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(updated));

        return newSearch.id;
    } catch (error) {
        console.error('Failed to save search:', error);
        return '';
    }
}

/**
 * Delete saved search from localStorage
 */
export function deleteSavedSearchFromStorage(id: string): void {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        const searches = getSavedSearchesFromStorage();
        const updated = searches.filter(s => s.id !== id);
        localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(updated));
    } catch (error) {
        console.error('Failed to delete saved search:', error);
    }
}

/**
 * Check if user is authenticated
 * TODO: Implement proper auth check
 */
function isAuthenticated(): boolean {
    // Placeholder - implement with actual auth system
    return false;
}

/**
 * Get saved searches from API (authenticated users)
 */
export async function getSavedSearches(): Promise<SavedSearch[]> {
    if (!isAuthenticated()) {
        return getSavedSearchesFromStorage();
    }

    try {
        const url = `${API_BASE_URL}${API_ENDPOINT}`;
        console.log(`[API] Request URL: ${url}`);
        console.log(`[API] API_BASE_URL: ${API_BASE_URL}`);
        
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                // TODO: Add authentication header
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch saved searches: ${response.statusText}`);
        }

        const data = await response.json();
        return data.searches || [];
    } catch (error) {
        console.error('Fetch failed:', error);
        console.error('Failed to fetch saved searches from API:', error);
        return getSavedSearchesFromStorage();
    }
}

/**
 * Save search to API (authenticated users)
 */
export async function saveSearch(search: Omit<SavedSearch, 'id' | 'timestamp'>): Promise<string> {
    // Always save to localStorage as backup
    const localId = saveSearchToStorage(search);

    if (!isAuthenticated()) {
        return localId;
    }

    try {
        const url = `${API_BASE_URL}${API_ENDPOINT}`;
        console.log(`[API] Request URL: ${url}`);
        console.log(`[API] API_BASE_URL: ${API_BASE_URL}`);
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // TODO: Add authentication header
            },
            body: JSON.stringify({ search }),
        });

        if (!response.ok) {
            throw new Error(`Failed to save search: ${response.statusText}`);
        }

        const data = await response.json();
        return data.id || localId;
    } catch (error) {
        console.error('Fetch failed:', error);
        console.error('Failed to save search to API:', error);
        return localId;
    }
}

/**
 * Delete saved search from API
 */
export async function deleteSavedSearch(id: string): Promise<void> {
    // Always delete from localStorage
    deleteSavedSearchFromStorage(id);

    if (!isAuthenticated()) {
        return;
    }

    try {
        const url = `${API_BASE_URL}${API_ENDPOINT}/${id}`;
        console.log(`[API] Request URL: ${url}`);
        console.log(`[API] API_BASE_URL: ${API_BASE_URL}`);
        
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                // TODO: Add authentication header
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to delete saved search: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Fetch failed:', error);
        console.error('Failed to delete saved search from API:', error);
    }
}

