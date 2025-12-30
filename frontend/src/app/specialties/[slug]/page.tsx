import { Suspense } from 'react';

import SpecialtyProvidersPageClient from './SpecialtyProvidersPageClient';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  return [{ slug: 'placeholder' }];
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

