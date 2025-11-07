import { Suspense } from 'react'
import { RewardsPageContent } from './RewardsPageContent'

export default function RewardsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>}>
      <RewardsPageContent />
    </Suspense>
  )
}
