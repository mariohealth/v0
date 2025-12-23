export interface Specialty {
  id: string;
  name: string;
  description: string;
  doctorCount: number;
  hospitalCount?: number; // Number of unique hospitals
}

export interface HospitalInfo {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  insuranceAccepted: string[];
  lat: number;
  lng: number;
}

export const hospitals: Record<string, HospitalInfo> = {
  ucsf: {
    id: 'ucsf',
    name: 'UCSF Medical Center',
    address: '505 Parnassus Ave, San Francisco, CA 94143',
    phone: '(415) 476-1000',
    hours: 'Mon-Fri: 8:00 AM - 5:00 PM',
    insuranceAccepted: ['Blue Shield', 'Aetna', 'Cigna', 'United Healthcare', 'Medicare'],
    lat: 37.7626,
    lng: -122.4574
  },
  stanford: {
    id: 'stanford',
    name: 'Stanford Health Care',
    address: '300 Pasteur Dr, Stanford, CA 94305',
    phone: '(650) 498-3333',
    hours: 'Mon-Fri: 7:00 AM - 6:00 PM',
    insuranceAccepted: ['Blue Cross', 'Aetna', 'Health Net', 'United Healthcare', 'Medicare'],
    lat: 37.4419,
    lng: -122.1711
  },
  kaiser_mission_bay: {
    id: 'kaiser_mission_bay',
    name: 'Kaiser Permanente Mission Bay',
    address: '1600 Owens St, San Francisco, CA 94158',
    phone: '(415) 833-2000',
    hours: 'Mon-Sun: 8:00 AM - 8:00 PM',
    insuranceAccepted: ['Kaiser Permanente', 'Blue Shield (select plans)', 'Medicare Advantage'],
    lat: 37.7697,
    lng: -122.3933
  },
  cpmc_van_ness: {
    id: 'cpmc_van_ness',
    name: 'CPMC Van Ness Campus',
    address: '1101 Van Ness Ave, San Francisco, CA 94109',
    phone: '(415) 600-6000',
    hours: 'Mon-Fri: 8:30 AM - 5:30 PM',
    insuranceAccepted: ['Blue Shield', 'Aetna', 'Anthem', 'Cigna', 'United Healthcare'],
    lat: 37.7876,
    lng: -122.4213
  },
  sutter_cpmc: {
    id: 'sutter_cpmc',
    name: 'Sutter Health CPMC',
    address: '45 Castro St, San Francisco, CA 94114',
    phone: '(415) 600-6000',
    hours: 'Mon-Fri: 9:00 AM - 5:00 PM',
    insuranceAccepted: ['Blue Shield', 'Health Net', 'Cigna', 'United Healthcare', 'Medicare'],
    lat: 37.7626,
    lng: -122.4351
  },
  sutter_oakland: {
    id: 'sutter_oakland',
    name: 'Sutter Health Oakland',
    address: '350 Hawthorne Ave, Oakland, CA',
    phone: '(510) 655-4000',
    hours: 'Mon-Fri: 8:00 AM - 6:00 PM',
    insuranceAccepted: ['Blue Shield', 'Aetna', 'Health Net', 'Cigna', 'United Healthcare', 'Medicare'],
    lat: 37.8242,
    lng: -122.2592
  },
  one_medical_soma: {
    id: 'one_medical_soma',
    name: 'One Medical – SoMa',
    address: '153 Townsend St, San Francisco, CA',
    phone: '(415) 644-0673',
    hours: 'Mon-Fri: 8:00 AM - 8:00 PM, Sat-Sun: 9:00 AM - 5:00 PM',
    insuranceAccepted: ['Aetna', 'Blue Cross', 'Cigna', 'United Healthcare', 'Oscar'],
    lat: 37.7784,
    lng: -122.3926
  },
  kaiser_richmond: {
    id: 'kaiser_richmond',
    name: 'Kaiser Permanente Richmond',
    address: '901 Nevin Ave, Richmond, CA',
    phone: '(510) 307-1500',
    hours: 'Mon-Sun: 8:00 AM - 8:00 PM',
    insuranceAccepted: ['Kaiser Permanente', 'Medicare Advantage'],
    lat: 37.9361,
    lng: -122.3441
  },
  stanford_derm: {
    id: 'stanford_derm',
    name: 'Stanford Dermatology Clinic',
    address: '450 Broadway St, Redwood City, CA',
    phone: '(650) 723-6316',
    hours: 'Mon-Fri: 8:00 AM - 5:00 PM',
    insuranceAccepted: ['Blue Cross', 'Aetna', 'Health Net', 'United Healthcare', 'Medicare'],
    lat: 37.485,
    lng: -122.23
  },
  ucsf_mount_zion: {
    id: 'ucsf_mount_zion',
    name: 'UCSF Mount Zion',
    address: '1600 Divisadero St, San Francisco, CA',
    phone: '(415) 567-6600',
    hours: 'Mon-Fri: 8:00 AM - 5:00 PM',
    insuranceAccepted: ['Blue Shield', 'Aetna', 'Cigna', 'United Healthcare', 'Medicare'],
    lat: 37.7869,
    lng: -122.4381
  }
};

