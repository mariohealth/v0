import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';

import { getApiBaseUrl } from '@/lib/api-base';


export interface UserPreferences {
  user_id: string;
  default_zip: string | null;
  default_radius: number;
  preferred_insurance_carriers: string[];
  saved_locations: any[];
  language: string;
  notifications: {
    email: boolean;
    sms: boolean;
  };
  updated_at?: string;
}

interface UseUserPreferencesReturn {
  preferences: UserPreferences | null;
  loading: boolean;
  error: string | null;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useUserPreferences(): UseUserPreferencesReturn {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPreferences = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const apiBase = getApiBaseUrl().replace(/\/+$/, '');
      const url = `${apiBase}/user/preferences`;

      console.log(`[useUserPreferences] Fetching from: ${url}`);

      const token = await user.getIdToken();
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setPreferences(data.preferences);
    } catch (err) {
      console.error('[useUserPreferences] Error fetching:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch preferences');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updatePreferences = useCallback(async (updates: Partial<UserPreferences>) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      setError(null);

      // Merge updates with existing preferences
      const updatedPreferences = {
        ...preferences,
        ...updates,
        user_id: user.uid,
      } as UserPreferences;

      const apiBase = getApiBaseUrl().replace(/\/+$/, '');
      const url = `${apiBase}/user/preferences`;

      console.log(`[useUserPreferences] Updating at: ${url}`);
      console.log(`[useUserPreferences] API Base URL: ${apiBase}`);
      console.log(`[useUserPreferences] Full URL: ${url}`);

      const token = await user.getIdToken();
      console.log(`[useUserPreferences] Token obtained: ${token ? 'Yes' : 'No'}`);

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          preferences: updatedPreferences,
        }),
      });

      console.log(`[useUserPreferences] Response status: ${response.status}`);
      console.log(`[useUserPreferences] Response ok: ${response.ok}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[useUserPreferences] Error response:`, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      setPreferences(data.preferences);
    } catch (err) {
      console.error('[useUserPreferences] Error updating:', err);
      if (err instanceof TypeError && err.message.includes('fetch')) {
        const errorMsg = `Network error: ${err.message}. Check console for URL being called.`;
        setError(errorMsg);
        throw new Error(errorMsg);
      }
      const errorMessage = err instanceof Error ? err.message : 'Failed to update preferences';
      setError(errorMessage);
      throw err;
    }
  }, [user, preferences]);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  return {
    preferences,
    loading,
    error,
    updatePreferences,
    refetch: fetchPreferences,
  };
}
