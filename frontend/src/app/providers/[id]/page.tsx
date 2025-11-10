import { Suspense } from 'react';
import ProviderDetailClient from './ProviderDetailClient';

// Required for static export with dynamic routes
export async function generateStaticParams() {
    // Return at least one valid path for dynamic routes
    // Routes will be generated dynamically on client
    return [{ id: 'placeholder' }];
}

export const revalidate = 0;
export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const fetchCache = 'force-no-store';

export default function ProviderDetailPage() {
    return (
        <Suspense fallback={
            <main className="flex min-h-screen flex-col items-center justify-center">
                <p className="text-gray-600">Loading...</p>
            </main>
        }>
            <ProviderDetailClient />
        </Suspense>
    );
}

