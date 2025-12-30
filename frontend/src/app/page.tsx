'use client'

import { MarioLandingPage } from '@/components/mario-landing-page'
import { useRouter } from 'next/navigation'
import { navigateToProcedure } from '@/lib/navigateToProcedure'
import { type AutocompleteSuggestion } from '@/components/mario-autocomplete-enhanced'

export default function HomePage() {
  const router = useRouter()

  const handleSearch = async (query: string, suggestion?: AutocompleteSuggestion) => {
    if (!query.trim()) {
      router.push('/procedures')
      return
    }

    const trimmedQuery = query.trim()
    
    // Specialty routing (preserve autocomplete metadata)
    if (suggestion?.type === 'specialty') {
      const slug = suggestion.specialtyId || suggestion.slug
      if (!slug) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('[home] specialty suggestion missing slug', suggestion)
        }
      } else {
        let zipParam = ''
        try {
          const storedZip = typeof window !== 'undefined' ? localStorage.getItem('userZipCode') : ''
          if (storedZip && storedZip.trim().length > 0) {
            zipParam = `?zip_code=${encodeURIComponent(storedZip.trim())}`
          }
        } catch (e) {
          // ignore localStorage errors
        }
        router.push(`/specialties/${slug}${zipParam}`)
        return
      }
    }
    
    // Search for procedure and route to /home?procedure=${slug} if found
    const navigated = await navigateToProcedure(trimmedQuery, router)
    
    // If no match found, navigateToProcedure shows toast but doesn't navigate
    // So we route to /home to show the home page
    if (!navigated) {
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
