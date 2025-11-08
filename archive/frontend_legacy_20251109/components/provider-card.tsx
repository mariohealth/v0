import { MapPin, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProviderCardProps {
  title: string
  subtitle: string
  price: string
  originalPrice: string
  savings: string
  locationCount: number
}

export function ProviderCard({ title, subtitle, price, originalPrice, savings, locationCount }: ProviderCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md border-2 border-[#4DA1A9] p-5 relative">
      {/* Mario's Pick Badge */}
      <div className="absolute top-4 right-4 bg-[#4DA1A9] text-white text-xs font-semibold px-3 py-1 rounded-full">
        Mario's Pick
      </div>

      <div className="space-y-4">
        {/* Title & Subtitle */}
        <div className="pr-24">
          <h3 className="font-bold text-gray-900 text-lg mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>

        {/* Pricing */}
        <div className="space-y-1">
          <div className="text-4xl font-bold text-gray-900">{price}</div>
          <div className="text-sm text-gray-500 line-through">{originalPrice}</div>
          <div className="flex items-center gap-1 text-green-600 font-medium">
            <DollarSign className="w-4 h-4" />
            <span className="text-sm">{savings}</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>Available at {locationCount}+ nearby providers</span>
        </div>

        {/* Button */}
        <Button className="w-full bg-[#2E5077] hover:bg-[#2E5077]/90 text-white rounded-lg h-11">View Details</Button>
      </div>
    </div>
  )
}
