'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Loader2, Sparkles } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { cn } from './ui/utils';
import { searchData } from '@/lib/data/mario-search-data';
import { MarioAutocompleteEnhanced, type AutocompleteSuggestion } from './mario-autocomplete-enhanced';
import { doctors, specialties } from '@/lib/data/mario-doctors-data';
import { searchMedications } from '@/lib/data/mario-medication-data';

interface SearchResult {
  id: string;
  text: string;
  category: 'Doctors' | 'Procedures' | 'Medications';
  metadata?: any;
}

interface SmartSearchProps {
  placeholder?: string;
  onSearch: (query: string, suggestion?: AutocompleteSuggestion) => void;
  onAutocompleteSelect?: (suggestion: AutocompleteSuggestion) => void;
  onFocus?: () => void;
  autoFocus?: boolean;
  className?: string;
}

export function MarioSmartSearch({
  placeholder = "Search services, doctors, or meds...",
  onSearch,
  onAutocompleteSelect,
  onFocus,
  autoFocus = false,
  className
}: SmartSearchProps) {
  const [query, setQuery] = useState('');
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Auto focus if requested
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Fuzzy match helper
  const fuzzyMatch = (text: string, search: string): boolean => {
    const searchLower = search.toLowerCase();
    const textLower = text.toLowerCase();
    
    // Direct match
    if (textLower.includes(searchLower)) {
      return true;
    }
    
    // Check if all search characters appear in order
    let searchIndex = 0;
    for (let i = 0; i < textLower.length && searchIndex < searchLower.length; i++) {
      if (textLower[i] === searchLower[searchIndex]) {
        searchIndex++;
      }
    }
    return searchIndex === searchLower.length;
  };

  // Search with debounce - populate autocomplete suggestions
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.length < 2) {
      setAutocompleteSuggestions([]);
      setShowAutocomplete(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    debounceRef.current = setTimeout(() => {
      const suggestions: AutocompleteSuggestion[] = [];
      
      // Search doctors
      const matchingDoctors = doctors.filter(doc => 
        fuzzyMatch(doc.name, query)
      ).slice(0, 3);
      
      matchingDoctors.forEach(doc => {
        suggestions.push({
          id: doc.id,
          type: 'doctor',
          primaryText: doc.name,
          secondaryText: doc.specialty,
          doctor: doc
        });
      });
      
      // Search specialties
      const matchingSpecialties = specialties.filter(spec =>
        fuzzyMatch(spec.name, query)
      ).slice(0, 3);
      
      matchingSpecialties.forEach(spec => {
        suggestions.push({
          id: spec.id,
          type: 'specialty',
          primaryText: spec.name,
          secondaryText: `${spec.doctorCount} doctors available`,
          specialty: spec
        });
      });
      
      // Search procedures (from existing search data)
      const matchingProcedures = searchData.procedures.filter(proc =>
        fuzzyMatch(proc.name, query)
      ).slice(0, 3);
      
      matchingProcedures.forEach(proc => {
        suggestions.push({
          id: `proc-${proc.name}`,
          type: 'specialty' as any, // Use specialty type for procedures for now
          primaryText: proc.name,
          secondaryText: 'View providers'
        });
      });
      
      // Search medications
      const matchingMedications = searchMedications(query).slice(0, 3);
      
      matchingMedications.forEach(med => {
        // Create display text like "Lipitor - Atorvastatin 20 mg"
        const displayName = med.genericFor 
          ? `${med.genericFor} - ${med.name}`
          : med.name;
        
        suggestions.push({
          id: med.id || `med-${med.name}`,
          type: 'medication' as any,
          primaryText: displayName,
          secondaryText: 'Medication',
          medication: med
        });
      });
      
      setAutocompleteSuggestions(suggestions);
      setShowAutocomplete(suggestions.length > 0);
      setIsLoading(false);
      setSelectedIndex(-1);
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
      setShowAutocomplete(false);
      setIsLoading(false);
    }
  };

  // Handle input focus
  const handleFocus = () => {
    setIsFocused(true);
    if (query.length >= 2) {
      setShowAutocomplete(true);
    }
    onFocus?.();
  };

  // Handle input blur
  const handleBlur = () => {
    // Delay hiding results to allow clicks
    setTimeout(() => {
      setIsFocused(false);
      setShowAutocomplete(false);
      setSelectedIndex(-1);
    }, 200);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showAutocomplete || autocompleteSuggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSearch(query);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < autocompleteSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < autocompleteSuggestions.length) {
          handleAutocompleteSelect(autocompleteSuggestions[selectedIndex]);
        } else {
          handleSearch(query);
        }
        break;
      case 'Escape':
        setShowAutocomplete(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle autocomplete selection
  const handleAutocompleteSelect = (suggestion: AutocompleteSuggestion) => {
    setQuery(suggestion.primaryText);
    setShowAutocomplete(false);
    setSelectedIndex(-1);
    
    // Call the onSearch with the suggestion so App.tsx can route appropriately
    onSearch(suggestion.primaryText, suggestion);
    
    // Also call the dedicated callback if provided
    if (onAutocompleteSelect) {
      onAutocompleteSelect(suggestion);
    }
  };

  // Handle search submission
  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim().length === 0) return;
    
    setShowAutocomplete(false);
    setSelectedIndex(-1);
    onSearch(searchQuery.trim());
  };

  // Clear search
  const handleClear = () => {
    setQuery('');
    setAutocompleteSuggestions([]);
    setShowAutocomplete(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
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

      {/* Search Results Overlay */}
      {showAutocomplete && (
        <div
          className="absolute top-full left-0 right-0 z-50 mt-2"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
            maxHeight: '480px',
            overflowY: 'auto'
          }}
        >
          {/* Doctors Section */}
          {autocompleteSuggestions.filter(s => s.type === 'doctor').length > 0 && (
            <div className="p-3">
              <div 
                className="px-2 py-1.5 mb-1"
                style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#666666',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                Doctors
              </div>
              <div className="space-y-0.5">
                {autocompleteSuggestions.filter(s => s.type === 'doctor').map((result, index) => {
                  const globalIndex = index;
                  const isSelected = selectedIndex === globalIndex;
                  
                  return (
                    <button
                      key={result.id}
                      onClick={() => handleAutocompleteSelect(result)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg",
                        "text-left transition-colors mario-transition",
                        isSelected && "bg-[#2E5077] text-white",
                        !isSelected && "hover:bg-gray-50"
                      )}
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.2)' : 'rgba(46, 80, 119, 0.1)'
                        }}
                      >
                        <span className="text-base">👨‍⚕️</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div 
                          className="font-medium truncate"
                          style={{
                            fontSize: '14px',
                            color: isSelected ? '#FFFFFF' : '#2E5077'
                          }}
                        >
                          {result.primaryText}
                        </div>
                        <div 
                          className="text-xs truncate"
                          style={{
                            color: isSelected ? 'rgba(255, 255, 255, 0.8)' : '#666666'
                          }}
                        >
                          {result.secondaryText}
                        </div>
                      </div>
                      {result.metadata?.marioPick && (
                        <div 
                          className="px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor: isSelected ? 'rgba(121, 215, 190, 0.3)' : 'rgba(121, 215, 190, 0.15)',
                            fontSize: '10px',
                            fontWeight: '600',
                            color: isSelected ? '#FFFFFF' : '#2E5077'
                          }}
                        >
                          Mario's Pick
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Specialties Section */}
          {autocompleteSuggestions.filter(s => s.type === 'specialty').length > 0 && (
            <div className="p-3">
              {autocompleteSuggestions.filter(s => s.type === 'doctor').length > 0 && (
                <div 
                  className="h-px mb-3"
                  style={{ backgroundColor: '#E8EAED' }}
                />
              )}
              <div 
                className="px-2 py-1.5 mb-1"
                style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#666666',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                Specialties
              </div>
              <div className="space-y-0.5">
                {autocompleteSuggestions.filter(s => s.type === 'specialty').map((result, index) => {
                  const globalIndex = autocompleteSuggestions.filter(s => s.type === 'doctor').length + index;
                  const isSelected = selectedIndex === globalIndex;
                  
                  return (
                    <button
                      key={result.id}
                      onClick={() => handleAutocompleteSelect(result)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg",
                        "text-left transition-colors mario-transition",
                        isSelected && "bg-[#2E5077] text-white",
                        !isSelected && "hover:bg-gray-50"
                      )}
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.2)' : 'rgba(46, 80, 119, 0.1)'
                        }}
                      >
                        <span className="text-base">🔬</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div 
                          className="font-medium truncate"
                          style={{
                            fontSize: '14px',
                            color: isSelected ? '#FFFFFF' : '#2E5077'
                          }}
                        >
                          {result.primaryText}
                        </div>
                        <div 
                          className="text-xs truncate"
                          style={{
                            color: isSelected ? 'rgba(255, 255, 255, 0.8)' : '#666666'
                          }}
                        >
                          {result.secondaryText}
                        </div>
                      </div>
                      {result.metadata?.price && (
                        <div 
                          className="flex-shrink-0"
                          style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: isSelected ? '#FFFFFF' : '#2E5077'
                          }}
                        >
                          {result.metadata.price}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Procedures Section */}
          {autocompleteSuggestions.filter(s => s.type === 'specialty' && !s.specialty).length > 0 && (
            <div className="p-3">
              {(autocompleteSuggestions.filter(s => s.type === 'doctor').length > 0 || autocompleteSuggestions.filter(s => s.type === 'specialty').length > 0) && (
                <div 
                  className="h-px mb-3"
                  style={{ backgroundColor: '#E8EAED' }}
                />
              )}
              <div 
                className="px-2 py-1.5 mb-1"
                style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#666666',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                Procedures
              </div>
              <div className="space-y-0.5">
                {autocompleteSuggestions.filter(s => s.type === 'specialty' && !s.specialty).map((result, index) => {
                  const globalIndex = autocompleteSuggestions.filter(s => s.type === 'doctor').length + autocompleteSuggestions.filter(s => s.type === 'specialty').length + index;
                  const isSelected = selectedIndex === globalIndex;
                  
                  return (
                    <button
                      key={result.id}
                      onClick={() => handleAutocompleteSelect(result)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg",
                        "text-left transition-colors mario-transition",
                        isSelected && "bg-[#2E5077] text-white",
                        !isSelected && "hover:bg-gray-50"
                      )}
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.2)' : 'rgba(46, 80, 119, 0.1)'
                        }}
                      >
                        <span className="text-base">🔬</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div 
                          className="font-medium truncate"
                          style={{
                            fontSize: '14px',
                            color: isSelected ? '#FFFFFF' : '#2E5077'
                          }}
                        >
                          {result.primaryText}
                        </div>
                        <div 
                          className="text-xs truncate"
                          style={{
                            color: isSelected ? 'rgba(255, 255, 255, 0.8)' : '#666666'
                          }}
                        >
                          {result.secondaryText}
                        </div>
                      </div>
                      {result.metadata?.price && (
                        <div 
                          className="flex-shrink-0"
                          style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: isSelected ? '#FFFFFF' : '#2E5077'
                          }}
                        >
                          {result.metadata.price}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Medications Section */}
          {autocompleteSuggestions.filter(s => s.type === 'medication').length > 0 && (
            <div className="p-3">
              {(autocompleteSuggestions.filter(s => s.type === 'doctor').length > 0 || autocompleteSuggestions.filter(s => s.type === 'specialty').length > 0 || autocompleteSuggestions.filter(s => s.type === 'specialty' && !s.specialty).length > 0) && (
                <div 
                  className="h-px mb-3"
                  style={{ backgroundColor: '#E8EAED' }}
                />
              )}
              <div 
                className="px-2 py-1.5 mb-1"
                style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#666666',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                Medications
              </div>
              <div className="space-y-0.5">
                {autocompleteSuggestions.filter(s => s.type === 'medication').map((result, index) => {
                  const globalIndex = autocompleteSuggestions.filter(s => s.type === 'doctor').length + autocompleteSuggestions.filter(s => s.type === 'specialty').length + autocompleteSuggestions.filter(s => s.type === 'specialty' && !s.specialty).length + index;
                  const isSelected = selectedIndex === globalIndex;
                  
                  return (
                    <button
                      key={result.id}
                      onClick={() => handleAutocompleteSelect(result)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg",
                        "text-left transition-colors mario-transition",
                        isSelected && "bg-[#2E5077] text-white",
                        !isSelected && "hover:bg-gray-50"
                      )}
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.2)' : 'rgba(46, 80, 119, 0.1)'
                        }}
                      >
                        <span className="text-base">💊</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div 
                          className="font-medium truncate"
                          style={{
                            fontSize: '14px',
                            color: isSelected ? '#FFFFFF' : '#2E5077'
                          }}
                        >
                          {result.primaryText}
                        </div>
                        <div 
                          className="text-xs truncate"
                          style={{
                            color: isSelected ? 'rgba(255, 255, 255, 0.8)' : '#666666'
                          }}
                        >
                          {result.secondaryText}
                        </div>
                      </div>
                      {result.metadata?.price && (
                        <div 
                          className="flex-shrink-0"
                          style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: isSelected ? '#FFFFFF' : '#2E5077'
                          }}
                        >
                          {result.metadata.price}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Truly no results */}
          {!isLoading && autocompleteSuggestions.length === 0 && (
            <div className="p-6 text-center">
              <Search 
                className="h-10 w-10 mx-auto mb-3"
                style={{ color: '#CCCCCC' }}
              />
              <p 
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#2E5077',
                  marginBottom: '4px'
                }}
              >
                No results found
              </p>
              <p 
                style={{
                  fontSize: '12px',
                  color: '#999999'
                }}
              >
                Try different keywords or browse categories
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}