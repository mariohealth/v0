'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchRedirectClient() {
    const router = useRouter();

    useEffect(() => {
        // Deprecated route: always redirect to landing
        router.replace('/');
    }, [router]);

    return null;
}
