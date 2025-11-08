'use client'
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Skeleton } from './ui/skeleton';
import { cn } from './ui/utils';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { MarioAIPanel } from './mario-ai-panel';
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
  Stethoscope,
  Building2,
  Award,
  Pill
} from 'lucide-react';

// Types
interface CompactSearchResult {
  id: string;
  type: 'provider' | 'facility' | 'medication';
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
  performedBy?: string[];
}

interface CompactMedicationResult {
  id: string;
  medication: string;
  dosage: string;
  quantity: string;
  insurancePrice: number;
  cashPrice: number;
  discountPrice?: number;
  bestPharmacy: string;
  isMariosPick: boolean;
  savings: number;
}

interface MarioSearchResultsCompactProps {
  query: string;
  searchType: 'provider' | 'specialty' | 'procedure' | 'medication';
  results: CompactSearchResult[] | CompactMedicationResult[];
  loading?: boolean;
  onBack: () => void;
  onResultClick?: (result: CompactSearchResult) => void;
  onBookAppointment?: (providerId: string) => void;
  onGetCoupon?: (medicationId: string) => void;
  onTransferPrescription?: (medicationId: string) => void;
}

// Sample compact data
const sampleProviderResults: CompactSearchResult[] = [
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
    points: 150
  },
  {
    id: '2',
    type: 'facility',
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
    performedBy: ['Dr. Sarah Johnson', 'Dr. Lee Chen', 'Dr. Michael Ortiz']
  },
  {
    id: '3',
    type: 'provider',
    name: 'Dr. Angela Patel',
    specialty: 'Internal Medicine',
    distance: 1.9,
    isInNetwork: true,
    isMariosPick: false,
    price: 160,
    originalPrice: 180,
    savingsPercent: 10,
    rating: 4.8,
    reviewCount: 52,
    address: '789 Wellness Blvd',
    points: 75
  }
];

const sampleMedicationResults: CompactMedicationResult[] = [
  {
    id: '1',
    medication: 'Atorvastatin',
    dosage: '20mg',
    quantity: '30 tablets',
    insurancePrice: 14,
    cashPrice: 22,
    discountPrice: 8,
    bestPharmacy: 'Cost Plus Drugs',
    isMariosPick: true,
    savings: 6
  }
];

function CompactLoadingSkeletons({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="h-[168px] p-4">
          <div className="flex gap-3 h-full">
            <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
              <div className="flex gap-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex gap-2 items-center">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
          </div>
          <div className="mt-3">
            <Skeleton className="h-9 w-full" />
          </div>
        </Card>
      ))}
    </div>
  );
}

function CompactEmptyState({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <Stethoscope className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="font-semibold mb-2">No results found</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-sm">
        Try expanding your search or adjusting your filters.
      </p>
      <Button variant="outline" size="sm">
        Expand Search Area
      </Button>
    </div>
  );
}

function CompactProviderCard({ 
  result, 
  onClick, 
  onBookAppointment 
}: { 
  result: CompactSearchResult;
  onClick?: () => void;
  onBookAppointment?: () => void;
}) {
  return (
    <Card 
      className="relative overflow-hidden mario-transition cursor-pointer mario-hover-provider"
      style={{ height: '168px' }}
      onClick={onClick}
    >
      {/* Mario's Pick Banner */}
      {result.isMariosPick && (
        <div 
          className="absolute top-0 left-0 right-0 h-1"
          style={{ backgroundColor: '#4DA1A9' }}
        />
      )}
      
      <div className="p-4 h-full flex flex-col">
        <div className="flex gap-3 flex-1">
          {/* Avatar - Gender-neutral medical icon, 48x48 */}
          <div 
            className="rounded-full flex-shrink-0 flex items-center justify-center"
            style={{ 
              width: '48px',
              height: '48px',
              backgroundColor: '#4DA1A9'
            }}
          >
            {result.type === 'facility' ? (
              <Building2 className="h-6 w-6 text-white" />
            ) : (
              <Stethoscope className="h-6 w-6 text-white" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Line 1: Name + Mario's Pick Badge */}
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-semibold text-sm truncate">{result.name}</h4>
              {result.isMariosPick && (
                <Badge 
                  className="text-white text-xs px-1.5 py-0.5 ml-2"
                  style={{ backgroundColor: '#4DA1A9' }}
                >
                  <Award className="h-2.5 w-2.5 mr-1" />
                  Mario's Pick
                </Badge>
              )}
            </div>
            
            {/* Line 2: Specialty */}
            <p className="text-xs text-muted-foreground mb-2">{result.specialty}</p>
            
            {/* Line 3: Distance, Network, Rating */}
            <div className="flex items-center gap-3 mb-2 text-xs">
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {result.distance} mi
              </div>
              {result.isInNetwork && (
                <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-green-50 text-green-700 border-green-200">
                  <Shield className="h-2.5 w-2.5 mr-1" />
                  In-Network
                </Badge>
              )}
              <div className="flex items-center gap-1 text-muted-foreground">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                {result.rating.toFixed(2)} ({result.reviewCount})
              </div>
            </div>
            
            {/* Line 4: Pricing */}
            <div className="flex items-center gap-2 mb-2">
              <span 
                className="font-semibold text-lg"
                style={{ color: '#2E5077' }}
              >
                ${result.price}
              </span>
              {result.originalPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  ${result.originalPrice}
                </span>
              )}
              {result.savingsPercent && (
                <div 
                  className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: '#79D7BE20', color: '#79D7BE' }}
                >
                  <TrendingDown className="h-2.5 w-2.5" />
                  {result.savingsPercent}% below avg
                </div>
              )}
            </div>
            
            {/* Line 5: Points + Performed By (for facilities) */}
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Gift className="h-3 w-3" />
                Earn +{result.points} MarioPoints
              </div>
            </div>

            {/* Performed By (for procedures/facilities) */}
            {result.performedBy && (
              <p className="text-xs text-muted-foreground mb-3">
                Performed by: {result.performedBy.slice(0, 2).join(', ')}
                {result.performedBy.length > 2 && ` +${result.performedBy.length - 2} more`}
              </p>
            )}
          </div>
        </div>

        {/* CTA Button */}
        <Button 
          size="sm"
          className="w-full mt-auto mario-button-scale"
          style={{ backgroundColor: '#2E5077', height: '36px' }}
          onClick={(e) => {
            e.stopPropagation();
            onBookAppointment?.();
          }}
        >
          {result.type === 'facility' ? 'View Details' : 'Book with Concierge'}
        </Button>
      </div>
    </Card>
  );
}

