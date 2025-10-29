"use client";

import { useEffect, useRef, useState } from 'react';

interface PullToRefreshOptions {
    onRefresh: () => Promise<void>;
    threshold?: number;
    resistance?: number;
    disabled?: boolean;
}

interface PullToRefreshState {
    isPulling: boolean;
    isRefreshing: boolean;
    pullDistance: number;
}

export function usePullToRefresh({
    onRefresh,
    threshold = 80,
    resistance = 2.5,
    disabled = false,
}: PullToRefreshOptions) {
    const [state, setState] = useState<PullToRefreshState>({
        isPulling: false,
        isRefreshing: false,
        pullDistance: 0,
    });

    const startY = useRef(0);
    const currentY = useRef(0);
    const isAtTop = useRef(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (disabled || !containerRef.current) return;

        const container = containerRef.current;

        const handleTouchStart = (e: TouchEvent) => {
            if (state.isRefreshing) return;

            startY.current = e.touches[0].clientY;
            currentY.current = e.touches[0].clientY;

            // Check if we're at the top of the scrollable area
            isAtTop.current = container.scrollTop === 0;
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (state.isRefreshing || !isAtTop.current) return;

            currentY.current = e.touches[0].clientY;
            const pullDistance = Math.max(0, (currentY.current - startY.current) / resistance);

            if (pullDistance > 0) {
                e.preventDefault();
                setState(prev => ({
                    ...prev,
                    isPulling: true,
                    pullDistance: Math.min(pullDistance, threshold * 1.5),
                }));
            }
        };

        const handleTouchEnd = async () => {
            if (state.isRefreshing) return;

            if (state.pullDistance >= threshold && isAtTop.current) {
                setState(prev => ({ ...prev, isRefreshing: true }));

                try {
                    await onRefresh();
                } catch (error) {
                    console.error('Pull to refresh failed:', error);
                } finally {
                    setState({
                        isPulling: false,
                        isRefreshing: false,
                        pullDistance: 0,
                    });
                }
            } else {
                setState(prev => ({
                    ...prev,
                    isPulling: false,
                    pullDistance: 0,
                }));
            }
        };

        container.addEventListener('touchstart', handleTouchStart, { passive: false });
        container.addEventListener('touchmove', handleTouchMove, { passive: false });
        container.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            container.removeEventListener('touchstart', handleTouchStart);
            container.removeEventListener('touchmove', handleTouchMove);
            container.removeEventListener('touchend', handleTouchEnd);
        };
    }, [state.isRefreshing, state.pullDistance, threshold, resistance, disabled, onRefresh]);

    return {
        ...state,
        containerRef,
        canRefresh: state.pullDistance >= threshold,
    };
}
