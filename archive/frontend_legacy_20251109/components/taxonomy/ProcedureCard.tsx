'use client';

/**
 * Enhanced Procedure Card Component
 * 
 * Visual card with:
 * - Title and description
 * - Pricing information
 * - Price range
 * - Popular indicator
 * - Category context
 */

import Link from 'next/link';
import { DollarSign, TrendingUp, Award, Info } from 'lucide-react';

interface ProcedureCardProps {
  id: string;
  name: string;
  description?: string;
  avgPrice?: number;
  minPrice?: number;
  maxPrice?: number;
  priceCount: number;
  familyName?: string;
  categoryName?: string;
  isPopular?: boolean;
  searchCount?: number;
}

export function ProcedureCard({
  id,
  name,
  description,
  avgPrice,
  minPrice,
  maxPrice,
  priceCount,
  familyName,
  categoryName,
  isPopular = false,
  searchCount,
}: ProcedureCardProps) {
  const displayPrice = avgPrice || 0;
  const hasPriceRange = minPrice && maxPrice && minPrice !== maxPrice;

  return (
    <Link href={`/procedure/${id}`}>
      <div className="group relative bg-card border rounded-xl p-6 hover:border-primary hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
        {/* Badges */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          {isPopular && (
            <div className="inline-flex items-center gap-1 px-2 py-1 bg-orange-500 text-white rounded-full text-xs font-semibold">
              <TrendingUp className="w-3 h-3" />
              Popular
            </div>
          )}
          {searchCount && searchCount > 100 && (
            <div className="inline-flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground rounded-full text-xs font-semibold">
              <Award className="w-3 h-3" />
              Most Searched
            </div>
          )}
        </div>

        <div className="space-y-4 flex-1 flex flex-col">
          {/* Header */}
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {name}
            </h3>
            {description && (
              <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                {description}
              </p>
            )}

            {/* Category Context */}
            <div className="flex flex-wrap gap-2 mt-3">
              {familyName && (
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  {familyName}
                </span>
              )}
              {categoryName && (
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  {categoryName}
                </span>
              )}
            </div>
          </div>

          {/* Pricing Section */}
          {displayPrice > 0 && (
            <div className="pt-4 border-t border-border group-hover:border-primary transition-colors">
              <div className="flex items-baseline gap-2">
                <DollarSign className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-2xl font-bold text-primary">
                    ${displayPrice.toLocaleString()}
                  </p>
                  {hasPriceRange && (
                    <p className="text-xs text-muted-foreground">
                      Range: ${minPrice?.toLocaleString()} - ${maxPrice?.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="pt-4 border-t border-border group-hover:border-primary transition-colors">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Info className="w-3 h-3" />
                {priceCount} price point{priceCount !== 1 ? 's' : ''}
              </div>
              <div className="text-sm text-primary font-medium group-hover:translate-x-1 transition-transform">
                View details →
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

