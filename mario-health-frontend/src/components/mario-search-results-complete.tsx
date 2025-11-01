'use client'
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Skeleton } from './ui/skeleton';
import { cn } from './ui/utils';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  ArrowLeft, 
  MoreVertical,
  Filter,
  Map,
  MapPin,
  Star,
  Clock,
  Shield,
  Gift,
  TrendingDown,
  ChevronRight,
  DollarSign,
  Pill,
  Building2,
  Stethoscope,
  Award,
  Heart,
  Sparkles
} from 'lucide-react';

// Types
interface SearchResult {
  id: string;
  type: 'provider' | 'medication' | 'procedure';
  name: string;
  specialty?: string;
  distance: number;
  isInNetwork: boolean;
  isMariosPick: boolean;
  price: number;
  originalPrice?: number;
  savingsPercent?: number;
  rating: number;
  reviewCount: number;
  address: string;
  image?: string;
  points: number;
  nextAvailable?: string;
  description?: string;
  performedBy?: string;
}

interface MedicationResult {
  id: string;
  medication: string;
  dosage: string;
  quantity: string;
  pharmacies: PharmacyPrice[];
}

interface PharmacyPrice {
  id: string;
  pharmacy: string;
  logo?: string;
  distance: number;
  insurancePrice: number;
  cashPrice: number;
  discountPrice?: number;
  isMariosPick: boolean;
  couponAvailable: boolean;
}

interface MarioSearchResultsCompleteProps {
  query: string;
  searchType: 'provider' | 'medication' | 'procedure';
  results: SearchResult[] | MedicationResult[];
  loading?: boolean;
  onBack: () => void;
  onResultClick?: (result: SearchResult) => void;
  onBookAppointment?: (providerId: string) => void;
  onGetCoupon?: (pharmacyId: string) => void;
}

// Sample data for realistic display
const sampleProviderResults: SearchResult[] = [
  {
    id: '1',
    type: 'provider',
    name: 'Dr. Sarah Johnson',
    specialty: 'Orthopedic Surgery',
    distance: 2.1,
    isInNetwork: true,
    isMariosPick: true,
    price: 425,
    originalPrice: 650,
    savingsPercent: 35,
    rating: 4.9,
    reviewCount: 127,
    address: '123 Medical Center Dr',
    image: 'https://images.unsplash.com/photo-1758691463626-0ab959babe00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBtZWRpY2FsJTIwcHJvZmVzc2lvbmFsJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU5NjQ1NDE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    points: 150,
    nextAvailable: 'Tomorrow 2:30 PM'
  },
  {
    id: '2',
    type: 'provider',
    name: 'City Medical Imaging',
    specialty: 'Radiology Center',
    distance: 3.8,
    isInNetwork: true,
    isMariosPick: false,
    price: 485,
    originalPrice: 580,
    savingsPercent: 16,
    rating: 4.7,
    reviewCount: 89,
    address: '456 Health Plaza',
    image: 'https://images.unsplash.com/photo-1710074213379-2a9c2653046a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwZmFjaWxpdHklMjBob3NwaXRhbCUyMGNsaW5pY3xlbnwxfHx8fDE3NTk2NDU0MjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    points: 100,
    nextAvailable: 'Wed 10:15 AM'
  },
  {
    id: '3',
    type: 'provider',
    name: 'Dr. Michael Chen',
    specialty: 'Sports Medicine',
    distance: 5.2,
    isInNetwork: true,
    isMariosPick: false,
    price: 520,
    originalPrice: 650,
    savingsPercent: 20,
    rating: 4.8,
    reviewCount: 156,
    address: '789 Wellness Blvd',
    points: 125,
    nextAvailable: 'Thu 9:00 AM'
  }
];

const sampleMedicationResults: MedicationResult[] = [
  {
    id: '1',
    medication: 'Ibuprofen',
    dosage: '200mg',
    quantity: '30 tablets',
    pharmacies: [
      {
        id: '1',
        pharmacy: 'CVS Pharmacy',
        distance: 0.8,
        insurancePrice: 12.50,
        cashPrice: 18.99,
        discountPrice: 8.99,
        isMariosPick: true,
        couponAvailable: true
      },
      {
        id: '2',
        pharmacy: 'Walgreens',
        distance: 1.2,
        insurancePrice: 15.20,
        cashPrice: 22.50,
        discountPrice: 11.25,
        isMariosPick: false,
        couponAvailable: true
      },
      {
        id: '3',
        pharmacy: 'Target Pharmacy',
        distance: 2.1,
        insurancePrice: 14.75,
        cashPrice: 19.99,
        discountPrice: 9.99,
        isMariosPick: false,
        couponAvailable: false
      }
    ]
  }
];

