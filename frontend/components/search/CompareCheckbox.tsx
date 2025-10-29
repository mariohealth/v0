'use client';

/**
 * Compare Checkbox Component
 * 
 * Checkbox for selecting procedures to compare
 */

import { CheckSquare, Square } from 'lucide-react';

interface CompareCheckboxProps {
    procedureId: string;
    selectedIds: string[];
    onToggle: (id: string, isSelected: boolean) => void;
}

export function CompareCheckbox({
    procedureId,
    selectedIds,
    onToggle
}: CompareCheckboxProps) {
    const isSelected = selectedIds.includes(procedureId);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle(procedureId, isSelected);
    };

    return (
        <button
            onClick={handleClick}
            className={`p-2 rounded-lg transition-colors ${isSelected
                    ? 'bg-emerald-100 hover:bg-emerald-200'
                    : 'bg-white/90 hover:bg-gray-100 border border-gray-200'
                }`}
            aria-label={isSelected ? 'Remove from comparison' : 'Add to comparison'}
        >
            {isSelected ? (
                <CheckSquare className="w-5 h-5 text-emerald-600" />
            ) : (
                <Square className="w-5 h-5 text-gray-400" />
            )}
        </button>
    );
}
