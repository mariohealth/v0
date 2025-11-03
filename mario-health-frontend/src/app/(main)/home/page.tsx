'use client'

import { useRouter } from 'next/navigation'
import { MarioHome } from '@/components/mario-home'

export default function HomePage() {
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
