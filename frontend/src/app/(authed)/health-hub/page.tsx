'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { MarioHealthHubRefined } from '@/components/mario-health-hub-refined';

import { GlobalNav } from '@/components/navigation/GlobalNav';

export default function HealthHubPage() {
  const { user, loading } = useAuth();
  const router = useRouter();



  return (
    <div className="min-h-screen bg-background flex flex-col">
      <GlobalNav />
      <div className="flex-1">
        <MarioHealthHubRefined />
      </div>
    </div>
  );
}


