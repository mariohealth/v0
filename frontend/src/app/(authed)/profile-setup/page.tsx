'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { MarioProfileSetup } from '@/components/mario-profile-setup';

function ProfileSetupContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/home';

  const handleComplete = () => {
    router.push(returnUrl);
  };

  return <MarioProfileSetup onComplete={handleComplete} />;
}

export default function ProfileSetupPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#FDFCFA]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#2E5077] border-t-transparent" />
      </div>
    }>
      <ProfileSetupContent />
    </Suspense>
  );
}
