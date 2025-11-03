'use client'

import { useRouter, useParams } from 'next/navigation'
import { ProviderDetailPage } from '@/components/mario-provider-detail-enhanced'
import { type Provider } from '@/lib/data/healthcare-data'
import { getProviderById } from '@/lib/data/mario-provider-data'

export default function ProviderDetailRoute() {
  const router = useRouter()
  const params = useParams()
  const providerId = params?.id as string

  const handleBack = () => router.push('/home')

  // Get provider from mock data
  const marioProvider = getProviderById(providerId || '')
  
  // Transform to Provider format
  const mockProvider: Provider = marioProvider ? {
    id: marioProvider.id,
    name: marioProvider.name,
    specialty: marioProvider.specialty,
    rating: parseFloat(marioProvider.rating) || 4.8,
    reviewCount: parseInt(marioProvider.reviews) || 0,
    distance: '2.5 miles',
    price: parseInt(marioProvider.appointmentCosts?.[0]?.price.replace('$', '') || '250') || 250,
    networkStatus: marioProvider.network === 'In-Network' ? 'in_network' : 'out_of_network',
    location: {
      address: '123 Medical Center Dr',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102'
    },
    costs: {
      'Office Visit': {
        total: parseInt(marioProvider.appointmentCosts?.[0]?.price.replace('$', '') || '150') || 150,
        median: Math.round(parseInt(marioProvider.appointmentCosts?.[0]?.price.replace('$', '') || '150') * 1.2) || 180,
        savings: Math.round((parseInt(marioProvider.appointmentCosts?.[0]?.price.replace('$', '') || '150') * 1.2) - (parseInt(marioProvider.appointmentCosts?.[0]?.price.replace('$', '') || '150'))) || 30,
        percentSavings: 17
      }
    },
    marioPick: marioProvider.marioPick || false,
    marioPoints: 0
  } as Provider : {
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
