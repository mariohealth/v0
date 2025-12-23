'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { MarioProfileSetup } from '@/components/mario-profile-setup';

export default function ProfileSetupPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleComplete = () => {
    router.push('/home');
  };

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return <MarioProfileSetup onComplete={handleComplete} />;
}
