import ProcedureDetailClient from './ProcedureDetailClient';

// Required for static export with dynamic routes
export async function generateStaticParams() {
    // Return at least one valid path for dynamic routes
    // Routes will be generated dynamically on client
    return [{ slug: 'placeholder' }];
}

export const dynamicParams = true;

export default function ProcedureDetailPage() {
    return <ProcedureDetailClient />;
}

