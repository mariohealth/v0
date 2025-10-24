"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import SearchHeader from "@/src/components/search/SearchHeader";
import SearchFilters, { FilterState } from "@/src/components/search/SearchFilters";
import SearchResults from "@/src/components/search/SearchResults";
import { mockProviders, filterProviders, Provider } from "@/src/lib/mockData";
import { SlidersHorizontal } from "lucide-react";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const location = searchParams.get("location") || "New York, NY";

  const [filteredProviders, setFilteredProviders] = useState<Provider[]>(mockProviders);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 2000],
    types: [],
    minRating: 0,
  });
  const [sortBy, setSortBy] = useState<"price" | "rating" | "distance">("price");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Apply filters and sorting
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API delay
    const timer = setTimeout(() => {
      let results = filterProviders(
        mockProviders,
        query,
        filters.priceRange,
        filters.types,
        filters.minRating
      );

      // Apply sorting
      results = [...results].sort((a, b) => {
        switch (sortBy) {
          case "price":
            return a.price - b.price;
          case "rating":
            return b.rating - a.rating;
          case "distance":
            return parseFloat(a.distance) - parseFloat(b.distance);
          default:
            return 0;
        }
      });

      setFilteredProviders(results);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [query, filters, sortBy]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      priceRange: [0, 2000],
      types: [],
      minRating: 0,
    });
  };

  const handleBookProvider = (providerId: string) => {
    // TODO: Implement booking flow in future sprint
    console.log("Booking provider:", providerId);
    alert(`Booking functionality coming soon! Provider ID: ${providerId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <SearchHeader
        initialQuery={query}
        initialLocation={location}
        resultCount={filteredProviders.length}
      />

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters sidebar - Desktop */}
          <aside className="hidden lg:block lg:w-80 flex-shrink-0">
            <div className="sticky top-24">
              <SearchFilters onFilterChange={handleFilterChange} />
            </div>
          </aside>

          {/* Mobile filters button */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-3 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>

            {/* Mobile filters overlay */}
            {showMobileFilters && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
                <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto">
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                    <h3 className="font-semibold text-lg">Filters</h3>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="p-4">
                    <SearchFilters onFilterChange={handleFilterChange} />
                  </div>
                  <div className="p-4 border-t border-gray-200 sticky bottom-0 bg-white">
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="w-full bg-emerald-500 text-white py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
                    >
                      Show {filteredProviders.length} Results
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Sort options */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{filteredProviders.length}</span> results
                  {query && (
                    <>
                      {" "}for <span className="font-semibold">"{query}"</span>
                    </>
                  )}
                </p>

                <div className="flex items-center gap-2">
                  <label htmlFor="sort" className="text-sm text-gray-600 whitespace-nowrap">
                    Sort by:
                  </label>
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="price">Lowest Price</option>
                    <option value="rating">Highest Rated</option>
                    <option value="distance">Nearest</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Provider cards */}
            <SearchResults 
              providers={filteredProviders}
              isLoading={isLoading}
              onBookProvider={handleBookProvider}
              onClearFilters={handleClearFilters}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          <p className="mt-4 text-gray-600">Loading search results...</p>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}