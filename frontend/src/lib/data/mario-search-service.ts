import { searchData } from './mario-search-data';

export interface Doctor {
  name: string;
  specialty: string;
  price: string;
  savings: string;
  rating: string;
  reviews: string;
  distance: string;
  network: string;
  marioPick?: boolean;
}

export interface Procedure {
  name: string;
  facility: string;
  price: string;
  originalPrice: string;
  savings: string;
  rewards: string;
}

export interface Medication {
  name: string;
  cashPrice: string;
  insurancePrice: string;
  savings: string;
  marioPick?: boolean;
}

export interface SearchResult {
  type: 'doctor' | 'specialty' | 'procedure' | 'medication';
  data: Doctor | Doctor[] | Procedure | Medication;
  query: string;
}

// Transform data for compact search component
export interface CompactSearchResult {
  id: string;
  type: 'provider' | 'facility' | 'medication';
  name: string;
  specialty?: string;
  distance: number;
  isInNetwork: boolean;
  isMariosPick: boolean;
  price: number;
  originalPrice?: number;
  savingsPercent?: number;
  rating: number;
  reviewCount: number;
  address: string;
  image?: string;
  points: number;
  nextAvailable?: string;
  performedBy?: string[];
}

export interface CompactMedicationResult {
  id: string;
  medication: string;
  dosage: string;
  quantity: string;
  insurancePrice: number;
  cashPrice: number;
  discountPrice?: number;
  bestPharmacy: string;
  isMariosPick: boolean;
  savings: number;
}

function normalizeQuery(query: string): string {
  return query.toLowerCase().trim();
}

function extractPrice(priceString: string): number {
  return parseInt(priceString.replace(/[^0-9]/g, '')) || 0;
}

function extractSavingsPercent(savingsString: string): number {
  const match = savingsString.match(/(\d+)%/);
  return match ? parseInt(match[1]) : 0;
}

function doctorToCompactResult(doctor: Doctor, index: number): CompactSearchResult {
  return {
    id: `doctor-${index}`,
    type: 'provider',
    name: doctor.name,
    specialty: doctor.specialty,
    distance: parseFloat(doctor.distance.replace(/[^0-9.]/g, '')) || 0,
    isInNetwork: doctor.network === 'In-Network',
    isMariosPick: doctor.marioPick || false,
    price: extractPrice(doctor.price),
    savingsPercent: extractSavingsPercent(doctor.savings),
    rating: parseFloat(doctor.rating),
    reviewCount: parseInt(doctor.reviews),
    address: '123 Healthcare Ave', // Mock address
    points: 50 + (index * 25), // Mock points based on savings
    nextAvailable: 'Tomorrow 2:30 PM'
  };
}

function procedureToCompactResult(procedure: Procedure, index: number): CompactSearchResult {
  return {
    id: `procedure-${index}`,
    type: 'facility',
    name: procedure.facility,
    specialty: procedure.name,
    distance: 2 + (index * 0.5),
    isInNetwork: true,
    isMariosPick: index === 0, // First result is Mario's Pick
    price: extractPrice(procedure.price),
    originalPrice: extractPrice(procedure.originalPrice),
    savingsPercent: extractSavingsPercent(procedure.savings),
    rating: 4.7 + (Math.random() * 0.3),
    reviewCount: 50 + (index * 20),
    address: '456 Medical Plaza',
    points: parseInt(procedure.rewards.replace(/[^0-9]/g, '')) || 50,
    performedBy: ['Dr. Sarah Johnson', 'Dr. Lee Chen', 'Dr. Michael Ortiz']
  };
}

