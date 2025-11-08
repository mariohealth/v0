import ProcedureDetailClient from './ProcedureDetailClient';

// Required for static export with dynamic routes
export function generateStaticParams() {
    // Return empty array - routes will be generated dynamically on client
    return [];
}

export default function ProcedureDetailPage() {
    return <ProcedureDetailClient />;
}
