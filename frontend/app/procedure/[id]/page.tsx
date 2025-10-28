'use client';

// API: GET /api/v1/procedures/{slug}

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, MapPin, Star, CheckCircle2 } from 'lucide-react';
import { getProcedureDetail, type ProcedureDetail, type CarrierPrice } from '@/lib/backend-api';
import { SkeletonCard } from '@/components/ui/loading-spinner';
import { ErrorMessage, EmptyState } from '@/components/ui/error-message';

export default function ProcedurePage() {
    const params = useParams();
    const procedureSlug = params.slug as string;

    const [procedure, setProcedure] = useState<ProcedureDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getProcedureDetail(procedureSlug);
                setProcedure(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load procedure details');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [procedureSlug]);

    if (loading) {
        return (
            <div className="min-h-screen p-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="h-8 bg-muted rounded w-48 mb-8 animate-pulse"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !procedure) {
        return (
            <div className="min-h-screen p-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </Link>
                    <ErrorMessage
                        title={error || 'Procedure not found'}
                        message="Unable to load this procedure. Please try again or return home."
                        onRetry={() => window.location.reload()}
                    />
                </div>
            </div>
        );
    }

    // Price calculations from backend data
    const savingsFromMin = procedure.avgPrice && procedure.minPrice ? procedure.avgPrice - procedure.minPrice : 0;
    const savingsToMax = procedure.maxPrice && procedure.avgPrice ? procedure.maxPrice - procedure.avgPrice : 0;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="border-b bg-white sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="bg-white rounded-lg border p-8 mb-8">
                    <div className="space-y-6">
                        {/* Category breadcrumb */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                            <span>/</span>
                            <Link href={`/category/${procedure.categorySlug}`} className="hover:text-primary transition-colors">
                                {procedure.categoryName}
                            </Link>
                            <span>/</span>
                            <Link href={`/family/${procedure.familySlug}`} className="hover:text-primary transition-colors">
                                {procedure.familyName}
                            </Link>
                            <span>/</span>
                            <span className="text-foreground">{procedure.name}</span>
                        </div>

                        {/* Title and Description */}
                        <div>
                            <h1 className="text-4xl font-bold mb-3">{procedure.name}</h1>
                            <p className="text-lg text-muted-foreground">{procedure.description}</p>
                        </div>

                        {/* Price Range Visualization */}
                        {procedure.avgPrice && (
                            <div className="space-y-4">
                                <div className="flex items-baseline gap-4">
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="h-8 w-8 text-muted-foreground" />
                                        <span className="text-5xl font-bold text-primary">
                                            ${procedure.avgPrice}
                                        </span>
                                    </div>
                                    <span className="text-sm text-muted-foreground">average price</span>
                                </div>

                                {/* Price Range Bar */}
                                {procedure.minPrice && procedure.maxPrice && (
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                            <span>Lowest: ${procedure.minPrice}</span>
                                            <span>Highest: ${procedure.maxPrice}</span>
                                        </div>
                                        <div className="relative h-4 bg-muted rounded-full overflow-hidden">
                                            <div className="absolute inset-0 flex">
                                                {/* Current average position indicator */}
                                                {procedure.avgPrice && (
                                                    <div
                                                        className="h-full w-1 bg-primary absolute z-10"
                                                        style={{
                                                            left: `${((procedure.avgPrice - procedure.minPrice) / (procedure.maxPrice - procedure.minPrice)) * 100}%`
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            <div
                                                className="h-full bg-gradient-to-r from-green-500 to-yellow-500 absolute"
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <div className="flex items-center gap-1 text-green-600">
                                                <TrendingDown className="h-3 w-3" />
                                                <span>Save up to ${savingsFromMin.toFixed(0)}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-yellow-600">
                                                <span>Could spend up to ${savingsToMax.toFixed(0)} more</span>
                                                <TrendingUp className="h-3 w-3" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Price Stats */}
                                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-primary">${procedure.minPrice || 'N/A'}</div>
                                        <div className="text-xs text-muted-foreground mt-1">Minimum</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-primary">${procedure.avgPrice || 'N/A'}</div>
                                        <div className="text-xs text-muted-foreground mt-1">Average</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-primary">${procedure.maxPrice || 'N/A'}</div>
                                        <div className="text-xs text-muted-foreground mt-1">Maximum</div>
                                    </div>
                                </div>
                            </div>
                        )}

                            {/* CTA Button */}
                            <div className="pt-6">
                                <button className="w-full bg-primary text-primary-foreground px-6 py-4 rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                                    Get Quotes from Providers
                                </button>
                                <p className="text-center text-sm text-muted-foreground mt-2">
                                    Compare prices and get the best deal
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Carrier Prices Section */}
                {procedure.carrierPrices && procedure.carrierPrices.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">
                            Pricing by Insurance Carrier
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {procedure.carrierPrices.map((carrierPrice, index) => (
                                <CarrierPriceCard key={`${carrierPrice.carrierId}-${index}`} price={carrierPrice} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function QuoteCard({ quote }: { quote: PriceQuote }) {
    const { provider } = quote;

    return (
        <Link
            href={`/provider/${provider.id}`}
            className="block bg-white border rounded-lg p-6 hover:shadow-lg transition-all hover:-translate-y-1"
        >
            <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold">{provider.name}</h3>
                            {provider.verified && (
                                <CheckCircle2 className="h-5 w-5 text-blue-500" />
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground capitalize">{provider.type}</p>
                    </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{provider.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                        ({provider.reviewCount} reviews)
                    </span>
                </div>

                {/* Location */}
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div>
                        <div className="font-medium">{provider.location.city}, {provider.location.state}</div>
                        <div className="text-xs">{provider.location.address}</div>
                    </div>
                </div>

                {/* Inclusions & Exclusions */}
                {quote.inclusions.length > 0 && (
                    <div className="text-sm">
                        <div className="font-medium text-green-600 mb-1">Included:</div>
                        <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                            {quote.inclusions.slice(0, 2).map((item, idx) => (
                                <li key={idx} className="text-xs">{item}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Price */}
                <div className="pt-4 border-t">
                    <div className="flex items-baseline justify-between">
                        <div>
                            <div className="text-2xl font-bold text-primary">
                                RM {quote.price}
                            </div>
                            <div className="text-xs text-muted-foreground">Starting price</div>
                        </div>
                        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition text-sm font-medium">
                            View Details →
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}

