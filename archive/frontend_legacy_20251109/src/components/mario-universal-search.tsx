'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { cn } from './ui/utils';
import { getSearchSuggestions, type SearchSuggestion } from '@/lib/data/healthcare-data';

interface UniversalSearchProps {
  placeholder?: string;
  onSearch: (query: string, suggestion?: SearchSuggestion) => void;
  onFocus?: () => void;
  autoFocus?: boolean;
  className?: string;
  showFilters?: boolean;
  filterValues?: {
    insurance: string;
    location: string;
  };
  onFilterChange?: (filters: { insurance: string; location: string }) => void;
}

export function UniversalSearch({
  placeholder = "Search services, doctors, or meds...",
  onSearch,
  onFocus,
  autoFocus = false,
  className,
  showFilters = false,
  filterValues,
  onFilterChange
}: UniversalSearchProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Auto focus if requested
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Search suggestions with debounce
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    debounceRef.current = setTimeout(() => {
      // Simulate API delay
      setTimeout(() => {
        const results = getSearchSuggestions(query);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
        setIsLoading(false);
        setSelectedIndex(-1);
      }, 200);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length === 0) {
      setShowSuggestions(false);
      setIsLoading(false);
    }
  };

  // Handle input focus
  const handleFocus = () => {
    setIsFocused(true);
    if (query.length >= 2 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
    onFocus?.();
  };

  // Handle input blur
  const handleBlur = () => {
    // Delay hiding suggestions to allow clicks
    setTimeout(() => {
      setIsFocused(false);
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }, 200);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSearch(query);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionSelect(suggestions[selectedIndex]);
        } else {
          handleSearch(query);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    onSearch(suggestion.text, suggestion);
  };

  // Handle search submission
  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim().length === 0) return;
    
    setShowSuggestions(false);
    setSelectedIndex(-1);
    onSearch(searchQuery.trim());
  };

  // Clear search
  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  // Get suggestion icon
  const getSuggestionIcon = (suggestion: SearchSuggestion) => {
    const iconMap: Record<string, string> = {
      service: '🔬',
      provider: '👩‍⚕️',
      medication: '💊',
      specialty: '🩺'
    };
    return iconMap[suggestion.type] || suggestion.icon || '🔍';
  };

  return (
    <div className={cn("relative w-full", className)}>
      {/* Main Search Bar */}
      <div className={cn(
        "relative flex items-center h-12",
        "transition-all duration-200",
        isFocused 
          ? "border-[3px] border-[#2E5077]" 
          : "border-2 border-[#2E5077]",
        "bg-white"
      )}
      style={{ 
        borderRadius: '14px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
      }}>
        <Search className={cn(
          "absolute left-4 h-5 w-5 transition-colors",
          isFocused ? "text-[#2E5077]" : "text-[#999999]"
        )} />
        <Input
          ref={inputRef}
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "pl-12 pr-12 h-12 border-0 bg-transparent mario-main-search cursor-text",
            "focus-visible:ring-0 focus-visible:ring-offset-0",
            "text-base font-normal"
          )}
          style={{
            color: '#1A1A1A'
          }}
        />
        
        {/* Loading or Clear Button */}
        <div className="absolute right-4 flex items-center">
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : query.length > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-6 w-6 p-0 hover:bg-muted/50"
            >
              <X className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
      </div>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className={cn(
            "absolute top-full left-0 right-0 z-50 mt-1",
            "bg-card border border-border rounded-lg shadow-lg",
            "max-h-96 overflow-y-auto"
          )}
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionSelect(suggestion)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3",
                "text-left transition-colors",
                "hover:bg-muted focus:bg-muted focus:outline-none",
                selectedIndex === index && "bg-muted",
                index === 0 && "rounded-t-lg",
                index === suggestions.length - 1 && "rounded-b-lg"
              )}
            >
              <span className="text-lg flex-shrink-0">
                {getSuggestionIcon(suggestion)}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">
                  {suggestion.text}
                </div>
                <div className="text-xs text-muted-foreground">
                  {suggestion.category}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {showSuggestions && query.length >= 2 && suggestions.length === 0 && !isLoading && (
        <div className={cn(
          "absolute top-full left-0 right-0 z-50 mt-1",
          "bg-card border border-border rounded-lg shadow-lg",
          "px-4 py-6 text-center"
        )}>
          <div className="text-muted-foreground">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No results found.</p>
            <p className="text-xs">Try different keywords.</p>
          </div>
        </div>
      )}

      {/* Filter Dropdowns (for home page) */}
      {showFilters && (
        <div className="flex gap-3 mt-2">
          <div className="flex-1">
            <select
              value={filterValues?.insurance || ''}
              onChange={(e) => onFilterChange?.({
                ...filterValues!,
                insurance: e.target.value
              })}
              className={cn(
                "w-full h-10 px-3 rounded-md border border-border",
                "bg-card text-sm",
                "focus:outline-none focus:ring-2 focus:ring-primary/20"
              )}
            >
              <option value="">Select Insurance</option>
              <option value="blue-cross">Blue Cross Blue Shield</option>
              <option value="aetna">Aetna</option>
              <option value="cigna">Cigna</option>
              <option value="united">UnitedHealthcare</option>
            </select>
          </div>
          <div className="flex-1">
            <select
              value={filterValues?.location || 'current'}
              onChange={(e) => onFilterChange?.({
                ...filterValues!,
                location: e.target.value
              })}
              className={cn(
                "w-full h-10 px-3 rounded-md border border-border",
                "bg-card text-sm",
                "focus:outline-none focus:ring-2 focus:ring-primary/20"
              )}
            >
              <option value="current">Current Location</option>
              <option value="home">Home Address</option>
              <option value="work">Work Address</option>
              <option value="custom">Enter ZIP Code</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}