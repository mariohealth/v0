'use client';

interface LoadingSpinnerProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * LoadingSpinner component displays a centered spinner with optional text.
 * Uses Tailwind animation classes.
 */
export function LoadingSpinner({ 
  text, 
  size = 'md',
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div
        className={`
          ${sizeClasses[size]}
          border-4 border-gray-200 border-t-blue-600
          rounded-full
          animate-spin
        `}
        aria-label="Loading"
        role="status"
      />
      {text && (
        <p className="text-sm text-gray-600 animate-pulse">
          {text}
        </p>
      )}
      <span className="sr-only">Loading...</span>
    </div>
  );
}

