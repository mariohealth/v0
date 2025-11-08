'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMarioPoints } from '../contexts/mario-points-context'
import { toast } from 'sonner'

export function useMarioRewards() {
  const router = useRouter()
  const { points, addPoints } = useMarioPoints()
  const [showConfetti, setShowConfetti] = useState(false)
  const [confettiKey, setConfettiKey] = useState(0)

  // Check if user hit a milestone
  useEffect(() => {
    const milestones = [500, 1000, 2000, 5000, 10000]
    if (milestones.includes(points)) {
      triggerConfetti()
    }
  }, [points])

  const triggerConfetti = useCallback(() => {
    setShowConfetti(true)
    setConfettiKey(prev => prev + 1)
    setTimeout(() => setShowConfetti(false), 3000)
  }, [])

  const earnPoints = useCallback((action: string, pointsAmount: number, savings?: number) => {
    // Points based on action type
    const pointsMap: Record<string, number> = {
      'book_appointment': 50,
      'complete_profile': 50,
      'upload_insurance': 25,
      'submit_claim': 30,
      'leave_review': 20,
      'share_app': 100,
      'refer_friend': 200,
      'first_search': 10,
    }

    const pointsToAdd = pointsMap[action] || pointsAmount || 10
    addPoints(pointsToAdd, action)

    // Show toast notification with deep link to rewards
    toast.success(`+${pointsToAdd} MarioPoints earned!`, {
      description: action + (savings ? ` • You saved $${savings}` : ''),
      action: {
        label: 'View Rewards',
        onClick: () => navigateToRewards('#activity')
      },
      duration: 6000
    })

    // Check for milestone
    const newTotal = points + pointsToAdd
    const milestones = [500, 1000, 2000, 5000, 10000]
    if (milestones.some(m => newTotal >= m && points < m)) {
      triggerConfetti()
    }
  }, [points, addPoints, triggerConfetti])

  const navigateToRewards = useCallback((hash?: string) => {
    if (hash) {
      router.push(`/rewards${hash}`)
    } else {
      router.push('/rewards')
    }
  }, [router])

  return {
    points,
    earnPoints,
    navigateToRewards,
    showConfetti,
    confettiKey,
    triggerConfetti,
  }
}

