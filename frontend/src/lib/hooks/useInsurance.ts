import { useState, useEffect } from 'react';

// Use relative URL for Firebase Hosting proxy (avoids CORS)
// Firebase rewrites /api/** to Cloud Run, so we use relative URLs in production
const getApiBaseUrl = (): string => {
  // In browser on Firebase Hosting, use relative URL to leverage proxy
  if (typeof window !== 'undefined' && window.location.hostname.includes('web.app')) {
    return '/api/v1';
  }
  // For local dev or other environments, check env vars
  if (process.env.NEXT_PUBLIC_API_BASE) {
    return process.env.NEXT_PUBLIC_API_BASE;
  }
  if (process.env.NEXT_PUBLIC_API_URL) {
    return `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;
  }
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1`;
  }
  // Fallback: use relative URL (works with Firebase proxy)
  return '/api/v1';
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

// Hardcoded fallback providers for Phase 1 (Cigna + United available)
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

        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          throw new Error(`Expected JSON but got ${contentType}`);
        }

        const data = await response.json();
        const rawProviders = data.providers || [];
        
        if (rawProviders.length === 0) {
          setProviders(FALLBACK_PROVIDERS);
          return;
        }

        // Map and clean up provider data
        let processedProviders = rawProviders.map((provider: any) => {
          let available = provider.available;
          if (available === undefined || available === null) {
            const providerId = provider.id?.toLowerCase() || '';
            const providerName = provider.name?.toLowerCase() || '';
            // Match Phase 1 available carriers
            available = 
              providerId.includes('cigna') || 
              providerId.includes('united') ||
              providerId.includes('ins_003') || // Gateway Cigna ID
              providerName.includes('cigna') ||
              providerName.includes('united') ||
              providerName.includes('uhc');
          }
          
          return {
            id: provider.id,
            name: provider.name,
            type: provider.type || 'PPO',
            network: provider.network || null,
            available: Boolean(available),
          };
        });

        // Ensure UnitedHealthcare is ALWAYS present for Phase 1, even if Gateway misses it
        const hasUnited = processedProviders.some((p: InsuranceProvider) => 
          p.id?.toLowerCase().includes('united') || 
          p.name?.toLowerCase().includes('united') ||
          p.name?.toLowerCase().includes('uhc')
        );

        if (!hasUnited) {
          processedProviders.push({
            id: 'united_pp1_00',
            name: 'UnitedHealthcare',
            type: 'PPO',
            network: 'National',
            available: true
          });
        }

        // Sort: available first, then alphabetically
        processedProviders.sort((a: InsuranceProvider, b: InsuranceProvider) => {
          if (a.available !== b.available) return a.available ? -1 : 1;
          return a.name.localeCompare(b.name);
        });

        setProviders(processedProviders);
      } catch (err) {
        console.error('[useInsurance] Error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch providers');
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
