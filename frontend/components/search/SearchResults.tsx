"use client";

import { useState, useEffect } from "react";
import { Provider } from "@/types/api";
import ProviderCard from "@/components/providers/ProviderCard";
import { SkeletonProviderCard } from "@/components/ui/SkeletonCard";
import { EmptyState } from "@/components/search/EmptyState";
import { LazyLoad } from "@/components/LazyLoad";

interface SearchResultsProps {
    providers: Provider[];
    isLoading: boolean;
    onBookProvider: (providerId: string) => void;
    onClearFilters?: () => void;
}

export default function SearchResults({ providers, isLoading, onBookProvider, onClearFilters }: SearchResultsProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                    <SkeletonProviderCard key={index} />
                ))}
            </div>
        );
    }

    if (providers.length === 0) {
        return (
            <EmptyState
                message="No providers found"
                description="Try adjusting your search terms or filters to find more providers."
                showClearFilters={!!onClearFilters}
                onClearFilters={onClearFilters}
            />
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {providers.map((provider, index) => (
                <LazyLoad
                    key={provider.id}
                    fallback={<SkeletonProviderCard />}
                    threshold={0.1}
                    rootMargin="100px"
                >
                    <ProviderCard
                        provider={provider}
                        onBook={onBookProvider}
                    />
                </LazyLoad>
            ))}
        </div>
    );
}
