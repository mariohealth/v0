'use client'
import { motion, AnimatePresence } from 'motion/react';
import { User, Activity, SearchSlash, Building2, Pill } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { doctors, specialties, hospitals, Doctor, Specialty, HospitalInfo } from '@/lib/data/mario-doctors-data';
import { searchMedications, type MedicationData } from '@/lib/data/mario-medication-data';
import { getSpecialties, type Specialty as APISpecialty, type SearchResponse } from '@/lib/api';

export type AutocompleteCategory = 'doctor' | 'specialty' | 'hospital' | 'medication' | 'procedure';

export interface AutocompleteSuggestion {
  id: string;
  type: AutocompleteCategory;
  primaryText: string;
  secondaryText?: string;
  doctor?: Doctor;
  specialty?: Specialty;
  hospital?: HospitalInfo;
  medication?: MedicationData;
  procedureSlug?: string;
  specialtyId?: string;
}

interface MarioAutocompleteEnhancedProps {
  suggestions: AutocompleteSuggestion[];
  onSelect: (suggestion: AutocompleteSuggestion) => void;
  isVisible: boolean;
  query: string;
  selectedIndex?: number;
  onKeyboardNavigation?: (direction: 'up' | 'down' | 'enter' | 'escape') => void;
}

export function MarioAutocompleteEnhanced({ 
  suggestions, 
  onSelect, 
  isVisible, 
  query,
  selectedIndex = -1,
  onKeyboardNavigation
}: MarioAutocompleteEnhancedProps) {
  const router = useRouter();
  const [isDesktop, setIsDesktop] = React.useState(window.innerWidth >= 768);
  
  // Handle selection with routing based on type
  const handleSelect = (suggestion: AutocompleteSuggestion) => {
    // Check if this is a procedure result from API (has procedureSlug)
    if (suggestion.procedureSlug) {
      router.push(`/procedures/${suggestion.procedureSlug}`);
      return;
    }
    
    // Check if this is a specialty result from API (has specialtyId and type is 'specialty')
    if (suggestion.type === 'specialty' && suggestion.specialtyId) {
      router.push(`/specialties/${suggestion.specialtyId}`);
      return;
    }
    
    // For all other cases, use the original onSelect handler
    onSelect(suggestion);
  };

  React.useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isVisible) return null;

  // Show "No results" if query exists but no suggestions
  const showNoResults = query.length >= 2 && suggestions.length === 0;

  // Group suggestions by type
  const doctorSuggestions = suggestions.filter(s => s.type === 'doctor');
  const specialtySuggestions = suggestions.filter(s => s.type === 'specialty');
  const procedureSuggestions = suggestions.filter(s => s.type === 'procedure');
  const hospitalSuggestions = suggestions.filter(s => s.type === 'hospital');
  const medicationSuggestions = suggestions.filter(s => s.type === 'medication');

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
          maxHeight: '288px', // 6 items × 48px
          width: isDesktop ? '480px' : '360px',
          maxWidth: '100%'
        }}
      >
        {showNoResults ? (
          <div 
            className="px-3 py-3 flex items-center justify-center gap-3" 
            style={{ height: '48px' }}
          >
            <SearchSlash className="h-4 w-4" style={{ color: '#666666' }} />
            <p 
              className="text-sm" 
              style={{ 
                color: '#666666',
                fontSize: '14px',
                fontFamily: 'Inter'
              }}
            >
              Try a different name or specialty.
            </p>
          </div>
        ) : (
          <div 
            className="overflow-y-auto"
            style={{
              maxHeight: '288px'
            }}
          >
            {/* Doctor Results */}
            {doctorSuggestions.length > 0 && (
              <>
                {doctorSuggestions.map((suggestion, index) => (
                  <button
                    key={suggestion.id}
                    onClick={() => onSelect(suggestion)}
                    className="w-full px-3 py-2 text-left transition-colors flex items-center gap-3"
                    style={{
                      height: '48px',
                      backgroundColor: selectedIndex === index 
                        ? 'rgba(77, 161, 169, 0.12)' 
                        : 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedIndex !== index) {
                        e.currentTarget.style.backgroundColor = '#F9F9F9';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = selectedIndex === index 
                        ? 'rgba(77, 161, 169, 0.12)' 
                        : 'transparent';
                    }}
                  >
                    <div 
                      className="flex-shrink-0 flex items-center justify-center"
                      style={{ width: '24px', height: '24px' }}
                    >
                      <User className="w-5 h-5" style={{ color: '#2E5077' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p 
                        className="leading-tight mb-0 truncate"
                        style={{ 
                          color: '#1A1A1A',
                          fontSize: '16px',
                          fontWeight: '600',
                          fontFamily: 'Inter'
                        }}
                      >
                        {suggestion.primaryText}
                      </p>
                      {suggestion.secondaryText && (
                        <p 
                          className="truncate"
                          style={{ 
                            color: '#666666',
                            fontSize: '14px',
                            fontFamily: 'Inter',
                            lineHeight: '1.2'
                          }}
                        >
                          {suggestion.secondaryText}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
                
                {/* Divider if there are specialty results too */}
                {specialtySuggestions.length > 0 && (
                  <div 
                    className="w-full" 
                    style={{ 
                      height: '1px', 
                      backgroundColor: '#E0E0E0',
                      margin: '0'
                    }} 
                  />
                )}
              </>
            )}

            {/* Specialty Results */}
            {specialtySuggestions.length > 0 && (
              <>
                {specialtySuggestions.map((suggestion, index) => {
                  const globalIndex = doctorSuggestions.length + index;
                  
                  return (
                    <button
                      key={suggestion.id}
                      onClick={() => handleSelect(suggestion)}
                      className="w-full px-3 py-2 text-left transition-colors flex items-center gap-3"
                      style={{
                        height: '48px',
                        backgroundColor: selectedIndex === globalIndex 
                          ? 'rgba(77, 161, 169, 0.12)' 
                          : 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedIndex !== globalIndex) {
                          e.currentTarget.style.backgroundColor = '#F9F9F9';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = selectedIndex === globalIndex 
                          ? 'rgba(77, 161, 169, 0.12)' 
                          : 'transparent';
                      }}
                    >
                      <div 
                        className="flex-shrink-0 flex items-center justify-center"
                        style={{ width: '24px', height: '24px' }}
                      >
                        <Activity className="w-5 h-5" style={{ color: '#2E5077' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p 
                          className="leading-tight mb-0 truncate"
                          style={{ 
                            color: '#1A1A1A',
                            fontSize: '16px',
                            fontWeight: '600',
                            fontFamily: 'Inter'
                          }}
                        >
                          {suggestion.primaryText}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </>
            )}

            {/* Procedure Results */}
            {procedureSuggestions.length > 0 && (
              <>
                {procedureSuggestions.map((suggestion, index) => {
                  const globalIndex = doctorSuggestions.length + specialtySuggestions.length + index;
                  
                  return (
                    <button
                      key={suggestion.id}
                      onClick={() => handleSelect(suggestion)}
                      className="w-full px-3 py-2 text-left transition-colors flex items-center gap-3"
                      style={{
                        height: '48px',
                        backgroundColor: selectedIndex === globalIndex 
                          ? 'rgba(77, 161, 169, 0.12)' 
                          : 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedIndex !== globalIndex) {
                          e.currentTarget.style.backgroundColor = '#F9F9F9';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = selectedIndex === globalIndex 
                          ? 'rgba(77, 161, 169, 0.12)' 
                          : 'transparent';
                      }}
                    >
                      <div 
                        className="flex-shrink-0 flex items-center justify-center"
                        style={{ width: '24px', height: '24px' }}
                      >
                        <Activity className="w-5 h-5" style={{ color: '#2E5077' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p 
                          className="leading-tight mb-0 truncate"
                          style={{ 
                            color: '#1A1A1A',
                            fontSize: '16px',
                            fontWeight: '600',
                            fontFamily: 'Inter'
                          }}
                        >
                          {suggestion.primaryText}
                        </p>
                        {suggestion.secondaryText && (
                          <p 
                            className="truncate"
                            style={{ 
                              color: '#666666',
                              fontSize: '14px',
                              fontFamily: 'Inter',
                              lineHeight: '1.2'
                            }}
                          >
                            {suggestion.secondaryText}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </>
            )}

            {/* Hospital Results */}
            {hospitalSuggestions.length > 0 && (
              <>
                {hospitalSuggestions.map((suggestion, index) => {
                  const globalIndex = doctorSuggestions.length + specialtySuggestions.length + procedureSuggestions.length + index;
                  
                  return (
                    <button
                      key={suggestion.id}
                      onClick={() => handleSelect(suggestion)}
                      className="w-full px-3 py-2 text-left transition-colors flex items-center gap-3"
                      style={{
                        height: '48px',
                        backgroundColor: selectedIndex === globalIndex 
                          ? 'rgba(77, 161, 169, 0.12)' 
                          : 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedIndex !== globalIndex) {
                          e.currentTarget.style.backgroundColor = '#F9F9F9';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = selectedIndex === globalIndex 
                          ? 'rgba(77, 161, 169, 0.12)' 
                          : 'transparent';
                      }}
                    >
                      <div 
                        className="flex-shrink-0 flex items-center justify-center"
                        style={{ width: '24px', height: '24px' }}
                      >
                        <Building2 className="w-5 h-5" style={{ color: '#2E5077' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p 
                          className="leading-tight mb-0 truncate"
                          style={{ 
                            color: '#1A1A1A',
                            fontSize: '16px',
                            fontWeight: '600',
                            fontFamily: 'Inter'
                          }}
                        >
                          {suggestion.primaryText}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </>
            )}

            {/* Medication Results */}
            {medicationSuggestions.length > 0 && (
              <>
                {medicationSuggestions.map((suggestion, index) => {
                  const globalIndex = doctorSuggestions.length + specialtySuggestions.length + procedureSuggestions.length + hospitalSuggestions.length + index;
                  
                  return (
                    <button
                      key={suggestion.id}
                      onClick={() => handleSelect(suggestion)}
                      className="w-full px-3 py-2 text-left transition-colors flex items-center gap-3"
                      style={{
                        height: '48px',
                        backgroundColor: selectedIndex === globalIndex 
                          ? 'rgba(77, 161, 169, 0.12)' 
                          : 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedIndex !== globalIndex) {
                          e.currentTarget.style.backgroundColor = '#F9F9F9';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = selectedIndex === globalIndex 
                          ? 'rgba(77, 161, 169, 0.12)' 
                          : 'transparent';
                      }}
                    >
                      <div 
                        className="flex-shrink-0 flex items-center justify-center"
                        style={{ width: '24px', height: '24px' }}
                      >
                        <Pill className="w-5 h-5" style={{ color: '#2E5077' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p 
                          className="leading-tight mb-0 truncate"
                          style={{ 
                            color: '#1A1A1A',
                            fontSize: '16px',
                            fontWeight: '600',
                            fontFamily: 'Inter'
                          }}
                        >
                          {suggestion.primaryText}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// Search function for doctors and specialties
export const getEnhancedAutocompleteSuggestions = (query: string): AutocompleteSuggestion[] => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const lowerQuery = query.toLowerCase().trim();
  const results: AutocompleteSuggestion[] = [];

  // Search doctors
  const matchedDoctors = doctors
    .filter(doctor => 
      doctor.name.toLowerCase().includes(lowerQuery)
    )
    .slice(0, 3) // Max 3 doctors
    .map(doctor => ({
      id: doctor.id,
      type: 'doctor' as AutocompleteCategory,
      primaryText: doctor.name,
      secondaryText: getHospitalForDoctor(doctor),
      doctor: doctor
    }));

  results.push(...matchedDoctors);

  // Search specialties (top 25 alphabetically)
  const matchedSpecialties = specialties
    .filter(specialty =>
      specialty.name.toLowerCase().includes(lowerQuery)
    )
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 25)
    .map(specialty => ({
      id: specialty.id,
      type: 'specialty' as AutocompleteCategory,
      primaryText: specialty.name,
      specialty: specialty
    }));

  results.push(...matchedSpecialties);

  // Search hospitals (top 25 alphabetically)
  const matchedHospitals = Object.values(hospitals)
    .filter(hospital =>
      hospital.name.toLowerCase().includes(lowerQuery)
    )
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 25)
    .map(hospital => ({
      id: hospital.id,
      type: 'hospital' as AutocompleteCategory,
      primaryText: hospital.name,
      hospital: hospital
    }));

  results.push(...matchedHospitals);

  // Search medications (top 25 alphabetically)
  const matchedMedications = searchMedications(lowerQuery)
    .slice(0, 25)
    .map(medication => ({
      id: medication.id || medication.name,
      type: 'medication' as AutocompleteCategory,
      primaryText: medication.name,
      medication: medication
    }));

  results.push(...matchedMedications);

  // Limit to 6 total results
  return results.slice(0, 6);
};

// Helper function to get hospital name for a doctor
function getHospitalForDoctor(doctor: Doctor): string {
  // Map specialties to hospitals (mock data)
  const hospitalMap: Record<string, string> = {
    'Primary Care': 'UCSF Medical Center',
    'Pediatrics': 'Stanford Children\'s Hospital',
    'Cardiology': 'Mayo Clinic',
    'Dermatology': 'Johns Hopkins Hospital',
    'Orthopedics': 'Cleveland Clinic',
    'Endocrinology': 'Massachusetts General Hospital',
    'Gastroenterology': 'Cedars-Sinai Medical Center',
    'Neurology': 'NYU Langone Health',
    'Psychiatry': 'McLean Hospital',
    'Pulmonology': 'National Jewish Health',
    'Allergy & Immunology': 'Mount Sinai Hospital',
    'OB/GYN': 'Northwestern Memorial Hospital'
  };

  return hospitalMap[doctor.specialty] || 'Regional Medical Center';
}

// Export React for use in component
import React from 'react';

// Module-level cache for specialties (fetched once)
let cachedSpecialties: APISpecialty[] | null = null;
let specialtiesFetchPromise: Promise<APISpecialty[]> | null = null;

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mario-health-api-gateway-x5pghxd.uc.gateway.dev';

/**
 * Get search results from the /search endpoint
 * This calls the real API endpoint that returns procedure results
 */
async function getSearchResults(query: string): Promise<SearchResponse> {
  const params = new URLSearchParams({
    q: query,
  });

  const url = `${API_BASE_URL}/api/v1/search?${params.toString()}`;

  try {
    // Public endpoint - use plain fetch (no headers, no auth, no CORS preflight)
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `API request failed: ${response.status} ${response.statusText}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.detail || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data as SearchResponse;
  } catch (error) {
    console.error('Failed to fetch search results:', error);
    throw error;
  }
}

/**
 * Fetch specialties once and cache in memory
 */
async function getCachedSpecialties(): Promise<APISpecialty[]> {
  if (cachedSpecialties !== null) {
    return cachedSpecialties;
  }
  
  if (specialtiesFetchPromise !== null) {
    return specialtiesFetchPromise;
  }
  
  specialtiesFetchPromise = (async () => {
    try {
      const response = await getSpecialties();
      cachedSpecialties = response.specialties;
      return cachedSpecialties;
    } catch (error) {
      console.error('Failed to fetch specialties:', error);
      return [];
    } finally {
      specialtiesFetchPromise = null;
    }
  })();
  
  return specialtiesFetchPromise;
}

/**
 * Get autocomplete suggestions with specialties first, then procedures
 * This function calls getSearchResults() and getSpecialties()
 * Filters specialties client-side and combines results
 */
export async function getAutocompleteSuggestions(query: string): Promise<AutocompleteSuggestion[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const lowerQuery = query.toLowerCase().trim();
  const suggestions: AutocompleteSuggestion[] = [];

  // Fetch specialties once (cached)
  const allSpecialties = await getCachedSpecialties();
  
  // Filter specialties client-side using fuzzy case-insensitive match on display_name
  const matchedSpecialties = allSpecialties
    .filter(specialty => 
      specialty.display_name.toLowerCase().includes(lowerQuery)
    )
    .map(specialty => ({
      id: `specialty-${specialty.id}`,
      type: 'specialty' as AutocompleteCategory,
      primaryText: specialty.display_name,
      secondaryText: specialty.grouping || null,
      specialtyId: specialty.id
    }));

  // Add specialties FIRST
  suggestions.push(...matchedSpecialties);

  // Call getSearchResults for procedure results
  try {
    const procedureResponse = await getSearchResults(query);
    if (procedureResponse.results && procedureResponse.results.length > 0) {
      procedureResponse.results.forEach((result) => {
        if (result.procedure_slug) {
          const displayName = result.procedure_name || 'Procedure';
          const category = result.category_name || 'Procedure';
          
          suggestions.push({
            id: result.procedure_id || result.procedure_slug,
            type: 'procedure' as AutocompleteCategory,
            primaryText: displayName,
            secondaryText: `${category} • ${result.provider_count || 0} providers • $${result.best_price || 'N/A'}`,
            procedureSlug: result.procedure_slug
          });
        }
      });
    }
  } catch (error) {
    console.error('Failed to fetch procedures:', error);
    // Continue without procedures if API fails
  }

  return suggestions;
}