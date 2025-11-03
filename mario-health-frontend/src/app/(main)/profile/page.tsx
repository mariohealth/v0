'use client'

import { useRouter } from 'next/navigation'
import { MarioProfileV2 } from '@/components/mario-profile-v2'

export default function ProfilePage() {
  const router = useRouter()

  const handleNavigateToHome = () => router.push('/home')
  const handleNavigateToHealthHub = () => router.push('/health-hub')
  const handleNavigateToRewards = () => router.push('/rewards')
  const handleSignOut = () => router.push('/login')
  const handleUpdateInsurance = () => router.push('/insurance')
  const handleViewSavedProviders = () => router.push('/saved-providers')
  const handleViewSavedMedications = () => router.push('/saved-medications')
  const handleViewSavedPharmacies = () => router.push('/saved-pharmacies')

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
  )
}
