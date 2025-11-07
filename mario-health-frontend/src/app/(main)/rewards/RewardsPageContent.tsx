'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { MarioRewardsV2 } from '@/components/mario-rewards-v2'
import { useMarioPoints } from '@/lib/contexts/mario-points-context'
import { useMarioRewards } from '@/lib/hooks/use-mario-rewards'

export function RewardsPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { points } = useMarioPoints()
  const { showConfetti, confettiKey } = useMarioRewards()

  // Handle deep links to activity section
  useEffect(() => {
    const hash = searchParams.get('hash') || window.location.hash
    if (hash === '#activity') {
      // Scroll to activity section if needed
      setTimeout(() => {
        const element = document.getElementById('activity-section')
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }
  }, [searchParams])

  const handleBack = () => router.push('/home')

  return (
    <div className="min-h-screen bg-background">
      {/* Confetti animation */}
      {showConfetti && (
        <div
          key={confettiKey}
          className="fixed inset-0 pointer-events-none z-50"
          style={{
            animation: 'confetti-fall 3s ease-out forwards',
          }}
        >
          {/* Simple confetti effect */}
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                width: '10px',
                height: '10px',
                backgroundColor: ['#2E5077', '#4DA1A9', '#79D7BE', '#FFA726'][Math.floor(Math.random() * 4)],
                animation: `confetti-fall ${2 + Math.random() * 2}s ease-out forwards`,
                animationDelay: `${Math.random() * 0.5}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>
      )}
      <MarioRewardsV2 onBack={handleBack} />
    </div>
  )
}

