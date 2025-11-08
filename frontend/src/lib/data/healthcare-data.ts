// Mario Health - Realistic Healthcare Data
// This file contains comprehensive mock data for the healthcare platform

export interface Provider {
  id: string;
  name: string;
  specialty: string;
  type: 'doctor' | 'facility' | 'clinic' | 'hospital';
  avatar?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  website?: string;
  distance: number; // miles from user
  inNetwork: boolean;
  rating: number;
  reviewCount: number;
  hours: {
    [key: string]: string;
  };
  services: string[];
  acceptedInsurance: string[];
  about: string;
  costs: {
    [service: string]: {
      facilityFee?: number;
      professionalFee?: number;
      total: number;
      median: number;
      savings: number;
      percentSavings: number;
    };
  };
  marioPick?: boolean;
  marioPoints: number;
}

export interface Medication {
  id: string;
  name: string;
  genericName?: string;
  dosage: string;
  form: 'tablet' | 'capsule' | 'liquid' | 'injection';
  quantities: number[];
  insurancePrice: {
    copay: number;
    pharmacy: string;
  };
  cashPrices: Array<{
    pharmacy: string;
    price: number;
    distance?: number;
    delivery?: boolean;
    deliveryTime?: string;
  }>;
  marioPick?: {
    pharmacy: string;
    price: number;
    savings: number;
  };
  marioPoints: number;
}

export interface Appointment {
  id: string;
  providerId: string;
  providerName: string;
  specialty: string;
  date: string;
  time: string;
  service: string;
  address: string;
  estimatedCost: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  marioPoints?: number;
}

export interface ConciergeRequest {
  id: string;
  type: 'appointment' | 'price_check' | 'claim_dispute' | 'general';
  title: string;
  description: string;
  status: 'submitted' | 'in_progress' | 'confirming' | 'completed' | 'cancelled';
  progress: number;
  expectedDate?: string;
  providerId?: string;
  providerName?: string;
  service?: string;
  submittedDate: string;
  updates: Array<{
    date: string;
    message: string;
    type: 'info' | 'progress' | 'completed';
  }>;
}

export interface Claim {
  id: string;
  claimNumber: string;
  providerId: string;
  providerName: string;
  service: string;
  dateOfService: string;
  billedAmount: number;
  insurancePaid: number;
  patientResponsibility: number;
  status: 'paid' | 'pending' | 'denied' | 'under_appeal';
  denialReason?: string;
  denialCode?: string;
  documents: Array<{
    name: string;
    type: 'eob' | 'bill' | 'receipt';
    url: string;
  }>;
}

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'service' | 'provider' | 'medication' | 'specialty';
  category: string;
  icon: string;
}

