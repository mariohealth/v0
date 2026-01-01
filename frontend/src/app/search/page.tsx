'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const q = searchParams.get('q');
        // Deprecated route: always redirect to landing
        router.replace('/');
    }, [router, searchParams]);

    return null;
}
