import { Suspense } from 'react';
import ProviderDetailClient from './ProviderDetailClient';

// Required for static export with dynamic routes
export async function generateStaticParams() {
    // For static export, we pre-render a placeholder page
    // Actual provider data is loaded client-side via ProviderDetailClient
    return [{ id: 'placeholder' }];
}

// Allow any provider ID to be accessed (not just pre-rendered ones)
export const dynamicParams = true;

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

