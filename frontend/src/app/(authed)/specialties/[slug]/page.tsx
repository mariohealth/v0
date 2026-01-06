import { Suspense } from 'react';
import { specialties } from '@/lib/data/mario-doctors-data';

import SpecialtyProvidersPageClient from './SpecialtyProvidersPageClient';

export const dynamic = 'force-static';

// Generate static params from local specialties dataset to support static export.
// Include a minimal alias for cardiologist to ensure deep links resolve.
export async function generateStaticParams() {
  const slugs = [
    ...specialties.map((s) => ({ slug: s.id })), // ids are used as slugs in static data
    { slug: 'cardiologist' }, // explicit alias for backend canonical slug
  ];
  // Remove potential duplicates
  const deduped = Array.from(new Map(slugs.map((s) => [s.slug, s])).values());
  return deduped;
}

function SpecialtyPageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="space-y-4 max-w-xl w-full">
        <div className="h-6 w-44 bg-gray-200 animate-pulse rounded" />
        <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded" />
        <div className="h-72 bg-gray-200 animate-pulse rounded" />
      </div>
    </div>
  );
}

type PageProps = {
  params: {
    slug: string;
  };
};

export default function SpecialtyPage({ params }: PageProps) {
  return (
    <Suspense fallback={<SpecialtyPageFallback />}>
      <SpecialtyProvidersPageClient slug={params.slug} />
    </Suspense>
  );
}

