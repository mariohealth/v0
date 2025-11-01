'use client'

import { useRouter } from 'next/navigation'
import { MarioHome } from '@/components/mario-home'
import { MarioSmartSearch } from '@/components/mario-smart-search'

export default function SearchPage() {
    const router = useRouter()

    const handleSearch = (query: string) => {
        if (query.trim()) {
            router.push(`/results?q=${encodeURIComponent(query)}`)
        } else {
            router.push('/search')
        }
    }

    const handleBrowseProcedures = () => {
        router.push('/procedures')
    }

    const handleFindDoctors = () => {
        router.push('/doctors')
    }

    const handleFindMedication = () => {
        router.push('/medications')
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
