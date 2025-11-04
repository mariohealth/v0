'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { MarioSearchResultsEnhanced as MarioSearchResults } from '@/components/mario-search-results-enhanced'

// Backend API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface ResultsPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

function ResultsContent() {
    const searchParams = useSearchParams()
    const query = searchParams.get('q') || ''
    const [results, setResults] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchResults = async () => {
            if (!query || query.length < 2) {
                setResults([])
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                setError(null)

                // Call backend API
                const url = `${API_BASE_URL}/api/v1/search?q=${encodeURIComponent(query)}&zip_code=10001&radius=25`
                console.log("✅ Fetching results from:", url)
                
                const response = await fetch(url)
                
                if (!response.ok) {
                    throw new Error(`API request failed: ${response.status} ${response.statusText}`)
                }

                const data = await response.json()
                console.log("✅ Results fetched:", {
                    query: data.query,
                    results_count: data.results_count,
                    results_length: data.results?.length || 0,
                })

                // Transform API results to match component format
                const transformedResults = (data.results || []).map((result: any) => ({
                    id: result.procedure_id || `procedure-${result.procedure_slug}`,
                    name: result.procedure_name,
                    specialty: result.category_name || 'Procedure',
                    type: 'procedure' as const,
                    address: '',
                    city: '',
                    state: '',
                    zipCode: '',
                    phone: '',
                    website: undefined,
                    distance: result.nearest_distance_miles 
                        ? `${result.nearest_distance_miles.toFixed(1)} miles` 
                        : undefined,
                    inNetwork: true,
                    rating: 4.5,
                    reviewCount: result.provider_count || 0,
                    hours: {},
                    services: [],
                    acceptedInsurance: [],
                    about: result.family_name || '',
                    costs: {
                        [result.procedure_name]: {
                            total: parseFloat(result.best_price) || 0,
                            median: parseFloat(result.avg_price) || 0,
                            savings: (parseFloat(result.avg_price) || 0) - (parseFloat(result.best_price) || 0),
                            percentSavings: result.avg_price && result.best_price 
                                ? Math.round(((parseFloat(result.avg_price) - parseFloat(result.best_price)) / parseFloat(result.avg_price)) * 100)
                                : 0
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
                }))

                setResults(transformedResults)
                console.log("✅ Transformed results:", {
                    count: transformedResults.length,
                    first_result: transformedResults[0] || null
                })
            } catch (err) {
                console.error('Failed to fetch search results:', err)
                setError(err instanceof Error ? err.message : 'Failed to fetch search results')
                setResults([])
            } finally {
                setLoading(false)
            }
        }

        fetchResults()
    }, [query])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                    <p className="mt-4 text-gray-600">Loading search results...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-red-900 mb-2">Error</h2>
                    <p className="text-red-700">{error}</p>
                </div>
            </div>
        )
    }

    return <MarioSearchResults query={query || ''} results={results || []} />
}

export default function ResultsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        }>
            <ResultsContent />
        </Suspense>
    )
}


