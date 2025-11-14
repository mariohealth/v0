'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Search } from 'lucide-react';
import { BottomNav } from '@/components/navigation/BottomNav';
import { searchProcedures, type SearchResult } from '@/lib/api';
import { ProcedureCard } from '@/components/ProcedureCard';
import { procedureCategories } from '@/lib/data/mario-procedures-data';

function ProceduresContent() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [procedures, setProcedures] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [useMockData, setUseMockData] = useState(false);

    // Get search query from URL params - but only for browsing, not for search
    // Search should use autocomplete and navigate directly to procedure detail pages
    useEffect(() => {
        const query = searchParams.get('q');
        if (query) {
            // Only set query if explicitly browsing (not from search flow)
            // For now, we'll still allow it but it's primarily for browsing
            setSearchQuery(query);
        }
    }, [searchParams]);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    // Fetch procedures from API when search query changes
    useEffect(() => {
        const fetchProcedures = async () => {
            if (!user || loading) return;

            setIsLoading(true);
            setUseMockData(false);

            try {
                if (searchQuery.trim()) {
                    // Search via API
                    const response = await searchProcedures(searchQuery.trim());
                    if (response.results && response.results.length > 0) {
                        setProcedures(response.results);
                    } else {
                        // No results from API, use mock data as fallback
                        setUseMockData(true);
                    }
                } else {
                    // No search query - show "browse all" (use mock data for now)
                    setUseMockData(true);
                }
            } catch (error) {
                console.error('Error fetching procedures:', error);
                // Fallback to mock data if API fails
                setUseMockData(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProcedures();
    }, [searchQuery, user, loading]);

    if (loading) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center">
                <p className="text-gray-600">Loading...</p>
            </main>
        );
    }

    if (!user) {
        return null;
    }

    // Use API results directly, or mock data as fallback
    let displayProcedures: SearchResult[] = [];
    if (useMockData || procedures.length === 0) {
        const allProcedures = procedureCategories.flatMap(category => 
            category.procedures.map(proc => ({
                procedure_id: proc.id,
                procedure_name: proc.name,
                procedure_slug: proc.id,
                family_name: category.name,
                family_slug: category.name.toLowerCase().replace(/\s+/g, '-'),
                category_name: category.name,
                category_slug: category.name.toLowerCase().replace(/\s+/g, '-'),
                best_price: proc.marioPrice?.toString() || '0',
                avg_price: proc.avgPrice?.toString() || '0',
                price_range: `$${proc.marioPrice || '0'} - $${proc.avgPrice || '0'}`,
                provider_count: Math.floor(Math.random() * 50) + 10,
                match_score: 1.0,
            } as SearchResult))
        );
        displayProcedures = allProcedures.filter((proc) =>
            !searchQuery || proc.procedure_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            proc.category_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    } else {
        // Use API results directly
        displayProcedures = procedures;
    }

    return (
        <main className="min-h-screen bg-gray-50 pb-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Procedures</h1>
                    <p className="text-gray-600">Find and compare medical procedures</p>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search procedures..."
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-[#2E5077] focus:outline-none focus:ring-2 focus:ring-[#2E5077]"
                        />
                    </div>
                </div>

                {/* Procedures Grid */}
                {isLoading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600">Loading procedures...</p>
                    </div>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayProcedures.map((procedure) => (
                        <ProcedureCard key={procedure.procedure_id} procedure={procedure} />
                    ))}
                </div>
                )}

                {!isLoading && displayProcedures.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-600">No procedures found. Try a different search term.</p>
                    </div>
                )}
            </div>
            <BottomNav />
        </main>
    );
}

export default function ProceduresPage() {
    return (
        <Suspense fallback={
            <main className="flex min-h-screen flex-col items-center justify-center">
                <p className="text-gray-600">Loading...</p>
            </main>
        }>
            <ProceduresContent />
        </Suspense>
    );
}

