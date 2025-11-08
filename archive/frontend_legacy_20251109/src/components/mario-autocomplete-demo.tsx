'use client'
import { useState } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { MarioAutocompleteEnhanced, getEnhancedAutocompleteSuggestions, type AutocompleteSuggestion } from './mario-autocomplete-enhanced';
import { Button } from './ui/button';

interface MarioAutocompleteDemoProps {
  onBack?: () => void;
}

export function MarioAutocompleteDemo({ onBack }: MarioAutocompleteDemoProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedResult, setSelectedResult] = useState<AutocompleteSuggestion | null>(null);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setSelectedIndex(-1);
    
    if (value.trim().length >= 2) {
      const results = getEnhancedAutocompleteSuggestions(value);
      setSuggestions(results);
      setShowDropdown(true);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  const handleSelectSuggestion = (suggestion: AutocompleteSuggestion) => {
    setSearchQuery('');
    setSuggestions([]);
    setShowDropdown(false);
    setSelectedResult(suggestion);
    
    console.log('Selected:', suggestion);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelectSuggestion(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <div 
        className="sticky top-0 z-50 bg-white"
        style={{ 
          borderBottom: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        }}
      >
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 rounded-full mario-transition hover:bg-gray-100 mario-focus-ring"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5" style={{ color: '#2E5077' }} />
              </button>
            )}
            <div>
              <h1 
                style={{ 
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#2E5077',
                  marginBottom: '4px'
                }}
              >
                Search Autocomplete Demo
              </h1>
              <p style={{ fontSize: '14px', color: '#6B7280' }}>
                Doctors + Specialties
              </p>
            </div>
          </div>

          {/* Search Bar with Autocomplete */}
          <div className="relative">
            <div className="relative">
              <Search 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" 
                style={{ color: '#6B7280' }}
              />
              <input
                type="text"
                placeholder="Search doctors or specialties..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => {
                  if (searchQuery.trim().length >= 2) {
                    setShowDropdown(true);
                  }
                }}
                onKeyDown={handleKeyDown}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-[#E5E7EB] mario-transition focus:outline-none focus:ring-2 focus:ring-[#4DA1A9] focus:border-transparent"
                style={{
                  fontSize: '16px',
                  fontFamily: 'Inter',
                  backgroundColor: 'white'
                }}
              />
            </div>

            {/* Autocomplete Dropdown */}
            <MarioAutocompleteEnhanced
              suggestions={suggestions}
              onSelect={handleSelectSuggestion}
              isVisible={showDropdown}
              query={searchQuery}
              selectedIndex={selectedIndex}
            />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Instructions */}
        <div 
          className="p-4 rounded-2xl mb-6"
          style={{ 
            backgroundColor: 'rgba(77, 161, 169, 0.12)',
            border: '1px solid #E5E7EB'
          }}
        >
          <h2 
            style={{ 
              fontSize: '16px',
              fontWeight: '600',
              color: '#2E5077',
              marginBottom: '8px'
            }}
          >
            How to use:
          </h2>
          <ul className="space-y-2" style={{ fontSize: '14px', color: '#374151' }}>
            <li>• Type at least 2 characters to see suggestions</li>
            <li>• Try searching: "Dr. Sarah", "Johnson", "Cardiology", "Derma"</li>
            <li>• Use arrow keys to navigate, Enter to select</li>
            <li>• Doctor results show hospital names</li>
            <li>• Specialty results show specialty names only</li>
          </ul>
        </div>

        {/* Selected Result Display */}
        {selectedResult && (
          <div 
            className="p-6 rounded-2xl"
            style={{ 
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div 
                  className="inline-block px-3 py-1 rounded-full mb-3"
                  style={{ 
                    backgroundColor: selectedResult.type === 'doctor' 
                      ? 'rgba(77, 161, 169, 0.12)' 
                      : 'rgba(121, 215, 190, 0.12)',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#2E5077'
                  }}
                >
                  {selectedResult.type === 'doctor' ? 'DOCTOR' : 'SPECIALTY'}
                </div>
                <h3 
                  style={{ 
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#2E5077',
                    marginBottom: '4px'
                  }}
                >
                  {selectedResult.primaryText}
                </h3>
                {selectedResult.secondaryText && (
                  <p style={{ fontSize: '16px', color: '#6B7280' }}>
                    {selectedResult.secondaryText}
                  </p>
                )}
              </div>
              <Button
                onClick={() => setSelectedResult(null)}
                variant="outline"
                style={{
                  borderColor: '#E5E7EB',
                  color: '#6B7280',
                  borderRadius: '12px'
                }}
              >
                Clear
              </Button>
            </div>

            {/* Doctor Details */}
            {selectedResult.doctor && (
              <div className="space-y-3 pt-4 border-t" style={{ borderColor: '#E5E7EB' }}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div 
                      style={{ 
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#6B7280',
                        marginBottom: '4px'
                      }}
                    >
                      SPECIALTY
                    </div>
                    <div style={{ fontSize: '14px', color: '#1A1A1A' }}>
                      {selectedResult.doctor.specialty}
                    </div>
                  </div>
                  <div>
                    <div 
                      style={{ 
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#6B7280',
                        marginBottom: '4px'
                      }}
                    >
                      NETWORK
                    </div>
                    <div style={{ fontSize: '14px', color: '#1A1A1A' }}>
                      {selectedResult.doctor.network}
                    </div>
                  </div>
                  <div>
                    <div 
                      style={{ 
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#6B7280',
                        marginBottom: '4px'
                      }}
                    >
                      PRICE
                    </div>
                    <div style={{ fontSize: '14px', color: '#1A1A1A' }}>
                      {selectedResult.doctor.price}
                    </div>
                  </div>
                  <div>
                    <div 
                      style={{ 
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#6B7280',
                        marginBottom: '4px'
                      }}
                    >
                      DISTANCE
                    </div>
                    <div style={{ fontSize: '14px', color: '#1A1A1A' }}>
                      {selectedResult.doctor.distance}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Specialty Details */}
            {selectedResult.specialty && (
              <div className="space-y-3 pt-4 border-t" style={{ borderColor: '#E5E7EB' }}>
                <div>
                  <div 
                    style={{ 
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#6B7280',
                      marginBottom: '4px'
                    }}
                  >
                    DESCRIPTION
                  </div>
                  <div style={{ fontSize: '14px', color: '#1A1A1A', lineHeight: '1.5' }}>
                    {selectedResult.specialty.description}
                  </div>
                </div>
                <div>
                  <div 
                    style={{ 
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#6B7280',
                      marginBottom: '4px'
                    }}
                  >
                    AVAILABLE DOCTORS
                  </div>
                  <div style={{ fontSize: '14px', color: '#1A1A1A' }}>
                    {selectedResult.specialty.doctorCount} doctors in network
                  </div>
                </div>
              </div>
            )}

            {/* Action Button */}
            <Button
              className="w-full mt-6"
              style={{
                backgroundColor: '#2E5077',
                color: 'white',
                borderRadius: '12px',
                height: '44px'
              }}
              onClick={() => {
                if (selectedResult.type === 'doctor') {
                  console.log('Opening doctor detail page:', selectedResult.doctor);
                } else {
                  console.log('Opening specialty page:', selectedResult.specialty);
                }
              }}
            >
              {selectedResult.type === 'doctor' ? 'View Doctor Profile' : 'Browse Doctors'}
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!selectedResult && (
          <div 
            className="p-12 rounded-2xl text-center"
            style={{ 
              backgroundColor: 'white',
              border: '1px solid #E5E7EB'
            }}
          >
            <Search 
              className="w-12 h-12 mx-auto mb-4" 
              style={{ color: '#D1D5DB' }} 
            />
            <p style={{ fontSize: '16px', color: '#6B7280' }}>
              Start typing to see autocomplete suggestions
            </p>
          </div>
        )}

        {/* Specifications */}
        <div 
          className="mt-6 p-6 rounded-2xl"
          style={{ 
            backgroundColor: 'white',
            border: '1px solid #E5E7EB'
          }}
        >
          <h3 
            style={{ 
              fontSize: '16px',
              fontWeight: '600',
              color: '#2E5077',
              marginBottom: '16px'
            }}
          >
            Design Specifications
          </h3>
          <div className="space-y-3" style={{ fontSize: '14px', color: '#374151' }}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span style={{ fontWeight: '600' }}>Container Width:</span>
                <br />Mobile: 360px, Desktop: 480px
              </div>
              <div>
                <span style={{ fontWeight: '600' }}>Row Height:</span>
                <br />48px
              </div>
              <div>
                <span style={{ fontWeight: '600' }}>Max Visible:</span>
                <br />6 options (288px total)
              </div>
              <div>
                <span style={{ fontWeight: '600' }}>Padding:</span>
                <br />12px horizontal
              </div>
              <div>
                <span style={{ fontWeight: '600' }}>Hover State:</span>
                <br />#F9F9F9
              </div>
              <div>
                <span style={{ fontWeight: '600' }}>Selected State:</span>
                <br />rgba(77, 161, 169, 0.12)
              </div>
            </div>
            <div className="pt-3 border-t" style={{ borderColor: '#E5E7EB' }}>
              <span style={{ fontWeight: '600' }}>Features:</span>
              <ul className="mt-2 space-y-1 ml-4">
                <li>• Gender-neutral User icon for doctors</li>
                <li>• Activity/Heart Pulse icon for specialties</li>
                <li>• Doctor results show hospital subtext</li>
                <li>• Specialty results show name only</li>
                <li>• Divider between sections (#E0E0E0)</li>
                <li>• Empty state with SearchSlash icon</li>
                <li>• Keyboard navigation support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
