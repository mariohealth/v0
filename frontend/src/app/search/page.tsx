import { Suspense } from 'react';
import SearchRedirectClient from './SearchRedirectClient';

export const dynamic = 'force-static';

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchRedirectClient />
    </Suspense>
  );
}
