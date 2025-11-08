/**
 * User Preferences Types
 * 
 * Defines data structures for user preferences including:
 * - Location defaults
 * - Insurance preferences
 * - Saved locations
 * - Language and notification preferences
 */

export interface SavedLocation {
  id: string;
  name: string;
  zip: string;
  radius: number;
}

export interface UserPreferences {
  // Location defaults
  defaultZip?: string;
  defaultRadius?: number;
  
  // Insurance preferences
  preferredInsuranceCarriers?: string[]; // Array of insurance provider names
  
  // Saved locations (max 5)
  savedLocations?: SavedLocation[];
  
  // Language preference
  language?: string; // ISO 639-1 language code (e.g., 'en', 'es')
  
  // Notification preferences
  notifications?: {
    email?: boolean;
    sms?: boolean;
  };
  
  // Timestamp for syncing
  updatedAt?: string;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  defaultZip: undefined,
  defaultRadius: 50, // Default 50 miles
  preferredInsuranceCarriers: [],
  savedLocations: [],
  language: 'en',
  notifications: {
    email: true,
    sms: false,
  },
};

// LocalStorage key
export const PREFERENCES_STORAGE_KEY = 'medSearchPreferences';

