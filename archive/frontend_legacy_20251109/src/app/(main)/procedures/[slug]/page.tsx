// Server component wrapper for static export
// Required: generateStaticParams must be in page file, not layout
import { ProcedureDetailClient } from './ProcedureDetailClient'

// Required for static export with dynamic routes
export async function generateStaticParams() {
    // Return empty array for client-side rendering
    // Pages will be generated on-demand at runtime
    return []
}

export default async function ProcedureDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    return <ProcedureDetailClient slug={slug} />
}
