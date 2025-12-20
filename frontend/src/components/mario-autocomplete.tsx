'use client'
import { motion, AnimatePresence } from 'motion/react';
import { Search, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface AutocompleteSuggestion {
  id: string;
  primaryText: string;
  secondaryText: string;
  category: 'procedure';
}

interface MarioAutocompleteProps {
  suggestions: AutocompleteSuggestion[];
  onSelect: (suggestion: AutocompleteSuggestion) => void;
  isVisible: boolean;
  query: string;
  selectedIndex?: number;
  onKeyboardNavigation?: (direction: 'up' | 'down' | 'enter' | 'escape') => void;
}

export function MarioAutocomplete({
  suggestions,
  onSelect,
  isVisible,
  query,
  selectedIndex = -1,
  onKeyboardNavigation
}: MarioAutocompleteProps) {
  if (!isVisible) return null;

  // Show "No results" if query exists but no suggestions
  const showNoResults = query.length >= 2 && suggestions.length === 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.15 }}
        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-[#E0E0E0] overflow-hidden z-50"
        style={{
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          maxHeight: '288px' // 6 items × 48px
        }}
      >
        {showNoResults ? (
          <div className="px-4 py-3 flex items-center gap-3" style={{ height: '48px' }}>
            <AlertCircle className="h-4 w-4" style={{ color: '#666666' }} />
            <p className="text-sm" style={{ color: '#666666' }}>
              No results found. Try another keyword.
            </p>
          </div>
        ) : (
          <div
            className="overflow-y-auto"
            style={{
              maxHeight: '288px'
            }}
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion.id}
                onClick={() => onSelect(suggestion)}
                className="w-full px-4 py-3 text-left transition-colors flex items-start gap-3"
                style={{
                  height: '48px',
                  backgroundColor: selectedIndex === index
                    ? '#F3F4F6'
                    : 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F9FAFB';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = selectedIndex === index
                    ? '#F3F4F6'
                    : 'transparent';
                }}
              >
                <div className="flex-1">
                  <p
                    className="text-sm leading-tight mb-0.5"
                    style={{
                      color: '#1A1A1A',
                      fontSize: '14px',
                      fontFamily: 'Inter'
                    }}
                  >
                    {suggestion.primaryText}
                  </p>
                  <p
                    className="text-xs"
                    style={{
                      color: '#666666',
                      fontSize: '12px',
                      fontFamily: 'Inter'
                    }}
                  >
                    {suggestion.secondaryText}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// Mock autocomplete suggestions data - PROCEDURES ONLY
export const getAutocompleteSuggestions = (query: string): AutocompleteSuggestion[] => {
  const allSuggestions: AutocompleteSuggestion[] = [
    {
      id: 'complete-blood-cell-count-blood-test',
      primaryText: 'Blood Test – CBC (Complete Blood Count)',
      secondaryText: 'Lab Test',
      category: 'procedure'
    },
    {
      id: 'comprehensive-metabolic-panel-blood-test',
      primaryText: 'Blood Test – CMP (Comprehensive Metabolic)',
      secondaryText: 'Lab Test',
      category: 'procedure'
    },
    {
      id: 'lipid-panel-blood-test',
      primaryText: 'Blood Test – Lipid Panel',
      secondaryText: 'Lab Test',
      category: 'procedure'
    },
    {
      id: 'tsh-blood-test',
      primaryText: 'Thyroid Panel (TSH)',
      secondaryText: 'Lab Test',
      category: 'procedure'
    },
    {
      id: 'hemoglobin-a1c-blood-test',
      primaryText: 'HbA1C (Diabetes Screening)',
      secondaryText: 'Lab Test',
      category: 'procedure'
    },
    {
      id: 'leg-joint-mri',
      primaryText: 'MRI - Knee (Leg Joint)',
      secondaryText: 'Imaging',
      category: 'procedure'
    },
    {
      id: 'brain-mri',
      primaryText: 'MRI - Brain',
      secondaryText: 'Imaging',
      category: 'procedure'
    },
    {
      id: 'chest-x-ray',
      primaryText: 'X-Ray - Chest',
      secondaryText: 'Imaging',
      category: 'procedure'
    },
    {
      id: 'lower-spine-x-ray',
      primaryText: 'X-Ray - Spine (Lower)',
      secondaryText: 'Imaging',
      category: 'procedure'
    },
    {
      id: 'chest-ct-scan',
      primaryText: 'CT Scan - Chest',
      secondaryText: 'Imaging',
      category: 'procedure'
    },
    {
      id: 'abdomen-ultrasound',
      primaryText: 'Ultrasound - Abdominal',
      secondaryText: 'Imaging',
      category: 'procedure'
    },
    {
      id: 'pregnancy-ultrasound',
      primaryText: 'Ultrasound - Pregnancy',
      secondaryText: 'Imaging',
      category: 'procedure'
    },
    {
      id: 'colonoscopy-diagnostic',
      primaryText: 'Colonoscopy',
      secondaryText: 'Procedure',
      category: 'procedure'
    },
    {
      id: 'mammogram-screening',
      primaryText: 'Mammogram',
      secondaryText: 'Imaging',
      category: 'procedure'
    },
    {
      id: 'bone-density-dxa',
      primaryText: 'Bone Density Scan (DXA)',
      secondaryText: 'Imaging',
      category: 'procedure'
    },
    {
      id: 'brain-stem-mri',
      primaryText: 'MRI - Brain Stem',
      secondaryText: 'Imaging',
      category: 'procedure'
    },
    {
      id: 'brain-intracranial-mri',
      primaryText: 'MRI - Brain (Intracranial)',
      secondaryText: 'Imaging',
      category: 'procedure'
    }
  ];

  if (!query || query.trim().length < 2) {
    return [];
  }

  const lowerQuery = query.toLowerCase().trim();
  const queryTerms = lowerQuery.split(/\s+/);

  return allSuggestions
    .filter(suggestion => {
      const text = suggestion.primaryText.toLowerCase();
      // Match if all terms in the query are present in the primary text
      return queryTerms.every(term => text.includes(term));
    })
    .slice(0, 6); // Max 6 suggestions
};