'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, TrendingUp, Shield, DollarSign } from 'lucide-react';
import { getCategories, type Category } from '@/lib/backend-api';
import { LoadingSpinner, SkeletonGrid } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { SearchResults } from '@/components/search-results';
import { CategoryCard } from '@/components/taxonomy/CategoryCard';

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch categories from real backend API
    // Endpoint: GET /api/v1/categories
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories:', err);
        setError(err instanceof Error ? err.message : 'Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Compare Healthcare Prices
            <span className="block text-primary mt-2">Save Money, Choose Better</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find transparent pricing for medical procedures across Malaysia.
            Compare hospitals, clinics, and specialists in one place.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mt-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search procedures, tests, or treatments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-lg border bg-background text-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Try: "Dental cleaning", "MRI scan", "Blood test"
            </p>
          </div>

          {/* Search Results */}
          <div className="max-w-7xl mx-auto mt-8 px-4">
            <SearchResults searchQuery={searchQuery} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<DollarSign className="h-8 w-8" />}
              title="Transparent Pricing"
              description="See real costs upfront. No surprises, no hidden fees."
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8" />}
              title="Verified Providers"
              description="All hospitals and clinics are verified and licensed."
            />
            <FeatureCard
              icon={<TrendingUp className="h-8 w-8" />}
              title="Best Value"
              description="Compare prices and find the best deals for your needs."
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
            <p className="text-muted-foreground">
              Explore healthcare services organized by specialty
            </p>
          </div>

          {loading && <SkeletonGrid count={6} />}

          {error && (
            <ErrorMessage
              message={error}
              onRetry={() => window.location.reload()}
            />
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <CategoryCard 
                  key={category.id} 
                  id={category.id}
                  name={category.name}
                  slug={category.slug}
                  emoji={category.emoji}
                  description={category.description}
                  familyCount={category.familyCount}
                  isPopular={index < 2}
                  isTrending={index === 0}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to Save on Healthcare?</h2>
          <p className="text-lg opacity-90">
            Start comparing prices now and make informed healthcare decisions
          </p>
          <Link
            href="/search"
            className="inline-block bg-background text-foreground px-8 py-3 rounded-lg font-semibold hover:bg-background/90 transition"
          >
            Start Searching
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description
}: {
  icon: React.ReactNode;
  title: string;
  description: string
}) {
  return (
    <div className="bg-background rounded-lg p-6 space-y-4 border">
      <div className="text-primary">{icon}</div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
