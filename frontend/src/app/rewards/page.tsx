'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { MarioRewardsV2 } from '@/components/mario-rewards-v2';

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
    <div className="min-h-screen bg-background">
      {/* Confetti animation */}
      {showConfetti && (
        <div
          key={confettiKey}
          className="fixed inset-0 pointer-events-none z-50"
          style={{
            animation: 'confetti-fall 3s ease-out forwards',
          }}
        >
          {/* Simple confetti effect */}
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                width: '10px',
                height: '10px',
                backgroundColor: ['#2E5077', '#4DA1A9', '#79D7BE', '#FFA726'][Math.floor(Math.random() * 4)],
                animation: `confetti-fall ${2 + Math.random() * 2}s ease-out forwards`,
                animationDelay: `${Math.random() * 0.5}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>
      )}
      <MarioRewardsV2 onBack={handleBack} />
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
