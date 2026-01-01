'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MARIO_HITS_KEY, MARIO_PREV_PATH_KEY } from './NavigationTracker';

interface BackButtonProps {
    className?: string;
    variant?: 'default' | 'outline' | 'ghost';
    fallbackPath?: string;
    label?: string;
}

/**
 * BackButton provides a consistent back-navigation experience.
 * Strategy:
 * 1. Prefer pushing to 'mario_prev_path' (last known internal route).
 * 2. Fallback to router.back() if we have generic internal history (hits > 1).
 * 3. Final fallback to 'fallbackPath' (default /home).
 */
export function BackButton({
    className,
    variant = 'ghost',
    fallbackPath = '/home',
    label
}: BackButtonProps) {
    const router = useRouter();

    const handleBack = () => {
        try {
            const prevPath = sessionStorage.getItem(MARIO_PREV_PATH_KEY);
            const hits = parseInt(sessionStorage.getItem(MARIO_HITS_KEY) || '0', 10);

            if (prevPath && prevPath !== window.location.pathname + window.location.search) {
                // Safe internal return
                router.push(prevPath);
            } else if (hits > 1) {
                // Generic history back
                router.back();
            } else {
                // Escape hatch
                router.push(fallbackPath);
            }
        } catch (e) {
            router.push(fallbackPath);
        }
    };

    return (
        <button
            onClick={handleBack}
            className={cn(
                "inline-flex items-center gap-2 p-2 rounded-full transition-colors",
                variant === 'ghost' ? "hover:bg-gray-100" : "bg-white border shadow-sm hover:bg-gray-50",
                className
            )}
            aria-label="Back"
        >
            <ArrowLeft className="h-6 w-6 text-[#2E5077]" />
            {label && <span className="text-sm font-medium text-[#2E5077]">{label}</span>}
        </button>
    );
}
