import { Star, MapPin, Clock, Shield, TrendingDown } from "lucide-react";
import { Provider } from "@/src/lib/mockData";
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
    <Link href={`/provider/${provider.id}`} className="block">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Image placeholder */}
        <div className="relative h-48 bg-gradient-to-br from-emerald-50 to-emerald-100">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-emerald-600 font-semibold text-lg">
              {provider.name.split(' ')[0]}
            </div>
          </div>

          {/* Savings badge */}
          {savingsPercent > 0 && (
            <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
              <TrendingDown className="w-4 h-4" />
              Save {savingsPercent}%
            </div>
          )}

          {/* Type badge */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 capitalize">
            {provider.type.replace('_', ' ')}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Header */}
          <div className="mb-3">
            <h3 className="font-semibold text-lg text-gray-900 mb-1">
              {provider.name}
            </h3>
            <p className="text-sm text-gray-600">{provider.neighborhood}</p>
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
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-gray-900">{provider.rating}</span>
            </div>
            <span className="text-sm text-gray-500">
              ({provider.reviewCount.toLocaleString()} reviews)
            </span>
          </div>

          {/* Location */}
          <div className="flex items-start gap-2 mb-3 text-sm text-gray-600">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <p>
                {typeof provider.address === 'string'
                  ? provider.address
                  : `${provider.address.street}, ${provider.address.city}, ${provider.address.state} ${provider.address.zip}`}
              </p>
              <p className="text-emerald-600 font-medium">{provider.distance} away</p>
            </div>
          </div>

          {/* Availability */}
          <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span>{provider.availability}</span>
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  ${provider.price}
                </span>
                {provider.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">
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
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors duration-200"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}