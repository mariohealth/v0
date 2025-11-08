'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { MarioProfileV2 } from '@/components/mario-profile-v2';

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

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

  const handleNavigateToHome = () => router.push('/home');
  const handleNavigateToHealthHub = () => router.push('/home'); // Updated: health-hub → /home
  const handleNavigateToRewards = () => router.push('/rewards');
  const handleSignOut = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  const handleUpdateInsurance = () => router.push('/insurance');
  const handleViewSavedProviders = () => router.push('/saved-providers');
  const handleViewSavedMedications = () => router.push('/saved-medications');
  const handleViewSavedPharmacies = () => router.push('/saved-pharmacies');

  return (
    <div className="min-h-screen bg-background">
      <MarioProfileV2
        onNavigateToHome={handleNavigateToHome}
        onNavigateToHealthHub={handleNavigateToHealthHub}
        onNavigateToRewards={handleNavigateToRewards}
        onSignOut={handleSignOut}
        onUpdateInsurance={handleUpdateInsurance}
        onViewSavedProviders={handleViewSavedProviders}
        onViewSavedMedications={handleViewSavedMedications}
        onViewSavedPharmacies={handleViewSavedPharmacies}
      />
    </div>
  );
}