// Mock Providers Data
export const providers: Provider[] = [
  {
    id: 'dr-jane-smith',
    name: 'Dr. Jane Smith',
    specialty: 'Radiology',
    type: 'doctor',
    address: '123 Main St, Suite 200',
    city: 'Austin',
    state: 'TX',
    zipCode: '78701',
    phone: '(555) 123-4567',
    website: 'https://example.com',
    distance: 2.5,
    inNetwork: true,
    rating: 4.8,
    reviewCount: 124,
    hours: {
      'Monday': '9:00 AM - 5:00 PM',
      'Tuesday': '9:00 AM - 5:00 PM',
      'Wednesday': '9:00 AM - 5:00 PM',
      'Thursday': '9:00 AM - 5:00 PM',
      'Friday': '9:00 AM - 5:00 PM',
      'Saturday': '10:00 AM - 2:00 PM',
      'Sunday': 'Closed'
    },
    services: ['MRI', 'CT Scan', 'X-Ray', 'Ultrasound'],
    acceptedInsurance: ['Blue Cross Blue Shield', 'Aetna', 'Cigna', 'UnitedHealth'],
    about: 'Dr. Smith is a board-certified radiologist with over 15 years of experience in diagnostic imaging. She specializes in musculoskeletal MRI and has a particular interest in sports-related injuries.',
    costs: {
      'MRI': {
        facilityFee: 300,
        professionalFee: 150,
        total: 450,
        median: 565,
        savings: 115,
        percentSavings: 20
      }
    },
    marioPick: true,
    marioPoints: 100
  },
  {
    id: 'city-imaging',
    name: 'City Imaging Center',
    specialty: 'Radiology',
    type: 'facility',
    address: '456 Oak Ave',
    city: 'Austin',
    state: 'TX',
    zipCode: '78702',
    phone: '(555) 234-5678',
    distance: 4.2,
    inNetwork: false,
    rating: 4.5,
    reviewCount: 89,
    hours: {
      'Monday': '8:00 AM - 6:00 PM',
      'Tuesday': '8:00 AM - 6:00 PM',
      'Wednesday': '8:00 AM - 6:00 PM',
      'Thursday': '8:00 AM - 6:00 PM',
      'Friday': '8:00 AM - 6:00 PM',
      'Saturday': '9:00 AM - 3:00 PM',
      'Sunday': 'Closed'
    },
    services: ['MRI', 'CT Scan', 'PET Scan', 'Mammography'],
    acceptedInsurance: ['Aetna', 'Cigna', 'Humana'],
    about: 'Modern imaging facility with state-of-the-art equipment and experienced technologists.',
    costs: {
      'MRI': {
        facilityFee: 525,
        professionalFee: 100,
        total: 625,
        median: 565,
        savings: -60,
        percentSavings: -11
      }
    },
    marioPick: false,
    marioPoints: 50
  },
  {
    id: 'austin-clinic',
    name: 'Austin Medical Clinic',
    specialty: 'Family Medicine',
    type: 'clinic',
    address: '789 Cedar Blvd',
    city: 'Austin',
    state: 'TX',
    zipCode: '78703',
    phone: '(555) 345-6789',
    distance: 1.8,
    inNetwork: true,
    rating: 4.6,
    reviewCount: 156,
    hours: {
      'Monday': '7:00 AM - 7:00 PM',
      'Tuesday': '7:00 AM - 7:00 PM',
      'Wednesday': '7:00 AM - 7:00 PM',
      'Thursday': '7:00 AM - 7:00 PM',
      'Friday': '7:00 AM - 6:00 PM',
      'Saturday': '8:00 AM - 4:00 PM',
      'Sunday': '10:00 AM - 4:00 PM'
    },
    services: ['Primary Care', 'Lab Work', 'Vaccinations', 'Annual Physicals'],
    acceptedInsurance: ['Blue Cross Blue Shield', 'Aetna', 'Cigna', 'UnitedHealth', 'Medicare'],
    about: 'Full-service family medicine clinic providing comprehensive primary care for all ages.',
    costs: {
      'Office Visit': {
        total: 150,
        median: 180,
        savings: 30,
        percentSavings: 17
      }
    },
    marioPick: false,
    marioPoints: 75
  },
  {
    id: 'dr-michael-chen',
    name: 'Dr. Michael Chen',
    specialty: 'Dermatology',
    type: 'doctor',
    address: '321 Pine St, Floor 3',
    city: 'Austin',
    state: 'TX',
    zipCode: '78704',
    phone: '(555) 456-7890',
    distance: 3.7,
    inNetwork: true,
    rating: 4.9,
    reviewCount: 203,
    hours: {
      'Monday': '8:00 AM - 5:00 PM',
      'Tuesday': '8:00 AM - 5:00 PM',
      'Wednesday': '8:00 AM - 5:00 PM',
      'Thursday': '8:00 AM - 5:00 PM',
      'Friday': '8:00 AM - 4:00 PM',
      'Saturday': 'Closed',
      'Sunday': 'Closed'
    },
    services: ['Skin Cancer Screening', 'Mole Removal', 'Acne Treatment', 'Cosmetic Procedures'],
    acceptedInsurance: ['Blue Cross Blue Shield', 'UnitedHealth', 'Humana'],
    about: 'Board-certified dermatologist specializing in skin cancer detection and cosmetic dermatology.',
    costs: {
      'Consultation': {
        total: 175,
        median: 195,
        savings: 20,
        percentSavings: 10
      }
    },
    marioPick: false,
    marioPoints: 85
  }
];

