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

    // 🔍 DEBUG: Log query param on mount and changes
    // useEffect(() => {
    //     console.log("🔍 [ROUTING] Query param detected:", {
    //         query,
    //         queryLength: query.length,
    //         searchParamsString: searchParams.toString(),
    //         hasQParam: searchParams.has('q')
    //     })
    // }, [query, searchParams])

    useEffect(() => {
        const fetchResults = async () => {
            if (!query || query.length < 2) {
                // console.log("🔍 [ROUTING] Query too short or empty, skipping fetch:", { query, length: query.length })
                setResults([])
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                setError(null)

                // Call backend API
                const url = `${API_BASE_URL}/api/v1/search?q=${encodeURIComponent(query)}&zip_code=10001&radius=25`
                // console.log("🔍 [API CALL] Fetching results from:", url)
                // console.log("🔍 [API CALL] HTTP Method: GET")
                // console.log("🔍 [API CALL] Parameters:", { query, zip_code: "10001", radius: 25 })
                
                const response = await fetch(url)
                
                // console.log("🔍 [API CALL] Response status:", response.status, response.statusText)
                
                if (!response.ok) {
                    throw new Error(`API request failed: ${response.status} ${response.statusText}`)
                }

                const data = await response.json()
                // console.log("🔍 [API CALL] Raw API response:", {
                //     query: data.query,
                //     results_count: data.results_count,
                //     results_length: data.results?.length || 0,
                //     first_3_results: data.results?.slice(0, 3).map((r: any) => ({
                //         procedure_id: r.procedure_id,
                //         procedure_name: r.procedure_name,
                //         best_price: r.best_price,
                //         avg_price: r.avg_price,
                //         nearest_distance_miles: r.nearest_distance_miles
                //     })) || []
                // })

                // Transform API results to match component format
                const transformedResults = (data.results || []).map((result: any) => ({
                    id: result.procedure_id || `procedure-${result.procedure_slug}`,
                    procedureSlug: result.procedure_slug || result.procedure_id,
                    name: result.procedure_name,
                    specialty: result.category_name || 'Procedure',
                    type: 'procedure' as const,
                    address: '',
                    city: '',
                    state: '',
                    zipCode: '',
                    phone: '',
                    website: undefined,
                    distance: result.nearest_distance_miles || 0, // Number, not string - fix for filter compatibility
                    distanceNumeric: result.nearest_distance_miles || 0,
                    inNetwork: true,
                    rating: 4.5,
                    reviewCount: result.provider_count || 0,
                    hours: {},
                    services: [],
                    acceptedInsurance: [],
                    about: result.family_name || '',
                    costs: {
                        // Use normalized 'MRI' key for component compatibility (component expects costs['MRI'])
                        'MRI': {
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

                // console.log("🔍 [STATE UPDATE] Before setResults:", {
                //     resultsLength: results.length,
                //     transformedCount: transformedResults.length,
                //     firstTransformed: transformedResults[0] ? {
                //         id: transformedResults[0].id,
                //         name: transformedResults[0].name,
                //         distance: transformedResults[0].distance,
                //         distanceNumeric: transformedResults[0].distanceNumeric,
                //         costKeys: Object.keys(transformedResults[0].costs || {}),
                //         inNetwork: transformedResults[0].inNetwork
                //     } : null
                // })

                setResults(transformedResults)
                
                // 🔍 DEBUG: Log after state update (will show in next render)
                // setTimeout(() => {
                //     console.log("🔍 [STATE UPDATE] After setResults (next render):", {
                //         resultsLength: transformedResults.length,
                //         stateUpdated: true
                //     })
                // }, 100)
            } catch (err) {
                // console.error('🔍 [API CALL] Failed to fetch search results:', err)
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

    // 🔍 DEBUG: Log before render
    // console.log("🔍 [RENDER] Rendering MarioSearchResults with:", {
    //     query,
    //     resultsLength: results.length,
    //     resultsArray: Array.isArray(results),
    //     firstResult: results[0] || null
    // })

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


