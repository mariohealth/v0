import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://mario-health-api-production-643522268884.us-central1.run.app';

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

      const token = await user.getIdToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/user/preferences`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch preferences');
      }

      const data = await response.json();
      setPreferences(data.preferences);
    } catch (err) {
      console.error('Error fetching preferences:', err);
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

      const token = await user.getIdToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/user/preferences`, {
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
        throw new Error('Failed to update preferences');
      }

      const data = await response.json();
      setPreferences(data.preferences);
    } catch (err) {
      console.error('Error updating preferences:', err);
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
