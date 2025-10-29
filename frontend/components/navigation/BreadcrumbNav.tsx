'use client';

/**
 * Enhanced Breadcrumb Navigation Component
 * 
 * Provides hierarchical navigation with:
 * - Clickable breadcrumb trail with full path
 * - Current path indicator
 * - Procedure counts display
 * - Mobile responsive
 * - Smooth animations
 */

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { usePathname } from 'next/navigation';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
  count?: number; // For showing procedure/category counts
  countLabel?: string; // e.g. "procedures", "families"
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

export function BreadcrumbNav({ 
  items, 
  className = '',
  showHome = true 
}: BreadcrumbNavProps) {
  const pathname = usePathname();
  
  // Ensure Home is first if not present and showHome is true
  const allItems: BreadcrumbItem[] = showHome
    ? [
        { label: 'Home', href: '/' },
        ...items
      ]
    : items;

  return (
    <nav 
      className={`flex items-center gap-2 text-sm text-muted-foreground ${className}`}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center gap-2 flex-wrap">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          const isActive = item.isActive !== false && isLast;

          return (
            <li key={index} className="flex items-center gap-2">
              {index === 0 && showHome ? (
                <Link
                  href={item.href || '/'}
                  className="flex items-center gap-1 hover:text-foreground transition-colors rounded p-1 hover:bg-muted"
                  aria-label="Home"
                >
                  <Home className="w-4 h-4" />
                </Link>
              ) : index === allItems.length - 1 ? (
                <span 
                  className={`font-semibold ${isActive ? 'text-foreground' : 'text-muted-foreground'} flex items-center gap-2`}
                >
                  <span>{item.label}</span>
                  {item.count !== undefined && item.countLabel && (
                    <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {item.count} {item.countLabel}
                    </span>
                  )}
                </span>
              ) : (
                <>
                  <Link
                    href={item.href || '#'}
                    className="hover:text-foreground transition-colors rounded px-1 py-0.5 hover:bg-muted flex items-center gap-2"
                  >
                    <span>{item.label}</span>
                    {item.count !== undefined && item.countLabel && (
                      <span className="text-xs text-muted-foreground">
                        ({item.count})
                      </span>
                    )}
                  </Link>
                  <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

