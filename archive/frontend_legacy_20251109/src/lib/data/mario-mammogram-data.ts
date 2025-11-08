export interface MammogramProvider {
  id: string;
  providerName: string;
  service: string;
  distance: string;
  distanceValue: number;
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

export const mammogramProviders: MammogramProvider[] = [
  {
    id: 'womens-imaging-center',
    providerName: 'Women\'s Imaging Center',
    service: 'Mammogram Screening',
    distance: '1.4 mi',
    distanceValue: 1.4,
    network: 'In-Network',
    rating: 4.9,
    reviewCount: 156,
    price: 125,
    originalPrice: 280,
    savingsPercentage: 55,
    isMariosPick: true,
    points: 85,
    note: '3D mammography available',
    address: '2450 Medical Center Pkwy, Suite 100',
    hours: 'Mon-Fri 7AM-7PM, Sat 8AM-4PM',
    amenities: ['3D imaging', 'Same-day results', 'Female technologists']
  },
  {
    id: 'breastcare-specialists',
    providerName: 'BreastCare Specialists',
    service: 'Mammogram Screening',
    distance: '2.3 mi',
    distanceValue: 2.3,
    network: 'In-Network',
    rating: 4.8,
    reviewCount: 203,
    price: 145,
    originalPrice: 285,
    savingsPercentage: 49,
    isMariosPick: true,
    points: 80,
    note: 'Board-certified radiologists on-site',
    address: '890 Women\'s Health Blvd',
    hours: 'Mon-Fri 8AM-6PM, Sat 9AM-2PM',
    amenities: ['Digital mammography', 'Walk-ins welcome', 'Free parking']
  },
  {
    id: 'advanced-radiology',
    providerName: 'Advanced Radiology Group',
    service: 'Mammogram Screening',
    distance: '3.1 mi',
    distanceValue: 3.1,
    network: 'In-Network',
    rating: 4.7,
    reviewCount: 89,
    price: 165,
    originalPrice: 295,
    savingsPercentage: 44,
    isMariosPick: false,
    points: 75,
    note: 'Comprehensive breast imaging services',
    address: '1234 Imaging Dr, Building A',
    hours: 'Mon-Fri 7AM-5PM',
    amenities: ['3D tomosynthesis', 'Ultrasound available', 'Online scheduling']
  },
  {
    id: 'metrohealth-imaging',
    providerName: 'MetroHealth Imaging',
    service: 'Mammogram Screening',
    distance: '2.8 mi',
    distanceValue: 2.8,
    network: 'In-Network',
    rating: 4.6,
    reviewCount: 112,
    price: 155,
    originalPrice: 290,
    savingsPercentage: 47,
    isMariosPick: false,
    points: 78,
    note: 'Digital and 3D mammography',
    address: '567 Healthcare Plaza',
    hours: 'Mon-Fri 8AM-6PM',
    amenities: ['Quick appointments', 'Comfortable environment', 'Bilingual staff']
  },
  {
    id: 'diagnostic-imaging-plus',
    providerName: 'Diagnostic Imaging Plus',
    service: 'Mammogram Screening',
    distance: '4.2 mi',
    distanceValue: 4.2,
    network: 'Out-of-Network',
    rating: 4.5,
    reviewCount: 67,
    price: 195,
    originalPrice: 310,
    savingsPercentage: 37,
    isMariosPick: false,
    points: 70,
    note: 'State-of-the-art equipment',
    address: '3400 Medical Park Ave',
    hours: 'Mon-Thu 9AM-5PM',
    amenities: ['Latest technology', 'Convenient location']
  },
  {
    id: 'city-womens-wellness',
    providerName: 'City Women\'s Wellness Center',
    service: 'Mammogram Screening',
    distance: '1.9 mi',
    distanceValue: 1.9,
    network: 'In-Network',
    rating: 4.8,
    reviewCount: 145,
    price: 135,
    originalPrice: 275,
    savingsPercentage: 51,
    isMariosPick: true,
    points: 82,
    note: 'Dedicated women\'s health facility',
    address: '789 Wellness Way',
    hours: 'Mon-Sat 7AM-7PM',
    amenities: ['All-female staff', 'Spa-like setting', 'Extended hours']
  },
  {
    id: 'precision-breast-imaging',
    providerName: 'Precision Breast Imaging',
    service: 'Mammogram Screening',
    distance: '3.5 mi',
    distanceValue: 3.5,
    network: 'In-Network',
    rating: 4.7,
    reviewCount: 98,
    price: 175,
    originalPrice: 300,
    savingsPercentage: 42,
    isMariosPick: false,
    points: 73,
    note: 'Specialized breast health center',
    address: '1122 Medical Mile',
    hours: 'Mon-Fri 8AM-5PM',
    amenities: ['Expert radiologists', 'Rapid results', 'Patient education']
  },
  {
    id: 'healthfirst-radiology',
    providerName: 'HealthFirst Radiology',
    service: 'Mammogram Screening',
    distance: '5.1 mi',
    distanceValue: 5.1,
    network: 'Out-of-Network',
    rating: 4.4,
    reviewCount: 54,
    price: 210,
    originalPrice: 320,
    savingsPercentage: 34,
    isMariosPick: false,
    points: 68,
    note: 'Full-service imaging center',
    address: '4567 Health Pkwy',
    hours: 'Mon-Fri 9AM-4PM',
    amenities: ['Comprehensive imaging', 'On-site consultation']
  }
];

// Sorting functions
export function sortMammogramProviders(
  providers: MammogramProvider[],
  sortBy: 'price' | 'distance' | 'rating' | 'savings'
): MammogramProvider[] {
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
}

// Filter functions
export function filterMammogramProviders(
  providers: MammogramProvider[],
  filters: {
    network?: 'all' | 'In-Network' | 'Out-of-Network';
    marioPick?: boolean;
  }
): MammogramProvider[] {
  let filtered = [...providers];
  
  if (filters.network && filters.network !== 'all') {
    filtered = filtered.filter(p => p.network === filters.network);
  }
  
  if (filters.marioPick) {
    filtered = filtered.filter(p => p.isMariosPick);
  }
  
  return filtered;
}
