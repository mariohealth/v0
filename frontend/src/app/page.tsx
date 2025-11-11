'use client'

import { MarioLandingPage } from '@/components/mario-landing-page'
import { useRouter } from 'next/navigation'
import { navigateToProcedure } from '@/lib/navigateToProcedure'

export default function HomePage() {
  const router = useRouter()

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      router.push('/procedures')
      return
    }

    const trimmedQuery = query.trim()
    
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