// Mock Medications Data
export const medications: Medication[] = [
  {
    id: 'atorvastatin-20mg',
    name: 'Atorvastatin',
    genericName: 'Atorvastatin Calcium',
    dosage: '20mg',
    form: 'tablet',
    quantities: [30, 60, 90],
    insurancePrice: {
      copay: 15,
      pharmacy: 'Preferred Network'
    },
    cashPrices: [
      {
        pharmacy: 'Cost Plus Drugs',
        price: 8.50,
        delivery: true,
        deliveryTime: '5-7 business days'
      },
      {
        pharmacy: 'Walmart',
        price: 12.00,
        distance: 1.2
      },
      {
        pharmacy: 'Walgreens',
        price: 15.00,
        distance: 2.5
      },
      {
        pharmacy: 'CVS',
        price: 18.00,
        distance: 3.1
      }
    ],
    marioPick: {
      pharmacy: 'Cost Plus Drugs',
      price: 8.50,
      savings: 6.50
    },
    marioPoints: 50
  },
  {
    id: 'metformin-1000mg',
    name: 'Metformin',
    genericName: 'Metformin Hydrochloride',
    dosage: '1000mg',
    form: 'tablet',
    quantities: [30, 60, 90],
    insurancePrice: {
      copay: 10,
      pharmacy: 'Preferred Network'
    },
    cashPrices: [
      {
        pharmacy: 'GoodRx',
        price: 4.00,
        delivery: true,
        deliveryTime: '3-5 business days'
      },
      {
        pharmacy: 'Costco',
        price: 6.50,
        distance: 5.2
      },
      {
        pharmacy: 'HEB',
        price: 8.00,
        distance: 2.1
      }
    ],
    marioPick: {
      pharmacy: 'GoodRx',
      price: 4.00,
      savings: 6.00
    },
    marioPoints: 40
  },
  {
    id: 'lisinopril-10mg',
    name: 'Lisinopril',
    dosage: '10mg',
    form: 'tablet',
    quantities: [30, 60, 90],
    insurancePrice: {
      copay: 12,
      pharmacy: 'Preferred Network'
    },
    cashPrices: [
      {
        pharmacy: 'Mark Cuban Cost Plus',
        price: 3.90,
        delivery: true,
        deliveryTime: '5-7 business days'
      },
      {
        pharmacy: 'Walmart',
        price: 9.00,
        distance: 1.2
      },
      {
        pharmacy: 'Target',
        price: 11.00,
        distance: 1.8
      }
    ],
    marioPick: {
      pharmacy: 'Mark Cuban Cost Plus',
      price: 3.90,
      savings: 8.10
    },
    marioPoints: 45
  }
];

// Mock Appointments Data
export const appointments: Appointment[] = [
  {
    id: 'appt-001',
    providerId: 'dr-jane-smith',
    providerName: 'Dr. Jane Smith',
    specialty: 'Radiology',
    date: '2025-01-15',
    time: '2:00 PM',
    service: 'MRI - Knee',
    address: '123 Main St, Suite 200, Austin, TX 78701',
    estimatedCost: 450,
    status: 'upcoming',
    marioPoints: 100
  },
  {
    id: 'appt-002',
    providerId: 'dr-michael-chen',
    providerName: 'Dr. Michael Chen',
    specialty: 'Dermatology',
    date: '2025-01-08',
    time: '10:30 AM',
    service: 'Annual Skin Check',
    address: '321 Pine St, Floor 3, Austin, TX 78704',
    estimatedCost: 175,
    status: 'completed',
    marioPoints: 85
  }
];

// Mock Concierge Requests
export const conciergeRequests: ConciergeRequest[] = [
  {
    id: 'req-001',
    type: 'appointment',
    title: 'MRI Booking Request',
    description: 'Book MRI appointment for knee pain',
    status: 'confirming',
    progress: 75,
    expectedDate: '2025-01-15',
    providerId: 'dr-jane-smith',
    providerName: 'Dr. Jane Smith',
    service: 'MRI - Knee',
    submittedDate: '2025-01-03',
    updates: [
      {
        date: '2025-01-03',
        message: 'Request submitted - finding available appointments',
        type: 'info'
      },
      {
        date: '2025-01-04',
        message: 'Contacted provider, checking availability',
        type: 'progress'
      },
      {
        date: '2025-01-05',
        message: 'Appointment slot found - confirming with provider',
        type: 'progress'
      }
    ]
  }
];

// Mock Claims Data
export const claims: Claim[] = [
  {
    id: 'claim-001',
    claimNumber: '12345',
    providerId: 'austin-clinic',
    providerName: 'Austin Medical Clinic',
    service: 'Office Visit - Primary Care',
    dateOfService: '2024-12-15',
    billedAmount: 250,
    insurancePaid: 200,
    patientResponsibility: 50,
    status: 'paid',
    documents: [
      { name: 'Explanation of Benefits', type: 'eob', url: '/documents/eob-12345.pdf' },
      { name: 'Itemized Bill', type: 'bill', url: '/documents/bill-12345.pdf' }
    ]
  },
  {
    id: 'claim-002',
    claimNumber: '12346',
    providerId: 'dr-michael-chen',
    providerName: 'Dr. Michael Chen',
    service: 'Dermatology Consultation',
    dateOfService: '2024-12-08',
    billedAmount: 175,
    insurancePaid: 0,
    patientResponsibility: 175,
    status: 'denied',
    denialReason: 'Service not medically necessary',
    denialCode: 'CO-50',
    documents: [
      { name: 'Denial Letter', type: 'eob', url: '/documents/denial-12346.pdf' }
    ]
  },
  {
    id: 'claim-003',
    claimNumber: '12347',
    providerId: 'city-imaging',
    providerName: 'City Imaging Center',
    service: 'CT Scan - Abdomen',
    dateOfService: '2024-12-20',
    billedAmount: 800,
    insurancePaid: 0,
    patientResponsibility: 800,
    status: 'pending',
    documents: [
      { name: 'Submitted Claim', type: 'bill', url: '/documents/claim-12347.pdf' }
    ]
  }
];

