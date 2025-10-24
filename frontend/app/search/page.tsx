'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import SearchHeader from '@/src/components/search/SearchHeader';
import SearchFilters, { FilterState } from '@/src/components/search/SearchFilters';
import ProviderCard from '@/src/components/providers/ProviderCard';
import { mockProviders, filterProviders, Provider } from '@/src/lib/mockData';
import { SlidersHorizontal } from 'lucide-react';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const location = searchParams.get('location') || 'New York, NY';

  const [filteredProviders, setFilteredProviders] = useState<Provider[]>(mockProviders);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 2000],
    types: [],
    minRating: 0,
  });
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'distance'>('price');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Apply filters and sorting
  useEffect(() => {
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
        case 'price':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        case 'distance':
          return parseFloat(a.distance) - parseFloat(b.distance);
        default:
          return 0;
      }
    });

    setFilteredProviders(results);
  }, [query, filters, sortBy]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleBookProvider = (providerId: string) => {
    console.log('Booking provider:', providerId);
    alert(`Booking functionality coming soon! Provider ID: ${providerId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SearchHeader
        initialQuery={query}
        initialLocation={location}
        resultCount={filteredProviders.length}
      />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="hidden lg:block lg:w-80 flex-shrink-0">
            <div className="sticky top-24">
              <SearchFilters onFilterChange={handleFilterChange} />
            </div>
          </aside>

          <div className="lg:hidden">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-3 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>

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

          <div className="flex-1">
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{filteredProviders.length}</span> results
                  {query && (
                    <>
                      {' '}
                      for <span className="font-semibold">"{query}"</span>
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

            {filteredProviders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProviders.map((provider) => (
                  <ProviderCard key={provider.id} provider={provider} onBook={handleBookProvider} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SlidersHorizontal className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your filters or search terms to find more providers.
                  </p>
                  <button
                    onClick={() => {
                      setFilters({
                        priceRange: [0, 2000],
                        types: [],
                        minRating: 0,
                      });
                    }}
                    className="text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            <p className="mt-4 text-gray-600">Loading search results...</p>
          </div>
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
