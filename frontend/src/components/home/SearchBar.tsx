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
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Location input */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="City or ZIP code"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Search button */}
          <button
            onClick={handleSearch}
            disabled={!procedure.trim()}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
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