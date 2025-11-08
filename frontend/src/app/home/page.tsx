'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { MarioHome } from '@/components/mario-home';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleSearch = async (query: string, suggestion?: any) => {
    if (!query || !query.trim()) {
      // Stay on home page if no query
      return;
    }

    const trimmedQuery = query.trim();
    
    // Handle different suggestion types
    if (suggestion) {
      // Procedure - navigate to procedure detail page
      if (suggestion.procedureSlug) {
        router.push(`/procedures/${suggestion.procedureSlug}`);
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
    
    // Regular search - navigate to procedures page with query
    router.push(`/procedures?q=${encodeURIComponent(trimmedQuery)}`);
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
      />
    </div>
  );
}
