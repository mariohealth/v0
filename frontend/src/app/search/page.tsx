'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import Link from 'next/link';
import { searchProcedures, type SearchResult } from '@/lib/api';

export default function SearchPage() {
  const { user, loading } = useAuth();
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setError(null);

    try {
      const response = await searchProcedures(query.trim());
      setSearchResults(response.results);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search procedures. Please try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="w-full max-w-md space-y-4 text-center">
          <h1 className="text-3xl font-bold">Search</h1>
          <p className="text-gray-600">Please log in to use search.</p>
          <Link
            href="/login"
            className="inline-block rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Search Procedures</h1>
          <p className="mt-2 text-gray-600">
            Search for healthcare procedures and compare prices
          </p>
        </div>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for procedures (e.g., MRI, X-ray, blood test)"
              className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSearching}
            />
            <button
              type="submit"
              disabled={isSearching || !query.trim()}
              className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-red-800">
            {error}
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Results ({searchResults.length})
            </h2>
            <div className="space-y-3">
              {searchResults.map((result) => (
                <Link
                  key={result.procedure_id}
                  href={`/procedures/${result.procedure_slug}`}
                  className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {result.procedure_name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {result.category_name} • {result.family_name}
                      </p>
                      <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                        <span>{result.provider_count} providers</span>
                        {result.nearest_provider && (
                          <span>Nearest: {result.nearest_provider}</span>
                        )}
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <div className="text-lg font-bold text-green-600">
                        ${result.best_price}
                      </div>
                      <div className="text-sm text-gray-500">
                        Avg: ${parseFloat(result.avg_price).toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-400">
                        {result.price_range}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {!isSearching && searchResults.length === 0 && query && !error && (
          <div className="rounded-md bg-gray-50 p-8 text-center">
            <p className="text-gray-600">No results found. Try a different search term.</p>
          </div>
        )}
      </div>
    </main>
  );
}

