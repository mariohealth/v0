export function SkeletonCard() {
    return (
        <div className="animate-pulse border rounded-lg p-6">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
    );
}

export function SkeletonProviderCard() {
    return (
        <div className="animate-pulse bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Image skeleton */}
            <div className="h-48 bg-gray-200"></div>

            <div className="p-6">
                {/* Provider name */}
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>

                {/* Location */}
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>

                {/* Button */}
                <div className="h-12 bg-gray-200 rounded"></div>
            </div>
        </div>
    );
}

export function SkeletonProviderDetail() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header skeleton */}
            <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
                        <div className="flex gap-4 mb-4">
                            <div className="h-6 bg-gray-200 rounded w-24"></div>
                            <div className="h-6 bg-gray-200 rounded w-32"></div>
                            <div className="h-6 bg-gray-200 rounded w-28"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Gallery skeleton */}
                        <div className="animate-pulse bg-white rounded-lg border border-gray-200 p-6">
                            <div className="h-64 bg-gray-200 rounded"></div>
                        </div>

                        {/* Info skeleton */}
                        <div className="animate-pulse bg-white rounded-lg border border-gray-200 p-6">
                            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>

                        {/* Reviews skeleton */}
                        <div className="animate-pulse bg-white rounded-lg border border-gray-200 p-6">
                            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="border-b border-gray-100 pb-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="h-4 bg-gray-200 rounded w-16"></div>
                                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                                        </div>
                                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Booking skeleton */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-4">
                            <div className="animate-pulse bg-white rounded-lg border border-gray-200 p-6">
                                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                                <div className="space-y-3">
                                    <div className="h-10 bg-gray-200 rounded"></div>
                                    <div className="h-10 bg-gray-200 rounded"></div>
                                    <div className="h-12 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
