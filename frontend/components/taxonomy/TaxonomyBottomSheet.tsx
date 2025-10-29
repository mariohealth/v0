'use client';

/**
 * Mobile Taxonomy Bottom Sheet
 * 
 * Mobile-optimized navigation component with:
 * - Swipeable categories
 * - Large touch targets (44px min)
 * - Sticky search bar
 * - Smooth animations
 */

import { useState, useEffect, useRef } from 'react';
import { X, Search, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Category, Family } from '@/lib/backend-api';

interface TaxonomyBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  categories?: Category[];
  families?: Family[];
  currentCategorySlug?: string;
  currentFamilySlug?: string;
  type: 'categories' | 'families';
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function TaxonomyBottomSheet({
  isOpen,
  onClose,
  categories = [],
  families = [],
  currentCategorySlug,
  currentFamilySlug,
  type,
  searchQuery = '',
  onSearchChange,
}: TaxonomyBottomSheetProps) {
  const [filteredItems, setFilteredItems] = useState<(Category | Family)[]>([]);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const items = type === 'categories' ? categories : families;
    if (!searchQuery) {
      setFilteredItems(items);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredItems(
        items.filter(item =>
          item.name.toLowerCase().includes(query) ||
          (item.description && item.description.toLowerCase().includes(query))
        )
      );
    }
  }, [categories, families, searchQuery, type]);

  // Handle swipe down to close
  useEffect(() => {
    if (!isOpen || !sheetRef.current) return;

    let startY = 0;
    let currentY = 0;
    let isDragging = false;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      isDragging = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;

      if (deltaY > 0 && sheetRef.current) {
        sheetRef.current.style.transform = `translateY(${deltaY}px)`;
      }
    };

    const handleTouchEnd = () => {
      if (!isDragging) return;
      const deltaY = currentY - startY;

      if (deltaY > 100 && sheetRef.current) {
        // Close if dragged down more than 100px
        onClose();
      } else if (sheetRef.current) {
        // Snap back
        sheetRef.current.style.transform = '';
      }

      isDragging = false;
      startY = 0;
      currentY = 0;
    };

    const sheet = sheetRef.current;
    sheet.addEventListener('touchstart', handleTouchStart);
    sheet.addEventListener('touchmove', handleTouchMove);
    sheet.addEventListener('touchend', handleTouchEnd);

    return () => {
      sheet.removeEventListener('touchstart', handleTouchStart);
      sheet.removeEventListener('touchmove', handleTouchMove);
      sheet.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const items = filteredItems;
  const getHref = (item: Category | Family) => {
    if (type === 'categories') {
      return `/category/${item.slug}`;
    }
    return `/family/${item.slug}`;
  };

  const getCountLabel = (item: Category | Family) => {
    if (type === 'categories') {
      return `${(item as Category).familyCount || 0} families`;
    }
    return `${(item as Family).procedureCount || 0} procedures`;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className="fixed inset-x-0 bottom-0 bg-background rounded-t-2xl shadow-2xl z-50 max-h-[85vh] flex flex-col transition-transform duration-300"
      >
        {/* Handle Bar */}
        <div className="flex items-center justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-4 pb-4 border-b sticky top-0 bg-background z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
              Browse {type === 'categories' ? 'Categories' : 'Families'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={`Search ${type}...`}
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {items.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No {type} found</p>
              {searchQuery && (
                <button
                  onClick={() => onSearchChange?.('')}
                  className="mt-2 text-primary hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item) => {
                const isActive =
                  (type === 'categories' && currentCategorySlug === item.slug) ||
                  (type === 'families' && currentFamilySlug === item.slug);

                return (
                  <Link
                    key={item.id}
                    href={getHref(item)}
                    onClick={onClose}
                    className={`block p-4 rounded-lg border transition-all min-h-[44px] ${
                      isActive
                        ? 'bg-primary/10 border-primary'
                        : 'bg-card border-border hover:border-primary'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          {type === 'categories' && (
                            <span className="text-2xl flex-shrink-0">
                              {(item as Category).emoji}
                            </span>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3
                              className={`font-semibold ${
                                isActive ? 'text-primary' : 'text-foreground'
                              }`}
                            >
                              {item.name}
                            </h3>
                            {item.description && (
                              <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          {getCountLabel(item)}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-2" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

