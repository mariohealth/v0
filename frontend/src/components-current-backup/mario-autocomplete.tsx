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
      id: 'blood-test-basic',
      primaryText: 'Blood Test – Basic Panel',
      secondaryText: 'Procedure',
      category: 'procedure'
    },
    {
      id: 'blood-test-comprehensive',
      primaryText: 'Blood Test – Comprehensive Metabolic',
      secondaryText: 'Procedure',
      category: 'procedure'
    },
    {
      id: 'blood-pressure-check',
      primaryText: 'Blood Pressure Monitoring',
      secondaryText: 'Procedure',
      category: 'procedure'
    },
    {
      id: 'blood-glucose',
      primaryText: 'Blood Glucose Testing',
      secondaryText: 'Procedure',
      category: 'procedure'
    },
    {
      id: 'vitamin-d-screening',
      primaryText: 'Vitamin D Screening',
      secondaryText: 'Procedure',
      category: 'procedure'
    },
    {
      id: 'cholesterol-panel',
      primaryText: 'Cholesterol Panel',
      secondaryText: 'Procedure',
      category: 'procedure'
    },
    {
      id: 'mri-knee',
      primaryText: 'MRI Knee',
      secondaryText: 'Procedure',
      category: 'procedure'
    },
    {
      id: 'mri-brain',
      primaryText: 'MRI Brain',
      secondaryText: 'Procedure',
      category: 'procedure'
    },
    {
      id: 'xray-chest',
      primaryText: 'X-Ray Chest',
      secondaryText: 'Procedure',
      category: 'procedure'
    },
    {
      id: 'xray-knee',
      primaryText: 'X-Ray Knee',
      secondaryText: 'Procedure',
      category: 'procedure'
    },
    {
      id: 'ct-scan-abdomen',
      primaryText: 'CT Scan – Abdomen',
      secondaryText: 'Procedure',
      category: 'procedure'
    },
    {
      id: 'ct-scan-chest',
      primaryText: 'CT Scan – Chest',
      secondaryText: 'Procedure',
      category: 'procedure'
    },
    {
      id: 'ultrasound-pregnancy',
      primaryText: 'Ultrasound – Pregnancy',
      secondaryText: 'Procedure',
      category: 'procedure'
    },
    {
      id: 'ultrasound-abdominal',
      primaryText: 'Ultrasound – Abdominal',
      secondaryText: 'Procedure',
      category: 'procedure'
    },
    {
      id: 'physical-exam',
      primaryText: 'Physical Exam – Annual',
      secondaryText: 'Procedure',
      category: 'procedure'
    },
    {
      id: 'dental-cleaning',
      primaryText: 'Dental Cleaning',
      secondaryText: 'Procedure',
      category: 'procedure'
    },
    {
      id: 'mammogram',
      primaryText: 'Mammogram',
      secondaryText: 'Procedure',
      category: 'procedure'
    },
    {
      id: 'colonoscopy',
      primaryText: 'Colonoscopy',
      secondaryText: 'Procedure',
      category: 'procedure'
    },
    {
      id: 'ecg',
      primaryText: 'ECG (Electrocardiogram)',
      secondaryText: 'Procedure',
      category: 'procedure'
    },
    {
      id: 'stress-test',
      primaryText: 'Cardiac Stress Test',
      secondaryText: 'Procedure',
      category: 'procedure'
    },
    {
      id: 'allergy-test',
      primaryText: 'Allergy Testing',
      secondaryText: 'Procedure',
      category: 'procedure'
    },
    {
      id: 'bone-density',
      primaryText: 'Bone Density Scan',
      secondaryText: 'Procedure',
      category: 'procedure'
    },
    {
      id: 'thyroid-test',
      primaryText: 'Thyroid Function Test',
      secondaryText: 'Procedure',
      category: 'procedure'
    },
    {
      id: 'liver-function',
      primaryText: 'Liver Function Test',
      secondaryText: 'Procedure',
      category: 'procedure'
    }
  ];

  if (!query || query.trim().length < 2) {
    return [];
  }

  const lowerQuery = query.toLowerCase().trim();
  
  return allSuggestions
    .filter(
      suggestion =>
        suggestion.primaryText.toLowerCase().includes(lowerQuery)
    )
    .slice(0, 6); // Max 6 suggestions
};