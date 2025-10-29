/**
 * User Preferences API Client
 * 
 * Handles API calls for authenticated users to sync preferences with backend
 * For guest users, see preferences-storage.ts
 */

import { UserPreferences } from '@/types/preferences';
import { getAuthToken } from './auth-token';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mario-health-api-72178908097.us-central1.run.app';

const PREFERENCES_API_ENDPOINT = '/api/v1/user/preferences';

/**
 * Check if user is authenticated
 * TODO: Implement proper auth check
 */
function isAuthenticated(): boolean {
  // Placeholder - implement with actual auth system
  return false;
}

/**
 * Get user ID from auth
 * TODO: Implement proper user ID extraction
 */
function getUserId(): string | null {
  // Placeholder - implement with actual auth system
  return null;
}

/**
 * Get preferences from API (for authenticated users)
 * Falls back to localStorage if not authenticated
 */
export async function getPreferencesFromAPI(): Promise<UserPreferences> {
  if (!isAuthenticated()) {
    // Return localStorage preferences for guest users
    const { getPreferences } = await import('./preferences-storage');
    return getPreferences();
  }

  try {
    const userId = getUserId();
    if (!userId) {
      throw new Error('User ID not found');
    }

    const token = await getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Log outgoing headers for debugging
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log(`[API Request] GET ${API_BASE_URL}${PREFERENCES_API_ENDPOINT}`, {
        headers: { ...headers, Authorization: token ? `Bearer ${token.substring(0, 20)}...` : 'None' },
      });
    }

    const response = await fetch(`${API_BASE_URL}${PREFERENCES_API_ENDPOINT}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch preferences: ${response.statusText}`);
    }

    const data = await response.json();
    return data.preferences || {};
  } catch (error) {
    console.error('Failed to fetch preferences from API:', error);
    // Fallback to localStorage
    const { getPreferences } = await import('./preferences-storage');
    return getPreferences();
  }
}

/**
 * Save preferences to API (for authenticated users)
 * Also saves to localStorage for offline access
 */
export async function savePreferencesToAPI(preferences: UserPreferences): Promise<void> {
  // Always save to localStorage
  const { savePreferences } = await import('./preferences-storage');
  savePreferences(preferences);

  // If authenticated, sync to API
  if (!isAuthenticated()) {
    return;
  }

  try {
    const userId = getUserId();
    if (!userId) {
      return;
    }

    const token = await getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Log outgoing headers for debugging
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log(`[API Request] PUT ${API_BASE_URL}${PREFERENCES_API_ENDPOINT}`, {
        headers: { ...headers, Authorization: token ? `Bearer ${token.substring(0, 20)}...` : 'None' },
      });
    }

    const response = await fetch(`${API_BASE_URL}${PREFERENCES_API_ENDPOINT}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ preferences }),
    });

    if (!response.ok) {
      throw new Error(`Failed to save preferences: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Failed to save preferences to API:', error);
    // Preferences are still saved in localStorage
  }
}

/**
 * Sync localStorage preferences to API on login
 */
export async function syncPreferencesOnLogin(): Promise<void> {
  if (!isAuthenticated()) {
    return;
  }

  try {
    // Get preferences from localStorage
    const { getPreferences } = await import('./preferences-storage');
    const localPreferences = getPreferences();

    // Check if we have any meaningful data to sync
    if (
      localPreferences.defaultZip ||
      (localPreferences.savedLocations && localPreferences.savedLocations.length > 0) ||
      (localPreferences.preferredInsuranceCarriers && localPreferences.preferredInsuranceCarriers.length > 0)
    ) {
      await savePreferencesToAPI(localPreferences);
    } else {
      // Load from API if no local preferences
      const apiPreferences = await getPreferencesFromAPI();
      if (apiPreferences) {
        const { savePreferences } = await import('./preferences-storage');
        savePreferences(apiPreferences);
      }
    }
  } catch (error) {
    console.error('Failed to sync preferences on login:', error);
  }
}

