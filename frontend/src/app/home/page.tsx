'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { MarioHome } from '@/components/mario-home';
import { getProcedureProviders, type Provider } from '@/lib/api';
import { navigateToProcedure } from '@/lib/navigateToProcedure';

function HomePageContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const procedureSlug = searchParams.get('procedure');
  
  const [providers, setProviders] = useState<Provider[]>([]);
  const [procedureName, setProcedureName] = useState<string>('');
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [providersError, setProvidersError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Fetch providers when procedure query param is present
  useEffect(() => {
    const fetchProviders = async () => {
      if (!procedureSlug || !user) return;

      setLoadingProviders(true);
      setProvidersError(null);

      try {
        const data = await getProcedureProviders(procedureSlug);
        setProviders(data.providers || []);
        setProcedureName(data.procedure_name || '');
      } catch (error) {
        console.error('Error fetching procedure providers:', error);
        setProvidersError('Failed to load providers. Please try again.');
        setProviders([]);
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
      // Procedure - navigate to /home with procedure query param
      if (suggestion.procedureSlug) {
        router.push(`/home?procedure=${encodeURIComponent(suggestion.procedureSlug)}`);
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
      
      // Specialty - navigate to doctors page filtered by specialty
      if (suggestion.specialty) {
        router.push(`/doctors?specialty=${encodeURIComponent(suggestion.specialty.id)}`);
        return;
      }
    }
    
    // Regular search (Enter key without autocomplete selection) - search for procedure
    await navigateToProcedure(trimmedQuery, router);
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
    router.push('/doctors');
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

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </main>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-background">
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
