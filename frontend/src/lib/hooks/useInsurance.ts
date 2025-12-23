import { useState, useEffect } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://mario-health-api-production-643522268884.us-central1.run.app';

export interface InsuranceProvider {
  id: string;
  name: string;
  type: string;
  network: string | null;
  available: boolean;
}

interface UseInsuranceReturn {
  providers: InsuranceProvider[];
  loading: boolean;
  error: string | null;
}

export function useInsurance(): UseInsuranceReturn {
  const [providers, setProviders] = useState<InsuranceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/api/v1/insurance/providers`);

        if (!response.ok) {
          throw new Error('Failed to fetch insurance providers');
        }

        const data = await response.json();
        setProviders(data.providers || []);
      } catch (err) {
        console.error('Error fetching insurance providers:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch providers');
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  return {
    providers,
    loading,
    error,
  };
}
