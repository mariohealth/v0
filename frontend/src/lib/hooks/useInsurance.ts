import { useState, useEffect } from 'react';

// Use same API base URL as other API calls (gateway, not direct Cloud Run)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mario-health-api-gateway-x5pghxd.uc.gateway.dev';

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
          const errorText = await response.text();
          throw new Error(`Failed to fetch insurance providers: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        
        // Handle missing 'available' field: default to false but still show providers
        // Map Cigna and UnitedHealthcare to available=true based on backend logic
        const providersWithDefaults = (data.providers || []).map((provider: any) => {
          // If available field is missing, determine based on provider ID/name
          let available = provider.available;
          if (available === undefined || available === null) {
            // Match backend logic: cigna_national_oap and united_pp1_00 are available
            // Also handle gateway response format (ins_003 for Cigna, etc.)
            const providerId = provider.id?.toLowerCase() || '';
            const providerName = provider.name?.toLowerCase() || '';
            // Check for Cigna (id: cigna_national_oap, ins_003, or name contains "cigna")
            // Check for UnitedHealthcare (id: united_pp1_00 or name contains "united")
            available = 
              providerId === 'cigna_national_oap' ||
              providerId === 'united_pp1_00' ||
              providerId === 'ins_003' || // Gateway format for Cigna
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
        console.error('Error fetching insurance providers:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch providers';
        setError(errorMessage);
        // Don't set empty array on error - let UI show error state
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
