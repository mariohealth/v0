// Extended interfaces for provider detail & booking
export interface TimeSlot {
  id: string;
  date: string; // ISO format: "2025-10-26"
  time: string; // "09:00 AM"
  available: boolean;
}

export interface Review {
  id: string;
  patientName: string;
  rating: number; // 1-5
  date: string;
  comment: string;
  procedure?: string;
}

export interface ProviderImage {
  id: string;
  url: string;
  alt: string;
  type: 'facility' | 'staff' | 'equipment';
}

export interface Provider {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'imaging_center' | 'lab';
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice?: number;
  distance: string;
  address:
  | string
  | {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  neighborhood: string;
  availability: string;
  imageUrl?: string;
  badges?: string[];
  acceptsInsurance: boolean;
  insurancePartners?: string[];

  // --- New detail page fields ---
  about?: string;
  specialties?: string[];
  languages?: string[];
  acceptedInsurance?: string[];
  images?: ProviderImage[];
  reviews?: Review[];
  availableTimeSlots?: TimeSlot[];
  phone?: string;
  website?: string;
  parkingAvailable?: boolean;
  wheelchairAccessible?: boolean;
  requiresReferral?: boolean;
  newPatientAccepted?: boolean;

  // --- Additional fields for components ---
  negotiatedRate?: number;
  standardRate?: number;
  savings?: number;
  savingsPercent?: number;
  insurance?: string[];
}

export const mockProviders: Provider[] = [
  {
    id: '1',
    name: 'NewYork-Presbyterian Hospital',
    type: 'hospital',
    rating: 4.8,
    reviewCount: 1247,
    price: 450,
    originalPrice: 750,
    distance: '2.3 miles',
    address: {
      street: '525 East 68th Street',
      city: 'New York',
      state: 'NY',
      zip: '10065',
    },
    neighborhood: 'Upper East Side',
    availability: 'Next available: Tomorrow 9:00 AM',
    acceptsInsurance: true,
    insurancePartners: ['UnitedHealthcare', 'Aetna', 'Cigna', 'Blue Cross'],
    phone: '(212) 746-5454',
    website: 'https://www.nyp.org',
    about:
      "NewYork-Presbyterian is one of the nation's most comprehensive academic health care delivery systems, dedicated to providing the highest quality, most compassionate care to patients in the New York metropolitan area and throughout the globe.",
    specialties: ['Cardiology', 'Orthopedics', 'Neurology', 'Oncology', 'Primary Care'],
    languages: ['English', 'Spanish', 'Chinese', 'Russian'],
    acceptedInsurance: [
      'UnitedHealthcare',
      'Aetna',
      'Cigna',
      'Blue Cross Blue Shield',
      'Empire BlueCross',
      'Medicare',
      'Medicaid',
    ],
    parkingAvailable: true,
    wheelchairAccessible: true,
    requiresReferral: false,
    newPatientAccepted: true,

    // Additional fields for components
    negotiatedRate: 450,
    standardRate: 750,
    savings: 300,
    savingsPercent: 40,
    insurance: ['UnitedHealthcare', 'Aetna', 'Cigna', 'Blue Cross'],
    images: [
      {
        id: 'img1',
        url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop',
        alt: 'Hospital exterior',
        type: 'facility',
      },
      {
        id: 'img2',
        url: 'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=800&auto=format&fit=crop',
        alt: 'Modern waiting area',
        type: 'facility',
      },
      {
        id: 'img3',
        url: 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=800&auto=format&fit=crop',
        alt: 'Medical equipment',
        type: 'equipment',
      },
    ],
    reviews: [
      {
        id: 'rev1',
        patientName: 'Sarah M.',
        rating: 5,
        date: '2025-10-15',
        comment:
          'Excellent care and very professional staff. The facility is modern and clean. Wait time was minimal.',
        procedure: 'Routine Physical Exam',
      },
      {
        id: 'rev2',
        patientName: 'Michael K.',
        rating: 4,
        date: '2025-10-10',
        comment:
          'Great experience overall. Dr. Johnson was thorough and explained everything clearly.',
        procedure: 'Blood Work',
      },
      {
        id: 'rev3',
        patientName: 'Jennifer L.',
        rating: 5,
        date: '2025-10-05',
        comment:
          'Amazing facility with state-of-the-art equipment. Staff was friendly and accommodating.',
      },
    ],
    availableTimeSlots: generateTimeSlots(),
  },

  {
    id: '2',
    name: 'Lenox Hill Radiology',
    type: 'imaging_center',
    rating: 4.9,
    reviewCount: 856,
    price: 650,
    originalPrice: 1200,
    distance: '1.8 miles',
    address: '61 E 77th Street',
    neighborhood: 'Upper East Side',
    availability: 'Next available: Today 2:30 PM',
    badges: ['Same Day Available', 'Insurance Partner'],
    acceptsInsurance: true,
    insurancePartners: ['Cigna', 'Aetna', 'Oxford'],
  },
  {
    id: '3',
    name: 'NYU Langone Health',
    type: 'hospital',
    rating: 4.7,
    reviewCount: 2103,
    price: 920,
    originalPrice: 1650,
    distance: '3.2 miles',
    address: '550 1st Avenue',
    neighborhood: 'Kips Bay',
    availability: 'Next available: Oct 25, 10:00 AM',
    badges: ['Academic Medical Center', 'Insurance Partner'],
    acceptsInsurance: true,
    insurancePartners: ['All major insurers'],
  },
  {
    id: '4',
    name: 'CityMD Urgent Care - Chelsea',
    type: 'clinic',
    rating: 4.5,
    reviewCount: 634,
    price: 425,
    originalPrice: 800,
    distance: '0.9 miles',
    address: '215 W 23rd Street',
    neighborhood: 'Chelsea',
    availability: 'Walk-ins welcome',
    badges: ['No Appointment Needed', 'Fast Service'],
    acceptsInsurance: true,
    insurancePartners: ['Most major insurers'],
  },
  {
    id: '5',
    name: 'Weill Cornell Imaging',
    type: 'imaging_center',
    rating: 4.6,
    reviewCount: 421,
    price: 780,
    originalPrice: 1400,
    distance: '2.5 miles',
    address: '1305 York Avenue',
    neighborhood: 'Upper East Side',
    availability: 'Next available: Oct 24, 3:00 PM',
    badges: ['Academic Affiliate', 'Insurance Partner'],
    acceptsInsurance: true,
    insurancePartners: ['Empire', 'Aetna', 'Cigna'],
  },
  {
    id: '6',
    name: 'Downtown Brooklyn Medical',
    type: 'clinic',
    rating: 4.4,
    reviewCount: 312,
    price: 550,
    originalPrice: 950,
    distance: '5.7 miles',
    address: '345 Jay Street',
    neighborhood: 'Downtown Brooklyn',
    availability: 'Next available: Tomorrow 11:00 AM',
    badges: ['Affordable', 'Evening Hours'],
    acceptsInsurance: true,
    insurancePartners: ['Medicaid', 'Medicare', 'Most insurers'],
  },
  {
    id: '7',
    name: 'Manhattan Diagnostic Center',
    type: 'imaging_center',
    rating: 4.9,
    reviewCount: 1089,
    price: 595,
    originalPrice: 1100,
    distance: '1.2 miles',
    address: '133 E 58th Street',
    neighborhood: 'Midtown East',
    availability: 'Next available: Today 4:00 PM',
    badges: ['Same Day Results', 'Premium Equipment'],
    acceptsInsurance: true,
    insurancePartners: ['All major insurers'],
  },
  {
    id: '8',
    name: 'Bellevue Hospital Center',
    type: 'hospital',
    rating: 4.3,
    reviewCount: 892,
    price: 720,
    originalPrice: 1350,
    distance: '2.8 miles',
    address: '462 1st Avenue',
    neighborhood: 'Kips Bay',
    availability: 'Next available: Oct 26, 8:00 AM',
    badges: ['Public Hospital', 'Safety Net Provider'],
    acceptsInsurance: true,
    insurancePartners: ['Medicaid', 'Medicare', 'All insurers'],
  },
  {
    id: '9',
    name: 'Tribeca Health & Wellness',
    type: 'clinic',
    rating: 4.7,
    reviewCount: 445,
    price: 680,
    originalPrice: 1150,
    distance: '3.5 miles',
    address: '78 Worth Street',
    neighborhood: 'Tribeca',
    availability: 'Next available: Tomorrow 1:30 PM',
    badges: ['Holistic Care', 'Concierge Service'],
    acceptsInsurance: false,
    insurancePartners: [],
  },
  {
    id: '10',
    name: 'Brooklyn Heights Imaging',
    type: 'imaging_center',
    rating: 4.6,
    reviewCount: 567,
    price: 620,
    originalPrice: 1080,
    distance: '4.9 miles',
    address: '142 Joralemon Street',
    neighborhood: 'Brooklyn Heights',
    availability: 'Next available: Oct 25, 9:30 AM',
    badges: ['Insurance Partner', 'Free Parking'],
    acceptsInsurance: true,
    insurancePartners: ['Blue Cross', 'Aetna', 'Oscar'],
  },
  {
    id: '11',
    name: 'Upper West Side Medical Group',
    type: 'clinic',
    rating: 4.8,
    reviewCount: 721,
    price: 495,
    originalPrice: 900,
    distance: '3.1 miles',
    address: '201 W 83rd Street',
    neighborhood: 'Upper West Side',
    availability: 'Next available: Today 5:00 PM',
    badges: ['Family Medicine', 'Same Day Available'],
    acceptsInsurance: true,
    insurancePartners: ['Most major insurers'],
  },
  {
    id: '12',
    name: 'Hudson Yards Diagnostic',
    type: 'imaging_center',
    rating: 4.5,
    reviewCount: 298,
    price: 875,
    originalPrice: 1550,
    distance: '1.5 miles',
    address: '450 W 33rd Street',
    neighborhood: 'Hudson Yards',
    availability: 'Next available: Oct 24, 1:00 PM',
    badges: ['New Facility', 'State-of-Art Equipment'],
    acceptsInsurance: true,
    insurancePartners: ['Aetna', 'UnitedHealthcare', 'Cigna'],
  },
];

// Helper function to generate mock time slots
function generateTimeSlots(): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const today = new Date();

