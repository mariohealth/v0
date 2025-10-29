'use client';

/**
 * Compare Checkbox Component
 * 
 * Checkbox for selecting procedures for bulk comparison
 */

import { useState, useEffect } from 'react';

interface CompareCheckboxProps {
  procedureId: string;
  selectedIds: string[];
  maxSelection?: number;
  onToggle: (id: string, isSelected: boolean) => void;
  disabled?: boolean;
}

export function CompareCheckbox({
  procedureId,
  selectedIds,
  maxSelection = 5,
  onToggle,
  disabled = false,
}: CompareCheckboxProps) {
  const isSelected = selectedIds.includes(procedureId);
  const isMaxReached = selectedIds.length >= maxSelection && !isSelected;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || isMaxReached) {
      return;
    }
    onToggle(procedureId, e.target.checked);
  };

  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={handleChange}
        disabled={disabled || isMaxReached}
        className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={`Select ${procedureId} for comparison`}
      />
    </label>
  );
}

