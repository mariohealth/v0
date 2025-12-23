import { useState, useEffect } from 'react';

// Check ALL possible API env var names used across the codebase
// Priority: NEXT_PUBLIC_API_BASE (includes /api/v1) > NEXT_PUBLIC_API_URL > NEXT_PUBLIC_API_BASE_URL > gateway fallback
const getApiBaseUrl = (): string => {
  // NEXT_PUBLIC_API_BASE typically includes /api/v1 already
  if (process.env.NEXT_PUBLIC_API_BASE) {
    return process.env.NEXT_PUBLIC_API_BASE;
  }
  // These typically don't include /api/v1
  if (process.env.NEXT_PUBLIC_API_URL) {
    return `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;
  }
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1`;
  }
  // Fallback to gateway (known working)
  return 'https://mario-health-api-gateway-x5pghxd.uc.gateway.dev/api/v1';
};

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

// Hardcoded fallback providers for Phase 1 (Cigna + United available, others coming soon)
const FALLBACK_PROVIDERS: InsuranceProvider[] = [
  { id: 'cigna_national_oap', name: 'Cigna', type: 'PPO', network: 'National', available: true },
  { id: 'united_pp1_00', name: 'UnitedHealthcare', type: 'PPO', network: 'National', available: true },
  { id: 'aetna', name: 'Aetna', type: 'PPO', network: 'National', available: false },
  { id: 'bcbs', name: 'Blue Cross Blue Shield', type: 'PPO', network: 'National', available: false },
];

export function useInsurance(): UseInsuranceReturn {
  const [providers, setProviders] = useState<InsuranceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiBase = getApiBaseUrl().replace(/\/+$/, '');
        const url = `${apiBase}/insurance/providers`;

        console.log(`[useInsurance] Fetching from: ${url}`);

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        // Check content-type to avoid parsing HTML as JSON
        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          throw new Error(`Expected JSON but got ${contentType}`);
        }

        const data = await response.json();
        const rawProviders = data.providers || [];
        
        if (rawProviders.length === 0) {
          console.warn('[useInsurance] API returned empty providers, using fallbacks');
          setProviders(FALLBACK_PROVIDERS);
          return;
        }

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

        setProviders(providersWithDefaults);
      } catch (err) {
        console.error('[useInsurance] Error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch providers');
        // Use fallback so UI is never blocked
        setProviders(FALLBACK_PROVIDERS);
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