function LoadingSkeletons({ type }: { type: 'provider' | 'medication' }) {
  if (type === 'medication') {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="p-4">
          <div className="flex gap-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-8 w-40" />
            </div>
            <div className="text-right space-y-2">
              <Skeleton className="h-6 w-16 ml-auto" />
              <Skeleton className="h-4 w-24 ml-auto" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
        <Stethoscope className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No results found</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        We couldn't find any {query.toLowerCase()} options in your area. Try expanding your search or adjusting your filters.
      </p>
      <Button variant="outline">
        Expand Search Area
      </Button>
    </div>
  );
}

function ProviderCard({ 
  result, 
  onClick, 
  onBookAppointment 
}: { 
  result: SearchResult;
  onClick?: () => void;
  onBookAppointment?: () => void;
}) {
  return (
    <Card 
      className="p-4 mario-transition cursor-pointer mario-hover-provider relative overflow-hidden"
      onClick={onClick}
    >
      {/* Mario's Pick Banner */}
      {result.isMariosPick && (
        <div 
          className="absolute top-0 left-0 right-0 h-1"
          style={{ backgroundColor: '#4DA1A9' }}
        />
      )}
      
      {result.isMariosPick && (
        <div className="absolute top-3 right-3">
          <Badge 
            className="text-white text-xs font-medium px-2 py-1"
            style={{ backgroundColor: '#4DA1A9' }}
          >
            <Award className="h-3 w-3 mr-1" />
            Mario's Pick
          </Badge>
        </div>
      )}

      <div className="flex gap-4">
        {/* Provider Image - Gender-neutral medical icon, 48x48 */}
        <div 
          className="rounded-full flex-shrink-0 flex items-center justify-center"
          style={{ 
            width: '48px',
            height: '48px',
            backgroundColor: '#4DA1A9'
          }}
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
            <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
            <circle cx="20" cy="10" r="2" />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-semibold text-card-foreground truncate">{result.name}</h4>
              <p className="text-sm text-muted-foreground">{result.specialty}</p>
            </div>
          </div>

          {/* Location & Network Status */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {result.distance} mi
            </div>
            {result.isInNetwork && (
              <Badge variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-200">
                <Shield className="h-3 w-3 mr-1" />
                In-Network
              </Badge>
            )}
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              {result.rating.toFixed(2)} ({result.reviewCount})
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span 
                  className="text-lg font-semibold"
                  style={{ color: '#2E5077' }}
                >
                  ${result.price}
                </span>
                {result.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${result.originalPrice}
                  </span>
                )}
              </div>
              {result.savingsPercent && (
                <div 
                  className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full mt-1"
                  style={{ backgroundColor: '#79D7BE20', color: '#79D7BE' }}
                >
                  <TrendingDown className="h-3 w-3" />
                  {result.savingsPercent}% below average
                </div>
              )}
            </div>
          </div>

          {/* Rewards & Availability */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Gift className="h-4 w-4" />
              Earn +{result.points} MarioPoints
            </div>
            {result.nextAvailable && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {result.nextAvailable}
              </div>
            )}
          </div>

          {/* CTA Button */}
          <Button 
            className="w-full mt-4 mario-button-scale"
            style={{ backgroundColor: '#2E5077' }}
            onClick={(e) => {
              e.stopPropagation();
              onBookAppointment?.();
            }}
          >
            Book with Concierge
          </Button>
        </div>
      </div>
    </Card>
  );
}

