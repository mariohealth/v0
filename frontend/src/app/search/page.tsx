"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import SearchHeader from "@/src/components/search/SearchHeader";
import SearchFilters, { FilterState } from "@/src/components/search/SearchFilters";
import SearchResults from "@/src/components/search/SearchResults";
import { ErrorDisplay, EmptyState, LoadingState, NetworkStatus } from "@/src/components/search/ErrorStates";
import { SkeletonSearchPage } from "@/src/components/ui/SkeletonComponents";
import { SearchErrorBoundary } from "@/src/components/search/SearchErrorBoundary";
import { ToastProvider, useErrorToast } from "@/src/components/ui/Toast";
import { useSearch } from "@/src/lib/useSearch";
import { useNetworkStatus } from "@/src/lib/useNetworkStatus";
import { SearchParams } from "@/src/lib/api";
import { SlidersHorizontal } from "lucide-react";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const location = searchParams.get("location") || "New York, NY";
  const errorToast = useErrorToast();

  const { searchState, search, retry, clearError, cancelSearch } = useSearch({
    debounceMs: 300,
    enableRetry: true,
    maxRetries: 3
  });

  const networkStatus = useNetworkStatus();

  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 2000],
    types: [],
    minRating: 0,
  });
  const [sortBy, setSortBy] = useState<"price" | "rating" | "distance">("price");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Perform search when query or filters change
  useEffect(() => {
    if (query.trim()) {
      const searchParams: SearchParams = {
        procedure: query,
        location: location,
        priceRange: filters.priceRange,
        minRating: filters.minRating,
        types: filters.types
      };

      search(searchParams);
    }
  }, [query, location, filters, search]);

  // Show toast notifications for transient errors
  useEffect(() => {
    if (searchState.error) {
      const error = searchState.error;

      // Show toast for retryable errors that aren't empty results
      if (error.retryable && error.type !== 'EMPTY_RESULTS') {
        errorToast(
          'Search Error',
          error.message,
          {
            label: 'Retry',
            onClick: () => retry()
          }
        );
      }
    }
  }, [searchState.error, errorToast, retry]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelSearch();
    };
  }, [cancelSearch]);

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

  const handleRetry = async () => {
    await retry();
  };

  const handleRefresh = async () => {
    if (query.trim()) {
      const searchParams: SearchParams = {
        procedure: query,
        location: location,
        priceRange: filters.priceRange,
        minRating: filters.minRating,
        types: filters.types
      };
      await search(searchParams);
    }
  };

  const handleDismissError = () => {
    clearError();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Network Status */}
      <NetworkStatus isOnline={networkStatus.isOnline} />

      {/* Header */}
      <SearchHeader
        initialQuery={query}
        initialLocation={location}
        resultCount={searchState.data?.providers.length || 0}
      />

      {/* Error Display */}
      {searchState.error && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <ErrorDisplay
            error={searchState.error}
            onRetry={handleRetry}
            onDismiss={handleDismissError}
          />
        </div>
      )}

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
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-3 min-h-[44px] font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 active:scale-[0.98] transition-all duration-150"
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
                      className="text-gray-500 hover:text-gray-700 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-gray-100 active:bg-gray-200 active:scale-[0.95] transition-all duration-150"
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
                      className="w-full bg-emerald-500 text-white py-3 min-h-[44px] rounded-lg font-semibold hover:bg-emerald-600 active:bg-emerald-700 active:scale-[0.98] transition-all duration-200"
                    >
                      Show {searchState.data?.providers?.length || 0} Results
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Loading State */}
            {searchState.isLoading && !searchState.data && (
              <LoadingState
                message={networkStatus.effectiveType === 'slow-2g' || networkStatus.effectiveType === '2g'
                  ? "Searching on slow connection..."
                  : "Searching for providers..."}
                showProgress={true}
              />
            )}

            {/* Empty State */}
            {!searchState.isLoading && searchState.data?.providers.length === 0 && !searchState.error && (
              <EmptyState
                title="No providers found"
                description="Try adjusting your search terms or filters to find more providers."
                showClearFilters={true}
                onClearFilters={handleClearFilters}
              />
            )}

            {/* Results */}
            {!searchState.isLoading && (searchState.data?.providers?.length || 0) > 0 && (
              <>
                {/* Sort options */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <p className="text-sm text-gray-600">
                      Showing <span className="font-semibold">{searchState.data?.providers?.length || 0}</span> results
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
                <SearchErrorBoundary onRetry={handleRetry}>
                  <SearchResults
                    providers={searchState.data?.providers || []}
                    isLoading={false}
                    onBookProvider={handleBookProvider}
                    onClearFilters={handleClearFilters}
                  />
                </SearchErrorBoundary>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <ToastProvider>
      <Suspense fallback={<SkeletonSearchPage />}>
        <SearchPageContent />
      </Suspense>
    </ToastProvider>
  );
}