'use client';

/**
 * Related Procedures Component
 * 
 * Shows related procedures that people also searched for
 */

import Link from 'next/link';
import { TrendingUp } from 'lucide-react';

interface RelatedProcedure {
  id: string;
  slug: string;
  name: string;
}

interface RelatedProceduresProps {
  currentQuery: string;
  currentCategory?: string;
  relatedProcedures: RelatedProcedure[];
  onSelect: (procedure: string) => void;
}

export function RelatedProcedures({
  currentQuery,
  currentCategory,
  relatedProcedures,
  onSelect,
}: RelatedProceduresProps) {
  if (relatedProcedures.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-emerald-600" />
        <h3 className="font-semibold text-gray-900">People also searched for</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {relatedProcedures.map((procedure) => (
          <button
            key={procedure.id}
            onClick={() => onSelect(procedure.name)}
            className="px-4 py-2 bg-gray-100 hover:bg-emerald-100 text-gray-700 hover:text-emerald-700 rounded-full text-sm font-medium transition-colors"
          >
            {procedure.name}
          </button>
        ))}
      </div>
    </div>
  );
}

