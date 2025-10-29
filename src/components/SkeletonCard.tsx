'use client';

interface SkeletonCardProps {
  className?: string;
}

/**
 * SkeletonCard component displays a loading skeleton for category cards.
 * Uses animated pulse effect from Tailwind.
 */
export function SkeletonCard({ className = '' }: SkeletonCardProps) {
  return (
    <div
      className={`
        bg-white rounded-lg border border-gray-200 p-6
        animate-pulse
        ${className}
      `}
    >
      {/* Emoji and Name Section */}
      <div className="flex items-start gap-4 mb-3">
        {/* Emoji Skeleton */}
        <div className="w-10 h-10 bg-gray-200 rounded-lg flex-shrink-0" />
        
        {/* Text Content Skeleton */}
        <div className="flex-1 space-y-2">
          {/* Title Skeleton */}
          <div className="h-5 bg-gray-200 rounded w-3/4" />
          {/* Description Skeleton */}
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
      </div>

      {/* Bottom Section Skeleton */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="h-3 bg-gray-200 rounded w-24" />
          <div className="h-3 bg-gray-200 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

