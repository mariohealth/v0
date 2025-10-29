'use client';

/**
 * Bulk Compare Bar Component
 * 
 * Sticky bar at bottom for comparing selected procedures
 * Similar to CompareBar but with simplified interface
 */

import { useRouter } from 'next/navigation';
import { X, GitCompare } from 'lucide-react';

interface BulkCompareBarProps {
  selectedIds: string[];
  maxSelection?: number;
  onClearSelection: () => void;
  onCompare: (ids: string[]) => void;
}

export function BulkCompareBar({ 
  selectedIds, 
  maxSelection = 5,
  onClearSelection,
  onCompare
}: BulkCompareBarProps) {
  const router = useRouter();

  const handleCompare = () => {
    if (selectedIds.length >= 2 && selectedIds.length <= maxSelection) {
      // Navigate to compare page with selected IDs
      const ids = selectedIds.join(',');
      router.push(`/compare?ids=${ids}`);
    }
  };

  if (selectedIds.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Selected Count */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">
              {selectedIds.length} procedure{selectedIds.length !== 1 ? 's' : ''} selected
            </span>
            {selectedIds.length >= maxSelection && (
              <span className="text-xs text-orange-600">
                (Max {maxSelection})
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onClearSelection}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors whitespace-nowrap"
            >
              Clear
            </button>
            
            <button
              onClick={handleCompare}
              disabled={selectedIds.length < 2 || selectedIds.length > maxSelection}
              className={`px-6 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
                selectedIds.length >= 2 && selectedIds.length <= maxSelection
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <GitCompare className="w-4 h-4" />
              Compare {selectedIds.length >= 2 && selectedIds.length <= maxSelection ? `(${selectedIds.length})` : `(need 2-${maxSelection})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
