import { Suspense } from 'react'
import type { Metadata } from 'next'
import { MarioSearchResultsEnhanced as MarioSearchResults } from '@/components/mario-search-results-enhanced'
import { providers } from '@/lib/data/mario-provider-data'

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

    // Use mock data instead of Supabase fetch
    let providerResults: any[] = []

    if (query) {
        const queryLower = query.toLowerCase()
        
        // Search providers from mock data
        providerResults = providers
            .filter(p => 
                p.name.toLowerCase().includes(queryLower) ||
                p.specialty.toLowerCase().includes(queryLower)
            )
            .map(p => ({
                id: p.id,
                name: p.name,
                specialty: p.specialty,
                type: 'doctor' as const,
                address: '',
                city: '',
                state: '',
                zipCode: '',
                phone: '',
                website: undefined,
                distance: '2.5 miles',
                inNetwork: p.network === 'In-Network',
                rating: parseFloat(p.rating) || 0,
                reviewCount: parseInt(p.reviews) || 0,
                hours: {},
                services: [],
                acceptedInsurance: p.insuranceAccepted || [],
                about: p.bio || '',
                costs: {
                    'Office Visit': p.appointmentCosts?.[0] ? {
                        total: parseInt(p.appointmentCosts[0].price.replace('$', '')) || 150,
                        median: Math.round(parseInt(p.appointmentCosts[0].price.replace('$', '')) * 1.2) || 180,
                        savings: Math.round((parseInt(p.appointmentCosts[0].price.replace('$', '')) * 1.2) - (parseInt(p.appointmentCosts[0].price.replace('$', '')) || 150)),
                        percentSavings: 17
                    } : {
                        total: 150,
                        median: 180,
                        savings: 30,
                        percentSavings: 17
                    }
                },
                marioPick: p.marioPick || false,
                marioPoints: 0,
                location: {
                    address: '',
                    city: '',
                    state: '',
                    zip: ''
                }
            }))
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MarioSearchResults query={query} results={providerResults} />
        </Suspense>
    )
}

