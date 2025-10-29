'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Filter, SortAsc, Clock, DollarSign, ArrowLeft } from 'lucide-react';
import { getProceduresByFamily, getFamiliesByCategory, getCategories, type Procedure } from '@/lib/backend-api';
import { SkeletonGrid } from '@/components/ui/loading-spinner';
import { ErrorMessage, EmptyState } from '@/components/ui/error-message';
import { BreadcrumbNav } from '@/components/navigation/BreadcrumbNav';
import { BackButton } from '@/components/navigation/BackButton';
import { ProcedureCard } from '@/components/taxonomy/ProcedureCard';

type SortOption = 'name' | 'price-low' | 'price-high';

type FamilyInfo = {
  name: string;
  slug: string;
  description: string;
  procedureCount: number;
  categoryName?: string;
  categorySlug?: string;
  categoryId?: string;
};

export default function FamilyPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.id as string;

  const [family, setFamily] = useState<FamilyInfo | null>(null);
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Fetch family and procedures
  // API: GET /api/v1/families/{slug}/procedures
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getProceduresByFamily(slug);

        // Fetch category info
        const [categories, familiesData] = await Promise.all([
          getCategories(),
          data.procedures.length > 0 ? getFamiliesByCategory(data.procedures[0].categorySlug || '') : Promise.resolve({ families: [] })
        ]);

        // Find category
        const category = categories.find(c =>
          data.familyCategorySlug ? c.slug === data.familyCategorySlug : false
        );

        setFamily({
          name: data.familyName,
          slug: data.familySlug,
          description: data.familyDescription || data.familyName,
          procedureCount: data.procedures.length,
          categoryName: category?.name,
          categorySlug: category?.slug,
          categoryId: category?.id,
        });

        setProcedures(data.procedures);
      } catch (err) {
        setError('Failed to load family data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter and sort procedures
  const filteredProcedures = procedures
    .filter(p => {
      if (!debouncedQuery) return true;
      const query = debouncedQuery.toLowerCase();
      return p.name.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query));
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return (a.avgPrice || 0) - (b.avgPrice || 0);
        case 'price-high':
          return (b.avgPrice || 0) - (a.avgPrice || 0);
        default:
          return 0;
      }
    });

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <SkeletonGrid count={6} />
        </div>
      </div>
    );
  }

  // Error state
  if (error || !family) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <ErrorMessage
            title="Family Not Found"
            message={error || 'This procedure family does not exist or has been removed.'}
            onRetry={() => window.location.reload()}
          />
          <Link
            href="/"
            className="inline-flex items-center gap-2 mt-6 text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb Bar */}
      <div className="bg-muted/30 border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <BreadcrumbNav
            items={[
              ...(family.categorySlug && family.categoryName ? [
                {
                  label: family.categoryName,
                  href: `/category/${family.categorySlug}`
                }
              ] : []),
              {
                label: family.name,
                href: `/family/${family.slug}`,
                count: family.procedureCount,
                countLabel: 'procedures'
              }
            ]}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        {family.categorySlug && (
          <div className="mb-6">
            <BackButton href={`/category/${family.categorySlug}`} label={`Back to ${family.categoryName}`} variant="minimal" />
          </div>
        )}

        {/* Header Section */}
        <div className="mb-8">
          <div className="mb-4">
            <h1 className="text-4xl font-bold mb-2">{family.name}</h1>
            <p className="text-muted-foreground text-lg mb-4">
              {family.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
              <span className="font-semibold text-foreground">
                {family.procedureCount} {family.procedureCount === 1 ? 'procedure' : 'procedures'} available
              </span>
            </div>
          </div>
        </div>

        {/* Filters & Sort Bar - Sticky on Mobile */}
        <div className="sticky top-[73px] md:static z-30 bg-card/95 backdrop-blur-sm border rounded-lg p-4 mb-6 md:bg-card md:backdrop-blur-none">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            {/* Search Input */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search procedures..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="name">Sort by Name (A-Z)</option>
              <option value="price-low">Sort by Price (Low to High)</option>
              <option value="price-high">Sort by Price (High to Low)</option>
            </select>

            {/* Filter Button (UI only for now) */}
            <button
              className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted transition"
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>

        {/* Results Count */}
        {filteredProcedures.length > 0 && (
          <p className="text-sm text-muted-foreground mb-6">
            Showing {filteredProcedures.length} of {procedures.length} procedures
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        )}

        {/* Procedures Grid */}
        {filteredProcedures.length === 0 ? (
          <EmptyState
            title="No Procedures Found"
            message={
              searchQuery
                ? 'No procedures match your search. Try different keywords.'
                : 'No procedures available in this family.'
            }
            action={
              searchQuery
                ? { label: 'Clear Search', onClick: () => setSearchQuery('') }
                : { label: 'Browse All Categories', onClick: () => router.push('/') }
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProcedures.map((procedure) => (
              <ProcedureCard
                key={procedure.id}
                id={procedure.id}
                name={procedure.name}
                description={procedure.description}
                avgPrice={procedure.avgPrice || undefined}
                minPrice={procedure.minPrice || undefined}
                maxPrice={procedure.maxPrice || undefined}
                priceCount={procedure.priceCount}
                familyName={family.name}
                categoryName={family.categoryName}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
