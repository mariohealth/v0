'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function DoctorsRedirectClient() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const specialtyParam = searchParams.get('specialty');
        const procedureParam = searchParams.get('procedure');

        if (specialtyParam) {
            const params = new URLSearchParams();
            const zipCode = searchParams.get('zip_code');
            const radiusMiles = searchParams.get('radius_miles');
            const offset = searchParams.get('offset');
            if (zipCode) params.set('zip_code', zipCode);
            if (radiusMiles) params.set('radius_miles', radiusMiles);
            if (offset) params.set('offset', offset);
            const query = params.toString();
            router.replace(`/specialties/${encodeURIComponent(specialtyParam)}${query ? `?${query}` : ''}`);
            return;
        }

        if (procedureParam) {
            router.replace(`/procedures/${encodeURIComponent(procedureParam)}`);
            return;
        }

        router.replace('/specialties');
    }, [router, searchParams]);

    return (
        <main className="flex min-h-screen items-center justify-center px-4">
            <div className="text-center text-sm text-muted-foreground">
                Redirecting…
            </div>
        </main>
    );
}
