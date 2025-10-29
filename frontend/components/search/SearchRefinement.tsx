'use client';

/**
 * Search Refinement Component
 * 
 * Allows users to search within search results with highlighting
 */

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { highlightText } from '@/lib/search-utils';

interface SearchRefinementProps {
  onRefine: (query: string) => void;
  resultCount: number;
  searchTerms?: string[];
}

export function SearchRefinement({ 
  onRefine, 
  resultCount,
  searchTerms = []
}: SearchRefinementProps) {
  const [refinementQuery, setRefinementQuery] = useState('');

  const handleRefine = (query: string) => {
    setRefinementQuery(query);
    onRefine(query);
  };

  const handleClear = () => {
    setRefinementQuery('');
    onRefine('');
  };

  if (resultCount === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={refinementQuery}
          onChange={(e) => handleRefine(e.target.value)}
          placeholder={`Refine ${resultCount} results...`}
          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
        {refinementQuery && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
            aria-label="Clear refinement"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>
      {refinementQuery && (
        <p className="text-sm text-gray-600 mt-2">
          Refining search within your results...
        </p>
      )}
    </div>
  );
}

/**
 * Highlight search terms in text
 */
export function HighlightedText({ 
  text, 
  searchTerms 
}: { 
  text: string; 
  searchTerms: string[];
}) {
  if (!searchTerms || searchTerms.length === 0) {
    return <>{text}</>;
  }

  const highlightedHtml = highlightText(text, searchTerms);
  
  return (
    <span dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
  );
}

