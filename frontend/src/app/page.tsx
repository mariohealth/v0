'use client'

import { MarioLandingPage } from '@/components/mario-landing-page'
import { useRouter } from 'next/navigation'
import { searchProcedures } from '@/lib/api'
import { MarioToast } from '@/components/mario-toast-helper'

export default function HomePage() {
  const router = useRouter()

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      router.push('/procedures')
      return
    }

    const trimmedQuery = query.trim()
    
    // Search for procedure and route to /home?procedure=${slug} if found
    try {
      const searchResponse = await searchProcedures(trimmedQuery)
      
      // Find the best matching procedure result
      if (searchResponse.results && searchResponse.results.length > 0) {
        // Use the first result (highest match score) as the best match
        const bestMatch = searchResponse.results[0]
        if (bestMatch.procedure_slug) {
          router.push(`/home?procedure=${encodeURIComponent(bestMatch.procedure_slug)}`)
          return
        }
      }
      
      // No procedure found - show toast and route to /home
      MarioToast.error('No matching procedure found', 'Try searching for a specific procedure name')
      router.push('/home')
    } catch (error) {
      console.error('Error searching procedures:', error)
      // On error, show toast and route to /home
      MarioToast.error('Search failed', 'Please try again or browse procedures')
      router.push('/home')
    }
  }

  const handleSignUp = () => {
    router.push('/signup')
  }

  const handleLogin = () => {
    router.push('/login')
  }

  const handleNavigate = (path: string) => {
    router.push(path)
  }

  return (
    <MarioLandingPage
      onSearch={handleSearch}
      onSignUp={handleSignUp}
      onLogin={handleLogin}
      onNavigateToAbout={() => handleNavigate('/about')}
      onNavigateToTransparency={() => handleNavigate('/transparency')}
      onNavigateToContact={() => handleNavigate('/contact')}
      onNavigateToEmployers={() => handleNavigate('/employers')}
      onNavigateToPrivacy={() => handleNavigate('/privacy')}
    />
  )
}
