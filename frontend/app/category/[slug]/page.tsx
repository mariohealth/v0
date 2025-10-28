'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Filter, SortAsc } from 'lucide-react';
import { mockApi, type Procedure, type Category, MOCK_CATEGORIES } from '@/src/lib/mock-data';
import { LoadingSpinner, SkeletonGrid } from '@/src/components/ui/loading-spinner';
import { ErrorMessage, EmptyState } from '@/src/components/ui/error-message';

export default function CategoryPage() {
    const params = useParams();
    const categorySlug = params.slug as string;

    const [category, setCategory] = useState<Category | null>(null);
    const [procedures, setProcedures] = useState<Procedure[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<'name' | 'price'>('name');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Find category
                const foundCategory = MOCK_CATEGORIES.find(c => c.slug === categorySlug);
                if (!foundCategory) {
                    setError('Category not found');
                    return;
                }
                setCategory(foundCategory);

                // Fetch procedures for this category
                const data = await mockApi.getProcedures(categorySlug);
                setProcedures(data);
            } catch (err) {
                setError('Failed to load procedures');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [categorySlug]);

    const sortedProcedures = [...procedures].sort((a, b) => {
        if (sortBy === 'name') {
            return a.name.localeCompare(b.name);
        }
        return a.averagePrice - b.averagePrice;
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
                        <span className="text-5xl">{category.icon}</span>
                        <div>
                            <h1 className="text-4xl font-bold">{category.name}</h1>
                            <p className="text-muted-foreground mt-2">{category.description}</p>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {procedures.length} procedures available
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

                {/* Procedures Grid */}
                {sortedProcedures.length === 0 ? (
                    <EmptyState
                        title="No procedures found"
                        message="We couldn't find any procedures in this category."
                        action={{
                            label: 'Browse All Categories',
                            onClick: () => window.location.href = '/'
                        }}
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sortedProcedures.map((procedure) => (
                            <ProcedureCard key={procedure.id} procedure={procedure} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function ProcedureCard({ procedure }: { procedure: Procedure }) {
    return (
        <Link
            href={`/procedure/${procedure.id}`}
            className="block bg-card border rounded-lg p-6 hover:shadow-lg transition-all hover:-translate-y-1"
        >
            <div className="space-y-4">
                <div>
                    <h3 className="text-xl font-semibold mb-2">{procedure.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {procedure.description}
                    </p>
                </div>

                <div className="pt-4 border-t">
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-primary">
                            RM {procedure.averagePrice}
                        </span>
                        <span className="text-sm text-muted-foreground">avg</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Range: RM {procedure.priceRange.min} - RM {procedure.priceRange.max}
                    </p>
                </div>

                <div className="text-sm text-primary font-medium">
                    View providers →
                </div>
            </div>
        </Link>
    );
}

