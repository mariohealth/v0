'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { MOCK_PROCEDURES, type Procedure } from '@/src/lib/mock-data';
import { EmptyState } from '@/src/components/ui/error-message';

interface SearchResultsProps {
    searchQuery: string;
    debounceMs?: number;
}

export function SearchResults({ searchQuery, debounceMs = 300 }: SearchResultsProps) {
    const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
    const [isDebouncing, setIsDebouncing] = useState(false);

    // Debounce the search query
    useEffect(() => {
        setIsDebouncing(true);
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
            setIsDebouncing(false);
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [searchQuery, debounceMs]);

    // Filter procedures based on debounced query
    const filteredProcedures = useMemo(() => {
        if (!debouncedQuery.trim()) {
            return [];
        }

        const query = debouncedQuery.toLowerCase().trim();
        return MOCK_PROCEDURES.filter(procedure =>
            procedure.name.toLowerCase().includes(query) ||
            procedure.description.toLowerCase().includes(query) ||
            procedure.category.toLowerCase().includes(query)
        );
    }, [debouncedQuery]);

    // Don't show anything if there's no search query
    if (!searchQuery.trim()) {
        return null;
    }

    return (
        <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-300">
            {isDebouncing ? (
                <div className="text-center py-8">
                    <div className="inline-flex items-center gap-2 text-muted-foreground">
                        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Searching...
                    </div>
                </div>
            ) : filteredProcedures.length === 0 ? (
                <EmptyState
                    title="No results found"
                    message={`No procedures match "${debouncedQuery}". Try different keywords.`}
                />
            ) : (
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Found {filteredProcedures.length} {filteredProcedures.length === 1 ? 'procedure' : 'procedures'}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredProcedures.map((procedure) => (
                            <ProcedureCard key={procedure.id} procedure={procedure} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function ProcedureCard({ procedure }: { procedure: Procedure }) {
    return (
        <Link
            href={`/procedure/${procedure.id}`}
            className="block bg-card border rounded-lg p-4 hover:shadow-lg transition-all hover:-translate-y-1 animate-in fade-in"
        >
            <div className="space-y-3">
                <div>
                    <h3 className="text-lg font-semibold text-foreground">{procedure.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {procedure.description}
                    </p>
                </div>

                <div className="pt-3 border-t">
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-primary">
                            RM {procedure.averagePrice}
                        </span>
                        <span className="text-xs text-muted-foreground">avg</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Range: RM {procedure.priceRange.min} - RM {procedure.priceRange.max}
                    </p>
                </div>

                <div className="text-xs text-primary font-medium">
                    View providers →
                </div>
            </div>
        </Link>
    );
}

