'use client';

import { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { MarioAIModal } from '@/components/mario-ai-modal';

export function MarioAIFloatingButton() {
    const [showModal, setShowModal] = useState(false);
    const pathname = usePathname();
    const { user } = useAuth();

    // Hide on login, landing, or if not authenticated
    if (pathname === '/login' || pathname === '/' || !user) {
        return null;
    }

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-50 w-14 h-14 rounded-full bg-[#2E5077] text-white shadow-lg hover:bg-[#1e3a5a] transition-all hover:scale-110 flex items-center justify-center"
                aria-label="Open MarioAI"
            >
                <Sparkles className="h-6 w-6" />
            </button>
            <MarioAIModal
                open={showModal}
                onClose={() => setShowModal(false)}
                mode="search"
            />
        </>
    );
}

