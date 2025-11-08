import ProviderDetailClient from './ProviderDetailClient';

// Required for static export with dynamic routes
export async function generateStaticParams() {
    // Return at least one valid path for catch-all routes
    // Routes will be generated dynamically on client
    return [{ id: ['placeholder'] }];
}

export default function ProviderDetailPage() {
    return <ProviderDetailClient />;
}
