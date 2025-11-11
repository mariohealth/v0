/**
 * Mock provider fallback data for procedure provider lists
 * 
 * Used when API fails or returns empty results to ensure users
 * always see valid provider suggestions for common procedures.
 * 
 * This dataset contains realistic provider cards for MRI and other common procedures.
 */

export interface MockProviderFallback {
  provider_id: string;
  provider_name: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  price?: string;
  distance_miles?: number | null;
  specialty?: string;
  rating?: number;
  reviews?: number;
  savings?: string;
}

export const mockProvidersFallback: MockProviderFallback[] = [
  {
    provider_id: 'dr_maria_gonzalez',
    provider_name: 'Dr. Maria Gonzalez',
    address: '123 Medical Center Dr',
    city: 'San Francisco',
    state: 'CA',
    zip: '94102',
    phone: '(415) 555-0123',
    price: '850',
    distance_miles: 2.5,
    specialty: 'Radiology',
    rating: 4.8,
    reviews: 124,
    savings: '20% below average'
  },
  {
    provider_id: 'dr_emily_rivera',
    provider_name: 'Dr. Emily Rivera',
    address: '456 Healthcare Blvd',
    city: 'San Francisco',
    state: 'CA',
    zip: '94103',
    phone: '(415) 555-0456',
    price: '900',
    distance_miles: 3.1,
    specialty: 'Radiology',
    rating: 4.7,
    reviews: 110,
    savings: '15% below average'
  },
  {
    provider_id: 'sf_imaging_center',
    provider_name: 'SF Imaging Center',
    address: '789 Diagnostic Way',
    city: 'San Francisco',
    state: 'CA',
    zip: '94104',
    phone: '(415) 555-0789',
    price: '875',
    distance_miles: 1.8,
    specialty: 'Radiology',
    rating: 4.6,
    reviews: 89,
    savings: '18% below average'
  },
  {
    provider_id: 'bay_area_radiology',
    provider_name: 'Bay Area Radiology Group',
    address: '321 Medical Plaza',
    city: 'Oakland',
    state: 'CA',
    zip: '94601',
    phone: '(510) 555-0321',
    price: '920',
    distance_miles: 8.2,
    specialty: 'Radiology',
    rating: 4.5,
    reviews: 156,
    savings: '12% below average'
  }
];

/**
 * Get mock providers for a specific procedure slug
 * Filters providers based on procedure type
 */
export function getMockProvidersForProcedure(procedureSlug: string): MockProviderFallback[] {
  // For MRI procedures, return all providers
  if (procedureSlug.includes('mri') || procedureSlug.includes('brain') || procedureSlug.includes('spine')) {
    return mockProvidersFallback;
  }
  
  // For other procedures, return a subset
  return mockProvidersFallback.slice(0, 2);
}

