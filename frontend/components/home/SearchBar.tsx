"use client";

import { Search, MapPin } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const [procedure, setProcedure] = useState("");
  const [location, setLocation] = useState("New York, NY");

  const handleSearch = () => {
    if (procedure.trim()) {
      router.push(
        `/search?q=${encodeURIComponent(procedure)}&location=${encodeURIComponent(location)}`
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Procedure input */}
          <div className="flex-1 relative">
            <label htmlFor="procedure" className="block text-sm font-medium text-gray-700 mb-2">
              What do you need?
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="procedure"
                type="text"
                placeholder="Search procedures or tests (e.g., MRI, Blood Test)"
                value={procedure}
                onChange={(e) => setProcedure(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Location input */}
          <div className="md:w-64 relative">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Where?
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="location"
                type="text"
                placeholder="City or ZIP code"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Search button */}
          <div className="md:self-end">
            <button
              onClick={handleSearch}
              disabled={!procedure.trim()}
              className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              <span>Search</span>
            </button>
          </div>
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
                className="px-3 py-1.5 bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 text-gray-700 text-sm rounded-full transition-colors"
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