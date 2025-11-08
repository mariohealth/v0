'use client'

import { useEffect, useState } from 'react'

interface ConfettiProps {
  show: boolean
  duration?: number
}

export function MarioConfetti({ show, duration = 3000 }: ConfettiProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [show, duration])

  if (!isVisible) return null

  const colors = ['#2E5077', '#4DA1A9', '#79D7BE', '#FFA726', '#00AA66']

  return (
    <div
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
      style={{ top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {Array.from({ length: 100 }).map((_, i) => {
        const color = colors[Math.floor(Math.random() * colors.length)]
        const left = Math.random() * 100
        const delay = Math.random() * 0.5
        const duration = 2 + Math.random() * 2

        return (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${left}%`,
              top: '-10px',
              width: '8px',
              height: '8px',
              backgroundColor: color,
              borderRadius: '50%',
              animation: `confetti-fall ${duration}s ease-out forwards`,
              animationDelay: `${delay}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        )
      })}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

