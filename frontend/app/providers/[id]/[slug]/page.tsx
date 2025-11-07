'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Phone, Globe, Clock, Star, CheckCircle2, TrendingDown, Sparkles, Award, Users } from 'lucide-react';
import { getProviderProcedureDetail, type ProviderProcedureDetail } from '@/lib/backend-api';
import { SkeletonCard } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';

export default function ProviderProcedureDetailPage() {
    const params = useParams();
    const router = useRouter();
    const providerId = params.id as string;
    const slug = params.slug as string;

    const [detail, setDetail] = useState<ProviderProcedureDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getProviderProcedureDetail(providerId, slug);
                setDetail(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load provider details');
            } finally {
                setLoading(false);
            }
        };

        if (providerId && slug) {
            fetchData();
        }
    }, [providerId, slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <SkeletonCard />
                </div>
            </div>
        );
    }

    if (error || !detail) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <ErrorMessage
                        message={error || 'Provider details not found'}
                        onRetry={() => window.location.reload()}
                    />
                </div>
            </div>
        );
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b sticky top-16 z-40">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <Link
                        href={`/procedures/${slug}`}
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Results
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">{detail.providerName}</h1>
                    <p className="text-gray-600 mt-1">{detail.procedureName}</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Provider Info Card */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Provider Information</h2>
                            
                            {/* Location */}
                            {(detail.address || detail.city || detail.state) && (
                                <div className="flex items-start gap-3 mb-4">
                                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        {detail.address && <p className="text-gray-900">{detail.address}</p>}
                                        {(detail.city || detail.state || detail.zipCode) && (
                                            <p className="text-gray-600">
                                                {[detail.city, detail.state, detail.zipCode].filter(Boolean).join(', ')}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Contact Info */}
                            <div className="space-y-3">
                                {detail.phone && (
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-5 h-5 text-gray-400" />
                                        <a href={`tel:${detail.phone}`} className="text-emerald-600 hover:text-emerald-700">
                                            {detail.phone}
                                        </a>
                                    </div>
                                )}
                                {detail.website && (
                                    <div className="flex items-center gap-3">
                                        <Globe className="w-5 h-5 text-gray-400" />
                                        <a
                                            href={detail.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-emerald-600 hover:text-emerald-700"
                                        >
                                            {detail.website}
                                        </a>
                                    </div>
                                )}
                                {detail.hours && (
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-5 h-5 text-gray-400" />
                                        <span className="text-gray-900">{detail.hours}</span>
                                    </div>
                                )}
                            </div>

                            {/* Accreditation & Staff */}
                            {(detail.accreditation || detail.staff) && (
                                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                                    {detail.accreditation && (
                                        <div className="flex items-start gap-3">
                                            <Award className="w-5 h-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="font-medium text-gray-900">Accreditation</p>
                                                <p className="text-gray-600">{detail.accreditation}</p>
                                            </div>
                                        </div>
                                    )}
                                    {detail.staff && (
                                        <div className="flex items-start gap-3">
                                            <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="font-medium text-gray-900">Staff</p>
                                                <p className="text-gray-600">{detail.staff}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Cost Breakdown */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Cost Breakdown</h2>
                            <div className="space-y-3">
                                {detail.estimatedCosts.facilityFee && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Facility Fee</span>
                                        <span className="font-medium text-gray-900">
                                            {formatPrice(detail.estimatedCosts.facilityFee)}
                                        </span>
                                    </div>
                                )}
                                {detail.estimatedCosts.professionalFee && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Professional Fee</span>
                                        <span className="font-medium text-gray-900">
                                            {formatPrice(detail.estimatedCosts.professionalFee)}
                                        </span>
                                    </div>
                                )}
                                {detail.estimatedCosts.suppliesFee && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Supplies Fee</span>
                                        <span className="font-medium text-gray-900">
                                            {formatPrice(detail.estimatedCosts.suppliesFee)}
                                        </span>
                                    </div>
                                )}
                                <div className="pt-3 border-t border-gray-200 flex justify-between">
                                    <span className="font-semibold text-gray-900">Total</span>
                                    <span className="text-2xl font-bold text-emerald-600">
                                        {formatPrice(detail.estimatedCosts.total)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Pricing Card */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <span className="text-3xl font-bold text-emerald-600">
                                            {formatPrice(detail.estimatedCosts.total)}
                                        </span>
                                        {detail.averagePrice && detail.averagePrice > detail.estimatedCosts.total && (
                                            <span className="text-lg text-gray-500 line-through">
                                                {formatPrice(detail.averagePrice)}
                                            </span>
                                        )}
                                    </div>
                                    {detail.savingsVsAverage !== null && detail.savingsVsAverage > 0 && (
                                        <div className="flex items-center gap-1 text-emerald-600 text-sm">
                                            <TrendingDown className="w-4 h-4" />
                                            <span>Save {detail.savingsVsAverage.toFixed(1)}% vs average</span>
                                        </div>
                                    )}
                                </div>

                                {detail.inNetwork && (
                                    <div className="flex items-center gap-2 text-emerald-600">
                                        <CheckCircle2 className="w-5 h-5" />
                                        <span className="font-medium">In Network</span>
                                    </div>
                                )}

                                {detail.rating !== null && (
                                    <div className="flex items-center gap-2">
                                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                        <div>
                                            <span className="font-semibold text-gray-900">{detail.rating.toFixed(1)}</span>
                                            <span className="text-gray-600 text-sm ml-2">
                                                ({detail.reviews} {detail.reviews === 1 ? 'review' : 'reviews'})
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {detail.marioPoints > 0 && (
                                    <div className="flex items-center gap-2 text-emerald-600 pt-4 border-t border-gray-200">
                                        <Sparkles className="w-5 h-5" />
                                        <div>
                                            <p className="font-semibold">Earn +{detail.marioPoints} MarioPoints</p>
                                            <p className="text-sm text-gray-600">Redeemable for future savings</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* CTA Button */}
                        <button
                            onClick={() => {
                                // TODO: Implement booking flow
                                alert('Booking flow coming soon!');
                            }}
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors text-lg"
                        >
                            Book with Concierge
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

