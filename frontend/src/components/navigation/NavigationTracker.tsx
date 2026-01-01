'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export const MARIO_HITS_KEY = 'mario_internal_hits';
export const MARIO_PREV_PATH_KEY = 'mario_prev_path';
export const MARIO_CURR_PATH_KEY = 'mario_curr_path';

function NavigationTrackerContent() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        try {
            const fullPath = pathname + (searchParams?.size ? `?${searchParams.toString()}` : '');
            const lastStoredPath = sessionStorage.getItem(MARIO_CURR_PATH_KEY);

            // Only process if the path has actually changed (ignore pure refreshes)
            if (lastStoredPath !== fullPath) {
                // 1. Increment Hit Counter
                const currentHits = parseInt(sessionStorage.getItem(MARIO_HITS_KEY) || '0', 10);
                sessionStorage.setItem(MARIO_HITS_KEY, (currentHits + 1).toString());

                // 2. Rotate Paths (Current becomes Previous)
                if (lastStoredPath) {
                    sessionStorage.setItem(MARIO_PREV_PATH_KEY, lastStoredPath);
                }
                sessionStorage.setItem(MARIO_CURR_PATH_KEY, fullPath);
            }
        } catch (e) {
            console.warn('[NavTracker] sessionStorage error', e);
        }
    }, [pathname, searchParams]);

    return null;
}

/**
 * NavigationTracker observes route changes to build a simple session history.
 * Wrapped in Suspense to avoid de-optimizing parent layouts due to useSearchParams.
 */
export function NavigationTracker() {
    return (
        <Suspense fallback={null}>
            <NavigationTrackerContent />
        </Suspense>
    );
}
