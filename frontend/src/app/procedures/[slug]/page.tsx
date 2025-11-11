import { procedureCategories } from '@/lib/data/mario-procedures-data';
import ProcedureDetailClient from './ProcedureDetailClient';

// Required for static export with dynamic routes
export async function generateStaticParams() {
    // Generate slugs from all procedures in the mock data
    const allProcedures = procedureCategories.flatMap(category => 
        category.procedures.map(proc => ({
            slug: proc.id // Use the procedure id as the slug
        }))
    );
    
    // Return all procedure slugs for static generation
    return allProcedures;
}

export const dynamicParams = true;

export default function ProcedureDetailPage() {
    return <ProcedureDetailClient />;
}

