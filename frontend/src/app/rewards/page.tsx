'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { MarioRewardsV2 } from '@/components/mario-rewards-v2';
import { FeatureGate } from '@/components/ui/FeatureGate';
import { ComingSoonOverlay } from '@/components/ui/ComingSoonOverlay';
import { BottomNav } from '@/components/navigation/BottomNav';


function RewardsContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Handle deep links to activity section
  useEffect(() => {
    const hash = searchParams.get('hash') || window.location.hash;
    if (hash === '#activity') {
      // Scroll to activity section if needed
      setTimeout(() => {
        const element = document.getElementById('activity-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  const handleBack = () => router.push('/home');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1">
        <ComingSoonOverlay
          title="Mario Rewards"
          description="We're building a smarter way to earn. Soon you'll get points for choosing high-value care and completing healthy activities."
          onBack={handleBack}
        />
      </div>
      <BottomNav />
    </div>
  );
}


export default function RewardsPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    }>
      <RewardsContent />
    </Suspense>
  );
}
