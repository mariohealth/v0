'use client';

/**
 * Bulk Compare Bar Component
 * 
 * Sticky bottom bar for comparing selected procedures
 * Shows selection count and compare button
 */

import { useState, useEffect } from 'react';
import { X, Compare } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BulkCompareBarProps {
  selectedIds: string[];
  maxSelection?: number;
  onClearSelection: () => void;
  onCompare: (ids: string[]) => void;
}

const MAX_SELECTION = 5;

export function BulkCompareBar({
  selectedIds,
  maxSelection = MAX_SELECTION,
  onClearSelection,
  onCompare,
}: BulkCompareBarProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(selectedIds.length > 0);
  }, [selectedIds.length]);

  if (!isVisible || selectedIds.length === 0) {
    return null;
  }

  const handleCompare = () => {
    if (selectedIds.length >= 2) {
      onCompare(selectedIds);
      // Navigate to compare page
      router.push(`/compare?ids=${selectedIds.join(',')}`);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onClearSelection}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Clear selection"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {selectedIds.length} procedure{selectedIds.length !== 1 ? 's' : ''} selected
            </p>
            {selectedIds.length < maxSelection && (
              <p className="text-xs text-gray-500">
                Select up to {maxSelection} to compare
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {selectedIds.length < 2 && (
            <p className="text-sm text-gray-500">
              Select at least 2 procedures to compare
            </p>
          )}
          <button
            onClick={handleCompare}
            disabled={selectedIds.length < 2}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
          >
            <Compare className="w-5 h-5" />
            Compare {selectedIds.length >= 2 ? `(${selectedIds.length})` : ''}
          </button>
        </div>
      </div>
    </div>
  );
}

