import { Star, MapPin, Clock, Shield, TrendingDown } from "lucide-react";
import { Provider } from "@/types/api";
import Link from "next/link";

interface ProviderCardProps {
  provider: Provider;
  onBook?: (providerId: string) => void;
}

export default function ProviderCard({ provider, onBook }: ProviderCardProps) {
  const savingsPercent = provider.originalPrice
    ? Math.round(((provider.originalPrice - provider.price) / provider.originalPrice) * 100)
    : 0;

  const handleBookClick = () => {
    if (onBook) {
      onBook(provider.id);
    }
  };

  return (
    <Link href={`/provider/${provider.id}`} className="block" aria-label={`View details for ${provider.name}`}>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2">
        {/* Image placeholder */}
        <div className="relative h-40 sm:h-48 bg-gradient-to-br from-emerald-50 to-emerald-100">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-emerald-600 font-semibold text-lg">
              {provider.name.split(' ')[0]}
            </div>
          </div>

          {/* Savings badge */}
          {savingsPercent > 0 && (
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-orange-500 text-white px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1">
              <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Save </span>{savingsPercent}%
            </div>
          )}

          {/* Type badge */}
          {provider.type && (
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-white/90 backdrop-blur-sm px-2 py-1 sm:px-3 rounded-full text-xs font-medium text-gray-700 capitalize">
              {provider.type.replace('_', ' ')}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
          {/* Header */}
          <div className="mb-3">
            <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-1 line-clamp-2">
              {provider.name}
            </h3>
            {provider.neighborhood && (
              <p className="text-xs sm:text-sm text-gray-600">{provider.neighborhood}</p>
            )}
          </div>

          {/* Badges */}
          {provider.badges && provider.badges.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {provider.badges.map((badge, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded"
                >
                  <Shield className="w-3 h-3" />
                  {badge}
                </span>
              ))}
            </div>
          )}

          {/* Rating & Reviews */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-gray-900 text-sm sm:text-base">{provider.rating}</span>
            </div>
            <span className="text-xs sm:text-sm text-gray-500">
              ({provider.reviewCount.toLocaleString()} reviews)
            </span>
          </div>

          {/* Location */}
          <div className="flex items-start gap-2 mb-3 text-xs sm:text-sm text-gray-600">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="truncate">
                {typeof provider.address === 'string'
                  ? provider.address
                  : `${provider.address.street}, ${provider.address.city}, ${provider.address.state} ${provider.address.zip}`}
              </p>
              <p className="text-emerald-600 font-medium">{provider.distance} away</p>
            </div>
          </div>

          {/* Availability */}
          {provider.availability && (
            <div className="flex items-center gap-2 mb-4 text-xs sm:text-sm text-gray-600">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">{provider.availability}</span>
            </div>
          )}

          {/* Price & CTA */}
          <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100 gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-1 sm:gap-2">
                <span className="text-lg sm:text-2xl font-bold text-gray-900">
                  ${provider.price}
                </span>
                {provider.originalPrice && (
                  <span className="text-xs sm:text-sm text-gray-400 line-through">
                    ${provider.originalPrice}
                  </span>
                )}
              </div>
              {provider.acceptsInsurance && (
                <p className="text-xs text-gray-500 mt-1">
                  Insurance accepted
                </p>
              )}
            </div>

            <button
              onClick={handleBookClick}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 sm:px-6 sm:py-2.5 rounded-lg font-semibold transition-colors duration-200 text-xs sm:text-sm whitespace-nowrap min-h-[44px] min-w-[80px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              aria-label={`Book appointment with ${provider.name}`}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}