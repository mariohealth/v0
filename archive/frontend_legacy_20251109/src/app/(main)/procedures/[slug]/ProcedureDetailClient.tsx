'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { API_BASE_URL } from '@/lib/config'

export function ProcedureDetailClient({ slug }: { slug: string }) {
    const router = useRouter()
    const [procedure, setProcedure] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchProcedure = async () => {
            if (!slug) {
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                setError(null)

                const url = `${API_BASE_URL}/api/v1/procedures/${slug}`
                console.log("🔍 [API CALL] Fetching procedure from:", url)
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

                if (!response.ok) {
                    throw new Error(`API request failed: ${response.status} ${response.statusText}`)
                }

                const data = await response.json()
                setProcedure(data)
            } catch (err) {
                console.error('❌ [API CALL] Failed to fetch procedure details:', err)
                console.error('❌ [API CALL] Error details:', {
                    message: err instanceof Error ? err.message : String(err),
                    url: `${API_BASE_URL}/api/v1/procedures/${slug}`,
                    API_BASE_URL
                })
                setError(err instanceof Error ? err.message : 'Failed to fetch procedure details')
            } finally {
                setLoading(false)
            }
        }

        fetchProcedure()
    }, [slug])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                    <p className="mt-4 text-gray-600">Loading procedure details...</p>
                </div>
            </div>
        )
    }

    if (error || !procedure) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-red-900 mb-2">Error</h2>
                    <p className="text-red-700 mb-4">{error || 'Procedure not found'}</p>
                    <Button onClick={() => router.back()}>Go Back</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background pb-20 md:pb-0">
            {/* Header */}
            <div className="sticky top-0 bg-background border-b border-border z-10">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => router.back()}
                        className="mb-4"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Back
                    </Button>
                    <h1 className="text-2xl font-bold">{procedure.name || procedure.procedure_name || 'Procedure Details'}</h1>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto p-4">
                <div className="bg-white rounded-lg border p-6 space-y-6">
                    {procedure.description && (
                        <div>
                            <h2 className="text-lg font-semibold mb-2">Description</h2>
                            <p className="text-muted-foreground">{procedure.description}</p>
                        </div>
                    )}

                    {procedure.category_name && (
                        <div>
                            <h2 className="text-lg font-semibold mb-2">Category</h2>
                            <p className="text-muted-foreground">{procedure.category_name}</p>
                        </div>
                    )}

                    {procedure.family_name && (
                        <div>
                            <h2 className="text-lg font-semibold mb-2">Family</h2>
                            <p className="text-muted-foreground">{procedure.family_name}</p>
                        </div>
                    )}

                    {procedure.avg_price && (
                        <div>
                            <h2 className="text-lg font-semibold mb-2">Average Price</h2>
                            <p className="text-2xl font-bold text-primary">${procedure.avg_price}</p>
                        </div>
                    )}

                    {procedure.best_price && (
                        <div>
                            <h2 className="text-lg font-semibold mb-2">Best Price</h2>
                            <p className="text-2xl font-bold text-green-600">${procedure.best_price}</p>
                        </div>
                    )}

                    {procedure.provider_count !== undefined && (
                        <div>
                            <h2 className="text-lg font-semibold mb-2">Providers</h2>
                            <p className="text-muted-foreground">{procedure.provider_count} providers available</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
