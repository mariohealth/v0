'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { MarioProfileSetup } from '@/components/mario-profile-setup';

export default function ProfileSetupPage() {
  const { user, loading } = useAuth();
  const router = useRouter();


  const handleComplete = () => {
    router.push('/home');
  };


  return <MarioProfileSetup onComplete={handleComplete} />;
}
