'use client'

import { MarioLandingPage } from '@/components/mario-landing-page'
import { useRouter } from 'next/navigation'
import { navigateToProcedure } from '@/lib/navigateToProcedure'
import { type AutocompleteSuggestion } from '@/components/mario-autocomplete-enhanced'
import { useState } from 'react'

export default function HomePage() {
  const router = useRouter()
  const [noResultsMessage, setNoResultsMessage] = useState<string | null>(null)

  // Helper to check if a string is a valid URL slug
  const isSlugLike = (str: string): boolean => {
    return /^[a-z0-9-]+$/i.test(str) && /[a-z-]/.test(str)
  }

  const handleSearch = async (query: string, suggestion?: AutocompleteSuggestion) => {
    if (!query.trim()) {
      router.push('/procedures')
      return
    }

    const trimmedQuery = query.trim()

    // Specialty routing (preserve autocomplete metadata)
    if (suggestion?.type === 'specialty') {
      const slug = suggestion.slug || suggestion.specialtyId
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
        setNoResultsMessage(null)
        return
      }
    }

    // Procedure routing (direct navigation to canonical URL)
    if (suggestion?.type === 'procedure') {
      const slug = suggestion.procedureSlug ||
                   suggestion.slug ||
                   (suggestion.id && isSlugLike(suggestion.id) ? suggestion.id : null)
      if (slug) {
        router.push(`/procedures/${slug}`)
        setNoResultsMessage(null)
        return
      } else if (process.env.NODE_ENV !== 'production') {
        console.warn('[home] procedure suggestion missing slug', suggestion)
      }
    }

    // Fallback: search for procedure and route to /procedures/${slug} if found
    const navigated = await navigateToProcedure(trimmedQuery, router)
    
    // If no match found, navigateToProcedure shows toast but doesn't navigate
    if (!navigated) {
      setNoResultsMessage(`We didn’t find any results for “${trimmedQuery}”. Please choose a suggestion.`)
    } else {
      setNoResultsMessage(null)
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
    <>
      {noResultsMessage && (
        <div className="mx-auto max-w-5xl px-4 pt-4">
          <div className="rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
            {noResultsMessage}
          </div>
        </div>
      )}
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
    </>
  )
}