function medicationToCompactResult(medication: Medication): CompactMedicationResult {
  const [name, dosage] = medication.name.split(' ');
  return {
    id: `med-${name.toLowerCase()}`,
    medication: name,
    dosage: dosage || '20mg',
    quantity: '30 tablets',
    insurancePrice: extractPrice(medication.insurancePrice),
    cashPrice: extractPrice(medication.cashPrice),
    discountPrice: extractPrice(medication.cashPrice) - extractSavingsPercent(medication.savings),
    bestPharmacy: 'Cost Plus Drugs',
    isMariosPick: medication.marioPick || false,
    savings: extractSavingsPercent(medication.savings)
  };
}

export function performSearch(query: string): SearchResult | null {
  const normalizedQuery = normalizeQuery(query);
  
  // 1. Check for exact doctor name match
  const doctorMatch = searchData.doctors.find(doctor => 
    normalizeQuery(doctor.name).includes(normalizedQuery) ||
    normalizedQuery.includes(normalizeQuery(doctor.name))
  );
  
  if (doctorMatch) {
    return {
      type: 'doctor',
      data: doctorMatch,
      query
    };
  }
  
  // 2. Check for specialty match
  const specialtyMatch = searchData.specialties.find(specialty =>
    normalizeQuery(specialty).includes(normalizedQuery) ||
    normalizedQuery.includes(normalizeQuery(specialty))
  );
  
  if (specialtyMatch) {
    const doctorsInSpecialty = searchData.doctors.filter(doctor =>
      normalizeQuery(doctor.specialty) === normalizeQuery(specialtyMatch)
    );
    
    return {
      type: 'specialty',
      data: doctorsInSpecialty,
      query
    };
  }
  
  // 3. Check for procedure match
  const procedureMatch = searchData.procedures.find(procedure =>
    normalizeQuery(procedure.name).includes(normalizedQuery) ||
    normalizedQuery.includes(normalizeQuery(procedure.name).split(' ')[0]) // Match first word like "MRI"
  );
  
  if (procedureMatch) {
    return {
      type: 'procedure',
      data: procedureMatch,
      query
    };
  }
  
  // 4. Check for medication match
  const medicationMatch = searchData.medications.find(medication =>
    normalizeQuery(medication.name).includes(normalizedQuery) ||
    normalizedQuery.includes(normalizeQuery(medication.name).split(' ')[0]) // Match drug name without dosage
  );
  
  if (medicationMatch) {
    return {
      type: 'medication',
      data: medicationMatch,
      query
    };
  }
  
  return null;
}

export function convertToCompactResults(searchResult: SearchResult): {
  searchType: 'provider' | 'specialty' | 'procedure' | 'medication';
  results: CompactSearchResult[] | CompactMedicationResult[];
} {
  switch (searchResult.type) {
    case 'doctor':
      return {
        searchType: 'provider',
        results: [doctorToCompactResult(searchResult.data as Doctor, 0)]
      };
      
    case 'specialty':
      return {
        searchType: 'specialty',
        results: (searchResult.data as Doctor[]).map((doctor, index) => 
          doctorToCompactResult(doctor, index)
        )
      };
      
    case 'procedure':
      return {
        searchType: 'procedure',
        results: [procedureToCompactResult(searchResult.data as Procedure, 0)]
      };
      
    case 'medication':
      return {
        searchType: 'medication',
        results: [medicationToCompactResult(searchResult.data as Medication)]
      };
      
    default:
      return {
        searchType: 'provider',
        results: []
      };
  }
}

// Helper function to get search suggestions
export function getSearchSuggestions(): string[] {
  const suggestions: string[] = [];
  
  // Add some doctor names
  suggestions.push(...searchData.doctors.slice(0, 3).map(d => d.name));
  
  // Add some specialties
  suggestions.push(...searchData.specialties.slice(0, 3));
  
  // Add some procedure names
  suggestions.push(...searchData.procedures.slice(0, 2).map(p => p.name.split(' –')[0])); // Just the procedure type
  
  // Add some medication names
  suggestions.push(...searchData.medications.slice(0, 2).map(m => m.name.split(' ')[0])); // Just drug name
  
  return suggestions;
}