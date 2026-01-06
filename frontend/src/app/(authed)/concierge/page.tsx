'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MessageSquare, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { BottomNav } from '@/components/navigation/BottomNav';
import Link from 'next/link';
import { FeatureGate } from '@/components/ui/FeatureGate';

interface ConciergeRequest {
    id: string;
    type: 'booking' | 'inquiry' | 'support';
    title: string;
    status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
    createdAt: string;
    providerName?: string;
    procedureName?: string;
}

import { ComingSoonOverlay } from '@/components/ui/ComingSoonOverlay';

export default function ConciergePage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [requests, setRequests] = useState<ConciergeRequest[]>([]);



    const handleBack = () => router.push('/home');

    return (
        <main className="min-h-screen bg-gray-50 pb-16 flex flex-col">
            <div className="flex-1">
                <ComingSoonOverlay
                    title="AI Concierge"
                    description="Your personal health advocate is almost ready. Soon you'll be able to chat with Mario to book appointments, resolve billing issues, and find the best specialist for your needs."
                    onBack={handleBack}
                />
            </div>
            <BottomNav />
        </main>
    );
}


