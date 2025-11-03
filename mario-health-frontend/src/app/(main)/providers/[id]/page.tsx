import { Suspense } from 'react'
import { ProviderDetailClient } from './ProviderDetailClient'
import { getProviderById } from '@/lib/data/mario-provider-data'
import type { Metadata } from 'next'

interface ProviderDetailPageProps {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ProviderDetailPageProps): Promise<Metadata> {
    const { id } = await params
    const providerData = await getProviderById(id)

    if (!providerData) {
        return {
            title: 'Provider Not Found',
        }
    }

    const marioProvider = getProviderById(id)
    const providerName = marioProvider?.name || 'Provider'
    const providerSpecialty = marioProvider?.specialty || ''
    
    return {
        title: `${providerName} - Mario Health`,
        description: providerSpecialty
            ? `Find ${providerName}, ${providerSpecialty} provider on Mario Health`
            : `Find ${providerName} on Mario Health`,
    }
}

export default async function ProviderDetailRoute({ params }: ProviderDetailPageProps) {
    const { id } = await params
    const marioProvider = getProviderById(id)

    if (!marioProvider) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold mb-4">Provider not found</h1>
                <p className="text-muted-foreground">The provider you're looking for doesn't exist.</p>
            </div>
        )
    }

    // Transform mock provider data to match component's expected format
    const transformedProvider = {
        id: marioProvider.id,
        name: marioProvider.name,
        specialty: marioProvider.specialty || 'General',
        type: 'doctor' as const,
        address: '',
        city: '',
        state: '',
        zipCode: '',
        phone: '',
        website: undefined,
        distance: '2.5 miles',
        inNetwork: marioProvider.network === 'In-Network',
        rating: parseFloat(marioProvider.rating) || 0,
        reviewCount: parseInt(marioProvider.reviews) || 0,
        hours: {},
        services: [],
        acceptedInsurance: marioProvider.insuranceAccepted || [],
        about: marioProvider.bio || '',
        costs: {
            'Office Visit': marioProvider.appointmentCosts?.[0] ? {
                total: parseInt(marioProvider.appointmentCosts[0].price.replace('$', '')) || 150,
                median: Math.round(parseInt(marioProvider.appointmentCosts[0].price.replace('$', '')) * 1.2) || 180,
                savings: Math.round((parseInt(marioProvider.appointmentCosts[0].price.replace('$', '')) * 1.2) - (parseInt(marioProvider.appointmentCosts[0].price.replace('$', '')))) || 30,
                percentSavings: 17
            } : {
                total: 150,
                median: 180,
                savings: 30,
                percentSavings: 17
            }
        },
        marioPick: marioProvider.marioPick || false,
        marioPoints: 0,
        location: {
            address: '',
            city: '',
            state: '',
            zip: ''
        }
    }

    return (
        <Suspense fallback={<div>Loading provider...</div>}>
            <ProviderDetailClient provider={transformedProvider} />
        </Suspense>
    )
}
