/**
 * User Preferences Storage Utilities
 * 
 * Handles localStorage operations for user preferences
 * Provides sync capabilities for logged-in users
 */

import { UserPreferences, PREFERENCES_STORAGE_KEY, DEFAULT_PREFERENCES } from '@/types/preferences';

/**
 * Get preferences from localStorage
 * Returns user's saved preferences or default preferences
 */
export function getPreferences(): UserPreferences {
  if (typeof window === 'undefined') {
    return DEFAULT_PREFERENCES;
  }

  try {
    const stored = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (!stored) {
      return DEFAULT_PREFERENCES;
    }

    const parsed = JSON.parse(stored);
    return {
      ...DEFAULT_PREFERENCES,
      ...parsed,
    };
  } catch (error) {
    console.error('Failed to parse preferences from localStorage:', error);
    return DEFAULT_PREFERENCES;
  }
}

/**
 * Save preferences to localStorage
 * @param preferences - Preferences to save
 */
export function savePreferences(preferences: UserPreferences): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const preferencesToSave: UserPreferences = {
      ...preferences,
      updatedAt: new Date().toISOString(),
    };
    
    localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferencesToSave));
  } catch (error) {
    console.error('Failed to save preferences to localStorage:', error);
  }
}

/**
 * Clear preferences from localStorage
 */
export function clearPreferences(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(PREFERENCES_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear preferences from localStorage:', error);
  }
}

/**
 * Update a specific preference field
 * @param field - Preference field to update
 * @param value - New value
 */
export function updatePreference<K extends keyof UserPreferences>(
  field: K,
  value: UserPreferences[K]
): void {
  const current = getPreferences();
  const updated = {
    ...current,
    [field]: value,
  };
  savePreferences(updated);
}

/**
 * Add a saved location (max 5)
 * @param location - Location to add
 */
export function addSavedLocation(location: { name: string; zip: string; radius: number }): void {
  const current = getPreferences();
  const savedLocations = current.savedLocations || [];
  
  // Enforce limit of 5 locations
  const updated = savedLocations.length >= 5 
    ? [...savedLocations.slice(1), { ...location, id: Date.now().toString() }]
    : [...savedLocations, { ...location, id: Date.now().toString() }];
  
  updatePreference('savedLocations', updated);
}

/**
 * Remove a saved location by ID
 * @param id - Location ID
 */
export function removeSavedLocation(id: string): void {
  const current = getPreferences();
  const savedLocations = current.savedLocations || [];
  const updated = savedLocations.filter(loc => loc.id !== id);
  
  updatePreference('savedLocations', updated);
}

/**
 * Check if user has preferences saved
 */
export function hasPreferences(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return localStorage.getItem(PREFERENCES_STORAGE_KEY) !== null;
}

