'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { MarioHome } from '@/components/mario-home';
import { getProcedureProviders, type Provider } from '@/lib/api';
import { navigateToProcedure } from '@/lib/navigateToProcedure';
import { DataSourceBanner } from '@/lib/dataSourceBanner';
import { GlobalNav } from '@/components/navigation/GlobalNav';


function HomePageContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const procedureSlug = searchParams.get('procedure');
  const [noResultsMessage, setNoResultsMessage] = useState<string | null>(null);

  const [providers, setProviders] = useState<Provider[]>([]);
  const [procedureName, setProcedureName] = useState<string>('');
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [providersError, setProvidersError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<'api' | 'mock' | null>(null);


  // Fetch providers when procedure query param is present
  useEffect(() => {
    const fetchProviders = async () => {
      if (!procedureSlug || !user) return;

      setLoadingProviders(true);
      setProvidersError(null);

      try {
        const data = await getProcedureProviders(procedureSlug);

        // Track data source for banner display
        setDataSource(data._dataSource || 'api');

        // Check if we got providers (rely on real API first during verification)
        if (data.providers && data.providers.length > 0) {
          setProviders(data.providers);
          setProcedureName(data.procedure_name || '');
          setProvidersError(null);
        } else {
          // No providers available - show empty state (no mock fallback during verification)
          setProviders([]);
          setProcedureName(data.procedure_name || '');
          setProvidersError(null); // Don't show error, just show empty state
        }
      } catch (error) {
        console.error('Error fetching procedure providers:', error);
        // During verification: show empty state instead of fallback
        setProviders([]);
        setProcedureName('');
        setProvidersError(null); // Don't show error message during verification
        setDataSource(null); // Clear data source on error during verification
      } finally {
        setLoadingProviders(false);
      }
    };

    if (procedureSlug && user) {
      fetchProviders();
    } else {
      setProviders([]);
      setProcedureName('');
    }
  }, [procedureSlug, user]);

  const handleSearch = async (query: string, suggestion?: any) => {
    if (!query || !query.trim()) {
      // Stay on home page if no query
      return;
    }

    const trimmedQuery = query.trim();

    // Handle different suggestion types
    if (suggestion) {
      // Specialty - route to /specialties/{slug} (check first before fallback patterns)
      // Supports: suggestion.type === 'specialty', or legacy suggestion.specialty object
      const specialtySlug = suggestion.slug || suggestion.specialtyId || suggestion.specialty?.slug || suggestion.specialty?.id;
      if (suggestion.type === 'specialty' && specialtySlug) {
        // Include user zip if available
        let zipParam = '';
        try {
          const storedZip = typeof window !== 'undefined' ? localStorage.getItem('userZipCode') : null;
          if (storedZip?.trim()) {
            zipParam = `?zip_code=${encodeURIComponent(storedZip.trim())}`;
          }
        } catch { /* ignore */ }
        router.push(`/specialties/${encodeURIComponent(specialtySlug)}${zipParam}`);
        return;
      }

      // Procedure - navigate directly to /procedures/{slug} for immediate results
      if (suggestion.procedureSlug) {
        router.push(`/procedures/${encodeURIComponent(suggestion.procedureSlug)}`);
        return;
      }

      // Doctor/Provider - navigate to provider detail page
      if (suggestion.doctor?.id) {
        router.push(`/providers/${suggestion.doctor.id}`);
        return;
      }

      // Medication - navigate to medications page
      if (suggestion.medication) {
        const medSlug = suggestion.medication.slug || suggestion.medication.name.toLowerCase().replace(/\s+/g, '-');
        router.push(`/medications/${medSlug}`);
        return;
      }

      // Legacy specialty fallback (if not caught above) - still route to specialty page
      if (suggestion.specialty) {
        const slug = suggestion.specialty.slug || suggestion.specialty.id;
        let zipParam = '';
        try {
          const storedZip = typeof window !== 'undefined' ? localStorage.getItem('userZipCode') : null;
          if (storedZip?.trim()) {
            zipParam = `?zip_code=${encodeURIComponent(storedZip.trim())}`;
          }
        } catch { /* ignore */ }
        router.push(`/specialties/${encodeURIComponent(slug)}${zipParam}`);
        setNoResultsMessage(null);
        return;
      }
    }

    // Regular search (Enter key without autocomplete selection) - search for procedure on /search page
    // Do not navigate; show inline message
    setNoResultsMessage(`We didn’t find any results for “${trimmedQuery}”. Please choose a suggestion.`);
  };

  const handleProviderClick = (providerId: string) => {
    if (procedureSlug) {
      router.push(`/providers/${providerId}?procedure=${encodeURIComponent(procedureSlug)}`);
    } else {
      router.push(`/providers/${providerId}`);
    }
  };

  const handleBrowseProcedures = () => {
    router.push('/procedures');
  };

  const handleFindDoctors = () => {
    router.push('/specialties');
  };

  const handleFindMedication = () => {
    router.push('/medications');
  };

  const handleMarioCare = () => {
    router.push('/home');
  };

  const handleOpenAI = () => {
    // Opens MarioAI modal (handled by MarioHome component)
  };

  const handleOpenAIWithPrompt = (prompt: string) => {
    // Opens MarioAI modal with prompt (handled by MarioHome component)
  };


  return (
    <div className="min-h-screen bg-background">
      <GlobalNav />
      {noResultsMessage && (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-4">
          <div className="rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
            {noResultsMessage}
          </div>
        </div>
      )}
      <MarioHome

        isReturningUser={true}
        onSearch={handleSearch}
        onOpenAI={handleOpenAI}
        onOpenAIWithPrompt={handleOpenAIWithPrompt}
        onBrowseProcedures={handleBrowseProcedures}
        onFindDoctors={handleFindDoctors}
        onFindMedication={handleFindMedication}
        onMarioCare={handleMarioCare}
        procedureSlug={procedureSlug || undefined}
        procedureName={procedureName}
        providers={providers}
        loadingProviders={loadingProviders}
        providersError={providersError}
        onProviderClick={handleProviderClick}
      />
      {dataSource && <DataSourceBanner source={dataSource} />}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen flex-col items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </main>
    }>
      <HomePageContent />
    </Suspense>
  );
}
