'use client'

import { useRouter } from 'next/navigation'
import { MarioFindMedication } from '@/components/mario-find-medication'

export default function FindMedicationPage() {
  const router = useRouter()

  const handleBack = () => router.push('/home')
  const handleMedicationClick = (medicationId: string) => {
    router.push(`/medication/${medicationId}`)
  }
  const handleCategoryClick = (categoryId: string) => {
    router.push(`/medications/category/${categoryId}`)
  }
  const handleBrowseByLetter = () => {
    router.push('/medications/browse')
  }

  return (
    <div className="min-h-screen bg-background">
      <MarioFindMedication
        onBack={handleBack}
        onMedicationClick={handleMedicationClick}
        onCategoryClick={handleCategoryClick}
        onBrowseByLetter={handleBrowseByLetter}
      />
    </div>
  )
}
