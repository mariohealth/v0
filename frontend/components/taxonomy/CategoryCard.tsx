'use client';

/**
 * Enhanced Category Card Component
 * 
 * Visual card with:
 * - Icon/emoji
 * - Title and description
 * - Procedure count
 * - Hover effects
 * - Badge support (popular, trending)
 */

import Link from 'next/link';
import { TrendingUp, Zap, Award } from 'lucide-react';

interface CategoryCardProps {
  id: string;
  name: string;
  slug: string;
  emoji?: string;
  description?: string;
  familyCount: number;
  isPopular?: boolean;
  isTrending?: boolean;
  onClick?: () => void;
}

export function CategoryCard({
  name,
  slug,
  emoji,
  description,
  familyCount,
  isPopular = false,
  isTrending = false,
  onClick,
}: CategoryCardProps) {
  return (
    <Link
      href={`/category/${slug}`}
      onClick={onClick}
      className="group relative block bg-card border-2 border-border rounded-xl p-6 hover:border-primary hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
    >
      {/* Badges */}
      {(isPopular || isTrending) && (
        <div className="absolute top-4 right-4 flex gap-2">
          {isPopular && (
            <div className="inline-flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground rounded-full text-xs font-semibold">
              <Award className="w-3 h-3" />
              Popular
            </div>
          )}
          {isTrending && (
            <div className="inline-flex items-center gap-1 px-2 py-1 bg-orange-500 text-white rounded-full text-xs font-semibold">
              <TrendingUp className="w-3 h-3" />
              Trending
            </div>
          )}
        </div>
      )}

      <div className="space-y-4">
        {/* Icon & Title */}
        <div className="flex items-start gap-4">
          <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
            {emoji || '🏥'}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
              {name}
            </h3>
          </div>
        </div>

        {/* Description */}
        {description && (
          <p className="text-muted-foreground text-sm line-clamp-2 group-hover:text-foreground transition-colors">
            {description}
          </p>
        )}

        {/* Stats */}
        <div className="pt-4 border-t border-border group-hover:border-primary transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors">
              <Zap className="w-4 h-4" />
              <span>{familyCount} families</span>
            </div>
            <div className="text-sm text-primary font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              Browse →
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

