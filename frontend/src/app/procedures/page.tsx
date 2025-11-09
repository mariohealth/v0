'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Search, Activity } from 'lucide-react';
import { BottomNav } from '@/components/navigation/BottomNav';
import { searchProcedures, type SearchResult } from '@/lib/api';
import { procedureCategories } from '@/lib/data/mario-procedures-data';

function ProceduresContent() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [procedures, setProcedures] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [useMockData, setUseMockData] = useState(false);

    // Get search query from URL params
    useEffect(() => {
        const query = searchParams.get('q');
        if (query) {
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

    // Use mock data as fallback
    let displayProcedures: any[] = [];
    if (useMockData || procedures.length === 0) {
        const allProcedures = procedureCategories.flatMap(category => 
            category.procedures.map(proc => ({
                ...proc,
                category: category.name,
                slug: proc.id,
                priceRange: `$${proc.marioPrice} - $${proc.avgPrice}`,
                providerCount: Math.floor(Math.random() * 50) + 10,
                description: proc.description || `${proc.name} procedure`,
                procedure_name: proc.name,
                procedure_slug: proc.id
            }))
        );
        displayProcedures = allProcedures.filter((proc) =>
            !searchQuery || proc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            proc.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
    } else {
        // Use API results
        displayProcedures = procedures.map(proc => ({
            id: proc.procedure_id || proc.procedure_slug,
            name: proc.procedure_name,
            category: proc.category_name || 'Procedure',
            slug: proc.procedure_slug,
            priceRange: `$${proc.best_price || 'N/A'} - $${proc.avg_price || 'N/A'}`,
            providerCount: proc.provider_count || 0,
            description: proc.procedure_name,
            procedure_name: proc.procedure_name,
            procedure_slug: proc.procedure_slug
        }));
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
                        <div
                            key={procedure.id}
                            onClick={() => router.push(`/procedures/${procedure.slug}`)}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <Activity className="h-8 w-8 text-[#4DA1A9] flex-shrink-0" />
                                <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#E9F6F5] text-[#2E5077]">
                                    {procedure.category}
                                </span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{procedure.name}</h3>
                            <p className="text-sm text-gray-600 mb-4">{procedure.description}</p>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-500">Price Range</p>
                                    <p className="text-lg font-bold text-[#2E5077]">{procedure.priceRange}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500">Providers</p>
                                    <p className="text-sm font-medium text-gray-900">{procedure.providerCount}+</p>
                                </div>
                            </div>
                        </div>
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

