'use client';

/**
 * Enhanced Back Button Component
 * 
 * Provides consistent back navigation with:
 * - Label customization
 * - Browser back fallback
 * - Mobile optimized
 */

import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronLeft } from 'lucide-react';

interface BackButtonProps {
  href?: string;
  label?: string;
  variant?: 'default' | 'minimal' | 'icon-only';
  onClick?: () => void;
}

export function BackButton({ 
  href, 
  label = 'Back', 
  variant = 'default',
  onClick 
}: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    } else {
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

