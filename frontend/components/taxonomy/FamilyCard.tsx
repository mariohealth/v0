'use client';

/**
 * Enhanced Family Card Component
 * 
 * Visual card with:
 * - Title and description
 * - Procedure count
 * - Average pricing
 * - Hover effects
 * - Category context
 */

import Link from 'next/link';
import { MoreVertical, DollarSign, TrendingUp } from 'lucide-react';

interface FamilyCardProps {
  id: string;
  name: string;
  slug: string;
  description?: string;
  procedureCount: number;
  avgPrice?: number;
  minPrice?: number;
  maxPrice?: number;
  categoryName?: string;
  categorySlug?: string;
  isPopular?: boolean;
}

export function FamilyCard({
  name,
  slug,
  description,
  procedureCount,
  avgPrice,
  minPrice,
  maxPrice,
  categoryName,
  categorySlug,
  isPopular = false,
}: FamilyCardProps) {
  return (
    <Link
      href={`/family/${slug}`}
      className="group relative block bg-card border rounded-xl p-6 hover:border-primary hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
              {name}
            </h3>
            {description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {description}
              </p>
            )}
          </div>
          {isPopular && (
            <div className="px-2 py-1 bg-orange-500 text-white rounded-full text-xs font-semibold flex-shrink-0">
              Trending
            </div>
          )}
        </div>

        {/* Category Context */}
        {categoryName && (
          <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded inline-block">
            {categoryName}
          </div>
        )}

        {/* Stats */}
        <div className="pt-4 border-t space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <MoreVertical className="w-4 h-4" />
            <span>{procedureCount} procedures</span>
          </div>

          {avgPrice && avgPrice > 0 && (
            <div className="flex items-baseline gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              <div>
                <p className="text-2xl font-bold text-primary">
                  {avgPrice.toLocaleString()}
                </p>
                {minPrice !== maxPrice && minPrice && maxPrice && (
                  <p className="text-xs text-muted-foreground">
                    Range: {minPrice.toLocaleString()} - {maxPrice.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-sm text-primary font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
          View procedures →
        </div>
      </div>
    </Link>
  );
}

