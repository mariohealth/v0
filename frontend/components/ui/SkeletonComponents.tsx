import React from 'react';

interface SkeletonProps {
    className?: string;
    height?: string;
    width?: string;
    rounded?: boolean;
    shimmer?: boolean;
}

export function Skeleton({
    className = '',
    height = 'h-4',
    width = 'w-full',
    rounded = true,
    shimmer = true
}: SkeletonProps) {
    return (
        <div
            className={`
                bg-gray-200 ${shimmer ? 'animate-pulse' : ''} 
                ${height} ${width} ${rounded ? 'rounded' : ''} 
                ${className}
            `}
        />
    );
}

// Enhanced skeleton with shimmer effect
export function ShimmerSkeleton({ className = '', height = 'h-4', width = 'w-full', rounded = true }: SkeletonProps) {
    return (
        <div className={`relative overflow-hidden ${height} ${width} ${rounded ? 'rounded' : ''} ${className}`}>
            <div className="absolute inset-0 bg-gray-200" />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
        </div>
    );
}

export function SkeletonProviderCard({ delay = 0 }: { delay?: number }) {
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <div
            className={`
                bg-white rounded-lg border border-gray-200 p-6
                transition-opacity duration-300
                ${isVisible ? 'opacity-100' : 'opacity-0'}
            `}
        >
            {/* Header with image and basic info */}
            <div className="flex gap-4 mb-4">
                <ShimmerSkeleton className="w-16 h-16 rounded-full" />
                <div className="flex-1">
                    <ShimmerSkeleton className="h-5 w-3/4 mb-2" />
                    <ShimmerSkeleton className="h-4 w-1/2 mb-1" />
                    <ShimmerSkeleton className="h-4 w-2/3" />
                </div>
            </div>

            {/* Rating and reviews */}
            <div className="flex items-center gap-2 mb-3">
                <ShimmerSkeleton className="h-4 w-20" />
                <ShimmerSkeleton className="h-4 w-16" />
            </div>

            {/* Address */}
            <div className="mb-3">
                <ShimmerSkeleton className="h-4 w-full mb-1" />
                <ShimmerSkeleton className="h-4 w-3/4" />
            </div>

            {/* Price */}
            <div className="mb-4">
                <ShimmerSkeleton className="h-6 w-24 mb-1" />
                <ShimmerSkeleton className="h-4 w-32" />
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
                <ShimmerSkeleton className="h-10 w-24 rounded-lg" />
                <ShimmerSkeleton className="h-10 w-20 rounded-lg" />
            </div>
        </div>
    );
}

export function SkeletonSearchResults({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: count }).map((_, index) => (
                <SkeletonProviderCard key={index} delay={index * 100} />
            ))}
        </div>
    );
}

export function SkeletonSearchHeader() {
    return (
        <div className="bg-white border-b border-gray-200 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search input */}
                    <div className="flex-1">
                        <Skeleton className="h-12 w-full rounded-lg" />
                    </div>

                    {/* Location input */}
                    <div className="lg:w-64">
                        <Skeleton className="h-12 w-full rounded-lg" />
                    </div>

                    {/* Search button */}
                    <div className="lg:w-32">
                        <Skeleton className="h-12 w-full rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function SkeletonFilters() {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <Skeleton className="h-6 w-24 mb-4" />

            {/* Price range */}
            <div className="mb-6">
                <Skeleton className="h-5 w-20 mb-3" />
                <Skeleton className="h-2 w-full rounded-full mb-2" />
                <div className="flex justify-between">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-12" />
                </div>
            </div>

            {/* Provider types */}
            <div className="mb-6">
                <Skeleton className="h-5 w-24 mb-3" />
                <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4 rounded" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Rating */}
            <div>
                <Skeleton className="h-5 w-16 mb-3" />
                <Skeleton className="h-2 w-full rounded-full mb-2" />
                <div className="flex justify-between">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-8" />
                </div>
            </div>
        </div>
    );
}

export function SkeletonSearchPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <SkeletonSearchHeader />

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Filters sidebar */}
                    <aside className="hidden lg:block lg:w-80 flex-shrink-0">
                        <div className="sticky top-24">
                            <SkeletonFilters />
                        </div>
                    </aside>

                    {/* Results */}
                    <div className="flex-1">
                        {/* Sort options */}
                        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <Skeleton className="h-4 w-48" />
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-12" />
                                    <Skeleton className="h-10 w-32 rounded-lg" />
                                </div>
                            </div>
                        </div>

                        {/* Provider cards */}
                        <SkeletonSearchResults />
                    </div>
                </div>
            </div>
        </div>
    );
}
