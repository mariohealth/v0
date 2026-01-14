import { Suspense } from 'react';

import OrgDetailClient from './OrgDetailClient';

export const dynamicParams = true;

export async function generateStaticParams() {
  // Return placeholder for Firebase static export compatibility
  // Real org IDs will be handled dynamically at runtime
  return [{ id: 'placeholder' }];
}

function OrgDetailFallback() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-4">
        <div className="h-8 w-32 bg-gray-200 animate-pulse" />
        <div className="h-12 w-3/4 bg-gray-200 animate-pulse" />
        <div className="h-6 w-1/2 bg-gray-200 animate-pulse" />
        <div className="h-64 w-full rounded-lg bg-white shadow-sm animate-pulse" />
        <div className="h-48 w-full rounded-lg bg-white shadow-sm animate-pulse" />
      </div>
    </div>
  );
}

export default function OrgDetailPage() {
  return (
    <Suspense fallback={<OrgDetailFallback />}>
      <OrgDetailClient />
    </Suspense>
  );
}

