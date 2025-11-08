'use client'
import { useState } from 'react';
import { ArrowLeft, MapPin, Star, SlidersHorizontal, Map, Navigation, Award } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { bloodTestProviders, sortBloodTestProviders, filterBloodTestProviders, type BloodTestProvider } from '@/lib/data/mario-blood-test-data';
import { mriProviders, sortMRIProviders, filterMRIProviders, type MRIProvider } from '@/lib/data/mario-mri-data';
import { colonoscopyProviders, sortColonoscopyProviders, filterColonoscopyProviders, type ColonoscopyProvider } from '@/lib/data/mario-colonoscopy-data';
import { mammogramProviders, sortMammogramProviders, filterMammogramProviders, type MammogramProvider } from '@/lib/data/mario-mammogram-data';
import { annualPhysicalProviders, sortAnnualPhysicalProviders, filterAnnualPhysicalProviders, type AnnualPhysicalProvider } from '@/lib/data/mario-annual-physical-data';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from './ui/dropdown-menu';

// Union type for all provider types
type Provider = BloodTestProvider | MRIProvider | ColonoscopyProvider | MammogramProvider | AnnualPhysicalProvider;
type SortOption = 'best_value' | 'distance' | 'rating' | 'price_low' | 'price_high';

interface MarioProcedureSearchResultsProps {
  procedureId: string;
  procedureName: string;
  onBack: () => void;
  onProviderSelect: (providerId: string) => void;
}

