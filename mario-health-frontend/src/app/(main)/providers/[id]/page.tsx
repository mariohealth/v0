import { ProviderDetailClient } from './ProviderDetailClient'

// Required for static export - return empty array to disable pre-rendering
// Client-side will handle all routing and data fetching
export async function generateStaticParams() {
    return []
}

export default function ProviderDetailRoute() {
    return <ProviderDetailClient />
}
