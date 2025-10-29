'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Filter, SortAsc, ArrowLeft } from 'lucide-react';
import { getFamiliesByCategory, getCategories, type Family, type Category } from '@/lib/backend-api';
import { LoadingSpinner, SkeletonGrid } from '@/components/ui/loading-spinner';
import { ErrorMessage, EmptyState } from '@/components/ui/error-message';
import { BreadcrumbNav } from '@/components/navigation/BreadcrumbNav';
import { BackButton } from '@/components/navigation/BackButton';
import { FamilyCard } from '@/components/taxonomy/FamilyCard';
import { Tooltip } from '@/components/ui/Tooltip';

export default function CategoryPage() {
    const params = useParams();
    const categorySlug = params.id as string;

    const [category, setCategory] = useState<Category | null>(null);
    const [families, setFamilies] = useState<Family[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<'name'>('name');
    const [focusedIndex, setFocusedIndex] = useState<number>(-1);
    const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);

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

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (sortedFamilies.length === 0) return;

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    setFocusedIndex((prev) =>
                        prev < sortedFamilies.length - 1 ? prev + 1 : prev
                    );
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1));
                    break;
                case 'Enter':
                    if (focusedIndex >= 0 && cardRefs.current[focusedIndex]) {
                        cardRefs.current[focusedIndex]?.click();
                    }
                    break;
                case 'Escape':
                    setFocusedIndex(-1);
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [sortedFamilies.length, focusedIndex]);

    // Scroll focused card into view
    useEffect(() => {
        if (focusedIndex >= 0 && cardRefs.current[focusedIndex]) {
            cardRefs.current[focusedIndex]?.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }
    }, [focusedIndex]);

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
        <div className="min-h-screen">
            {/* Breadcrumb Bar */}
            <div className="bg-muted/30 border-b sticky top-16 z-40">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <BreadcrumbNav
                        items={[
                            {
                                label: category.name,
                                href: `/category/${category.slug}`,
                                count: families.length,
                                countLabel: 'families'
                            }
                        ]}
                    />
                </div>
            </div>

            <div className="p-4">
                <div className="max-w-7xl mx-auto">
                    {/* Back Button */}
                    <div className="mb-6">
                        <BackButton href="/" label="Back to Categories" variant="minimal" />
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-5xl">{category.emoji}</span>
                            <div className="flex-1">
                                <h1 className="text-4xl font-bold">{category.name}</h1>
                                {category.description && (
                                    <div className="flex items-start gap-2 mt-2">
                                        <p className="text-muted-foreground text-lg">
                                            {category.description}
                                        </p>
                                        <Tooltip
                                            content={category.description}
                                            position="top"
                                            triggerIcon
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                            <span className="font-semibold text-foreground">
                                {families.length} {families.length === 1 ? 'family' : 'families'} available
                            </span>
                            <span className="hidden sm:inline">•</span>
                            <span className="hidden sm:inline">Browse and compare procedures</span>
                        </div>
                    </div>

                    {/* Filters & Sort - Sticky on Mobile */}
                    <div className="sticky top-[73px] md:static z-30 bg-background/95 backdrop-blur-sm py-4 md:py-0 -mx-4 px-4 md:mx-0 mb-8 border-b md:border-none">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Search families..."
                                    className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
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
                                {sortedFamilies.map((family, index) => (
                                    <div
                                        key={family.id}
                                        ref={(el) => {
                                            if (el) {
                                                cardRefs.current[index] = el.querySelector('a') as HTMLAnchorElement;
                                            }
                                        }}
                                    >
                                        <FamilyCard
                                            id={family.id}
                                            name={family.name}
                                            slug={family.slug}
                                            description={family.description}
                                            procedureCount={family.procedureCount}
                                            categoryName={category.name}
                                            className={focusedIndex === index ? 'ring-2 ring-primary' : ''}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                );
}


