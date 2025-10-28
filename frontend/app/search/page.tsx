'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import SearchHeader from '@/components/search/SearchHeader';
import SearchFilters, { FilterState } from '@/components/search/SearchFilters';
import { searchProcedures, type SearchResult } from '@/lib/backend-api';
import { usePreferences } from '@/lib/contexts/PreferencesContext';
import { SlidersHorizontal, DollarSign, MapPin, Users } from 'lucide-react';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const locationParam = searchParams.get('location') || '';
  const radiusParam = searchParams.get('radius');

  const { defaultRadius, defaultZip } = usePreferences();

  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 2000],
    types: [],
    minRating: 0,
  });
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'distance'>('price');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch search results from API
  // API: GET /api/v1/search?q={query}&zip={zip}&radius={radius}
  useEffect(() => {
    const fetchResults = async () => {
      if (!query || query.length < 2) {
        setSearchResults([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Use location from params or preference, radius from params or preference
        const zip = locationParam || defaultZip || undefined;
        const radius = radiusParam ? parseInt(radiusParam) : (defaultRadius || 25);

        const results = await searchProcedures(query, zip, radius);
        setSearchResults(results);
      } catch (err) {
        console.error('Failed to search procedures:', err);
        setError(err instanceof Error ? err.message : 'Failed to search procedures');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, locationParam, radiusParam, defaultRadius, defaultZip]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  // Filter and sort search results based on UI filters
  const filteredResults = searchResults.filter(result => {
    const avgPrice = result.avgPrice;
    if (avgPrice < filters.priceRange[0] || avgPrice > filters.priceRange[1]) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.avgPrice - b.avgPrice;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <SearchHeader
        initialQuery={query}
        initialLocation=""
        resultCount={filteredResults.length}
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
                      Show {filteredResults.length} Results
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1">
            {loading && (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Searching procedures...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-red-900 mb-2">Search Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {!loading && !error && (
              <>
                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <p className="text-sm text-gray-600">
                      Showing <span className="font-semibold">{filteredResults.length}</span> results
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
                      </select>
                    </div>
                  </div>
                </div>

                {filteredResults.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredResults.map((result) => (
                      <ProcedureCard key={result.procedureId} result={result} />
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
                        Try adjusting your filters or search terms to find more procedures.
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Procedure Card Component for Search Results
function ProcedureCard({ result }: { result: SearchResult }) {
  return (
    <Link
      href={`/procedure/${result.procedureSlug}`}
      className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all hover:-translate-y-1"
    >
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-xl font-semibold mb-2">{result.procedureName}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>{result.familyName}</span>
            <span>•</span>
            <span>{result.categoryName}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <div>
              <div className="text-lg font-bold text-gray-900">
                ${result.avgPrice}
              </div>
              <div className="text-xs text-gray-500">Average</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            <div>
              <div className="text-lg font-bold text-gray-900">
                {result.providerCount}
              </div>
              <div className="text-xs text-gray-500">Providers</div>
            </div>
          </div>
        </div>

        {/* Price Range */}
        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Price Range:</span>
            <span className="font-semibold text-gray-900">{result.priceRange}</span>
          </div>
        </div>

        {/* Location (if available) */}
        {result.nearestProvider && (
          <div className="pt-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{result.nearestProvider}</span>
              {result.nearestDistanceMiles && (
                <span className="ml-auto">{result.nearestDistanceMiles.toFixed(1)} mi away</span>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-gray-200">
          <div className="text-emerald-600 font-medium text-sm hover:text-emerald-700">
            View details →
          </div>
        </div>
      </div>
    </Link>
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
