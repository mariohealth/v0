'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console for debugging
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
      <h2 className="text-2xl font-semibold mb-4 text-destructive">
        {error.message || 'An unexpected error occurred'}
      </h2>
      <p className="text-muted-foreground mb-8">
        We're sorry, but something went wrong. Please try again.
      </p>
      <div className="flex gap-4 justify-center">
        <Button onClick={reset}>Try again</Button>
        <Link href="/home">
          <Button variant="outline">Go to Home</Button>
        </Link>
      </div>
    </div>
  );
}

