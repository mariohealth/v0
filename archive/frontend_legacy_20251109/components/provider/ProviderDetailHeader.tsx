import { MapPin, Phone, Star, Globe, ChevronLeft } from 'lucide-react';
import { Provider } from '@/lib/mockData';
import Link from 'next/link';

export default function ProviderDetailHeader({ provider }: { provider: Provider }) {
    return (
        <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Back Button */}
                <Link
                    href="/search"
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#00BFA6] mb-4 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back to Search Results</span>
                </Link>

                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    {/* Provider Info */}
                    <div className="flex-1">
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            {provider.name}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 text-gray-600">
                            {/* Rating */}
                            <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-lg">
                                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                <span className="font-semibold text-gray-900">{provider.rating}</span>
                                <span className="text-sm text-gray-600">({provider.reviewCount} reviews)</span>
                            </div>

                            {/* Location */}
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-gray-400" />
                                <span className="text-sm font-medium">
                                    {typeof provider.address === 'string'
                                        ? provider.address
                                        : `${provider.address.city}, ${provider.address.state}`} • {provider.distance}
                                </span>
                            </div>

                            {/* Phone */}
                            <a
                                href={`tel:${provider.phone}`}
                                className="flex items-center gap-2 hover:text-[#00BFA6] transition-colors"
                            >
                                <Phone className="w-5 h-5 text-gray-400" />
                                <span className="text-sm font-medium">{provider.phone}</span>
                            </a>

                            {/* Website */}
                            {provider.website && (
                                <a
                                    href={provider.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-[#00BFA6] hover:text-[#00A896] transition-colors"
                                >
                                    <Globe className="w-5 h-5" />
                                    <span className="text-sm font-medium">Visit Website</span>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Price Card */}
                    <div className="lg:min-w-[280px]">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 shadow-md">
                            <div className="text-sm text-gray-600 mb-2">Starting from</div>
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-4xl font-bold text-green-600">
                                    ${provider.negotiatedRate || provider.price}
                                </span>
                                <span className="text-lg text-gray-400 line-through">
                                    ${provider.standardRate || provider.originalPrice}
                                </span>
                            </div>
                            <div className="inline-flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                <span>Save {provider.savingsPercent || (provider.originalPrice ? Math.round(((provider.originalPrice - provider.price) / provider.originalPrice) * 100) : 0)}%</span>
                                <span>(${provider.savings || (provider.originalPrice ? provider.originalPrice - provider.price : 0)})</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}