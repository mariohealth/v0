'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { searchProcedures, type UnifiedResult, type SearchResult, type DoctorResult } from '@/lib/api';
import { saveSearchQuery, getLastSearchQuery, clearSearchHistory } from '@/lib/search-state';
import { BottomNav } from '@/components/navigation/BottomNav';
import { Card } from '@/components/ui/card';
import { ProcedureCard } from '@/components/ProcedureCard';
import { ProviderCard } from '@/components/mario-card';

function SearchPageContent() {
    const { user, loading } = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState<UnifiedResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Restore last search query on mount
    useEffect(() => {
        if (user && !loading) {
            const urlQuery = searchParams.get('q');
            const lastQuery = getLastSearchQuery();
            const initialQuery = urlQuery || lastQuery || '';
            if (initialQuery) {
                setQuery(initialQuery);
                // Auto-search if query from URL
                if (urlQuery) {
                    handleSearchInternal(initialQuery);
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, loading, searchParams]);

    const handleSearchInternal = async (searchQuery: string) => {
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        setError(null);

        try {
            // Save to localStorage
            saveSearchQuery(searchQuery.trim());

            const response = await searchProcedures(searchQuery.trim());
            setSearchResults(response.results);
        } catch (err) {
            console.error('Search error:', err);
            setError('Failed to search procedures. Please try again.');
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    };

    const handleClearHistory = () => {
        clearSearchHistory();
        setQuery('');
        setSearchResults([]);
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
        <main className="min-h-screen bg-gray-50 py-8 pb-24 md:pb-8">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-3xl font-bold text-gray-900">Search Procedures</h1>
                        <button
                            onClick={handleClearHistory}
                            className="text-sm text-gray-600 hover:text-gray-900 underline"
                        >
                            Clear History
                        </button>
                    </div>
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
                            placeholder="Search for doctors, specialties, or procedures"
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {searchResults.map((result, idx) => {
                                if (result.type === 'doctor') {
                                    const doctor = result as DoctorResult;
                                    return (
                                        <div key={doctor.id} onClick={() => router.push(`/providers/${doctor.id}`)}>
                                            <ProviderCard
                                                name={doctor.name}
                                                specialty={doctor.specialty}
                                                distance={doctor.distance}
                                                inNetwork={true}
                                                price={doctor.price}
                                                comparedToMedian="15% below average"
                                                onBook={() => { }}
                                            />
                                        </div>
                                    );
                                } else {
                                    const procedure = result as SearchResult;
                                    return (
                                        <ProcedureCard
                                            key={procedure.procedure_id || idx}
                                            procedure={procedure}
                                        />
                                    );
                                }
                            })}
                        </div>
                    </div>
                )}

                {!isSearching && searchResults.length === 0 && query && !error && (
                    <div className="rounded-md bg-gray-50 p-8 text-center">
                        <p className="text-gray-600">No results found. Try a different search term.</p>
                    </div>
                )}
            </div>
            <BottomNav />
        </main>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <main className="flex min-h-screen flex-col items-center justify-center">
                <p className="text-gray-600">Loading...</p>
            </main>
        }>
            <SearchPageContent />
        </Suspense>
    );
}
