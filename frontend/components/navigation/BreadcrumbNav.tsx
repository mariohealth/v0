'use client';

/**
 * Breadcrumb Navigation Component
 * 
 * Provides hierarchical navigation with:
 * - Clickable breadcrumb trail
 * - Current path indicator
 * - Mobile responsive
 */

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function BreadcrumbNav({ items, className = '' }: BreadcrumbNavProps) {
  // Ensure Home is first if not present
  const allItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    ...items
  ];

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
              {index === 0 ? (
                <Link
                  href={item.href || '/'}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                  aria-label="Home"
                >
                  <Home className="w-4 h-4" />
                </Link>
              ) : index === allItems.length - 1 ? (
                <span className={`font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {item.label}
                </span>
              ) : (
                <>
                  <Link
                    href={item.href || '#'}
                    className="hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