  for (let dayOffset = 1; dayOffset <= 7; dayOffset++) {
    const date = new Date(today);
    date.setDate(date.getDate() + dayOffset);
    const dateStr = date.toISOString().split('T')[0];

    // Skip Sundays
    if (date.getDay() === 0) continue;

    const morningTimes = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'];
    const afternoonTimes = ['02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'];

    [...morningTimes, ...afternoonTimes].forEach((time, index) => {
      const available = Math.random() > 0.3;
      slots.push({
        id: `slot-${dayOffset}-${index}`,
        date: dateStr,
        time: time,
        available: available,
      });
    });
  }

  return slots;
}


// Helper function for filtering
export const filterProviders = (
  providers: Provider[],
  query?: string,
  priceRange?: [number, number],
  types?: string[],
  minRating?: number
): Provider[] => {
  return providers.filter((provider) => {
    // Search query filter - made more flexible
    if (query) {
      const searchLower = query.toLowerCase();

      // For medical procedures, show all providers that could perform them
      // This simulates a real search where "MRI" would return imaging centers
      const medicalKeywords = ['mri', 'ct', 'scan', 'xray', 'x-ray', 'ultrasound', 'imaging'];
      const isMedicalSearch = medicalKeywords.some((keyword) => searchLower.includes(keyword));

      if (isMedicalSearch) {
        // Show imaging centers and hospitals for medical imaging searches
        if (provider.type === 'imaging_center' || provider.type === 'hospital') {
          return true; // Continue to other filters
        }
      }

      // Regular search - check name, neighborhood, type
      const matchesQuery =
        provider.name.toLowerCase().includes(searchLower) ||
        provider.neighborhood.toLowerCase().includes(searchLower) ||
        provider.type.toLowerCase().replace('_', ' ').includes(searchLower);

      if (!matchesQuery && !isMedicalSearch) return false;
    }

    // Price range filter
    if (priceRange) {
      if (provider.price < priceRange[0] || provider.price > priceRange[1]) {
        return false;
      }
    }

    // Type filter
    if (types && types.length > 0) {
      if (!types.includes(provider.type)) return false;
    }

    // Rating filter
    if (minRating && provider.rating < minRating) {
      return false;
    }

    return true;
  });
};
