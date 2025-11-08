'use client'
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  Search, 
  MapPin, 
  ChevronDown, 
  Filter,
  X,
  Slider,
  CheckCircle2
} from 'lucide-react';

interface UniversalSearchProps {
  onSearch?: (query: string, insurance: string, location: string) => void;
}

export function UniversalSearch({ onSearch }: UniversalSearchProps) {
  const [query, setQuery] = useState('');
  const [insurance, setInsurance] = useState('Blue Cross Blue Shield');
  const [location, setLocation] = useState('New York, NY');
  
  const handleSearch = () => {
    onSearch?.(query, insurance, location);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search procedures, doctors, medications..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 h-12 text-base"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="relative">
          <Input
            value={insurance}
            onChange={(e) => setInsurance(e.target.value)}
            className="pr-10 h-12"
            placeholder="Select insurance"
          />
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
        
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-10 pr-10 h-12"
            placeholder="Location"
          />
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
      </div>
      
      <Button onClick={handleSearch} className="w-full h-12 mario-button-scale">
        Search
      </Button>
    </div>
  );
}

interface MarioAISearchProps {
  onQuery?: (query: string) => void;
}

export function MarioAISearch({ onQuery }: MarioAISearchProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');

  return (
    <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 text-left"
      >
        <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-semibold text-accent-foreground">AI</span>
        </div>
        <div className="flex-1">
          <p className="font-medium text-accent">Ask MarioAI (beta)</p>
          <p className="text-sm text-muted-foreground">Get personalized healthcare recommendations</p>
        </div>
        <ChevronDown className={`h-5 w-5 text-accent mario-transition ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      
      {isExpanded && (
        <div className="mt-4 space-y-3">
          <Input
            placeholder="Ask me anything about your healthcare..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-background"
            onKeyDown={(e) => e.key === 'Enter' && onQuery?.(query)}
          />
          <div className="flex flex-wrap gap-2">
            {[
              "Find cheap MRI near me",
              "Compare insurance plans",
              "Best cardiologist reviews"
            ].map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                onClick={() => {
                  setQuery(suggestion);
                  onQuery?.(suggestion);
                }}
                className="text-xs"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface CommonSearchesProps {
  searches: string[];
  onSearchClick?: (search: string) => void;
}

export function CommonSearches({ searches, onSearchClick }: CommonSearchesProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-medium text-foreground">Common Searches</h3>
      <div className="flex flex-wrap gap-2">
        {searches.map((search) => (
          <Badge
            key={search}
            variant="secondary"
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground mario-transition mario-button-scale"
            onClick={() => onSearchClick?.(search)}
          >
            {search}
          </Badge>
        ))}
      </div>
    </div>
  );
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
}

interface FilterOptions {
  sortBy: string;
  networkType: string;
  maxDistance: number;
  priceRange: [number, number];
}

export function FilterModal({ isOpen, onClose, onApply }: FilterModalProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: 'distance',
    networkType: 'all',
    maxDistance: 25,
    priceRange: [0, 1000]
  });

  if (!isOpen) return null;

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      sortBy: 'distance',
      networkType: 'all',
      maxDistance: 25,
      priceRange: [0, 1000]
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50">
      <div className="bg-background rounded-t-lg md:rounded-lg w-full md:w-96 max-h-[80vh] overflow-y-auto">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold">Filter & Sort</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 space-y-6">
          <div>
            <h3 className="font-medium mb-3">Sort By</h3>
            <div className="space-y-2">
              {[
                { value: 'distance', label: 'Distance' },
                { value: 'price', label: 'Price: Low to High' },
                { value: 'rating', label: 'Highest Rated' },
                { value: 'availability', label: 'Earliest Available' }
              ].map(({ value, label }) => (
                <label key={value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sortBy"
                    value={value}
                    checked={filters.sortBy === value}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Network</h3>
            <div className="space-y-2">
              {[
                { value: 'all', label: 'All Providers' },
                { value: 'in-network', label: 'In-Network Only' },
                { value: 'out-network', label: 'Out-of-Network Only' }
              ].map(({ value, label }) => (
                <label key={value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="networkType"
                    value={value}
                    checked={filters.networkType === value}
                    onChange={(e) => setFilters({ ...filters, networkType: e.target.value })}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Distance</h3>
            <div className="space-y-2">
              <input
                type="range"
                min="5"
                max="100"
                value={filters.maxDistance}
                onChange={(e) => setFilters({ ...filters, maxDistance: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>5 miles</span>
                <span>{filters.maxDistance} miles</span>
                <span>100 miles</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Price Range</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={filters.priceRange[0]}
                  onChange={(e) => setFilters({ 
                    ...filters, 
                    priceRange: [parseInt(e.target.value), filters.priceRange[1]] 
                  })}
                  className="flex-1"
                  placeholder="Min"
                />
                <span>to</span>
                <Input
                  type="number"
                  value={filters.priceRange[1]}
                  onChange={(e) => setFilters({ 
                    ...filters, 
                    priceRange: [filters.priceRange[0], parseInt(e.target.value)] 
                  })}
                  className="flex-1"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border flex gap-3">
          <Button variant="outline" onClick={handleReset} className="flex-1">
            Reset
          </Button>
          <Button onClick={handleApply} className="flex-1">
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
}