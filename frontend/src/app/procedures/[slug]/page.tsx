import { Suspense } from 'react';

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
    
    // Add a placeholder for dynamic routing fallback
    allProcedures.push({ slug: 'placeholder' });
    
    // Return all procedure slugs for static generation
    return allProcedures;
}

export const dynamicParams = true;

function ProcedurePageFallback() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
            <div className="space-y-4 max-w-xl w-full">
                <div className="h-6 w-44 bg-gray-200 animate-pulse rounded" />
                <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded" />
                <div className="h-72 bg-gray-200 animate-pulse rounded" />
            </div>
        </div>
    );
}

export default function ProcedureDetailPage() {
    return (
        <Suspense fallback={<ProcedurePageFallback />}>
            <ProcedureDetailClient />
        </Suspense>
    );
}

