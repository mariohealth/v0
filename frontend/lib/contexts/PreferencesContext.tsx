'use client';

/**
 * User Preferences Context
 * 
 * Provides global state management for user preferences
 * Supports both guest (localStorage) and authenticated users (API sync)
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { UserPreferences } from '@/types/preferences';
import { getPreferences, savePreferences } from '@/lib/preferences-storage';
import { 
  getPreferencesFromAPI, 
  savePreferencesToAPI,
  syncPreferencesOnLogin
} from '@/lib/preferences-api';

interface PreferencesContextType {
  preferences: UserPreferences;
  loading: boolean;
  error: string | null;
  
  // Actions
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  resetPreferences: () => Promise<void>;
  refreshPreferences: () => Promise<void>;
  
  // Convenience getters
  defaultZip: string | undefined;
  defaultRadius: number;
  preferredInsuranceCarriers: string[];
  savedLocations: Array<{ id: string; name: string; zip: string; radius: number }>;
  language: string;
  notifications: { email?: boolean; sms?: boolean };
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

interface PreferencesProviderProps {
  children: ReactNode;
}

export function PreferencesProvider({ children }: PreferencesProviderProps) {
  const [preferences, setPreferences] = useState<UserPreferences>({
    defaultZip: undefined,
    defaultRadius: 50,
    preferredInsuranceCarriers: [],
    savedLocations: [],
    language: 'en',
    notifications: {
      email: true,
      sms: false,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load preferences on mount
  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to load from API first (for authenticated users)
      // Falls back to localStorage automatically
      const prefs = await getPreferencesFromAPI();
      setPreferences(prefs);
    } catch (err) {
      console.error('Failed to load preferences:', err);
      setError(err instanceof Error ? err.message : 'Failed to load preferences');
      
      // Fallback to localStorage
      try {
        const localPrefs = getPreferences();
        setPreferences(localPrefs);
      } catch (fallbackErr) {
        console.error('Failed to load preferences from localStorage:', fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = useCallback(async (updates: Partial<UserPreferences>) => {
    try {
      setError(null);
      
      const updated = {
        ...preferences,
        ...updates,
      };
      
      setPreferences(updated);
      
      // Save to localStorage immediately
      savePreferences(updated);
      
      // Sync to API if authenticated
      await savePreferencesToAPI(updated);
    } catch (err) {
      console.error('Failed to update preferences:', err);
      setError(err instanceof Error ? err.message : 'Failed to update preferences');
    }
  }, [preferences]);

  const resetPreferences = useCallback(async () => {
    try {
      setError(null);
      
      const defaultPrefs: UserPreferences = {
        defaultZip: undefined,
        defaultRadius: 50,
        preferredInsuranceCarriers: [],
        savedLocations: [],
        language: 'en',
        notifications: {
          email: true,
          sms: false,
        },
      };
      
      setPreferences(defaultPrefs);
      savePreferences(defaultPrefs);
      await savePreferencesToAPI(defaultPrefs);
    } catch (err) {
      console.error('Failed to reset preferences:', err);
      setError(err instanceof Error ? err.message : 'Failed to reset preferences');
    }
  }, []);

  const refreshPreferences = useCallback(() => {
    loadPreferences();
  }, []);

  const value: PreferencesContextType = {
    preferences,
    loading,
    error,
    updatePreferences,
    resetPreferences,
    refreshPreferences,
    
    // Convenience getters
    defaultZip: preferences.defaultZip,
    defaultRadius: preferences.defaultRadius ?? 50,
    preferredInsuranceCarriers: preferences.preferredInsuranceCarriers ?? [],
    savedLocations: preferences.savedLocations ?? [],
    language: preferences.language ?? 'en',
    notifications: preferences.notifications ?? { email: true, sms: false },
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
}

