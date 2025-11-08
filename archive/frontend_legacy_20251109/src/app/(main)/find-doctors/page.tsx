'use client'

import { useRouter } from 'next/navigation'
import { MarioFindDoctors } from '@/components/mario-find-doctors'

export default function FindDoctorsPage() {
  const router = useRouter()

  const handleSpecialtySelect = (specialtyId: string) => {
    router.push(`/specialty/${specialtyId}`)
  }

  const handleBack = () => router.push('/home')

  return (
    <div className="min-h-screen bg-background">
      <MarioFindDoctors
        onSpecialtySelect={handleSpecialtySelect}
        onBack={handleBack}
      />
    </div>
  )
}
