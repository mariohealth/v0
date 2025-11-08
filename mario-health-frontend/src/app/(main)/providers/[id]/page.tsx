'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ProviderDetailPage as ProviderDetailComponent } from '@/components/mario-provider-detail-enhanced'
import { Button } from '@/components/ui/button'
import { API_BASE_URL } from '@/lib/config'

export default function ProviderDetailRoute() {
    const router = useRouter()
    const params = useParams()
    const providerId = params?.id as string
    const [provider, setProvider] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchProvider = async () => {
            if (!providerId) {
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                setError(null)

                const url = `${API_BASE_URL}/api/v1/providers/${providerId}`
                console.log("🔍 [API CALL] Fetching provider from:", url)
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
                setProvider(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch provider details')
            } finally {
                setLoading(false)
            }
        }

        fetchProvider()
    }, [providerId])

    const handleBack = () => router.push('/home')

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                    <p className="mt-4 text-gray-600">Loading provider details...</p>
                </div>
            </div>
        )
    }

    if (error || !provider) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-red-900 mb-2">Error</h2>
                    <p className="text-red-700 mb-4">{error || 'Provider not found'}</p>
                    <Button onClick={handleBack}>Go Back</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <ProviderDetailComponent
                provider={provider}
                onBack={handleBack}
                service="Office Visit"
            />
        </div>
    )
}
