'use client';

/**
 * Compare Bar Component
 * 
 * Sticky bar at bottom for comparing selected procedures
 * Shows selected count and compare button
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, GitCompare, CheckCircle2 } from 'lucide-react';

interface CompareBarProps {
    selectedItems: string[];
    maxSelection?: number;
    onClear: () => void;
    onRemove: (id: string) => void;
    items: Array<{
        id: string;
        name: string;
        category?: string;
    }>;
}

export function CompareBar({
    selectedItems,
    maxSelection = 5,
    onClear,
    onRemove,
    items
}: CompareBarProps) {
    const router = useRouter();
    const [selectedDetails, setSelectedDetails] = useState<Array<{ id: string; name: string }>>([]);

    useEffect(() => {
        // Get details for selected items
        const details = selectedItems
            .map(id => items.find(item => item.id === id))
            .filter(Boolean)
            .map(item => ({ id: item!.id, name: item!.name }));

        setSelectedDetails(details);
    }, [selectedItems, items]);

    const handleCompare = () => {
        if (selectedItems.length >= 2) {
            // Navigate to compare page with selected IDs
            const ids = selectedItems.join(',');
            router.push(`/compare?ids=${ids}`);
        }
    };

    if (selectedItems.length === 0) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
            <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                    {/* Selected Items */}
                    <div className="flex items-center gap-2 flex-1 overflow-x-auto">
                        <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                            {selectedItems.length} selected:
                        </span>
                        <div className="flex items-center gap-2 flex-1">
                            {selectedDetails.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm whitespace-nowrap"
                                >
                                    <span className="truncate max-w-[150px]">{item.name}</span>
                                    <button
                                        onClick={() => onRemove(item.id)}
                                        className="ml-1 hover:bg-emerald-200 rounded-full p-0.5 transition-colors"
                                        aria-label={`Remove ${item.name} from comparison`}
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onClear}
                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors whitespace-nowrap"
                        >
                            Clear ({selectedItems.length})
                        </button>

                        <button
                            onClick={handleCompare}
                            disabled={selectedItems.length < 2}
                            className={`px-6 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all whitespace-nowrap ${selectedItems.length >= 2
                                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            <GitCompare className="w-4 h-4" />
                            Compare {selectedItems.length >= 2 ? `(${selectedItems.length})` : '(min 2)'}
                        </button>
                    </div>
                </div>

                {/* Selection Limit Warning */}
                {selectedItems.length >= maxSelection && (
                    <div className="mt-2 text-xs text-orange-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Maximum {maxSelection} items can be compared
                    </div>
                )}
            </div>
        </div>
    );
}

