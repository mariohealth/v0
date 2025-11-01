'use client'

import { MarioLandingPage } from '@/components/mario-landing-page'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    } else {
      router.push('/search')
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
