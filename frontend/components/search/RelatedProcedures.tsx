'use client';

/**
 * Related Procedures Component
 * 
 * Shows "People also searched for" based on:
 * - Category similarity
 * - Search co-occurrence
 * - Popular procedures
 */

import Link from 'next/link';
import { TrendingUp, ArrowRight } from 'lucide-react';
import type { SearchResult } from '@/lib/backend-api';

interface RelatedProceduresProps {
  currentProcedure: SearchResult;
  allResults: SearchResult[];
  maxItems?: number;
}

export function RelatedProcedures({ 
  currentProcedure, 
  allResults,
  maxItems = 5 
}: RelatedProceduresProps) {
  // Find related procedures based on same category or family
  const related = allResults
    .filter(result => 
      result.procedureId !== currentProcedure.procedureId &&
      (
        result.categorySlug === currentProcedure.categorySlug ||
        result.familySlug === currentProcedure.familySlug
      )
    )
    .slice(0, maxItems);

  if (related.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-emerald-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          People also searched for
        </h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {related.map((procedure) => (
          <Link
            key={procedure.procedureId}
            href={`/procedure/${procedure.procedureSlug}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full hover:bg-emerald-100 transition-colors text-sm font-medium group"
          >
            <span>{procedure.procedureName}</span>
            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>
    </div>
  );
}
