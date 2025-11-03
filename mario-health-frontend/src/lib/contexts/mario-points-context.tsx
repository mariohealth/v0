'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface MarioPointsContextType {
  points: number
  addPoints: (amount: number, reason: string) => void
  resetPoints: () => void
}

const MarioPointsContext = createContext<MarioPointsContextType | undefined>(undefined)

export function MarioPointsProvider({ children }: { children: React.ReactNode }) {
  const [points, setPoints] = useState(0)

  // Load points from localStorage on mount
  useEffect(() => {
    const savedPoints = localStorage.getItem('mario-points')
    if (savedPoints) {
      setPoints(parseInt(savedPoints, 10))
    } else {
      // Initial balance - can be adjusted
      setPoints(1250)
      localStorage.setItem('mario-points', '1250')
    }
  }, [])

  // Save points to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('mario-points', points.toString())
  }, [points])

  const addPoints = (amount: number, reason: string) => {
    setPoints(prev => {
      const newTotal = prev + amount
      console.log(`+${amount} MarioPoints: ${reason} (Total: ${newTotal})`)
      return newTotal
    })
  }

  const resetPoints = () => {
    setPoints(1250)
    localStorage.setItem('mario-points', '1250')
  }

  return (
    <MarioPointsContext.Provider value={{ points, addPoints, resetPoints }}>
      {children}
    </MarioPointsContext.Provider>
  )
}

export function useMarioPoints() {
  const context = useContext(MarioPointsContext)
  if (context === undefined) {
    throw new Error('useMarioPoints must be used within a MarioPointsProvider')
  }
  return context
}

