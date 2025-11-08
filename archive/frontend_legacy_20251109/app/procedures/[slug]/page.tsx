'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Star, CheckCircle2, TrendingDown, Sparkles } from 'lucide-react';
import { getProcedureProviders, type ProcedureProvider } from '@/lib/backend-api';
import { SkeletonCard } from '@/components/ui/loading-spinner';
import { ErrorMessage, EmptyState } from '@/components/ui/error-message';

export default function ProcedureProvidersPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [procedureName, setProcedureName] = useState('');
    const [providers, setProviders] = useState<ProcedureProvider[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getProcedureProviders(slug);
                setProcedureName(data.procedureName);
                setProviders(data.providers);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load providers');
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchData();
        }
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <ErrorMessage
                        message={error}
                        onRetry={() => window.location.reload()}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b sticky top-16 z-40">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Search
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">{procedureName}</h1>
                    <p className="text-gray-600 mt-2">
                        {providers.length} {providers.length === 1 ? 'provider' : 'providers'} available
                    </p>
                </div>
            </div>

            {/* Provider List */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {providers.length === 0 ? (
                    <EmptyState
                        message="No providers found for this procedure"
                        description="Try searching for a different procedure"
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {providers.map((provider) => (
                            <ProviderCard
                                key={provider.providerId}
                                provider={provider}
                                procedureSlug={slug}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function ProviderCard({ provider, procedureSlug }: { provider: ProcedureProvider; procedureSlug: string }) {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/providers/${provider.providerId}/${procedureSlug}`);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div
            onClick={handleClick}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer hover:border-emerald-500"
        >
            {/* Provider Name & Badge */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {provider.providerName}
                    </h3>
                    {provider.inNetwork && (
                        <div className="inline-flex items-center gap-1 text-emerald-600 text-sm">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>In Network</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Location */}
            {provider.distance !== null && (
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{provider.distance.toFixed(1)} mi away</span>
                    {provider.city && provider.state && (
                        <span>• {provider.city}, {provider.state}</span>
                    )}
                </div>
            )}

            {/* Rating */}
            {provider.rating !== null && (
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-gray-900">{provider.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-gray-600 text-sm">
                        ({provider.reviews} {provider.reviews === 1 ? 'review' : 'reviews'})
                    </span>
                </div>
            )}

            {/* Price */}
            <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl font-bold text-emerald-600">
                        {formatPrice(provider.priceEstimate)}
                    </span>
                    {provider.priceAverage && provider.priceAverage > provider.priceEstimate && (
                        <span className="text-lg text-gray-500 line-through">
                            {formatPrice(provider.priceAverage)}
                        </span>
                    )}
                </div>
                {provider.priceRelativeToAverage && (
                    <div className="flex items-center gap-1 text-emerald-600 text-sm">
                        <TrendingDown className="w-4 h-4" />
                        <span>{provider.priceRelativeToAverage}</span>
                    </div>
                )}
            </div>

            {/* MarioPoints */}
            {provider.marioPoints > 0 && (
                <div className="flex items-center gap-2 text-emerald-600 mb-4">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-medium">
                        Earn +{provider.marioPoints} MarioPoints
                    </span>
                </div>
            )}

            {/* CTA Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                }}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
                Book with Concierge
            </button>
        </div>
    );
}

