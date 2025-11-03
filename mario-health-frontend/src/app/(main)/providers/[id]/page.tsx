import { Suspense } from 'react'
import { ProviderDetailClient } from './ProviderDetailClient'
import { getProviderById } from '@/lib/api/providers'
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

    return {
        title: `${providerData.provider.name} - Mario Health`,
        description: providerData.provider.specialty
            ? `Find ${providerData.provider.name}, ${providerData.provider.specialty} provider on Mario Health`
            : `Find ${providerData.provider.name} on Mario Health`,
    }
}

export default async function ProviderDetailRoute({ params }: ProviderDetailPageProps) {
    const { id } = await params
    const providerData = await getProviderById(id)

    if (!providerData) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold mb-4">Provider not found</h1>
                <p className="text-muted-foreground">The provider you're looking for doesn't exist.</p>
            </div>
        )
    }

    // Transform Supabase provider data to match component's expected format
    const transformedProvider = {
        id: providerData.provider.id,
        name: providerData.provider.name,
        specialty: providerData.provider.specialty || 'General',
        type: 'doctor' as const,
        address: providerData.provider.address || '',
        city: providerData.provider.city || '',
        state: providerData.provider.state || '',
        zipCode: providerData.provider.zip_code || '',
        phone: providerData.provider.phone || '',
        website: providerData.provider.website || undefined,
        distance: 5,
        inNetwork: true,
        rating: providerData.provider.rating || 0,
        reviewCount: providerData.provider.review_count || 0,
        hours: {},
        services: [],
        acceptedInsurance: [],
        about: '',
        costs: {
            'Office Visit': {
                total: 150,
                median: 180,
                savings: 30,
                percentSavings: 17
            }
        },
        marioPick: false,
        marioPoints: 0,
        location: {
            address: providerData.provider.address || '',
            city: providerData.provider.city || '',
            state: providerData.provider.state || '',
            zip: providerData.provider.zip_code || ''
        }
    }

    return (
        <Suspense fallback={<div>Loading provider...</div>}>
            <ProviderDetailClient provider={transformedProvider} />
        </Suspense>
    )
}