export const specialties: Specialty[] = [
  {
    id: 'allergy-immunology',
    name: 'Allergy & Immunology',
    description: 'Allergies, asthma, and immune system disorders',
    doctorCount: 8
  },
  {
    id: 'cardiology',
    name: 'Cardiology',
    description: 'Heart and cardiovascular conditions',
    doctorCount: 12
  },
  {
    id: 'dermatology',
    name: 'Dermatology',
    description: 'Skin, hair, and nail conditions',
    doctorCount: 15
  },
  {
    id: 'endocrinology',
    name: 'Endocrinology',
    description: 'Hormones, diabetes, and metabolism',
    doctorCount: 9
  },
  {
    id: 'gastroenterology',
    name: 'Gastroenterology',
    description: 'Digestive system and GI tract',
    doctorCount: 11
  },
  {
    id: 'neurology',
    name: 'Neurology',
    description: 'Brain, spine, and nervous system',
    doctorCount: 10
  },
  {
    id: 'obgyn',
    name: 'OB/GYN',
    description: "Women's health and reproductive care",
    doctorCount: 14
  },
  {
    id: 'orthopedics',
    name: 'Orthopedics',
    description: 'Bones, joints, and musculoskeletal system',
    doctorCount: 16
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics',
    description: 'Healthcare for infants, children, and adolescents',
    doctorCount: 18
  },
  {
    id: 'primary-care',
    name: 'Primary Care',
    description: 'General healthcare and preventive medicine',
    doctorCount: 25
  },
  {
    id: 'psychiatry',
    name: 'Psychiatry',
    description: 'Mental health and behavioral disorders',
    doctorCount: 13
  },
  {
    id: 'pulmonology',
    name: 'Pulmonology',
    description: 'Lungs and respiratory system',
    doctorCount: 7
  }
];

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  price: string;
  savings: string;
  rating: string;
  reviews: string;
  distance: string;
  network: string;
  yearsExperience: number;
  acceptingNewPatients: boolean;
  nextAvailable?: string;
  marioPick?: boolean;
  location?: string;
  education?: string;
  languages?: string[];
  bio?: string;
}

export const doctors: Doctor[] = [];


// Provider-Hospital Pairing type definition
export interface ProviderHospitalPairing {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  hospital: string;
  hospitalId: string;
  price: string;
  savings: string;
  rating: string;
  reviews: string;
  distance: string;
  network: 'In-Network' | 'Out-of-Network';
  marioPick?: boolean;
  yearsExperience: number;
  acceptingNewPatients: boolean;
  nextAvailable?: string;
  marioPoints?: number;
}

// Provider-Hospital Pairings for Specialty Search Results
// Each pairing represents a unique doctor-hospital combination
export const providerHospitalPairings: ProviderHospitalPairing[] = [];


// Helper functions
export function getSpecialtyById(id: string): Specialty | undefined {
  return specialties.find(s => s.id === id);
}

export function getDoctorsBySpecialty(specialtyName: string): Doctor[] {
  return doctors.filter(d => d.specialty === specialtyName);
}

export function getDoctorById(id: string): Doctor | undefined {
  return doctors.find(d => d.id === id);
}

export function getAllDoctors(): Doctor[] {
  return doctors;
}

export function searchDoctors(query: string): Doctor[] {
  const lowerQuery = query.toLowerCase();
  return doctors.filter(
    d =>
      d.name.toLowerCase().includes(lowerQuery) ||
      d.specialty.toLowerCase().includes(lowerQuery)
  );
}

// Get provider-hospital pairings by specialty
export function getProviderHospitalPairingsBySpecialty(specialtyId: string): ProviderHospitalPairing[] {
  const specialty = getSpecialtyById(specialtyId);
  if (!specialty) return [];

  return providerHospitalPairings.filter(p => p.specialty === specialty.name);
}

// Get provider-hospital pairings by hospital AND specialty
export function getProviderHospitalPairingsByHospitalAndSpecialty(
  hospitalId: string,
  specialtyId: string
): ProviderHospitalPairing[] {
  const specialty = getSpecialtyById(specialtyId);
  if (!specialty) return [];

  return providerHospitalPairings.filter(
    p => p.hospitalId === hospitalId && p.specialty === specialty.name
  );
}

// Get all provider-hospital pairings by hospital
export function getProviderHospitalPairingsByHospital(hospitalId: string): ProviderHospitalPairing[] {
  return providerHospitalPairings.filter(p => p.hospitalId === hospitalId);
}

// Get unique specialties at a hospital with doctor counts
export function getSpecialtiesAtHospital(hospitalId: string): Array<{
  id: string;
  name: string;
  doctorCount: number;
}> {
  const pairings = getProviderHospitalPairingsByHospital(hospitalId);

  // Group by specialty
  const specialtyMap = new Map<string, number>();
  pairings.forEach(p => {
    const count = specialtyMap.get(p.specialty) || 0;
    specialtyMap.set(p.specialty, count + 1);
  });

  // Convert to array with specialty IDs
  const result: Array<{ id: string; name: string; doctorCount: number }> = [];
  specialtyMap.forEach((count, specialtyName) => {
    const specialty = specialties.find(s => s.name === specialtyName);
    if (specialty) {
      result.push({
        id: specialty.id,
        name: specialty.name,
        doctorCount: count
      });
    }
  });

  // Sort by name
  return result.sort((a, b) => a.name.localeCompare(b.name));
}

// Get unique hospital count for a specialty
// Export alias for compatibility
export const marioDoctorsData = doctors;

export function getUniqueHospitalCount(specialtyId: string): number {
  const pairings = getProviderHospitalPairingsBySpecialty(specialtyId);
  const uniqueHospitals = new Set(pairings.map(p => p.hospitalId));
  return uniqueHospitals.size;
}