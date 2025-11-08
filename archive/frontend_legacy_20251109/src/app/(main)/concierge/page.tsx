'use client'

import { useRouter } from 'next/navigation'
import { MarioConciergeRequests } from '@/components/mario-concierge-requests'
import { toast } from 'sonner'
import { useMarioRewards } from '@/lib/hooks/use-mario-rewards'

export default function ConciergePage() {
  const router = useRouter()
  const { earnPoints } = useMarioRewards()

  const handleRequestSubmitted = () => {
    // Earn points for submitting a concierge request
    earnPoints('submit_claim', 30)
    
    // Show toast and redirect
    toast.success('Concierge request submitted!', {
      description: 'Your request has been received. You\'ll be notified when it\'s confirmed.',
    })

    // Redirect to health hub after a short delay
    setTimeout(() => {
      router.push('/health-hub')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-background">
      <MarioConciergeRequests 
        onRequestSubmitted={handleRequestSubmitted}
      />
    </div>
  )
}
