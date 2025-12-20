'use client';

import React from 'react';
import { isFeatureEnabled, type FeatureFlag } from '@/lib/flags';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface FeatureGateProps {
    feature: FeatureFlag;
    children: React.ReactNode;
    fallback?: React.ReactNode;
    showOverlay?: boolean; // If true, shows children with an overlay instead of hiding them
    className?: string;
}

export function FeatureGate({
    feature,
    children,
    fallback = null,
    showOverlay = false,
    className
}: FeatureGateProps) {
    const enabled = isFeatureEnabled(feature);

    if (enabled) {
        return <>{children}</>;
    }

    if (showOverlay) {
        return (
            <div className={cn("relative group", className)}>
                <div className="pointer-events-none opacity-30 filter grayscale select-none">
                    {children}
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-[1px] z-10">
                    <Badge variant="secondary" className="text-sm py-1 px-3 shadow-sm border-primary/20 bg-background/90">
                        Coming Soon
                    </Badge>
                </div>
            </div>
        );
    }

    return <>{fallback}</>;
}
