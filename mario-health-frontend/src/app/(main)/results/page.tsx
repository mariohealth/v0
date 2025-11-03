import { Suspense } from 'react'
import type { Metadata } from 'next'
import { MarioSearchResultsEnhanced as MarioSearchResults } from '@/components/mario-search-results-enhanced'
import { providers as mockProviders } from '@/lib/data/mario-provider-data'
import { procedures as mockProcedures } from '@/lib/data/mario-procedures-data'

// Safe fallbacks for data imports
const providers = Array.isArray(mockProviders) ? mockProviders : []
const procedures = Array.isArray(mockProcedures) ? mockProcedures : []

// Debug logging
console.log("providers:", providers?.length || 0, "procedures:", procedures?.length || 0)

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
    let procedureResults: any[] = []

    if (query && Array.isArray(providers) && Array.isArray(procedures)) {
        try {
            const queryLower = query.toLowerCase()
            
            // Search providers from mock data with safety checks
            const filteredProviders = (providers || []).filter(p => {
                if (!p || typeof p !== 'object') return false
                const name = (p.name || '').toLowerCase()
                const specialty = (p.specialty || '').toLowerCase()
                return name.includes(queryLower) || specialty.includes(queryLower)
            })
            
            // Search procedures from mock data with safety checks
            const filteredProcedures = (procedures || []).filter(p => {
                if (!p || typeof p !== 'object') return false
                const name = (p.name || '').toLowerCase()
                const category = (p.category || '').toLowerCase()
                return name.includes(queryLower) || category.includes(queryLower)
            })
            
            // Transform providers to match component format with safety checks
            providerResults = Array.isArray(filteredProviders) ? filteredProviders.map(p => {
                if (!p || typeof p !== 'object') return null
                try {
                    return {
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
                    }
                } catch (err) {
                    console.error('Error transforming provider:', err)
                    return null
                }
            }).filter(Boolean) : []
            
            // Transform procedures to Provider-like format for display with safety checks
            procedureResults = Array.isArray(filteredProcedures) ? filteredProcedures.map(p => {
                if (!p || typeof p !== 'object') return null
                try {
                    return {
                        id: `procedure-${p.id}`,
                        name: p.name,
                        specialty: p.category || 'Procedure',
                        type: 'procedure' as const,
                        address: '',
                        city: '',
                        state: '',
                        zipCode: '',
                        phone: '',
                        website: undefined,
                        distance: '2.5 miles',
                        inNetwork: true,
                        rating: 4.5,
                        reviewCount: 0,
                        hours: {},
                        services: [],
                        acceptedInsurance: [],
                        about: p.description || '',
                        costs: {
                            [p.name]: {
                                total: p.marioPrice || p.avgPrice * 0.6,
                                median: p.avgPrice || 0,
                                savings: (p.avgPrice || 0) - (p.marioPrice || 0),
                                percentSavings: p.savings || 0
                            }
                        },
                        marioPick: true,
                        marioPoints: 0,
                        location: {
                            address: '',
                            city: '',
                            state: '',
                            zip: ''
                        }
                    }
                } catch (err) {
                    console.error('Error transforming procedure:', err)
                    return null
                }
            }).filter(Boolean) : []
        } catch (err) {
            console.error('Error filtering search results:', err)
            providerResults = []
            procedureResults = []
        }
    }
    
    // Combine results - providers and procedures with safety check
    const allResults = Array.isArray(providerResults) && Array.isArray(procedureResults) 
        ? [...providerResults, ...procedureResults] 
        : []

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MarioSearchResults query={query || ''} results={allResults || []} />
        </Suspense>
    )
}

