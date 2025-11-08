'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Filter, MapPin, ChevronDown, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from './ui/select';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle 
} from './ui/dialog';
import { Slider } from './ui/slider';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { getSearchSuggestions, type SearchSuggestion } from '@/lib/data/healthcare-data';

interface SearchBarProps {
  onSearch: (query: string, type?: 'service' | 'medication' | 'provider') => void;
  placeholder?: string;
  showFilters?: boolean;
  defaultValue?: string;
}

export function EnhancedSearchBar({ onSearch, placeholder = "Search services, doctors, or medications...", showFilters = true, defaultValue = "" }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Location and insurance state for home page filters
  const [insurance, setInsurance] = useState("Blue Cross Blue Shield");
  const [location, setLocation] = useState("Current Location");

  useEffect(() => {
    if (query.length >= 2) {
      setIsLoading(true);
      // Simulate API delay
      const timer = setTimeout(() => {
        const newSuggestions = getSearchSuggestions(query);
        setSuggestions(newSuggestions);
        setIsLoading(false);
        setSelectedIndex(-1);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
      setIsLoading(false);
    }
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isFocused || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setIsFocused(false);
        setSuggestions([]);
        break;
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    setIsFocused(false);
    setSuggestions([]);
    onSearch(suggestion.text, suggestion.type);
  };

  const handleSearch = () => {
    if (query.trim()) {
      setIsFocused(false);
      setSuggestions([]);
      onSearch(query.trim());
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-3">
      {/* Main Search Bar */}
      <div className="relative">
        <div className={`relative flex items-center border rounded-lg bg-white transition-all duration-200 ${
          isFocused ? 'border-primary shadow-lg ring-2 ring-primary/20' : 'border-border'
        }`}>
          <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              // Delay hiding suggestions to allow clicking
              setTimeout(() => setIsFocused(false), 150);
            }}
            placeholder={placeholder}
            className="pl-12 pr-12 h-12 border-0 focus-visible:ring-0 text-base bg-transparent"
          />
          {isLoading && (
            <Loader2 className="absolute right-12 h-4 w-4 animate-spin text-muted-foreground" />
          )}
          {query && !isLoading && (
            <button
              onClick={clearSearch}
              className="absolute right-4 p-1 hover:bg-muted rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Search Suggestions Dropdown */}
        {isFocused && (suggestions.length > 0 || isLoading) && (
          <Card 
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 mt-1 z-50 shadow-lg border-0 mario-shadow-elevated"
          >
            {isLoading ? (
              <div className="p-4 text-center text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                Searching...
              </div>
            ) : suggestions.length > 0 ? (
              <div className="py-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted transition-colors ${
                      index === selectedIndex ? 'bg-muted' : ''
                    }`}
                  >
                    <span className="text-xl">{suggestion.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium">{suggestion.text}</div>
                      <div className="text-sm text-muted-foreground">{suggestion.category}</div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {suggestion.type}
                    </Badge>
                  </button>
                ))}
              </div>
            ) : query.length >= 2 && (
              <div className="p-4 text-center text-muted-foreground">
                <div className="text-sm">No results found</div>
                <div className="text-xs">Try different keywords</div>
              </div>
            )}
          </Card>
        )}
      </div>

      {/* Filter Dropdowns (Home Page) */}
      {showFilters && (
        <div className="flex gap-3">
          <Select value={insurance} onValueChange={setInsurance}>
            <SelectTrigger className="flex-1 h-11">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Insurance:</span>
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Blue Cross Blue Shield">Blue Cross Blue Shield</SelectItem>
              <SelectItem value="Aetna">Aetna</SelectItem>
              <SelectItem value="Cigna">Cigna</SelectItem>
              <SelectItem value="UnitedHealth">UnitedHealth</SelectItem>
              <SelectItem value="Humana">Humana</SelectItem>
            </SelectContent>
          </Select>

          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="flex-1 h-11">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Location:</span>
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Current Location">Current Location</SelectItem>
              <SelectItem value="Home">Home Address</SelectItem>
              <SelectItem value="Work">Work Address</SelectItem>
              <SelectItem value="Custom">Enter ZIP Code</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: SearchFilters) => void;
  initialFilters?: SearchFilters;
}

export interface SearchFilters {
  sortBy: 'best_value' | 'price_low' | 'distance' | 'rating';
  network: 'all' | 'in_network' | 'out_network';
  distance: number;
  priceRange: [number, number];
}

export function FilterModal({ isOpen, onClose, onApply, initialFilters }: FilterModalProps) {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters || {
    sortBy: 'best_value',
    network: 'all',
    distance: 25,
    priceRange: [0, 1000]
  });

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      sortBy: 'best_value',
      network: 'all',
      distance: 25,
      priceRange: [0, 1000]
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Filter & Sort</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Sort By */}
          <div>
            <Label className="text-base font-medium mb-3 block">Sort By</Label>
            <RadioGroup 
              value={filters.sortBy} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value as any }))}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="best_value" id="best_value" />
                <Label htmlFor="best_value">Best Value</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="price_low" id="price_low" />
                <Label htmlFor="price_low">Price: Low to High</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="distance" id="distance" />
                <Label htmlFor="distance">Distance: Nearest First</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rating" id="rating" />
                <Label htmlFor="rating">Highest Rated</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Network */}
          <div>
            <Label className="text-base font-medium mb-3 block">Network</Label>
            <RadioGroup 
              value={filters.network} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, network: value as any }))}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all_providers" />
                <Label htmlFor="all_providers">All Providers</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="in_network" id="in_network" />
                <Label htmlFor="in_network">In-Network Only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="out_network" id="out_network" />
                <Label htmlFor="out_network">Out-of-Network Only</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Distance */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              Distance: {filters.distance} miles
            </Label>
            <Slider
              value={[filters.distance]}
              onValueChange={([value]) => setFilters(prev => ({ ...prev, distance: value }))}
              max={50}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1 mi</span>
              <span>50 mi</span>
            </div>
          </div>

          {/* Price Range */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
            </Label>
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value as [number, number] }))}
              max={2000}
              min={0}
              step={50}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>$0</span>
              <span>$2000</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="ghost" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleApply}>
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ActiveFiltersProps {
  filters: SearchFilters;
  onRemoveFilter: (filterType: keyof SearchFilters) => void;
  onClearAll: () => void;
}

export function ActiveFilterChips({ filters, onRemoveFilter, onClearAll }: ActiveFiltersProps) {
  const activeFilters = [];

  if (filters.network !== 'all') {
    activeFilters.push({
      key: 'network' as const,
      label: filters.network === 'in_network' ? 'In-Network Only' : 'Out-of-Network Only'
    });
  }

  if (filters.sortBy !== 'best_value') {
    const sortLabels = {
      price_low: 'Price: Low to High',
      distance: 'Distance: Nearest First',
      rating: 'Highest Rated'
    };
    activeFilters.push({
      key: 'sortBy' as const,
      label: sortLabels[filters.sortBy]
    });
  }

  if (filters.distance < 25) {
    activeFilters.push({
      key: 'distance' as const,
      label: `Within ${filters.distance} miles`
    });
  }

  if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) {
    activeFilters.push({
      key: 'priceRange' as const,
      label: `$${filters.priceRange[0]} - $${filters.priceRange[1]}`
    });
  }

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {activeFilters.map(filter => (
        <Badge 
          key={filter.key}
          variant="secondary" 
          className="flex items-center gap-1 cursor-pointer hover:bg-muted"
          onClick={() => onRemoveFilter(filter.key)}
        >
          {filter.label}
          <X className="h-3 w-3" />
        </Badge>
      ))}
      {activeFilters.length > 1 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="h-6 px-2 text-xs"
        >
          Clear all
        </Button>
      )}
    </div>
  );
}