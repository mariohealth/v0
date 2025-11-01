import { Suspense } from 'react'
import type { Metadata } from 'next'
import { MarioSearchResultsEnhanced as MarioSearchResults } from '@/components/mario-search-results-enhanced'
import { searchProviders } from '@/lib/api/providers'

interface ResultsPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ searchParams }: ResultsPageProps): Promise<Metadata> {
    const params = await searchParams
    const query = (params.q as string) || ''

    if (!query) {
        return {
            title: 'Search Results - Mario Health',
        }
    }

    return {
        title: `Search Results for "${query}" - Mario Health`,
        description: `Find providers and procedures matching "${query}" on Mario Health`,
    }
}

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
    const params = await searchParams
    const query = (params.q as string) || ''

    // Fetch provider data from Supabase
    let providerResults: any[] = []

    if (query) {
        const result = await searchProviders(query, {}, 1, 20)
        // Transform Supabase data to match component's expected format
        providerResults = result.providers.map(p => ({
            id: p.id,
            name: p.name,
            specialty: p.specialty || 'General',
            type: 'doctor' as const,
            address: p.address || '',
            city: p.city || '',
            state: p.state || '',
            zipCode: p.zip_code || '',
            phone: p.phone || '',
            website: p.website || undefined,
            distance: 5, // TODO: Calculate from user location
            inNetwork: true, // TODO: Check from user insurance
            rating: p.rating || 0,
            reviewCount: p.review_count || 0,
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
            marioPoints: 0
        }))
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MarioSearchResults query={query} results={providerResults} />
        </Suspense>
    )
}

