'use client'
import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Slider } from './ui/slider';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { 
  Star, 
  MapPin, 
  Phone, 
  Clock, 
  Target, 
  Filter, 
  Map,
  ChevronLeft,
  X,
  Search
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from './ui/utils';
import { searchProviders, type Provider } from '@/lib/data/healthcare-data';

interface SearchFilters {
  sortBy: 'best_value' | 'price' | 'distance' | 'rating';
  network: 'all' | 'in_network' | 'out_network';
  maxDistance: number;
  priceRange: [number, number];
}

interface FilterChip {
  key: string;
  label: string;
  value: string;
}

interface MarioSearchResultsEnhancedProps {
  query: string;
  results?: Provider[];
  onResultClick?: (result: Provider) => void;
  onBack?: () => void;
}

export function MarioSearchResultsEnhanced({ 
  query, 
  results: initialResults, 
  onResultClick,
  onBack 
}: MarioSearchResultsEnhancedProps) {
  const [results, setResults] = useState<Provider[]>([]);
  const [filteredResults, setFilteredResults] = useState<Provider[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    sortBy: 'best_value',
    network: 'all',
    maxDistance: 25,
    priceRange: [0, 1000]
  });
  const [activeFilters, setActiveFilters] = useState<FilterChip[]>([]);
  const [showMap, setShowMap] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Load results on mount or when query changes
  useEffect(() => {
    try {
      if (initialResults && Array.isArray(initialResults)) {
        setResults(initialResults);
      } else {
        // Use mock search function
        const searchResults = searchProviders(query, {
          inNetworkOnly: filters.network === 'in_network',
          maxDistance: filters.maxDistance,
          sortBy: filters.sortBy
        });
        setResults(Array.isArray(searchResults) ? searchResults : []);
      }
    } catch (err) {
      console.error('Error loading search results:', err);
      setResults([]);
    }
  }, [query, initialResults, filters]);

  // Apply filters whenever filters or results change
  useEffect(() => {
    try {
      if (!Array.isArray(results)) {
        setFilteredResults([]);
        return;
      }
      let filtered = [...results];

      // Network filter
      if (filters.network === 'in_network') {
        filtered = filtered.filter(r => r && r.inNetwork === true);
      } else if (filters.network === 'out_network') {
        filtered = filtered.filter(r => r && r.inNetwork === false);
      }

      // Distance filter
      filtered = filtered.filter(r => {
        if (!r || typeof r.distance !== 'number') return false;
        return r.distance <= filters.maxDistance;
      });

    // Price range filter (using MRI cost as example)
    filtered = filtered.filter(r => {
      const cost = r.costs?.['MRI']?.total || 0;
      return cost >= filters.priceRange[0] && cost <= filters.priceRange[1];
    });

    // Sort results
    switch (filters.sortBy) {
      case 'price':
        filtered.sort((a, b) => {
          const aCost = a.costs?.['MRI']?.total || 0;
          const bCost = b.costs?.['MRI']?.total || 0;
          return aCost - bCost;
        });
        break;
      case 'distance':
        filtered.sort((a, b) => a.distance - b.distance);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'best_value':
      default:
        // Mario's Pick first, then by best value combination
        filtered.sort((a, b) => {
          if (a.marioPick && !b.marioPick) return -1;
          if (!a.marioPick && b.marioPick) return 1;
          return a.distance - b.distance;
        });
        break;
    }

      setFilteredResults(Array.isArray(filtered) ? filtered : []);
    } catch (err) {
      console.error('Error applying filters:', err);
      setFilteredResults([]);
    }

    // Update active filter chips
    const chips: FilterChip[] = [];
    
    if (filters.network === 'in_network') {
      chips.push({ key: 'network', label: 'In-Network Only', value: 'in_network' });
    } else if (filters.network === 'out_network') {
      chips.push({ key: 'network', label: 'Out-of-Network Only', value: 'out_network' });
    }
    
    if (filters.sortBy !== 'best_value') {
      const sortLabels = {
        price: 'Price ↑',
        distance: 'Distance ↑', 
        rating: 'Rating ↓'
      };
      chips.push({ 
        key: 'sort', 
        label: `Sort: ${sortLabels[filters.sortBy]}`, 
        value: filters.sortBy 
      });
    }

    setActiveFilters(chips);
  }, [results, filters]);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const removeFilter = (chipKey: string) => {
    if (chipKey === 'network') {
      handleFilterChange('network', 'all');
    } else if (chipKey === 'sort') {
      handleFilterChange('sortBy', 'best_value');
    }
  };

  const resetFilters = () => {
    setFilters({
      sortBy: 'best_value',
      network: 'all', 
      maxDistance: 25,
      priceRange: [0, 1000]
    });
  };

  const handleResultClick = (result: Provider) => {
    onResultClick?.(result);
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-border z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="md:hidden"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">{query}</h1>
              <p className="text-sm text-muted-foreground">
                {filteredResults.length} options nearby
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="flex-shrink-0">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter & Sort
                  {activeFilters.length > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 px-2">
                      {activeFilters.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh] md:h-auto">
                <SheetHeader className="mb-6">
                  <SheetTitle>Filter & Sort</SheetTitle>
                </SheetHeader>
                
                <div className="space-y-6">
                  {/* Sort By */}
                  <div>
                    <Label className="text-base font-medium mb-3 block">Sort By</Label>
                    <RadioGroup
                      value={filters.sortBy}
                      onValueChange={(value) => handleFilterChange('sortBy', value)}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="best_value" id="best_value" />
                        <Label htmlFor="best_value" className="flex-1 cursor-pointer">Best Value</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="price" id="price" />
                        <Label htmlFor="price" className="flex-1 cursor-pointer">Price: Low to High</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="distance" id="distance" />
                        <Label htmlFor="distance" className="flex-1 cursor-pointer">Distance: Nearest First</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="rating" id="rating" />
                        <Label htmlFor="rating" className="flex-1 cursor-pointer">Highest Rated</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Separator />

                  {/* Network */}
                  <div>
                    <Label className="text-base font-medium mb-3 block">Network</Label>
                    <RadioGroup
                      value={filters.network}
                      onValueChange={(value) => handleFilterChange('network', value)}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="all" id="all" />
                        <Label htmlFor="all" className="flex-1 cursor-pointer">All Providers</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="in_network" id="in_network" />
                        <Label htmlFor="in_network" className="flex-1 cursor-pointer">In-Network Only</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="out_network" id="out_network" />
                        <Label htmlFor="out_network" className="flex-1 cursor-pointer">Out-of-Network Only</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Separator />

                  {/* Distance */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-base font-medium">Distance</Label>
                      <span className="text-sm text-muted-foreground">
                        Currently: {filters.maxDistance} mi
                      </span>
                    </div>
                    <div className="px-3">
                      <Slider
                        value={[filters.maxDistance]}
                        onValueChange={([value]) => handleFilterChange('maxDistance', value)}
                        max={25}
                        min={1}
                        step={1}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>1 mi</span>
                        <span>25 mi</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Price Range */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-base font-medium">Price Range</Label>
                      <span className="text-sm text-muted-foreground">
                        ${filters.priceRange[0]} - ${filters.priceRange[1]}
                      </span>
                    </div>
                    <div className="px-3">
                      <Slider
                        value={filters.priceRange}
                        onValueChange={(value) => handleFilterChange('priceRange', value as [number, number])}
                        max={1000}
                        min={0}
                        step={25}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>$0</span>
                        <span>$1000</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 mt-8 pt-6 border-t">
                  <Button variant="outline" onClick={resetFilters} className="flex-1">
                    Reset
                  </Button>
                  <Button onClick={() => setIsFilterOpen(false)} className="flex-1">
                    Apply Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowMap(!showMap)}
              className="flex-shrink-0"
            >
              <Map className="h-4 w-4 mr-2" />
              {showMap ? 'List' : 'Map'} View
            </Button>
          </div>

          {/* Active Filter Chips */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {Array.isArray(activeFilters) && activeFilters.length > 0 ? activeFilters.map((chip) => (
                <div
                  key={chip.key}
                  className="flex items-center gap-1 bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs"
                >
                  <span>{chip.label}</span>
                  <button
                    onClick={() => removeFilter(chip.key)}
                    className="hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-4xl mx-auto p-4">
        {filteredResults.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No results found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
            <Button variant="outline" onClick={resetFilters}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {Array.isArray(filteredResults) && filteredResults.length > 0 ? filteredResults.map((result) => {
              if (!result || typeof result !== 'object') return null;
              return (
                <Card 
                  key={result.id}
                  className={cn(
                    "p-6 cursor-pointer",
                    "mario-transition mario-hover-provider"
                  )}
                  onClick={() => result && handleResultClick(result)}
                >
                {result.marioPick && (
                  <div className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium mb-4 inline-flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Mario's Pick - Save {result.costs?.['MRI']?.percentSavings}%
                  </div>
                )}
                
                <div className="flex items-start gap-4">
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
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-lg truncate">{result.name}</h3>
                        <p className="text-muted-foreground text-sm">{result.specialty}</p>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <div className="text-2xl font-bold text-primary">
                          ${result.costs?.['MRI']?.total || 'N/A'}
                        </div>
                        {result.costs?.['MRI']?.percentSavings && result.costs['MRI'].percentSavings > 0 && (
                          <Badge variant="secondary" className="bg-accent/20 text-accent mt-1">
                            {result.costs['MRI'].percentSavings}% below average
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3 flex-wrap">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{result.rating.toFixed(2)}</span>
                        <span>({result.reviewCount} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{result.distance} miles</span>
                      </div>
                      <Badge 
                        variant={result.inNetwork ? "default" : "outline"}
                        className={cn(
                          result.inNetwork 
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                            : "border-orange-300 text-orange-700 dark:border-orange-700 dark:text-orange-300"
                        )}
                      >
                        {result.inNetwork ? "In-Network" : "Out-of-Network"}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-muted-foreground mb-4 truncate">
                      <span>{result.address}, {result.city}, {result.state}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        +{result.marioPoints} MarioPoints
                      </span>
                      <Button size="sm" className="mario-button-scale">
                        {result.marioPick ? 'Book Appointment' : 'View Details'}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
              );
            }).filter(Boolean) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No results found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}