export function MarioProcedureSearchResults({
  procedureId,
  procedureName,
  onBack,
  onProviderSelect
}: MarioProcedureSearchResultsProps) {
  const [sortBy, setSortBy] = useState<SortOption>('best_value');
  const [networkFilter, setNetworkFilter] = useState<'all' | 'In-Network' | 'Out-of-Network'>('all');
  const [marioPickOnly, setMarioPickOnly] = useState(false);

  // Get providers based on procedure type
  let providers: Provider[];
  
  if (procedureId.includes('mri')) {
    // MRI providers
    let mriList = mriProviders;
    
    // Apply filters
    mriList = filterMRIProviders(mriList, {
      network: networkFilter,
      marioPick: marioPickOnly
    });
    
    // Apply sorting
    const sortMapping: Record<SortOption, 'price' | 'distance' | 'rating' | 'savings'> = {
      'best_value': 'savings',
      'distance': 'distance',
      'rating': 'rating',
      'price_low': 'price',
      'price_high': 'price'
    };
    
    mriList = sortMRIProviders(mriList, sortMapping[sortBy]);
    
    // Reverse for price_high
    if (sortBy === 'price_high') {
      mriList = [...mriList].reverse();
    }
    
    providers = mriList;
  } else if (procedureId.includes('colonoscopy')) {
    // Colonoscopy providers
    let colonoscopyList = colonoscopyProviders;
    
    // Apply filters
    colonoscopyList = filterColonoscopyProviders(colonoscopyList, {
      network: networkFilter,
      marioPick: marioPickOnly
    });
    
    // Apply sorting
    const sortMapping: Record<SortOption, 'price' | 'distance' | 'rating' | 'savings'> = {
      'best_value': 'savings',
      'distance': 'distance',
      'rating': 'rating',
      'price_low': 'price',
      'price_high': 'price'
    };
    
    colonoscopyList = sortColonoscopyProviders(colonoscopyList, sortMapping[sortBy]);
    
    // Reverse for price_high
    if (sortBy === 'price_high') {
      colonoscopyList = [...colonoscopyList].reverse();
    }
    
    providers = colonoscopyList;
  } else if (procedureId.includes('mammogram')) {
    // Mammogram providers
    let mammogramList = mammogramProviders;
    
    // Apply filters
    mammogramList = filterMammogramProviders(mammogramList, {
      network: networkFilter,
      marioPick: marioPickOnly
    });
    
    // Apply sorting
    const sortMapping: Record<SortOption, 'price' | 'distance' | 'rating' | 'savings'> = {
      'best_value': 'savings',
      'distance': 'distance',
      'rating': 'rating',
      'price_low': 'price',
      'price_high': 'price'
    };
    
    mammogramList = sortMammogramProviders(mammogramList, sortMapping[sortBy]);
    
    // Reverse for price_high
    if (sortBy === 'price_high') {
      mammogramList = [...mammogramList].reverse();
    }
    
    providers = mammogramList;
  } else if (procedureId.includes('annual_physical') || procedureId.includes('annual-physical')) {
    // Annual Physical providers
    let annualPhysicalList = annualPhysicalProviders;
    
    // Apply filters
    annualPhysicalList = filterAnnualPhysicalProviders(annualPhysicalList, {
      network: networkFilter,
      marioPick: marioPickOnly
    });
    
    // Apply sorting
    const sortMapping: Record<SortOption, 'price' | 'distance' | 'rating' | 'savings'> = {
      'best_value': 'savings',
      'distance': 'distance',
      'rating': 'rating',
      'price_low': 'price',
      'price_high': 'price'
    };
    
    annualPhysicalList = sortAnnualPhysicalProviders(annualPhysicalList, sortMapping[sortBy]);
    
    // Reverse for price_high
    if (sortBy === 'price_high') {
      annualPhysicalList = [...annualPhysicalList].reverse();
    }
    
    providers = annualPhysicalList;
  } else {
    // Blood test providers (default)
    let bloodList = bloodTestProviders;
    
    // Apply filters
    bloodList = filterBloodTestProviders(bloodList, {
      network: networkFilter,
      marioPickOnly
    });
    
    // Apply sorting
    const sortMapping: Record<SortOption, 'best_value' | 'distance' | 'rating' | 'price_low' | 'price_high'> = {
      'best_value': 'best_value',
      'distance': 'distance',
      'rating': 'rating',
      'price_low': 'price_low',
      'price_high': 'price_high'
    };
    
    bloodList = sortBloodTestProviders(bloodList, sortMapping[sortBy]);
    
    providers = bloodList;
  }

  const getSortLabel = () => {
    switch (sortBy) {
      case 'best_value': return 'Best Value';
      case 'distance': return 'Distance';
      case 'rating': return 'Rating';
      case 'price_low': return 'Price: Low to High';
      case 'price_high': return 'Price: High to Low';
      default: return 'Best Value';
    }
  };

  const getNetworkFilterLabel = () => {
    if (networkFilter === 'all') return 'All Networks';
    return networkFilter;
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0" style={{ backgroundColor: '#F9FAFB' }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" style={{ color: '#2E5077' }} />
            </button>
            <div className="flex-1">
              <h1 className="font-semibold" style={{ color: '#2E5077' }}>
                {procedureName}
              </h1>
              <p className="text-sm" style={{ color: '#4DA1A9' }}>
                {providers.length} options nearby
              </p>
            </div>
          </div>

          {/* Filter & Sort Controls */}
          <div className="flex items-center gap-2">
            {/* Filter & Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  style={{ borderColor: '#E0E0E0' }}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>Filter & Sort</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setSortBy('best_value')}>
                  {sortBy === 'best_value' && '✓ '}Best Value
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('distance')}>
                  {sortBy === 'distance' && '✓ '}Distance
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('rating')}>
                  {sortBy === 'rating' && '✓ '}Rating
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('price_low')}>
                  {sortBy === 'price_low' && '✓ '}Price: Low to High
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('price_high')}>
                  {sortBy === 'price_high' && '✓ '}Price: High to Low
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuLabel>Filter</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setNetworkFilter('all')}>
                  {networkFilter === 'all' && '✓ '}All Networks
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setNetworkFilter('In-Network')}>
                  {networkFilter === 'In-Network' && '✓ '}In-Network Only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setNetworkFilter('Out-of-Network')}>
                  {networkFilter === 'Out-of-Network' && '✓ '}Out-of-Network
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={() => setMarioPickOnly(!marioPickOnly)}>
                  {marioPickOnly && '✓ '}Mario's Pick Only
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Map View Button */}
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              style={{ borderColor: '#E0E0E0' }}
              onClick={() => {
                console.log('Map view clicked');
              }}
            >
              <Map className="h-4 w-4" />
              <span className="hidden sm:inline">Map View</span>
            </Button>

            {/* Active Filters Display */}
            <div className="flex-1 flex items-center gap-2 overflow-x-auto">
              {networkFilter !== 'all' && (
                <Badge variant="secondary" className="text-xs whitespace-nowrap">
                  {getNetworkFilterLabel()}
                </Badge>
              )}
              {marioPickOnly && (
                <Badge variant="secondary" className="text-xs whitespace-nowrap">
                  Mario's Pick
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Provider Cards */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-4">
          {providers.map((provider, index) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              onClick={() => onProviderSelect(provider.id)}
              index={index}
            />
          ))}
        </div>

        {providers.length === 0 && (
          <div className="text-center py-12">
            <p style={{ color: '#2E5077' }}>No providers found matching your filters.</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setNetworkFilter('all');
                setMarioPickOnly(false);
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

interface ProviderCardProps {
  provider: Provider;
  onClick: () => void;
  index: number;
}

function ProviderCard({ provider, onClick, index }: ProviderCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <button
        onClick={onClick}
        className="w-full bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-5 text-left border border-transparent hover:border-gray-200"
      >
        {/* Mario's Pick Badge */}
        {provider.isMariosPick && (
          <div className="flex items-center gap-2 mb-3">
            <Badge
              className="text-xs px-2 py-1"
              style={{
                backgroundColor: '#79D7BE',
                color: '#2E5077'
              }}
            >
              <Award className="h-3 w-3 mr-1" />
              Mario's Pick
            </Badge>
          </div>
        )}

        {/* Provider Name & Service */}
        <div className="mb-3">
          <h3 className="font-semibold mb-1" style={{ color: '#2E5077' }}>
            {provider.providerName}
          </h3>
          <p className="text-sm" style={{ color: '#4DA1A9' }}>
            {provider.service}
          </p>
        </div>

        {/* Distance, Network, Rating */}
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <div className="flex items-center gap-1 text-sm" style={{ color: '#2E5077' }}>
            <Navigation className="h-3 w-3" />
            <span>{provider.distance}</span>
          </div>
          
          <Badge
            variant={provider.network === 'In-Network' ? 'default' : 'secondary'}
            className="text-xs"
            style={
              provider.network === 'In-Network'
                ? { backgroundColor: '#E6F7F6', color: '#2E5077' }
                : {}
            }
          >
            {provider.network}
          </Badge>

          <div className="flex items-center gap-1 text-sm" style={{ color: '#2E5077' }}>
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{provider.rating.toFixed(1)}</span>
            <span className="text-gray-400">({provider.reviewCount})</span>
          </div>
        </div>

        {/* Price & Savings */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-2xl" style={{ color: '#2E5077' }}>
              ${provider.price}
            </span>
            <span className="text-sm line-through text-gray-400">
              ${provider.originalPrice}
            </span>
          </div>
          
          <Badge
            className="text-xs"
            style={{
              backgroundColor: '#E8F5E9',
              color: '#2E5077'
            }}
          >
            {provider.savingsPercentage}% below avg
          </Badge>
        </div>

        {/* Points */}
        <div className="mb-3">
          <p className="text-sm font-medium" style={{ color: '#4DA1A9' }}>
            Earn +{provider.points} MarioPoints
          </p>
        </div>

        {/* Optional Note */}
        {provider.note && (
          <div className="pt-3 border-t border-gray-100">
            <p className="text-sm" style={{ color: '#2E5077' }}>
              {provider.note}
            </p>
          </div>
        )}
      </button>
    </motion.div>
  );
}