export interface AnnualPhysicalProvider {
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

export const annualPhysicalProviders: AnnualPhysicalProvider[] = [
  {
    id: 'primary-care-wellness',
    providerName: 'Primary Care & Wellness Clinic',
    service: 'Annual Physical Exam',
    distance: '0.8 mi',
    distanceValue: 0.8,
    network: 'In-Network',
    rating: 4.9,
    reviewCount: 284,
    price: 95,
    originalPrice: 220,
    savingsPercentage: 57,
    isMariosPick: true,
    points: 65,
    note: 'Comprehensive preventive care',
    address: '150 Medical Plaza, Suite 300',
    hours: 'Mon-Fri 8AM-6PM, Sat 9AM-1PM',
    amenities: ['Same-day appointments', 'On-site lab', 'Bilingual providers']
  },
  {
    id: 'family-health-partners',
    providerName: 'Family Health Partners',
    service: 'Annual Physical Exam',
    distance: '1.5 mi',
    distanceValue: 1.5,
    network: 'In-Network',
    rating: 4.8,
    reviewCount: 367,
    price: 105,
    originalPrice: 225,
    savingsPercentage: 53,
    isMariosPick: true,
    points: 60,
    note: 'Accepting new patients',
    address: '2340 Health Ave',
    hours: 'Mon-Fri 7AM-7PM, Sat 8AM-4PM',
    amenities: ['Walk-ins welcome', 'Extended hours', 'Free parking']
  },
  {
    id: 'citymed-primary-care',
    providerName: 'CityMed Primary Care',
    service: 'Annual Physical Exam',
    distance: '2.1 mi',
    distanceValue: 2.1,
    network: 'In-Network',
    rating: 4.7,
    reviewCount: 198,
    price: 115,
    originalPrice: 230,
    savingsPercentage: 50,
    isMariosPick: false,
    points: 58,
    note: 'Board-certified family physicians',
    address: '890 Downtown Medical Center',
    hours: 'Mon-Fri 8AM-5PM',
    amenities: ['Online booking', 'Patient portal', 'Video visits available']
  },
  {
    id: 'complete-care-clinic',
    providerName: 'Complete Care Clinic',
    service: 'Annual Physical Exam',
    distance: '1.2 mi',
    distanceValue: 1.2,
    network: 'In-Network',
    rating: 4.8,
    reviewCount: 156,
    price: 100,
    originalPrice: 218,
    savingsPercentage: 54,
    isMariosPick: true,
    points: 62,
    note: 'Comprehensive wellness exams',
    address: '456 Wellness Blvd, Suite 201',
    hours: 'Mon-Sat 7AM-6PM',
    amenities: ['No wait guarantee', 'Full lab services', 'Preventive focus']
  },
  {
    id: 'healthbridge-physicians',
    providerName: 'HealthBridge Physicians',
    service: 'Annual Physical Exam',
    distance: '3.4 mi',
    distanceValue: 3.4,
    network: 'In-Network',
    rating: 4.6,
    reviewCount: 142,
    price: 125,
    originalPrice: 235,
    savingsPercentage: 47,
    isMariosPick: false,
    points: 55,
    note: 'Multiple providers available',
    address: '1234 Medical Park Dr',
    hours: 'Mon-Fri 9AM-5PM',
    amenities: ['Easy scheduling', 'Convenient location', 'Modern facility']
  },
  {
    id: 'wellness-first-medical',
    providerName: 'Wellness First Medical Group',
    service: 'Annual Physical Exam',
    distance: '2.8 mi',
    distanceValue: 2.8,
    network: 'Out-of-Network',
    rating: 4.5,
    reviewCount: 89,
    price: 145,
    originalPrice: 250,
    savingsPercentage: 42,
    isMariosPick: false,
    points: 52,
    note: 'Holistic approach to health',
    address: '789 Integrative Health Center',
    hours: 'Mon-Fri 8AM-6PM',
    amenities: ['Holistic care', 'Nutrition counseling', 'Wellness programs']
  },
  {
    id: 'metro-family-doctors',
    providerName: 'Metro Family Doctors',
    service: 'Annual Physical Exam',
    distance: '1.9 mi',
    distanceValue: 1.9,
    network: 'In-Network',
    rating: 4.7,
    reviewCount: 223,
    price: 110,
    originalPrice: 222,
    savingsPercentage: 50,
    isMariosPick: false,
    points: 59,
    note: 'Family medicine specialists',
    address: '3210 Family Health Plaza',
    hours: 'Mon-Fri 8AM-6PM, Sat 9AM-2PM',
    amenities: ['All ages welcome', 'Coordinated care', 'Electronic records']
  },
  {
    id: 'cornerstone-health',
    providerName: 'Cornerstone Health Associates',
    service: 'Annual Physical Exam',
    distance: '4.2 mi',
    distanceValue: 4.2,
    network: 'In-Network',
    rating: 4.6,
    reviewCount: 175,
    price: 120,
    originalPrice: 228,
    savingsPercentage: 47,
    isMariosPick: false,
    points: 56,
    note: 'Experienced healthcare team',
    address: '5678 Professional Pkwy',
    hours: 'Mon-Fri 8AM-5PM',
    amenities: ['Thorough exams', 'Preventive screening', 'Care coordination']
  },
  {
    id: 'optimal-health-center',
    providerName: 'Optimal Health Center',
    service: 'Annual Physical Exam',
    distance: '3.1 mi',
    distanceValue: 3.1,
    network: 'Out-of-Network',
    rating: 4.4,
    reviewCount: 67,
    price: 160,
    originalPrice: 265,
    savingsPercentage: 40,
    isMariosPick: false,
    points: 48,
    note: 'Personalized health assessments',
    address: '9012 Wellness Way',
    hours: 'Mon-Thu 9AM-4PM',
    amenities: ['Personalized care', 'Health coaching', 'Wellness plans']
  },
  {
    id: 'community-medical-group',
    providerName: 'Community Medical Group',
    service: 'Annual Physical Exam',
    distance: '2.5 mi',
    distanceValue: 2.5,
    network: 'In-Network',
    rating: 4.7,
    reviewCount: 201,
    price: 108,
    originalPrice: 220,
    savingsPercentage: 51,
    isMariosPick: false,
    points: 60,
    note: 'Trusted community healthcare',
    address: '1357 Community Health Dr',
    hours: 'Mon-Fri 7AM-6PM',
    amenities: ['Trusted providers', 'Community focused', 'Comprehensive care']
  }
];

// Sorting functions
export function sortAnnualPhysicalProviders(
  providers: AnnualPhysicalProvider[],
  sortBy: 'price' | 'distance' | 'rating' | 'savings'
): AnnualPhysicalProvider[] {
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
export function filterAnnualPhysicalProviders(
  providers: AnnualPhysicalProvider[],
  filters: {
    network?: 'all' | 'In-Network' | 'Out-of-Network';
    marioPick?: boolean;
  }
): AnnualPhysicalProvider[] {
  let filtered = [...providers];
  
  if (filters.network && filters.network !== 'all') {
    filtered = filtered.filter(p => p.network === filters.network);
  }
  
  if (filters.marioPick) {
    filtered = filtered.filter(p => p.isMariosPick);
  }
  
  return filtered;
}
