"use client";

import { Search, MapPin, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePreferences } from "@/lib/contexts/PreferencesContext";

export default function SearchBar() {
  const router = useRouter();
  const { defaultZip, defaultRadius, savedLocations } = usePreferences();
  const [procedure, setProcedure] = useState("");
  const [location, setLocation] = useState(defaultZip || "New York, NY");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [selectedSavedLocation, setSelectedSavedLocation] = useState<string | null>(null);

  // Update location when preference changes
  useEffect(() => {
    if (defaultZip) {
      setLocation(defaultZip);
    }
  }, [defaultZip]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.location-dropdown-container')) {
        setShowLocationDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (procedure.trim()) {
      router.push(
        `/search?q=${encodeURIComponent(procedure)}&location=${encodeURIComponent(location)}&radius=${selectedSavedLocation ? savedLocations.find(l => l.name === selectedSavedLocation)?.radius || defaultRadius : defaultRadius}`
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSavedLocationSelect = (loc: { name: string; zip: string; radius: number }) => {
    setLocation(loc.zip);
    setSelectedSavedLocation(loc.name);
    setShowLocationDropdown(false);
  };

  const handleManualLocationChange = (value: string) => {
    setLocation(value);
    setSelectedSavedLocation(null);
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        {/* Title */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Find affordable healthcare
          </h1>
          <p className="text-gray-600">
            Compare prices and book appointments
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {/* Procedure input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search procedures or tests (e.g., MRI, Blood Test)"
              value={procedure}
              onChange={(e) => setProcedure(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-4 py-3 min-h-[44px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base"
            />
          </div>

          {/* Location input with saved locations dropdown */}
          <div className="relative location-dropdown-container">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
            <input
              type="text"
              placeholder="City or ZIP code"
              value={location}
              onChange={(e) => handleManualLocationChange(e.target.value)}
              onFocus={() => setShowLocationDropdown(savedLocations.length > 0)}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-4 py-3 min-h-[44px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base"
            />
            {showLocationDropdown && savedLocations.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                <div className="p-2">
                  <div className="text-xs font-semibold text-gray-500 uppercase px-3 py-1">Saved Locations</div>
                  {savedLocations.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => handleSavedLocationSelect(loc)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <div className="font-medium text-gray-900">{loc.name}</div>
                      <div className="text-sm text-gray-600">
                        {loc.zip} • {loc.radius} mi radius
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search button */}
          <button
            onClick={handleSearch}
            disabled={!procedure.trim()}
            className="w-full bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 min-h-[44px] rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <Search className="w-5 h-5" />
            <span>Search</span>
          </button>
        </div>

        {/* Quick search suggestions */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Popular searches:</p>
          <div className="flex flex-wrap gap-2">
            {["MRI Scan", "Blood Test", "X-Ray", "CT Scan", "Ultrasound"].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setProcedure(suggestion);
                  router.push(
                    `/search?q=${encodeURIComponent(suggestion)}&location=${encodeURIComponent(location)}`
                  );
                }}
                className="px-3 py-2 min-h-[44px] bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 active:bg-emerald-100 active:scale-[0.95] text-gray-700 text-sm rounded-full transition-all duration-150 flex items-center"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}