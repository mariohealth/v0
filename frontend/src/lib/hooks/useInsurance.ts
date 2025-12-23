import { useState, useEffect } from 'react';

// Unified API base URL logic - check all common env vars and fallback to the production Cloud Run URL
const API_BASE_URL = 
  process.env.NEXT_PUBLIC_API_URL || 
  process.env.NEXT_PUBLIC_API_BASE_URL || 
  'https://mario-health-api-production-643522268884.us-central1.run.app';

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

        // Build the URL carefully to avoid double /api/v1
        const baseUrl = API_BASE_URL.replace(/\/+$/, '');
        const apiPath = baseUrl.includes('/api/v1') ? '/insurance/providers' : '/api/v1/insurance/providers';
        const url = `${baseUrl}${apiPath}`;

        console.log(`[useInsurance] Fetching from: ${url}`);

        const response = await fetch(url);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        const rawProviders = data.providers || [];
        
        // Map and clean up provider data
        const providersWithDefaults = rawProviders.map((provider: any) => {
          let available = provider.available;
          if (available === undefined || available === null) {
            const providerId = provider.id?.toLowerCase() || '';
            const providerName = provider.name?.toLowerCase() || '';
            // Phase 1 essential carriers
            available = 
              providerId === 'cigna_national_oap' ||
              providerId === 'united_pp1_00' ||
              providerId === 'ins_003' || // Gateway Cigna ID
              providerName.includes('cigna') ||
              providerName.includes('united');
          }
          
          return {
            id: provider.id,
            name: provider.name,
            type: provider.type || 'PPO',
            network: provider.network || null,
            available: Boolean(available),
          };
        });

        if (providersWithDefaults.length === 0) {
          console.warn('[useInsurance] API returned empty providers list, using fallbacks');
          setProviders([
            { id: 'cigna_national_oap', name: 'Cigna', type: 'PPO', network: 'National', available: true },
            { id: 'united_pp1_00', name: 'UnitedHealthcare', type: 'PPO', network: 'National', available: true },
            { id: 'aetna', name: 'Aetna', type: 'PPO', network: 'National', available: false },
            { id: 'bcbs', name: 'Blue Cross Blue Shield', type: 'PPO', network: 'National', available: false },
          ]);
        } else {
          setProviders(providersWithDefaults);
        }
      } catch (err) {
        console.error('[useInsurance] Error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch providers');
        
        // Safety fallback even on network error so the UI is not blocked
        setProviders([
          { id: 'cigna_national_oap', name: 'Cigna', type: 'PPO', network: 'National', available: true },
          { id: 'united_pp1_00', name: 'UnitedHealthcare', type: 'PPO', network: 'National', available: true },
          { id: 'aetna', name: 'Aetna', type: 'PPO', network: 'National', available: false },
          { id: 'bcbs', name: 'Blue Cross Blue Shield', type: 'PPO', network: 'National', available: false },
        ]);
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
