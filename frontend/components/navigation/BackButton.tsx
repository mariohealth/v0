'use client';

/**
 * Enhanced Back Button Component
 * 
 * Provides consistent back navigation with:
 * - Label customization
 * - Browser back fallback with scroll preservation
 * - Mobile optimized
 * - Scroll position memory
 */

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { ArrowLeft, ChevronLeft } from 'lucide-react';

interface BackButtonProps {
  href?: string;
  label?: string;
  variant?: 'default' | 'minimal' | 'icon-only';
  onClick?: () => void;
  preserveScroll?: boolean; // Whether to restore scroll position when returning
}

// Store scroll positions by pathname
const scrollPositions = new Map<string, number>();

export function BackButton({ 
  href, 
  label = 'Back', 
  variant = 'default',
  onClick,
  preserveScroll = true
}: BackButtonProps) {
  const router = useRouter();
  const hasRestoredScroll = useRef(false);

  // Save scroll position before navigation
  useEffect(() => {
    if (!preserveScroll) return;

    const saveScroll = () => {
      scrollPositions.set(window.location.pathname, window.scrollY);
    };

    // Save on scroll
    const handleScroll = () => {
      saveScroll();
    };

    // Save before page unload
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('beforeunload', saveScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', saveScroll);
    };
  }, [preserveScroll]);

  // Restore scroll position on mount (if we're returning to a page)
  useEffect(() => {
    if (!preserveScroll || hasRestoredScroll.current) return;

    const savedPosition = scrollPositions.get(window.location.pathname);
    if (savedPosition !== undefined) {
      // Small delay to ensure page is rendered
      setTimeout(() => {
        window.scrollTo({
          top: savedPosition,
          behavior: 'smooth'
        });
        hasRestoredScroll.current = true;
      }, 100);
    }
  }, [preserveScroll]);

  const handleClick = () => {
    if (preserveScroll && href) {
      // Save current scroll position before navigating
      scrollPositions.set(window.location.pathname, window.scrollY);
    }

    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    } else {
      // Use browser back which naturally preserves scroll
      router.back();
    }
  };

  if (variant === 'icon-only') {
    return (
      <button
        onClick={handleClick}
        className="p-2 rounded-lg hover:bg-muted transition-colors"
        aria-label={label}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
    );
  }

  if (variant === 'minimal') {
    return (
      <button
        onClick={handleClick}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>{label}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card hover:bg-accent transition-colors text-sm font-medium"
    >
      <ArrowLeft className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
}

