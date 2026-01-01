'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function SearchRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Deprecated route: always redirect to landing
    router.replace('/');
  }, [router, searchParams]);

  return null;
}

export default function SearchPage() {
  return <SearchRedirect />;
}
