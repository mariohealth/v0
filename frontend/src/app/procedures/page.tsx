'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { MarioBrowseProcedures } from '@/components/mario-browse-procedures';

export default function ProceduresPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

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

  const handleCategorySelect = (categoryId: string) => {
    // Navigate to procedures page with category filter
    router.push(`/procedures?category=${encodeURIComponent(categoryId)}`);
  };

  const handleBack = () => {
    router.push('/home');
  };

  return (
    <div className="min-h-screen bg-background">
      <MarioBrowseProcedures 
        onCategorySelect={handleCategorySelect}
        onBack={handleBack}
      />
    </div>
  );
}

