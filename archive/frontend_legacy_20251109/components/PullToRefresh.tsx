"use client";

import { RefreshCw } from "lucide-react";
import { usePullToRefresh } from "@/lib/usePullToRefresh";

interface PullToRefreshProps {
    onRefresh: () => Promise<void>;
    children: React.ReactNode;
    disabled?: boolean;
    className?: string;
}

export function PullToRefresh({
    onRefresh,
    children,
    disabled = false,
    className = ""
}: PullToRefreshProps) {
    const { isPulling, isRefreshing, pullDistance, containerRef, canRefresh } = usePullToRefresh({
        onRefresh,
        disabled,
    });

    const progress = Math.min(pullDistance / 80, 1);
    const rotation = progress * 180;

    return (
        <div className={`relative ${className}`}>
            {/* Pull to refresh indicator */}
            <div
                className={`fixed top-0 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-200 ${isPulling || isRefreshing ? 'opacity-100' : 'opacity-0'
                    }`}
                style={{
                    transform: `translateX(-50%) translateY(${Math.min(pullDistance, 80)}px)`,
                }}
            >
                <div className="bg-white rounded-full p-3 shadow-lg border border-gray-200">
                    <RefreshCw
                        className={`w-6 h-6 text-emerald-500 transition-transform duration-200 ${isRefreshing ? 'animate-spin' : ''
                            }`}
                        style={{
                            transform: isRefreshing ? 'rotate(0deg)' : `rotate(${rotation}deg)`,
                        }}
                    />
                </div>
            </div>

            {/* Content container */}
            <div
                ref={containerRef}
                className={`transition-transform duration-200 ${isPulling ? 'transform' : ''
                    }`}
                style={{
                    transform: isPulling ? `translateY(${pullDistance * 0.3}px)` : 'translateY(0)',
                }}
            >
                {children}
            </div>

            {/* Overlay for refreshing state */}
            {isRefreshing && (
                <div className="fixed inset-0 bg-black bg-opacity-10 z-40 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-4 shadow-lg flex items-center gap-3">
                        <RefreshCw className="w-5 h-5 text-emerald-500 animate-spin" />
                        <span className="text-gray-700 font-medium">Refreshing...</span>
                    </div>
                </div>
            )}
        </div>
    );
}