function MedicationCard({ 
  medication, 
  onGetCoupon 
}: { 
  medication: MedicationResult;
  onGetCoupon?: (pharmacyId: string) => void;
}) {
  const bestInsurance = medication.pharmacies.reduce((best, current) => 
    current.insurancePrice < best.insurancePrice ? current : best
  );
  
  const bestCash = medication.pharmacies.reduce((best, current) => 
    (current.discountPrice || current.cashPrice) < (best.discountPrice || best.cashPrice) ? current : best
  );

  return (
    <Card className="p-4 mario-transition">
      <div className="mb-4">
        <h4 className="font-semibold">{medication.medication}</h4>
        <p className="text-sm text-muted-foreground">{medication.dosage} • {medication.quantity}</p>
      </div>

      {/* Dual Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Insurance Price Card */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <h5 className="font-medium text-sm">Insurance Price</h5>
            {bestInsurance.isMariosPick && (
              <Badge 
                className="text-white text-xs"
                style={{ backgroundColor: '#4DA1A9' }}
              >
                Mario's Pick
              </Badge>
            )}
          </div>
          <div className="mb-2">
            <span 
              className="text-xl font-bold"
              style={{ color: '#2E5077' }}
            >
              ${bestInsurance.insurancePrice}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{bestInsurance.pharmacy}</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
            <MapPin className="h-3 w-3" />
            {bestInsurance.distance} mi away
          </div>
          <Button size="sm" variant="outline" className="w-full">
            Transfer Prescription
          </Button>
        </Card>

        {/* Cash/Discount Price Card */}
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <h5 className="font-medium text-sm">Cash/Discount Price</h5>
            {bestCash.isMariosPick && (
              <Badge 
                className="text-white text-xs"
                style={{ backgroundColor: '#4DA1A9' }}
              >
                Mario's Pick
              </Badge>
            )}
          </div>
          <div className="mb-2">
            <span 
              className="text-xl font-bold"
              style={{ color: '#2E5077' }}
            >
              ${bestCash.discountPrice || bestCash.cashPrice}
            </span>
            {bestCash.discountPrice && (
              <span className="text-sm text-muted-foreground line-through ml-2">
                ${bestCash.cashPrice}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-2">{bestCash.pharmacy}</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
            <MapPin className="h-3 w-3" />
            {bestCash.distance} mi away
          </div>
          <Button 
            size="sm" 
            className="w-full"
            style={{ backgroundColor: '#2E5077' }}
            onClick={() => onGetCoupon?.(bestCash.id)}
          >
            {bestCash.couponAvailable ? 'Get Coupon' : 'View Pricing'}
          </Button>
        </Card>
      </div>

      {/* Compare Prices Table */}
      <div className="border-t pt-4">
        <Button variant="ghost" size="sm" className="w-full justify-between">
          Compare All Prices
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}

function FilterModal({ 
  isOpen, 
  onClose, 
  onApply 
}: { 
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
}) {
  const [distance, setDistance] = useState([10]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [inNetworkOnly, setInNetworkOnly] = useState(false);

  const handleApply = () => {
    onApply({
      distance: distance[0],
      priceRange,
      inNetworkOnly
    });
    onClose();
  };

  const handleReset = () => {
    setDistance([10]);
    setPriceRange([0, 1000]);
    setInNetworkOnly(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="rounded-t-xl">
        <SheetHeader>
          <SheetTitle>Filter Results</SheetTitle>
        </SheetHeader>
        
        <div className="space-y-6 py-6">
          {/* Distance Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Distance</Label>
            <div className="px-2">
              <Slider
                value={distance}
                onValueChange={setDistance}
                max={50}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1 mi</span>
                <span>{distance[0]} miles</span>
                <span>50+ mi</span>
              </div>
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Price Range</Label>
            <div className="px-2">
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={2000}
                min={0}
                step={50}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>$0</span>
                <span>${priceRange[0]} - ${priceRange[1]}</span>
                <span>$2000+</span>
              </div>
            </div>
          </div>

          {/* In-Network Filter */}
          <div className="flex items-center justify-between">
            <Label htmlFor="in-network" className="text-sm font-medium">
              In-Network Only
            </Label>
            <Switch
              id="in-network"
              checked={inNetworkOnly}
              onCheckedChange={setInNetworkOnly}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleReset} className="flex-1">
            Reset
          </Button>
          <Button 
            onClick={handleApply} 
            className="flex-1"
            style={{ backgroundColor: '#2E5077' }}
          >
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function MarioSearchResultsComplete({
  query,
  searchType,
  results = [],
  loading = false,
  onBack,
  onResultClick,
  onBookAppointment,
  onGetCoupon
}: MarioSearchResultsCompleteProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [appliedFilters, setAppliedFilters] = useState<any>({});

  // Use sample data for demonstration
  const displayResults = results.length > 0 ? results : 
    (searchType === 'medication' ? sampleMedicationResults : sampleProviderResults);

  const resultCount = searchType === 'medication' 
    ? (displayResults as MedicationResult[]).length
    : (displayResults as SearchResult[]).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card mario-shadow-card">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack} className="mario-button-scale">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-semibold text-card-foreground">{query}</h1>
              <p className="text-sm text-muted-foreground">{resultCount} options nearby</p>
            </div>
          </div>
          
          <Button variant="ghost" size="icon" className="mario-button-scale">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowFilters(true)}
              className="mario-button-scale"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter & Sort
            </Button>
            
            {searchType !== 'medication' && (
              <Button 
                variant={viewMode === 'map' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
                className="mario-button-scale"
              >
                <Map className="h-4 w-4 mr-2" />
                Map View
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl">
          {loading ? (
            <LoadingSkeletons type={searchType} />
          ) : displayResults.length === 0 ? (
            <EmptyState query={query} />
          ) : searchType === 'medication' ? (
            /* Medication Results */
            <div className="space-y-4">
              {(displayResults as MedicationResult[]).map((medication) => (
                <MedicationCard
                  key={medication.id}
                  medication={medication}
                  onGetCoupon={onGetCoupon}
                />
              ))}
            </div>
          ) : (
            /* Provider/Procedure Results */
            <div className="space-y-3">
              {(displayResults as SearchResult[]).map((result) => (
                <ProviderCard
                  key={result.id}
                  result={result}
                  onClick={() => onResultClick?.(result)}
                  onBookAppointment={() => onBookAppointment?.(result.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={setAppliedFilters}
      />
    </div>
  );
}