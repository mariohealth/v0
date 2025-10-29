'use client';

/**
 * My Saved Searches Page
 * 
 * Displays all user's saved searches with:
 * - List of saved searches
 * - Option to re-run searches
 * - Delete saved searches
 * - Sort by date/query
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bookmark, Trash2, Search, Calendar, MapPin, Clock } from 'lucide-react';
import { getSavedSearches, deleteSavedSearch, type SavedSearch } from '@/lib/saved-searches';

export default function SavedSearchesPage() {
    const router = useRouter();
    const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadSearches();
    }, []);

    const loadSearches = async () => {
        try {
            setLoading(true);
            setError(null);
            const searches = await getSavedSearches();
            setSavedSearches(searches);
        } catch (err) {
            console.error('Failed to load saved searches:', err);
            setError(err instanceof Error ? err.message : 'Failed to load saved searches');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this saved search?')) {
            return;
        }

        try {
            await deleteSavedSearch(id);
            setSavedSearches(prev => prev.filter(s => s.id !== id));
        } catch (err) {
            console.error('Failed to delete saved search:', err);
            alert('Failed to delete saved search. Please try again.');
        }
    };

    const handleRerun = (search: SavedSearch) => {
        const params = new URLSearchParams({
            q: search.query,
        });

        if (search.location) {
            params.append('location', search.location);
        }

        router.push(`/search?${params.toString()}`);
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return 'Today';
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else {
            return date.toLocaleDateString();
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
                    <p className="text-gray-600">Loading saved searches...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Bookmark className="w-8 h-8 text-emerald-600" />
                        <h1 className="text-3xl font-bold text-gray-900">My Saved Searches</h1>
                    </div>
                    <p className="text-gray-600">
                        Manage and quickly re-run your saved searches
                    </p>
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {/* Saved Searches List */}
                {savedSearches.length === 0 ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                        <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved searches</h3>
                        <p className="text-gray-600 mb-4">
                            Save searches from the search results page to access them here.
                        </p>
                        <Link
                            href="/search"
                            className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                        >
                            Start Searching
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {savedSearches.map((search) => (
                            <div
                                key={search.id}
                                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                    {search.query}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                                    {search.location && (
                                                        <div className="flex items-center gap-1">
                                                            <MapPin className="w-4 h-4" />
                                                            <span>{search.location}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        <span>{formatDate(search.timestamp)}</span>
                                                    </div>
                                                    {search.filters && (
                                                        <div className="text-xs">
                                                            {search.filters.priceRange && (
                                                                <span>Price: ${search.filters.priceRange[0]}-${search.filters.priceRange[1]}</span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => handleRerun(search)}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors text-sm"
                                            >
                                                <Search className="w-4 h-4" />
                                                Re-run Search
                                            </button>
                                            <button
                                                onClick={() => handleDelete(search.id)}
                                                className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Back Link */}
                <div className="mt-8">
                    <Link
                        href="/search"
                        className="text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-2"
                    >
                        ← Back to Search
                    </Link>
                </div>
            </div>
        </div>
    );
}

