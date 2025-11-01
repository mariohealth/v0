'use client'

import { UniversalSearch as MarioUniversalSearch } from '@/components/mario-universal-search'
import { useRouter } from 'next/navigation'

export default function SearchPage() {
    const router = useRouter()

    const handleSearch = (query: string) => {
        if (query.trim()) {
            router.push(`/results?q=${encodeURIComponent(query)}`)
        }
    }

    return (
        <MarioUniversalSearch
            onSearch={handleSearch}
            autoFocus={true}
            placeholder="Search services, doctors, or meds..."
        />
    )
}
