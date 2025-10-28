'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, MapPin, Star, CheckCircle2 } from 'lucide-react';
import { getProcedureById, getQuotesForProcedure, MOCK_CATEGORIES, type Procedure, type PriceQuote } from '@/lib/mock-data';
import { SkeletonCard } from '@/components/ui/loading-spinner';
import { ErrorMessage, EmptyState } from '@/components/ui/error-message';

export default function ProcedurePage() {
    const params = useParams();
    const procedureId = params.id as string;

    const [procedure, setProcedure] = useState<Procedure | null>(null);
    const [quotes, setQuotes] = useState<PriceQuote[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 600));

                const foundProcedure = getProcedureById(procedureId);
                if (!foundProcedure) {
                    setError('Procedure not found');
                    return;
                }

                setProcedure(foundProcedure);
                setQuotes(getQuotesForProcedure(procedureId));
            } catch (err) {
                setError('Failed to load procedure details');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [procedureId]);

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

    // Find category for breadcrumb
    const category = MOCK_CATEGORIES.find(c => c.slug === procedure.category);

    const savingsFromMin = procedure.averagePrice - procedure.priceRange.min;
    const savingsToMax = procedure.priceRange.max - procedure.averagePrice;

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
                        {category && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                                <span>/</span>
                                <Link href={`/category/${category.slug}`} className="hover:text-primary transition-colors">
                                    {category.name}
                                </Link>
                                <span>/</span>
                                <span className="text-foreground">{procedure.name}</span>
                            </div>
                        )}

                        {/* Title and Description */}
                        <div>
                            <h1 className="text-4xl font-bold mb-3">{procedure.name}</h1>
                            <p className="text-lg text-muted-foreground">{procedure.description}</p>
                        </div>

                        {/* Price Range Visualization */}
                        <div className="space-y-4">
                            <div className="flex items-baseline gap-4">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="h-8 w-8 text-muted-foreground" />
                                    <span className="text-5xl font-bold text-primary">
                                        RM {procedure.averagePrice}
                                    </span>
                                </div>
                                <span className="text-sm text-muted-foreground">average price</span>
                            </div>

                            {/* Price Range Bar */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                    <span>Lowest: RM {procedure.priceRange.min}</span>
                                    <span>Highest: RM {procedure.priceRange.max}</span>
                                </div>
                                <div className="relative h-4 bg-muted rounded-full overflow-hidden">
                                    <div className="absolute inset-0 flex">
                                        {/* Current average position indicator */}
                                        <div
                                            className="h-full w-1 bg-primary absolute z-10"
                                            style={{
                                                left: `${((procedure.averagePrice - procedure.priceRange.min) / (procedure.priceRange.max - procedure.priceRange.min)) * 100}%`
                                            }}
                                        />
                                    </div>
                                    <div
                                        className="h-full bg-gradient-to-r from-green-500 to-yellow-500 absolute"
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                <div className="flex justify-between text-xs">
                                    <div className="flex items-center gap-1 text-green-600">
                                        <TrendingDown className="h-3 w-3" />
                                        <span>Save up to RM {savingsFromMin.toFixed(0)}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-yellow-600">
                                        <span>Could spend up to RM {savingsToMax.toFixed(0)} more</span>
                                        <TrendingUp className="h-3 w-3" />
                                    </div>
                                </div>
                            </div>

                            {/* Price Stats */}
                            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary">RM {procedure.priceRange.min}</div>
                                    <div className="text-xs text-muted-foreground mt-1">Minimum</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary">RM {procedure.averagePrice}</div>
                                    <div className="text-xs text-muted-foreground mt-1">Average</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary">RM {procedure.priceRange.max}</div>
                                    <div className="text-xs text-muted-foreground mt-1">Maximum</div>
                                </div>
                            </div>

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

                {/* Providers Section */}
                <div>
                    <h2 className="text-2xl font-bold mb-6">
                        Providers Offering This Procedure
                    </h2>

                    {quotes.length === 0 ? (
                        <EmptyState
                            title="No providers found"
                            message="We couldn't find any providers offering this procedure."
                            action={{
                                label: 'Browse All Categories',
                                onClick: () => window.location.href = '/'
                            }}
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {quotes.map((quote) => (
                                <QuoteCard key={quote.id} quote={quote} />
                            ))}
                        </div>
                    )}
                </div>
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

