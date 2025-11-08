export interface ColonoscopyProvider {
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

export const colonoscopyProviders: ColonoscopyProvider[] = [
  {
    id: 'digestive-health-center',
    providerName: 'Digestive Health Center',
    service: 'Colonoscopy Screening',
    distance: '1.2 mi',
    distanceValue: 1.2,
    network: 'In-Network',
    rating: 4.9,
    reviewCount: 187,
    price: 695,
    originalPrice: 1200,
    savingsPercentage: 42,
    isMariosPick: true,
    points: 120,
    note: 'Board-certified gastroenterologists with latest sedation options',
    address: '234 Gastro Medical Plaza, Suite 200',
    hours: 'Mon-Fri 6AM-4PM, Sat 7AM-2PM',
    amenities: ['Same-day prep kits', 'Twilight sedation', 'Private recovery rooms', 'Free parking']
  },
  {
    id: 'advanced-endoscopy',
    providerName: 'Advanced Endoscopy Associates',
    service: 'Colonoscopy Screening',
    distance: '2.1 mi',
    distanceValue: 2.1,
    network: 'In-Network',
    rating: 4.88,
    reviewCount: 156,
    price: 750,
    originalPrice: 1200,
    savingsPercentage: 38,
    isMariosPick: false,
    points: 110,
    note: 'Experienced team with over 20 years serving the community',
    address: '567 Healthcare Drive, Building B',
    hours: 'Mon-Fri 7AM-5PM, Sat 8AM-1PM',
    amenities: ['HD imaging technology', 'Anesthesia available', 'Wheelchair accessible', 'Bilingual staff']
  },
  {
    id: 'metro-gastroenterology',
    providerName: 'Metro Gastroenterology Center',
    service: 'Colonoscopy Screening',
    distance: '1.8 mi',
    distanceValue: 1.8,
    network: 'In-Network',
    rating: 4.85,
    reviewCount: 134,
    price: 825,
    originalPrice: 1200,
    savingsPercentage: 31,
    isMariosPick: false,
    points: 105,
    note: 'State-of-the-art facility with comfortable recovery area',
    address: '890 Metro Medical Center',
    hours: 'Mon-Fri 6AM-6PM, Sat 7AM-3PM',
    amenities: ['Extended hours', 'Comfortable recovery', 'Online results portal', 'Valet parking']
  },
  {
    id: 'premier-gi-specialists',
    providerName: 'Premier GI Specialists',
    service: 'Colonoscopy Screening',
    distance: '3.4 mi',
    distanceValue: 3.4,
    network: 'In-Network',
    rating: 4.92,
    reviewCount: 243,
    price: 895,
    originalPrice: 1200,
    savingsPercentage: 25,
    isMariosPick: false,
    points: 115,
    note: 'Award-winning patient care with highest safety standards',
    address: '456 Premier Healthcare Blvd',
    hours: 'Mon-Sat 6AM-5PM, Sun 7AM-2PM',
    amenities: ['Award-winning care', 'Latest equipment', '7-day availability', 'Concierge service']
  },
  {
    id: 'coastal-endoscopy',
    providerName: 'Coastal Endoscopy Center',
    service: 'Colonoscopy Screening',
    distance: '2.9 mi',
    distanceValue: 2.9,
    network: 'In-Network',
    rating: 4.80,
    reviewCount: 98,
    price: 950,
    originalPrice: 1200,
    savingsPercentage: 21,
    isMariosPick: false,
    points: 100,
    note: 'Compassionate care with focus on patient comfort',
    address: '789 Coastal Medical Plaza',
    hours: 'Mon-Fri 7AM-4PM, Sat 8AM-12PM',
    amenities: ['Patient comfort focus', 'Music therapy', 'Aromatherapy options', 'Family waiting area']
  },
  {
    id: 'university-gi',
    providerName: 'University GI Associates',
    service: 'Colonoscopy Screening',
    distance: '4.5 mi',
    distanceValue: 4.5,
    network: 'In-Network',
    rating: 4.75,
    reviewCount: 76,
    price: 1050,
    originalPrice: 1200,
    savingsPercentage: 13,
    isMariosPick: false,
    points: 90,
    note: 'Academic medical center with research expertise',
    address: '123 University Medical Drive',
    hours: 'Mon-Fri 7AM-5PM',
    amenities: ['Research hospital', 'Teaching facility', 'Specialist consultations']
  },
  {
    id: 'southside-digestive',
    providerName: 'Southside Digestive Care',
    service: 'Colonoscopy Screening',
    distance: '3.7 mi',
    distanceValue: 3.7,
    network: 'In-Network',
    rating: 4.78,
    reviewCount: 112,
    price: 875,
    originalPrice: 1200,
    savingsPercentage: 27,
    isMariosPick: false,
    points: 95,
    note: 'Community-focused practice with personalized care',
    address: '321 South Medical Center',
    hours: 'Mon-Fri 6:30AM-5PM',
    amenities: ['Community focused', 'Personalized care', 'Family-friendly']
  },
  {
    id: 'rapid-screening-gi',
    providerName: 'Rapid Screening GI Center',
    service: 'Colonoscopy Screening',
    distance: '2.5 mi',
    distanceValue: 2.5,
    network: 'Out-of-Network',
    rating: 4.70,
    reviewCount: 64,
    price: 1180,
    originalPrice: 1400,
    savingsPercentage: 16,
    isMariosPick: false,
    points: 85,
    note: 'Out-of-network but fast scheduling available',
    address: '555 Rapid Care Lane',
    hours: 'Mon-Fri 8AM-4PM',
    amenities: ['Fast scheduling', 'Quick turnaround', 'Same-week appointments']
  }
];

// Helper function to get colonoscopy providers
export const getColonoscopyProviders = (): ColonoscopyProvider[] => {
  return colonoscopyProviders;
};

// Helper function to get a specific colonoscopy provider by ID
export const getColonoscopyProviderById = (id: string): ColonoscopyProvider | undefined => {
  return colonoscopyProviders.find(provider => provider.id === id);
};

// Helper function to sort providers
export const sortColonoscopyProviders = (
  providers: ColonoscopyProvider[],
  sortBy: 'price' | 'distance' | 'rating' | 'savings'
): ColonoscopyProvider[] => {
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
export const filterColonoscopyProviders = (
  providers: ColonoscopyProvider[],
  filters: {
    network?: 'In-Network' | 'Out-of-Network' | 'all';
    maxDistance?: number;
    minRating?: number;
    marioPick?: boolean;
  }
): ColonoscopyProvider[] => {
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
