export interface MRIProvider {
  id: string;
  providerName: string;
  service: string;
  distance: string;
  distanceValue: number; // for sorting
  network: 'In-Network' | 'Out-of-Network';
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice: number;
  savingsPercentage: number;
  isMariosPick: boolean;
  points: number;
  note?: string;
  address?: string;
  hours?: string;
  amenities?: string[];
}

export const mriProviders: MRIProvider[] = [
  {
    id: 'city-medical-imaging',
    providerName: 'City Medical Imaging',
    service: 'MRI Scan – Brain',
    distance: '1.4 mi',
    distanceValue: 1.4,
    network: 'In-Network',
    rating: 4.9,
    reviewCount: 142,
    price: 850,
    originalPrice: 1400,
    savingsPercentage: 39,
    isMariosPick: true,
    points: 100,
    note: 'State-of-the-art 3T MRI scanner with fastest scan times',
    address: '456 Imaging Blvd, Suite 100',
    hours: 'Mon-Fri 6AM-9PM, Sat-Sun 7AM-5PM',
    amenities: ['Same-day results', '3T MRI scanner', 'Online scheduling', 'Free parking']
  },
  {
    id: 'advanced-diagnostics',
    providerName: 'Advanced Diagnostics Center',
    service: 'MRI Scan – Brain',
    distance: '2.3 mi',
    distanceValue: 2.3,
    network: 'In-Network',
    rating: 4.85,
    reviewCount: 98,
    price: 920,
    originalPrice: 1400,
    savingsPercentage: 34,
    isMariosPick: false,
    points: 90,
    note: 'Board-certified radiologists with subspecialty training',
    address: '789 Healthcare Way',
    hours: 'Mon-Fri 7AM-8PM, Sat 8AM-4PM',
    amenities: ['24-hour results', 'Board-certified radiologists', 'Wheelchair accessible']
  },
  {
    id: 'northside-radiology',
    providerName: 'Northside Radiology',
    service: 'MRI Scan – Brain',
    distance: '3.1 mi',
    distanceValue: 3.1,
    network: 'In-Network',
    rating: 4.8,
    reviewCount: 76,
    price: 975,
    originalPrice: 1400,
    savingsPercentage: 30,
    isMariosPick: false,
    points: 85,
    note: 'Open MRI available for claustrophobic patients',
    address: '321 North Medical Plaza',
    hours: 'Mon-Fri 8AM-7PM, Sat 9AM-3PM',
    amenities: ['Open MRI option', 'Music during scan', 'Evening hours']
  },
  {
    id: 'premier-imaging',
    providerName: 'Premier Imaging Solutions',
    service: 'MRI Scan – Brain',
    distance: '1.9 mi',
    distanceValue: 1.9,
    network: 'In-Network',
    rating: 4.92,
    reviewCount: 215,
    price: 1050,
    originalPrice: 1400,
    savingsPercentage: 25,
    isMariosPick: false,
    points: 95,
    note: 'Award-winning patient experience and comfort',
    address: '555 Premier Drive',
    hours: 'Mon-Sat 7AM-9PM, Sun 8AM-6PM',
    amenities: ['Award-winning facility', 'Comfort amenities', '7-day availability']
  },
  {
    id: 'metro-health-mri',
    providerName: 'Metro Health MRI Center',
    service: 'MRI Scan – Brain',
    distance: '4.2 mi',
    distanceValue: 4.2,
    network: 'In-Network',
    rating: 4.75,
    reviewCount: 54,
    price: 1120,
    originalPrice: 1400,
    savingsPercentage: 20,
    isMariosPick: false,
    points: 80,
    address: '888 Metro Boulevard',
    hours: 'Mon-Fri 8AM-6PM',
    amenities: ['Ample parking', 'Friendly staff']
  },
  {
    id: 'coastal-imaging',
    providerName: 'Coastal Imaging Associates',
    service: 'MRI Scan – Brain',
    distance: '5.1 mi',
    distanceValue: 5.1,
    network: 'Out-of-Network',
    rating: 4.88,
    reviewCount: 167,
    price: 1280,
    originalPrice: 1600,
    savingsPercentage: 20,
    isMariosPick: false,
    points: 70,
    note: 'Out-of-network but highly rated specialists',
    address: '999 Coastal Highway',
    hours: 'Mon-Fri 7AM-7PM, Sat 8AM-2PM',
    amenities: ['Specialist radiologists', 'Premium equipment']
  },
  {
    id: 'university-radiology',
    providerName: 'University Radiology Group',
    service: 'MRI Scan – Brain',
    distance: '3.8 mi',
    distanceValue: 3.8,
    network: 'In-Network',
    rating: 4.7,
    reviewCount: 89,
    price: 1190,
    originalPrice: 1400,
    savingsPercentage: 15,
    isMariosPick: false,
    points: 75,
    note: 'Academic medical center with research expertise',
    address: '234 University Medical Center',
    hours: 'Mon-Fri 7AM-6PM',
    amenities: ['Research hospital', 'Teaching facility']
  },
  {
    id: 'quickscan-diagnostics',
    providerName: 'QuickScan Diagnostics',
    service: 'MRI Scan – Brain',
    distance: '2.7 mi',
    distanceValue: 2.7,
    network: 'In-Network',
    rating: 4.65,
    reviewCount: 43,
    price: 1250,
    originalPrice: 1400,
    savingsPercentage: 11,
    isMariosPick: false,
    points: 65,
    address: '777 Quick Medical Plaza',
    hours: 'Mon-Fri 9AM-5PM',
    amenities: ['Fast scheduling', 'Convenient location']
  }
];

// Helper function to get MRI providers by service type
export const getMRIProvidersByService = (serviceType: string): MRIProvider[] => {
  // For now, return all brain MRI providers
  // Can be extended for knee, spine, etc.
  return mriProviders;
};

// Helper function to get a specific MRI provider by ID
export const getMRIProviderById = (id: string): MRIProvider | undefined => {
  return mriProviders.find(provider => provider.id === id);
};

// Helper function to sort providers
export const sortMRIProviders = (
  providers: MRIProvider[],
  sortBy: 'price' | 'distance' | 'rating' | 'savings'
): MRIProvider[] => {
  const sorted = [...providers];
  
  switch (sortBy) {
    case 'price':
      return sorted.sort((a, b) => a.price - b.price);
    case 'distance':
      return sorted.sort((a, b) => a.distanceValue - b.distanceValue);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'savings':
      return sorted.sort((a, b) => b.savingsPercentage - a.savingsPercentage);
    default:
      return sorted;
  }
};

// Helper function to filter providers
export const filterMRIProviders = (
  providers: MRIProvider[],
  filters: {
    network?: 'In-Network' | 'Out-of-Network' | 'all';
    maxDistance?: number;
    minRating?: number;
    marioPick?: boolean;
  }
): MRIProvider[] => {
  let filtered = [...providers];
  
  if (filters.network && filters.network !== 'all') {
    filtered = filtered.filter(p => p.network === filters.network);
  }
  
  if (filters.maxDistance) {
    filtered = filtered.filter(p => p.distanceValue <= filters.maxDistance);
  }
  
  if (filters.minRating) {
    filtered = filtered.filter(p => p.rating >= filters.minRating);
  }
  
  if (filters.marioPick) {
    filtered = filtered.filter(p => p.isMariosPick);
  }
  
  return filtered;
};
