'use client';

import Link from 'next/link';
import { Activity } from 'lucide-react';
import { type SearchResult } from '@/lib/api';

interface ProcedureCardProps {
    procedure: SearchResult;
}

export function ProcedureCard({ procedure }: ProcedureCardProps) {
    return (
        <Link
            href={`/procedures/${procedure.procedure_slug}`}
            className="block bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
            <div className="flex items-start justify-between mb-4">
                <Activity className="h-8 w-8 text-[#4DA1A9] flex-shrink-0" />
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#E9F6F5] text-[#2E5077]">
                    {procedure.category_name}
                </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{procedure.procedure_name}</h3>
            <p className="text-sm text-gray-600 mb-4">
                {procedure.family_name}
            </p>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs text-gray-500">Best Price</p>
                    <p className="text-lg font-bold text-[#2E5077]">
                        ${procedure.best_price || 'N/A'}
                    </p>
                    {procedure.price_range && (
                        <p className="text-xs text-gray-500 mt-1">{procedure.price_range}</p>
                    )}
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500">Providers</p>
                    <p className="text-sm font-medium text-gray-900">
                        {procedure.provider_count || 0}+
                    </p>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
                <span className="text-sm font-medium text-[#4DA1A9]">View Prices →</span>
            </div>
        </Link>
    );
}

