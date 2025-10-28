'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Filter, SortAsc } from 'lucide-react';
import { getFamiliesByCategory, getCategories, type Family, type Category } from '@/lib/backend-api';
import { LoadingSpinner, SkeletonGrid } from '@/components/ui/loading-spinner';
import { ErrorMessage, EmptyState } from '@/components/ui/error-message';

export default function CategoryPage() {
    const params = useParams();
    const categorySlug = params.slug as string;

    const [category, setCategory] = useState<Category | null>(null);
    const [families, setFamilies] = useState<Family[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<'name'>('name');

    useEffect(() => {
        // Fetch families from real backend API
        // API: GET /api/v1/categories/{slug}/families
        // Also fetch all categories to get full category details
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [familiesData, allCategories] = await Promise.all([
                    getFamiliesByCategory(categorySlug),
                    getCategories()
                ]);

                // Find the full category details from all categories
                const fullCategory = allCategories.find(c => c.slug === categorySlug);

                if (!fullCategory) {
                    setError('Category not found');
                    return;
                }

                setCategory(fullCategory);
                setFamilies(familiesData.families);
            } catch (err) {
                console.error('Failed to load category families:', err);
                setError(err instanceof Error ? err.message : 'Failed to load families');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [categorySlug]);

    const sortedFamilies = [...families].sort((a, b) => {
        if (sortBy === 'name') {
            return a.name.localeCompare(b.name);
        }
        return 0;
    });

    if (loading) {
        return (
            <div className="min-h-screen p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="h-8 bg-muted rounded w-48 mb-8 animate-pulse"></div>
                    <SkeletonGrid count={6} />
                </div>
            </div>
        );
    }

    if (error || !category) {
        return (
            <div className="min-h-screen p-4">
                <div className="max-w-7xl mx-auto">
                    <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </Link>
                    <ErrorMessage
                        title={error || 'Category not found'}
                        message="Unable to load this category. Please try again or return home."
                        onRetry={() => window.location.reload()}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumb */}
                <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                </Link>

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-5xl">{category.emoji}</span>
                        <div>
                            <h1 className="text-4xl font-bold">{category.name}</h1>
                            {category.description && <p className="text-muted-foreground mt-2">{category.description}</p>}
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {families.length} families available
                    </p>
                </div>

                {/* Filters & Sort */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search procedures..."
                            className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as 'name' | 'price')}
                            className="px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="name">Sort by Name</option>
                            <option value="price">Sort by Price</option>
                        </select>
                        <button className="px-4 py-2 rounded-lg border bg-background hover:bg-accent flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            Filters
                        </button>
                    </div>
                </div>

                {/* Families Grid */}
                {sortedFamilies.length === 0 ? (
                    <EmptyState
                        title="No families found"
                        message="We couldn't find any procedure families in this category."
                        action={{
                            label: 'Browse All Categories',
                            onClick: () => window.location.href = '/'
                        }}
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sortedFamilies.map((family) => (
                            <FamilyCard key={family.slug} family={family} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function FamilyCard({ family }: { family: Family }) {
    return (
        <Link
            href={`/family/${family.slug}`}
            className="block bg-card border rounded-lg p-6 hover:shadow-lg transition-all hover:-translate-y-1"
        >
            <div className="space-y-4">
                <div>
                    <h3 className="text-xl font-semibold mb-2">{family.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {family.description}
                    </p>
                </div>

                <div className="pt-4 border-t">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-muted-foreground">
                            {family.procedureCount} procedures
                        </span>
                    </div>
                </div>

                <div className="text-sm text-primary font-medium">
                    View procedures →
                </div>
            </div>
        </Link>
    );
}

