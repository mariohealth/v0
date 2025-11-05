'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { searchProcedures, type SearchResult } from '@/lib/backend-api';
import { EmptyState } from '@/components/ui/error-message';

interface SearchResultsProps {
    searchQuery: string;
    debounceMs?: number;
}

export function SearchResults({ searchQuery, debounceMs = 300 }: SearchResultsProps) {
    const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
    const [isDebouncing, setIsDebouncing] = useState(false);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Debounce the search query
    useEffect(() => {
        setIsDebouncing(true);
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
            setIsDebouncing(false);
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [searchQuery, debounceMs]);

    // Fetch results from API when debounced query changes
    useEffect(() => {
        const fetchResults = async () => {
            if (!debouncedQuery.trim() || debouncedQuery.length < 2) {
                setResults([]);
                setError(null);
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);
                const data = await searchProcedures(debouncedQuery.trim());
                setResults(data);
            } catch (err) {
                console.error('Failed to search procedures:', err);
                setError(err instanceof Error ? err.message : 'Failed to search procedures');
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [debouncedQuery]);

    // Don't show anything if there's no search query
    if (!searchQuery.trim()) {
        return null;
    }

    return (
        <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-300">
            {isDebouncing || isLoading ? (
                <div className="text-center py-8">
                    <div className="inline-flex items-center gap-2 text-muted-foreground">
                        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Searching...
                    </div>
                </div>
            ) : error ? (
                <EmptyState
                    title="Search Error"
                    message={error}
                />
            ) : results.length === 0 ? (
                <EmptyState
                    title="No results found"
                    message={`No procedures match "${debouncedQuery}". Try different keywords.`}
                />
            ) : (
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Found {results.length} {results.length === 1 ? 'procedure' : 'procedures'}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {results.map((result) => (
                            <ProcedureCard key={result.procedureId} result={result} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function ProcedureCard({ result }: { result: SearchResult }) {
    return (
        <Link
            href={`/procedure/${result.procedureSlug}`}
            className="block bg-card border rounded-lg p-4 hover:shadow-lg transition-all hover:-translate-y-1 animate-in fade-in"
        >
            <div className="space-y-3">
                <div>
                    <h3 className="text-lg font-semibold text-foreground">{result.procedureName}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {result.familyName} • {result.categoryName}
                    </p>
                </div>

                <div className="pt-3 border-t">
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-primary">
                            ${result.avgPrice.toFixed(2)}
                        </span>
                        <span className="text-xs text-muted-foreground">avg</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        {result.priceRange}
                    </p>
                    {result.providerCount > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                            {result.providerCount} {result.providerCount === 1 ? 'provider' : 'providers'} available
                        </p>
                    )}
                </div>

                <div className="text-xs text-primary font-medium">
                    View providers →
                </div>
            </div>
        </Link>
    );
}

