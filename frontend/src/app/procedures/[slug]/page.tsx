import ProcedureDetailClient from './ProcedureDetailClient';

// Force dynamic rendering - no static generation for procedure detail pages
export const dynamic = "force-dynamic";

export default function ProcedureDetailPage() {
    return <ProcedureDetailClient />;
}

