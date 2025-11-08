// Server component wrapper for static export
// Required: generateStaticParams must be in page file, not layout
import { ProviderDetailClient } from './ProviderDetailClient'

// Required for static export with dynamic routes
export async function generateStaticParams() {
    // Return empty array for client-side rendering
    // Pages will be generated on-demand at runtime
    return []
}

export default async function ProviderDetailRoute({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    return <ProviderDetailClient providerId={id} />
}
