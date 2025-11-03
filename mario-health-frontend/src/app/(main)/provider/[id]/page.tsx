'use client'

import { useRouter, useParams } from 'next/navigation'
import { ProviderDetailPage } from '@/components/mario-provider-detail-enhanced'
import { type Provider } from '@/lib/data/healthcare-data'

export default function ProviderDetailRoute() {
  const router = useRouter()
  const params = useParams()
  const providerId = params?.id as string

  const handleBack = () => router.push('/home')

  // Mock provider data - replace with actual data fetching
  const mockProvider: Provider = {
    id: providerId || '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    rating: 4.8,
    reviewCount: 127,
    distance: '2.5 miles',
    price: 250,
    networkStatus: 'in_network',
    location: {
      address: '123 Medical Center Dr',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102'
    }
  } as Provider

  return (
    <div className="min-h-screen bg-background">
      <ProviderDetailPage
        provider={mockProvider}
        onBack={handleBack}
        service="Office Visit"
      />
    </div>
  )
}
