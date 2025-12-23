import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';

// Check ALL possible API env var names - same logic as useInsurance
const getApiBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_API_BASE) {
    return process.env.NEXT_PUBLIC_API_BASE;
  }
  if (process.env.NEXT_PUBLIC_API_URL) {
    return `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;
  }
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1`;
  }
  return 'https://mario-health-api-gateway-x5pghxd.uc.gateway.dev/api/v1';
};

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

      const token = await user.getIdToken();
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

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      setPreferences(data.preferences);
    } catch (err) {
      console.error('[useUserPreferences] Error updating:', err);
      setError(err instanceof Error ? err.message : 'Failed to update preferences');
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
