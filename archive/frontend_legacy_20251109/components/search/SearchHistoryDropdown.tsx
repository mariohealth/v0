'use client';

/**
 * Search History Dropdown Component
 * 
 * Shows recent searches when user focuses on search input
 */

import { useState, useEffect, useRef } from 'react';
import { History, X } from 'lucide-react';
import { getSearchHistory, removeHistoryItem, clearSearchHistory } from '@/lib/search-history';
import type { SearchHistoryItem } from '@/lib/search-history';

interface SearchHistoryDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (query: string, location?: string) => void;
}

export function SearchHistoryDropdown({ isOpen, onClose, onSelect }: SearchHistoryDropdownProps) {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setHistory(getSearchHistory());
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  const handleSelect = (item: SearchHistoryItem, index: number) => {
    onSelect(item.query, item.location);
    onClose();
  };

  const handleRemove = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    removeHistoryItem(index);
    setHistory(getSearchHistory());
  };

  const handleClearAll = () => {
    clearSearchHistory();
    setHistory([]);
  };

  if (!isOpen || history.length === 0) {
    return null;
  }

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-xl z-50"
    >
      <div className="p-2 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <History className="w-4 h-4" />
          <span>Recent Searches</span>
        </div>
        <button
          onClick={handleClearAll}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Clear all
        </button>
      </div>

      <div className="max-h-64 overflow-y-auto">
        {history.map((item, index) => (
          <div
            key={index}
            onClick={() => handleSelect(item, index)}
            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer group"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {item.query}
              </p>
              {item.location && (
                <p className="text-xs text-gray-500 truncate">
                  {item.location}
                </p>
              )}
            </div>
            <button
              onClick={(e) => handleRemove(index, e)}
              className="ml-2 p-1 hover:bg-gray-200 rounded transition-colors opacity-0 group-hover:opacity-100"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