// Search Suggestions
export const searchSuggestions: SearchSuggestion[] = [
  { id: '1', text: 'MRI (Magnetic Resonance Imaging)', type: 'service', category: 'Imaging', icon: '🧲' },
  { id: '2', text: 'MRI - Knee', type: 'service', category: 'Imaging', icon: '🦵' },
  { id: '3', text: 'MRI - Lower Extremity', type: 'service', category: 'Imaging', icon: '🦴' },
  { id: '4', text: 'CT Scan', type: 'service', category: 'Imaging', icon: '🔍' },
  { id: '5', text: 'Blood Test', type: 'service', category: 'Lab Work', icon: '🩸' },
  { id: '6', text: 'Annual Physical', type: 'service', category: 'Primary Care', icon: '🩺' },
  { id: '7', text: 'Dermatology', type: 'specialty', category: 'Specialty', icon: '🧴' },
  { id: '8', text: 'Primary Care', type: 'specialty', category: 'Specialty', icon: '👩‍⚕️' },
  { id: '9', text: 'Urgent Care', type: 'specialty', category: 'Specialty', icon: '🚑' },
  { id: '10', text: 'Atorvastatin', type: 'medication', category: 'Medication', icon: '💊' },
  { id: '11', text: 'Metformin', type: 'medication', category: 'Medication', icon: '💊' },
  { id: '12', text: 'Blood Pressure Check', type: 'service', category: 'Primary Care', icon: '🩺' },
  { id: '13', text: 'Vaccination', type: 'service', category: 'Preventive Care', icon: '💉' },
  { id: '14', text: 'Eye Exam', type: 'service', category: 'Vision', icon: '👁️' },
  { id: '15', text: 'Dental Cleaning', type: 'service', category: 'Dental', icon: '🦷' }
];

// User's insurance and deductible info
export const userInsurance = {
  provider: 'Blue Cross Blue Shield',
  planName: 'PPO Plus',
  memberId: 'ABC123456789',
  deductible: {
    total: 2000,
    met: 850,
    remaining: 1150,
    percentage: 42.5
  },
  copays: {
    primaryCare: 25,
    specialist: 50,
    urgentCare: 75,
    emergency: 200
  }
};

// Common search categories for home page
export const commonSearches = [
  'MRI',
  'Blood Test', 
  'Primary Care',
  'Dermatology',
  'Urgent Care',
  'Annual Physical',
  'Lab Work',
  'CT Scan'
];

// Helper functions
export const getProviderById = (id: string): Provider | undefined => {
  return providers.find(provider => provider.id === id);
};

export const getMedicationById = (id: string): Medication | undefined => {
  return medications.find(medication => medication.id === id);
};

export const searchProviders = (query: string, filters?: {
  inNetworkOnly?: boolean;
  maxDistance?: number;
  sortBy?: 'distance' | 'price' | 'rating' | 'best_value';
}): Provider[] => {
  let results = providers.filter(provider => 
    provider.name.toLowerCase().includes(query.toLowerCase()) ||
    provider.specialty.toLowerCase().includes(query.toLowerCase()) ||
    provider.services.some(service => service.toLowerCase().includes(query.toLowerCase()))
  );

  if (filters?.inNetworkOnly) {
    results = results.filter(provider => provider.inNetwork);
  }

  if (filters?.maxDistance) {
    results = results.filter(provider => provider.distance <= filters.maxDistance!);
  }

  // Sort results
  switch (filters?.sortBy) {
    case 'distance':
      results.sort((a, b) => a.distance - b.distance);
      break;
    case 'rating':
      results.sort((a, b) => b.rating - a.rating);
      break;
    case 'best_value':
    default:
      // Mario's Pick first, then by combination of factors
      results.sort((a, b) => {
        if (a.marioPick && !b.marioPick) return -1;
        if (!a.marioPick && b.marioPick) return 1;
        return a.distance - b.distance; // Secondary sort by distance
      });
      break;
  }

  return results;
};

export const searchMedications = (query: string): Medication[] => {
  return medications.filter(medication =>
    medication.name.toLowerCase().includes(query.toLowerCase()) ||
    (medication.genericName && medication.genericName.toLowerCase().includes(query.toLowerCase()))
  );
};

export const getSearchSuggestions = (query: string): SearchSuggestion[] => {
  if (query.length < 2) return [];
  
  return searchSuggestions
    .filter(suggestion => 
      suggestion.text.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 6); // Limit to 6 suggestions as per design spec
};