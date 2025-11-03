'use client'

import { ProviderDetailPage as ProviderDetailComponent } from '@/components/mario-provider-detail-enhanced'
import { useRouter } from 'next/navigation'

export function ProviderDetailClient({ provider }: { provider: any }) {
    const router = useRouter()
    
    const handleBack = () => router.push('/home')

    return (
        <ProviderDetailComponent
            provider={provider}
            onBack={handleBack}
            service="Office Visit"
        />
    )
}

