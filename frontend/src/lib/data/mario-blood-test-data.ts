export interface BloodTestProvider {
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

export const bloodTestProviders: BloodTestProvider[] = [
  {
    id: 'labfast-diagnostics',
    providerName: 'LabFast Diagnostics',
    service: 'Blood Test – Basic Panel',
    distance: '2.1 mi',
    distanceValue: 2.1,
    network: 'In-Network',
    rating: 4.84,
    reviewCount: 50,
    price: 45,
    originalPrice: 85,
    savingsPercentage: 47,
    isMariosPick: true,
    points: 30,
    note: 'Performed by board-certified pathologists',
    address: '123 Medical Plaza, Suite 200',
    hours: 'Mon-Fri 7AM-7PM, Sat 8AM-2PM',
    amenities: ['Walk-ins welcome', 'Fast results', 'Online booking']
  },
  {
    id: 'metrolab-clinics',
    providerName: 'MetroLab Clinics',
    service: 'Blood Test – Basic Panel',
    distance: '1.8 mi',
    distanceValue: 1.8,
    network: 'In-Network',
    rating: 4.9,
    reviewCount: 78,
    price: 50,
    originalPrice: 87,
    savingsPercentage: 42,
    isMariosPick: true,
    points: 28,
    note: 'Same-day results available',
    address: '456 Health Ave, Building C',
    hours: 'Mon-Sun 6AM-8PM',
    amenities: ['No appointment needed', 'Same-day results', 'Free parking']
  },
  {
    id: 'healthone-medical',
    providerName: 'HealthOne Medical Center',
    service: 'Blood Test – Basic Panel',
    distance: '3.2 mi',
    distanceValue: 3.2,
    network: 'Out-of-Network',
    rating: 4.6,
    reviewCount: 34,
    price: 90,
    originalPrice: 112,
    savingsPercentage: 20,
    isMariosPick: false,
    points: 25,
    note: 'Full-service medical center',
    address: '789 Central Blvd',
    hours: 'Mon-Fri 8AM-6PM',
    amenities: ['Comprehensive care', 'On-site pharmacy']
  },
  {
    id: 'precision-labworks',
    providerName: 'Precision LabWorks',
    service: 'Blood Test – Basic Panel',
    distance: '4.0 mi',
    distanceValue: 4.0,
    network: 'In-Network',
    rating: 4.7,
    reviewCount: 62,
    price: 65,
    originalPrice: 93,
    savingsPercentage: 30,
    isMariosPick: false,
    points: 27,
    note: 'Advanced testing capabilities',
    address: '321 Science Park Dr',
    hours: 'Mon-Fri 7AM-5PM',
    amenities: ['Specialized tests', 'Digital results portal']
  },
  {
    id: 'carefirst-labs',
    providerName: 'CareFirst Labs',
    service: 'Blood Test – Basic Panel',
    distance: '2.7 mi',
    distanceValue: 2.7,
    network: 'Out-of-Network',
    rating: 4.3,
    reviewCount: 28,
    price: 110,
    originalPrice: 141,
    savingsPercentage: 22,
    isMariosPick: false,
    points: 26,
    address: '555 Wellness Way',
    hours: 'Mon-Fri 9AM-5PM',
    amenities: ['Evening appointments', 'Validated parking']
  },
  {
    id: 'brightpath-diagnostics',
    providerName: 'BrightPath Diagnostics',
    service: 'Blood Test – Basic Panel',
    distance: '1.5 mi',
    distanceValue: 1.5,
    network: 'In-Network',
    rating: 4.8,
    reviewCount: 91,
    price: 55,
    originalPrice: 89,
    savingsPercentage: 38,
    isMariosPick: true,
    points: 29,
    note: 'Highest patient satisfaction scores',
    address: '888 Innovation St',
    hours: 'Mon-Sat 7AM-6PM',
    amenities: ['Family-friendly', 'Quick turnaround', 'Insurance pre-verification']
  },
  {
    id: 'mediquest-diagnostics',
    providerName: 'MediQuest Diagnostics',
    service: 'Blood Test – Basic Panel',
    distance: '4.8 mi',
    distanceValue: 4.8,
    network: 'In-Network',
    rating: 4.5,
    reviewCount: 45,
    price: 70,
    originalPrice: 97,
    savingsPercentage: 28,
    isMariosPick: false,
    points: 25,
    address: '222 Healthcare Pkwy',
    hours: 'Mon-Fri 8AM-6PM, Sat 9AM-1PM',
    amenities: ['Electronic medical records', 'Flexible scheduling']
  },
  {
    id: 'quickcare-labs',
    providerName: 'QuickCare Labs',
    service: 'Blood Test – Basic Panel',
    distance: '3.5 mi',
    distanceValue: 3.5,
    network: 'In-Network',
    rating: 4.75,
    reviewCount: 66,
    price: 48,
    originalPrice: 86,
    savingsPercentage: 44,
    isMariosPick: true,
    points: 30,
    note: 'Express service with 2-hour results',
    address: '999 Express Lane',
    hours: 'Mon-Sun 24/7',
    amenities: ['24/7 service', 'Express results', 'Mobile phlebotomy']
  }
];

export type SortOption = 'best_value' | 'distance' | 'rating' | 'price_low' | 'price_high';

export function sortBloodTestProviders(
  providers: BloodTestProvider[],
  sortBy: SortOption
): BloodTestProvider[] {
  const sorted = [...providers];

  switch (sortBy) {
    case 'best_value':
      // Mario's Pick first, then by savings percentage
      return sorted.sort((a, b) => {
        if (a.isMariosPick && !b.isMariosPick) return -1;
        if (!a.isMariosPick && b.isMariosPick) return 1;
        return b.savingsPercentage - a.savingsPercentage;
      });
    
    case 'distance':
      return sorted.sort((a, b) => a.distanceValue - b.distanceValue);
    
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    
    case 'price_low':
      return sorted.sort((a, b) => a.price - b.price);
    
    case 'price_high':
      return sorted.sort((a, b) => b.price - a.price);
    
    default:
      return sorted;
  }
}

export function filterBloodTestProviders(
  providers: BloodTestProvider[],
  filters: {
    network?: 'In-Network' | 'Out-of-Network' | 'all';
    maxDistance?: number;
    minRating?: number;
    marioPickOnly?: boolean;
  }
): BloodTestProvider[] {
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

  if (filters.marioPickOnly) {
    filtered = filtered.filter(p => p.isMariosPick);
  }

  return filtered;
}
