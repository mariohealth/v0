'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { MarioProcedureSearchResults } from '@/components/mario-procedure-search-results';
import { getProcedureBySlug } from '@/lib/api';

export default function ProcedureDetailClient() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const slug = params.slug as string;
  const [procedureName, setProcedureName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchProcedureName = async () => {
      if (!slug) return;

      setLoading(true);
      try {
        // Try to get procedure name from API
        const procedureData = await getProcedureBySlug(slug);
        if (procedureData) {
          setProcedureName(procedureData.procedure_name);
        } else {
          // Fallback to slug-based name
          setProcedureName(slug.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' '));
        }
      } catch (error) {
        console.error('Error fetching procedure name:', error);
        // Fallback to slug-based name
        setProcedureName(slug.split('_').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '));
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProcedureName();
    }
  }, [slug]);

  if (authLoading || loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </main>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  const handleBack = () => {
    router.push('/procedures');
  };

  const handleProviderSelect = (providerId: string) => {
    router.push(`/providers/${providerId}?procedure=${encodeURIComponent(slug)}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <MarioProcedureSearchResults
        procedureId={slug}
        procedureName={procedureName || slug}
        onBack={handleBack}
        onProviderSelect={handleProviderSelect}
      />
    </div>
  );
}
