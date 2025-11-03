'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { MarioHome } from '@/components/mario-home'
import { useSearchPersistence } from '@/lib/hooks/use-search-persistence'

export default function SearchPage() {
    const router = useRouter()
    const { searchState, updateQuery } = useSearchPersistence()

    // Restore saved search state on mount
    useEffect(() => {
        if (searchState.query) {
            // You can restore the query to the search input if needed
            // This depends on how MarioHome component handles initial query
        }
    }, [])

    const handleSearch = (query: string) => {
        try {
            updateQuery(query)
            if (query && query.trim()) {
                router.push(`/results?q=${encodeURIComponent(query.trim())}`)
            } else {
                router.push('/search')
            }
        } catch (err) {
            console.error('Error handling search:', err)
            router.push('/search')
        }
    }

    const handleBrowseProcedures = () => {
        router.push('/procedures')
    }

    const handleFindDoctors = () => {
        router.push('/find-doctors')
    }

    const handleFindMedication = () => {
        router.push('/find-medication')
    }

    const handleMarioCare = () => {
        router.push('/mariocare')
    }

    const handleOpenAI = () => {
        router.push('/ai-chat')
    }

    const handleOpenAIWithPrompt = (prompt: string) => {
        router.push(`/ai-chat?prompt=${encodeURIComponent(prompt)}`)
    }

    return (
        <div className="min-h-screen bg-background">
            <MarioHome
                isReturningUser={true}
                onSearch={handleSearch}
                onOpenAI={handleOpenAI}
                onOpenAIWithPrompt={handleOpenAIWithPrompt}
                onBrowseProcedures={handleBrowseProcedures}
                onFindDoctors={handleFindDoctors}
                onFindMedication={handleFindMedication}
                onMarioCare={handleMarioCare}
            />
        </div>
    )
}
