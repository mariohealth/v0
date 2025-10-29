"use client";

import { ArrowLeft, Search, MapPin, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { usePreferences } from "@/lib/contexts/PreferencesContext";
import { SearchHistoryDropdown } from "@/components/search/SearchHistoryDropdown";
import { findClosestMatch } from "@/lib/search-utils";
import { addToHistory } from "@/lib/search-history";
// import { Provider } from "@/lib/mockData";

interface SearchHeaderProps {
  initialQuery?: string;
  initialLocation?: string;
  resultCount: number;
}

// Common medical terms for spell checking
const COMMON_MEDICAL_TERMS = [
  'MRI',
  'CT',
  'X-ray',
  'Ultrasound',
  'Blood test',
  'Mammogram',
  'Colonoscopy',
  'Endoscopy',
  'Surgery',
  'Physical exam',
  'Dental cleaning',
];

export default function SearchHeader({
  initialQuery = "",
  initialLocation = "",
  resultCount,
}: SearchHeaderProps) {
  const router = useRouter();
  const { defaultZip, defaultRadius } = usePreferences();
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation || defaultZip || "");
  const [showHistory, setShowHistory] = useState(false);
  const [spellSuggestion, setSpellSuggestion] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(query);
  const queryInputRef = useRef<HTMLInputElement>(null);

  // Update location when preferences change
  useEffect(() => {
    if (defaultZip && !initialLocation) {
      setLocation(defaultZip);
    }
  }, [defaultZip, initialLocation]);

  // Spell check as user types
  useEffect(() => {
    if (searchQuery.length >= 3) {
      const suggestion = findClosestMatch(searchQuery, COMMON_MEDICAL_TERMS, 0.6);
      setSpellSuggestion(suggestion);
    } else {
      setSpellSuggestion(null);
    }
  }, [searchQuery]);

  const handleSearch = (searchQuery: string, searchLocation: string) => {
    if (searchQuery.trim()) {
      // Add to history
      addToHistory(searchQuery, searchLocation);
      
      // Navigate to search page
      router.push(`/search?q=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(searchLocation)}`);
      setShowHistory(false);
    }
  };

  const handleSubmit = () => {
    handleSearch(query, location);
  };

  const handleQuerySelect = (selectedQuery: string, selectedLocation?: string) => {
    setQuery(selectedQuery);
    setSearchQuery(selectedQuery);
    if (selectedLocation) {
      setLocation(selectedLocation);
    }
    handleSearch(selectedQuery, selectedLocation || location);
  };

  const handleSuggestionClick = () => {
    if (spellSuggestion) {
      setQuery(spellSuggestion);
      setSearchQuery(spellSuggestion);
      handleSearch(spellSuggestion, location);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Back button and title */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => router.back()}
            className="p-2 min-h-[44px] min-w-[44px] hover:bg-gray-100 active:bg-gray-200 active:scale-[0.95] rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 flex items-center justify-center"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" aria-hidden="true" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Search Results
            </h1>
            <p className="text-sm text-gray-500">
              {resultCount} {resultCount === 1 ? "provider" : "providers"} found
            </p>
          </div>
        </div>

        {/* Search inputs */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Procedure input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" aria-hidden="true" />
            <input
              ref={queryInputRef}
              type="text"
              placeholder="Search procedures or tests..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setQuery(e.target.value);
              }}
              onFocus={() => setShowHistory(true)}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-4 py-3 min-h-[44px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base"
              aria-label="Search for procedures or tests"
            />
            
            {/* Search History Dropdown */}
            {showHistory && (
              <SearchHistoryDropdown
                isOpen={showHistory}
                onClose={() => setShowHistory(false)}
                onSelect={handleQuerySelect}
              />
            )}
          </div>

          {/* Location input */}
          <div className="sm:w-64 relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" aria-hidden="true" />
            <input
              type="text"
              placeholder="New York, NY"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-4 py-3 min-h-[44px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base"
              aria-label="Enter your location"
            />
          </div>

          {/* Search button */}
          <button
            onClick={handleSubmit}
            className="sm:w-auto bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 active:scale-[0.98] text-white px-6 py-3 min-h-[44px] rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            aria-label="Search for providers"
          >
            <Search className="w-5 h-5" aria-hidden="true" />
            <span>Search</span>
          </button>
        </div>

        {/* Spell Check Suggestion */}
        {spellSuggestion && spellSuggestion !== searchQuery && (
          <div className="flex items-center gap-2 mt-2 text-sm">
            <AlertCircle className="w-4 h-4 text-orange-500" />
            <span className="text-gray-600">
              Did you mean:{' '}
              <button
                onClick={handleSuggestionClick}
                className="text-emerald-600 hover:text-emerald-700 font-medium underline"
              >
                {spellSuggestion}
              </button>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}