function MedicationDetailView({ 
  medication, 
  onGetCoupon, 
  onTransferPrescription 
}: { 
  medication: CompactMedicationResult;
  onGetCoupon?: () => void;
  onTransferPrescription?: () => void;
}) {
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="mb-6">
        <h3 className="font-semibold text-lg">{medication.medication}</h3>
        <p className="text-sm text-muted-foreground">{medication.dosage} • {medication.quantity}</p>
      </div>

      {/* Dual Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Insurance Price Card */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Insurance Price</h4>
          </div>
          <div className="mb-3">
            <span 
              className="text-2xl font-bold"
              style={{ color: '#2E5077' }}
            >
              ${medication.insurancePrice}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Walgreens • 0.8 mi away</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={onTransferPrescription}
          >
            Transfer Prescription
          </Button>
        </Card>

        {/* Cash/Discount Price Card */}
        <Card className="p-4 bg-green-50 border-green-200 relative">
          {medication.isMariosPick && (
            <Badge 
              className="absolute top-3 right-3 text-white text-xs"
              style={{ backgroundColor: '#4DA1A9' }}
            >
              <Award className="h-2.5 w-2.5 mr-1" />
              Mario's Pick
            </Badge>
          )}
          <div className="mb-3">
            <h4 className="font-medium">Cash/Discount Price</h4>
          </div>
          <div className="mb-3 flex items-center gap-2">
            <span 
              className="text-2xl font-bold"
              style={{ color: '#2E5077' }}
            >
              ${medication.discountPrice || medication.cashPrice}
            </span>
            {medication.discountPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${medication.cashPrice}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-2">{medication.bestPharmacy}</p>
          <div 
            className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full mb-4"
            style={{ backgroundColor: '#79D7BE20', color: '#79D7BE' }}
          >
            Save ${medication.savings}
          </div>
          <Button 
            size="sm" 
            className="w-full"
            style={{ backgroundColor: '#2E5077' }}
            onClick={onGetCoupon}
          >
            Get Coupon
          </Button>
        </Card>
      </div>
    </div>
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

export function MarioSearchResultsCompact({
  query,
  searchType,
  results = [],
  loading = false,
  onBack,
  onResultClick,
  onBookAppointment,
  onGetCoupon,
  onTransferPrescription
}: MarioSearchResultsCompactProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [appliedFilters, setAppliedFilters] = useState<any>({});

  // Use sample data for demonstration
  const displayResults = results.length > 0 ? results : 
    (searchType === 'medication' ? sampleMedicationResults : sampleProviderResults);

  const resultCount = Array.isArray(displayResults) ? displayResults.length : 0;

  // For medication search, show detail view directly
  if (searchType === 'medication' && !loading && displayResults.length > 0) {
    const medicationResult = displayResults[0] as CompactMedicationResult;
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
                <p className="text-sm text-muted-foreground">Best prices found</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <MedicationDetailView
            medication={medicationResult}
            onGetCoupon={() => onGetCoupon?.(medicationResult.id)}
            onTransferPrescription={() => onTransferPrescription?.(medicationResult.id)}
          />
        </div>
      </div>
    );
  }

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

          {/* Sort indicator for specialty searches */}
          {searchType === 'specialty' && (
            <Badge variant="outline" className="text-xs">
              Sort: Distance
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="max-w-4xl">
          {loading ? (
            <CompactLoadingSkeletons count={searchType === 'specialty' ? 12 : 4} />
          ) : displayResults.length === 0 ? (
            <CompactEmptyState query={query} />
          ) : (
            /* Provider/Facility/Procedure Results */
            <div className="space-y-3">
              {(displayResults as CompactSearchResult[]).map((result) => (
                <CompactProviderCard
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

      {/* MarioAI Panel */}
      <div className="pb-32 md:pb-0">
        <MarioAIPanel 
          onBookAppointment={(doctor) => {
            onBookAppointment?.(doctor.name);
          }}
        />
      </div>
    </div>
  );
}