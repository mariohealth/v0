'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Filter, SortAsc, Clock, DollarSign } from 'lucide-react';
import { getProceduresByFamily, type Procedure } from '@/lib/backend-api';
import { SkeletonGrid } from '@/components/ui/loading-spinner';
import { ErrorMessage, EmptyState } from '@/components/ui/error-message';

type SortOption = 'name' | 'price-low' | 'price-high';

type FamilyInfo = {
  name: string;
  slug: string;
  description: string;
  procedureCount: number;
  categoryName?: string;
  categorySlug?: string;
};

export default function FamilyPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

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
        
        setFamily({
          name: data.familyName,
          slug: data.familySlug,
          description: data.familyDescription || data.familyName,
          procedureCount: data.procedures.length,
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
      {/* Breadcrumb Navigation */}
      <div className="bg-muted/30 border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground">{family.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Header Section */}
        <div className="mb-8">
          <div className="mb-4">
            <h1 className="text-4xl font-bold mb-2">{family.name}</h1>
            <p className="text-muted-foreground text-lg mb-4">
              {family.description}
            </p>
            <p className="text-sm text-muted-foreground">
              {family.procedureCount} procedures available
            </p>
          </div>
        </div>

        {/* Filters & Sort Bar */}
        <div className="bg-card border rounded-lg p-4 mb-6">
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
              <ProcedureCard key={procedure.id} procedure={procedure} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Procedure Card Component
function ProcedureCard({ procedure }: { procedure: Procedure }) {
  const avgPrice = procedure.avgPrice || 0;
  const minPrice = procedure.minPrice || avgPrice;
  const maxPrice = procedure.maxPrice || avgPrice;
  
  return (
    <Link href={`/procedure/${procedure.id}`}>
      <div className="bg-card border rounded-lg p-6 hover:shadow-lg transition-all hover:-translate-y-1 h-full flex flex-col">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">{procedure.name}</h3>
          {procedure.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {procedure.description}
            </p>
          )}
        </div>

        {/* Details Section */}
        <div className="mt-auto">
          {avgPrice > 0 && (
            <div className="flex items-baseline gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-primary flex-shrink-0" />
              <div>
                <p className="text-2xl font-bold text-primary">
                  RM {avgPrice.toLocaleString()}
                </p>
                {(minPrice !== maxPrice) && (
                  <p className="text-xs text-muted-foreground">
                    Range: RM {minPrice.toLocaleString()} - RM {maxPrice.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Price Count */}
          {procedure.priceCount > 0 && (
            <p className="text-xs text-muted-foreground">
              {procedure.priceCount} price point{procedure.priceCount !== 1 ? 's' : ''} available
            </p>
          )}

          {/* Footer */}
          <p className="text-primary text-sm font-medium mt-auto pt-4 border-t hover:underline">
            View details →
          </p>
        </div>
      </div>
    </Link>
  );
}

