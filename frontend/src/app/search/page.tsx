'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { searchProcedures, type UnifiedResult, type SearchResult, type DoctorResult } from '@/lib/api';
import { saveSearchQuery, getLastSearchQuery, clearSearchHistory } from '@/lib/search-state';
import { BottomNav } from '@/components/navigation/BottomNav';
import { GlobalNav } from '@/components/navigation/GlobalNav';

import { Card } from '@/components/ui/card';
import { ProcedureCard } from '@/components/ProcedureCard';
import { ProviderCard } from '@/components/mario-card';
import { OrganizationCard } from '@/components/OrganizationCard';

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

            // If we have exactly one procedure result and it's a close match, redirect directly
            const procedures = response.results.filter(r => r.type === 'procedure') as SearchResult[];
            if (procedures.length === 1 && procedures[0].procedure_slug) {
                router.push(`/procedures/${procedures[0].procedure_slug}`);
                return;
            }

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
        // Legacy page: do not navigate; show inline guidance instead.
        setError(`We didn’t find any results for “${query.trim()}”. Please choose a suggestion.`);
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

    const getGroupedResults = () => {
        const doctors = searchResults.filter(r => r.type === 'doctor') as DoctorResult[];
        const procedures = searchResults.filter(r => r.type === 'procedure') as SearchResult[];

        const groupedByOrg = doctors.reduce((acc, doc) => {
            const orgName = doc.hospital_name || doc.provider_name;
            if (!acc[orgName]) {
                acc[orgName] = {
                    org_name: orgName,
                    providers: [],
                    price_range: { min: Infinity, max: -Infinity },
                    distance: doc.distance_miles ? `${doc.distance_miles} mi` : undefined,
                    hospital_name: doc.hospital_name
                };
            }
            acc[orgName].providers.push(doc);

            const price = parseFloat(String(doc.price || '0').replace(/[^0-9.]/g, ''));
            if (!isNaN(price) && price > 0) {
                acc[orgName].price_range.min = Math.min(acc[orgName].price_range.min, price);
                acc[orgName].price_range.max = Math.max(acc[orgName].price_range.max, price);
            }

            return acc;
        }, {} as Record<string, any>);

        return {
            orgs: Object.values(groupedByOrg),
            procedures
        };
    };

    const { orgs, procedures } = getGroupedResults();

    return (
        <main className="min-h-screen bg-gray-50 pb-24 md:pb-8">
            <GlobalNav />
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
                {query && (
                    <div className="mb-8">
                        <h1 className="text-2xl font-black text-[#2E5077] tracking-tight">
                            {query.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </h1>
                        <p className="text-sm font-medium text-gray-400">
                            {searchResults.length > 0 ? `${searchResults.length} providers available` : 'Searching for best prices...'}
                        </p>
                    </div>
                )}

                {!query && (
                    <div className="mb-8 text-center pt-10">
                        <h1 className="text-3xl font-black text-[#2E5077] mb-2 tracking-tight">Know what care costs.</h1>
                        <p className="text-xl text-[#4DA1A9] font-medium">Choose smart. Save with Mario.</p>
                    </div>
                )}

                <form onSubmit={handleSearch} className="mb-10">
                    <div className="relative group">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search services, doctors, or meds..."
                            className="w-full h-14 pl-12 pr-4 rounded-xl border-2 border-[#2E5077]/10 focus:border-[#2E5077] focus:outline-none focus:ring-4 focus:ring-[#2E5077]/5 transition-all bg-white text-lg font-medium shadow-sm"
                            disabled={isSearching}
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                            <svg className="h-5 w-5 text-[#2E5077]/40 group-focus-within:text-[#2E5077]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </form>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-800 border border-red-100">
                        {error}
                    </div>
                )}

                <div className="space-y-6">
                    {procedures.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Suggested Procedures</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {procedures.map((proc, idx) => (
                                    <ProcedureCard key={proc.procedure_id || idx} procedure={proc} />
                                ))}
                            </div>
                        </div>
                    )}

                    {orgs.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Facilities & Groups</h2>
                            <div className="grid grid-cols-1 gap-6">
                                {orgs.map((org, idx) => (
                                    <OrganizationCard
                                        key={idx}
                                        orgName={org.org_name}
                                        procedureName={query || "Procedure"}
                                        priceRange={org.price_range}
                                        providerCount={org.providers.length}
                                        distance={org.distance}
                                        providers={org.providers}
                                        mariosPick={idx === 0} // For demo purposes, make first result Mario's Pick
                                        onBookProvider={(p: any) => router.push(`/providers/${p.provider_id}`)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {!isSearching && searchResults.length === 0 && query && !error && (
                    <div className="rounded-md bg-gray-50 p-8 text-center">
                        <p className="text-gray-600">No results found. Try a different search term.</p>
                    </div>
                )}
            </div>
            <BottomNav />
        </main >
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
