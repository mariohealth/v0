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
      router.push('/search');
      return;
    }

    const trimmedQuery = query.trim();
    
    // If suggestion has a procedure_slug, navigate directly to procedure page
    if (suggestion?.procedureSlug) {
      router.push(`/procedures/${suggestion.procedureSlug}`);
      return;
    }
    
    // Regular search - navigate to search page
    router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
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
    router.push('/search');
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

