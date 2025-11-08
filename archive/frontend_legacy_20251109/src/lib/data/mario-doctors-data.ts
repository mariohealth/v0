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

export const doctors: Doctor[] = [
  // Primary Care
  {
    id: 'dr_angela_patel',
    name: 'Dr. Angela Patel',
    specialty: 'Primary Care',
    price: '$160',
    savings: '10% below average',
    rating: '4.8',
    reviews: '52',
    distance: '1.9 mi',
    network: 'In-Network',
    yearsExperience: 12,
    acceptingNewPatients: true,
    nextAvailable: 'Tomorrow at 10:00 AM'
  },
  {
    id: 'dr_james_wilson',
    name: 'Dr. James Wilson',
    specialty: 'Primary Care',
    price: '$145',
    savings: '18% below average',
    rating: '4.9',
    reviews: '84',
    distance: '2.3 mi',
    network: 'In-Network',
    marioPick: true,
    yearsExperience: 18,
    acceptingNewPatients: true,
    nextAvailable: 'Today at 3:30 PM'
  },
  {
    id: 'dr_maria_gonzalez',
    name: 'Dr. Maria Gonzalez',
    specialty: 'Primary Care',
    price: '$155',
    savings: '12% below average',
    rating: '4.7',
    reviews: '67',
    distance: '3.1 mi',
    network: 'In-Network',
    yearsExperience: 15,
    acceptingNewPatients: true,
    nextAvailable: 'Oct 12 at 9:00 AM'
  },

  // Pediatrics
  {
    id: 'dr_emily_rivera',
    name: 'Dr. Emily Rivera',
    specialty: 'Pediatrics',
    price: '$130',
    savings: '15% below average',
    rating: '4.8',
    reviews: '91',
    distance: '1.7 mi',
    network: 'In-Network',
    yearsExperience: 10,
    acceptingNewPatients: true,
    nextAvailable: 'Oct 11 at 2:00 PM'
  },
  {
    id: 'dr_david_kim',
    name: 'Dr. David Kim',
    specialty: 'Pediatrics',
    price: '$125',
    savings: '20% below average',
    rating: '4.9',
    reviews: '103',
    distance: '2.5 mi',
    network: 'In-Network',
    marioPick: true,
    yearsExperience: 14,
    acceptingNewPatients: true,
    nextAvailable: 'Tomorrow at 11:00 AM'
  },
  {
    id: 'dr_sarah_thompson',
    name: 'Dr. Sarah Thompson',
    specialty: 'Pediatrics',
    price: '$135',
    savings: '10% below average',
    rating: '4.8',
    reviews: '78',
    distance: '1.2 mi',
    network: 'In-Network',
    yearsExperience: 9,
    acceptingNewPatients: true,
    nextAvailable: 'Oct 13 at 8:30 AM'
  },

  // Cardiology
  {
    id: 'dr_lee_chen',
    name: 'Dr. Lee Chen',
    specialty: 'Cardiology',
    price: '$240',
    savings: '8% below average',
    rating: '4.7',
    reviews: '68',
    distance: '3.0 mi',
    network: 'In-Network',
    yearsExperience: 20,
    acceptingNewPatients: true,
    nextAvailable: 'Oct 15 at 1:00 PM'
  },
  {
    id: 'dr_rebecca_hart',
    name: 'Dr. Rebecca Hart',
    specialty: 'Cardiology',
    price: '$225',
    savings: '14% below average',
    rating: '4.9',
    reviews: '95',
    distance: '2.8 mi',
    network: 'In-Network',
    marioPick: true,
    yearsExperience: 22,
    acceptingNewPatients: true,
    nextAvailable: 'Oct 14 at 10:30 AM'
  },
  {
    id: 'dr_robert_mason',
    name: 'Dr. Robert Mason',
    specialty: 'Cardiology',
    price: '$250',
    savings: '4% below average',
    rating: '4.6',
    reviews: '54',
    distance: '4.2 mi',
    network: 'In-Network',
    yearsExperience: 25,
    acceptingNewPatients: false
  },

  // Dermatology
  {
    id: 'dr_michael_ortiz',
    name: 'Dr. Michael Ortiz',
    specialty: 'Dermatology',
    price: '$180',
    savings: '12% below average',
    rating: '4.9',
    reviews: '74',
    distance: '2.4 mi',
    network: 'In-Network',
    yearsExperience: 16,
    acceptingNewPatients: true,
    nextAvailable: 'Oct 16 at 3:00 PM'
  },
  {
    id: 'dr_lisa_chang',
    name: 'Dr. Lisa Chang',
    specialty: 'Dermatology',
    price: '$165',
    savings: '19% below average',
    rating: '4.8',
    reviews: '89',
    distance: '1.8 mi',
    network: 'In-Network',
    marioPick: true,
    yearsExperience: 13,
    acceptingNewPatients: true,
    nextAvailable: 'Tomorrow at 1:30 PM'
  },
  {
    id: 'dr_jennifer_brooks',
    name: 'Dr. Jennifer Brooks',
    specialty: 'Dermatology',
    price: '$175',
    savings: '14% below average',
    rating: '4.7',
    reviews: '62',
    distance: '2.9 mi',
    network: 'In-Network',
    yearsExperience: 11,
    acceptingNewPatients: true,
    nextAvailable: 'Oct 17 at 9:30 AM'
  },

  // Orthopedics
  {
    id: 'dr_sarah_johnson',
    name: 'Dr. Sarah Johnson',
    specialty: 'Orthopedics',
    price: '$425',
    savings: '35% below average',
    rating: '4.9',
    reviews: '127',
    distance: '2.1 mi',
    network: 'In-Network',
    marioPick: true,
    yearsExperience: 19,
    acceptingNewPatients: true,
    nextAvailable: 'Oct 12 at 2:30 PM'
  },
  {
    id: 'dr_thomas_anderson',
    name: 'Dr. Thomas Anderson',
    specialty: 'Orthopedics',
    price: '$450',
    savings: '28% below average',
    rating: '4.8',
    reviews: '98',
    distance: '3.5 mi',
    network: 'In-Network',
    yearsExperience: 23,
    acceptingNewPatients: true,
    nextAvailable: 'Oct 18 at 11:00 AM'
  },
  {
    id: 'dr_monica_patel',
    name: 'Dr. Monica Patel',
    specialty: 'Orthopedics',
    price: '$440',
    savings: '30% below average',
    rating: '4.7',
    reviews: '71',
    distance: '2.7 mi',
    network: 'In-Network',
    yearsExperience: 17,
    acceptingNewPatients: true,
    nextAvailable: 'Oct 19 at 8:00 AM'
  },

  // Endocrinology
  {
    id: 'dr_amanda_foster',
    name: 'Dr. Amanda Foster',
    specialty: 'Endocrinology',
    price: '$210',
    savings: '15% below average',
    rating: '4.8',
    reviews: '56',
    distance: '2.2 mi',
    network: 'In-Network',
    yearsExperience: 14,
    acceptingNewPatients: true,
    nextAvailable: 'Oct 20 at 10:00 AM'
  },
  {
    id: 'dr_kenneth_lee',
    name: 'Dr. Kenneth Lee',
    specialty: 'Endocrinology',
    price: '$195',
    savings: '21% below average',
    rating: '4.9',
    reviews: '82',
    distance: '1.9 mi',
    network: 'In-Network',
    marioPick: true,
    yearsExperience: 18,
    acceptingNewPatients: true,
    nextAvailable: 'Oct 14 at 2:00 PM'
  },

  // Gastroenterology
  {
    id: 'dr_steven_rodriguez',
    name: 'Dr. Steven Rodriguez',
    specialty: 'Gastroenterology',
    price: '$230',
    savings: '10% below average',
    rating: '4.7',
    reviews: '64',
    distance: '3.3 mi',
    network: 'In-Network',
    yearsExperience: 16,
    acceptingNewPatients: true,
    nextAvailable: 'Oct 21 at 1:30 PM'
  },
  {
    id: 'dr_patricia_nguyen',
    name: 'Dr. Patricia Nguyen',
    specialty: 'Gastroenterology',
    price: '$215',
    savings: '16% below average',
    rating: '4.8',
    reviews: '77',
    distance: '2.6 mi',
    network: 'In-Network',
    marioPick: true,
    yearsExperience: 15,
    acceptingNewPatients: true,
    nextAvailable: 'Oct 15 at 9:00 AM'
  },

  // Neurology
  {
    id: 'dr_christopher_davis',
    name: 'Dr. Christopher Davis',
    specialty: 'Neurology',
    price: '$265',
    savings: '12% below average',
    rating: '4.9',
    reviews: '91',
    distance: '2.4 mi',
    network: 'In-Network',
    marioPick: true,
    yearsExperience: 21,
    acceptingNewPatients: true,
    nextAvailable: 'Oct 22 at 11:30 AM'
  },
  {
    id: 'dr_elizabeth_martin',
    name: 'Dr. Elizabeth Martin',
    specialty: 'Neurology',
    price: '$280',
    savings: '7% below average',
    rating: '4.7',
    reviews: '58',
    distance: '3.8 mi',
    network: 'In-Network',
    yearsExperience: 19,
    acceptingNewPatients: true,
    nextAvailable: 'Oct 23 at 3:00 PM'
  },

  // Psychiatry
  {
    id: 'dr_rachel_cohen',
    name: 'Dr. Rachel Cohen',
    specialty: 'Psychiatry',
    price: '$185',
    savings: '18% below average',
    rating: '4.9',
    reviews: '106',
    distance: '1.5 mi',
    network: 'In-Network',
    marioPick: true,
    yearsExperience: 13,
    acceptingNewPatients: true,
    nextAvailable: 'Tomorrow at 4:00 PM'
  },
  {
    id: 'dr_anthony_garcia',
    name: 'Dr. Anthony Garcia',
    specialty: 'Psychiatry',
    price: '$200',
    savings: '11% below average',
    rating: '4.7',
    reviews: '72',
    distance: '2.8 mi',
    network: 'In-Network',
    yearsExperience: 16,
    acceptingNewPatients: true,
    nextAvailable: 'Oct 16 at 10:30 AM'
  },

  // Pulmonology
  {
    id: 'dr_daniel_white',
    name: 'Dr. Daniel White',
    specialty: 'Pulmonology',
    price: '$245',
    savings: '13% below average',
    rating: '4.8',
    reviews: '68',
    distance: '2.9 mi',
    network: 'In-Network',
    yearsExperience: 17,
    acceptingNewPatients: true,
    nextAvailable: 'Oct 24 at 2:00 PM'
  },
  {
    id: 'dr_melissa_taylor',
    name: 'Dr. Melissa Taylor',
    specialty: 'Pulmonology',
    price: '$230',
    savings: '18% below average',
    rating: '4.9',
    reviews: '85',
    distance: '2.1 mi',
    network: 'In-Network',
    marioPick: true,
    yearsExperience: 15,
    acceptingNewPatients: true,
    nextAvailable: 'Oct 17 at 11:00 AM'
  },

  // Allergy & Immunology
  {
    id: 'dr_brian_lee',
    name: 'Dr. Brian Lee',
    specialty: 'Allergy & Immunology',
    price: '$175',
    savings: '16% below average',
    rating: '4.8',
    reviews: '63',
    distance: '2.5 mi',
    network: 'In-Network',
    yearsExperience: 12,
    acceptingNewPatients: true,
    nextAvailable: 'Oct 18 at 1:00 PM'
  },
  {
    id: 'dr_nicole_williams',
    name: 'Dr. Nicole Williams',
    specialty: 'Allergy & Immunology',
    price: '$160',
    savings: '23% below average',
    rating: '4.9',
    reviews: '94',
    distance: '1.6 mi',
    network: 'In-Network',
    marioPick: true,
    yearsExperience: 14,
    acceptingNewPatients: true,
    nextAvailable: 'Tomorrow at 9:30 AM'
  },

  // OB/GYN
  {
    id: 'dr_samantha_brown',
    name: 'Dr. Samantha Brown',
    specialty: 'OB/GYN',
    price: '$190',
    savings: '14% below average',
    rating: '4.8',
    reviews: '112',
    distance: '1.8 mi',
    network: 'In-Network',
    yearsExperience: 16,
    acceptingNewPatients: true,
    nextAvailable: 'Oct 19 at 10:00 AM'
  },
  {
    id: 'dr_linda_martinez',
    name: 'Dr. Linda Martinez',
    specialty: 'OB/GYN',
    price: '$175',
    savings: '21% below average',
    rating: '4.9',
    reviews: '128',
    distance: '2.2 mi',
    network: 'In-Network',
    marioPick: true,
    yearsExperience: 18,
    acceptingNewPatients: true,
    nextAvailable: 'Oct 13 at 2:30 PM'
  },
  {
    id: 'dr_jessica_turner',
    name: 'Dr. Jessica Turner',
    specialty: 'OB/GYN',
    price: '$185',
    savings: '16% below average',
    rating: '4.7',
    reviews: '87',
    distance: '3.1 mi',
    network: 'In-Network',
    yearsExperience: 14,
    acceptingNewPatients: true,
    nextAvailable: 'Oct 20 at 11:30 AM'
  }
];

// Provider-Hospital Pairings for Specialty Search Results
// Each pairing represents a unique doctor-hospital combination
export const providerHospitalPairings: ProviderHospitalPairing[] = [
  // Cardiology - Dr. Rebecca Hart at multiple hospitals
  {
    id: 'dr_rebecca_hart_ucsf',
    doctorId: 'dr_rebecca_hart',
    doctorName: 'Dr. Rebecca Hart',
    specialty: 'Cardiology',
    hospital: 'UCSF Medical Center',
    hospitalId: 'ucsf',
    price: '$225',
    savings: '14% below average',
    rating: '4.9',
    reviews: '95',
    distance: '2.8 mi',
    network: 'In-Network',
    marioPick: true,
    yearsExperience: 22,
    acceptingNewPatients: true,
    nextAvailable: 'Oct 14 at 10:30 AM',
    marioPoints: 150
  },
  {
    id: 'dr_rebecca_hart_stanford',
    doctorId: 'dr_rebecca_hart',
    doctorName: 'Dr. Rebecca Hart',
    specialty: 'Cardiology',
    hospital: 'Stanford Health Care',
    hospitalId: 'stanford',
    price: '$240',
    savings: '8% below average',
    rating: '4.9',
    reviews: '95',
    distance: '5.2 mi',
    network: 'In-Network',
    marioPick: false,
    yearsExperience: 22,
    acceptingNewPatients: true,
    nextAvailable: 'Oct 16 at 2:00 PM',
    marioPoints: 120
  },
  // Cardiology - Dr. Michael Chen at Kaiser
  {
    id: 'dr_michael_chen_kaiser',
    doctorId: 'dr_lee_chen',
    doctorName: 'Dr. Michael Chen',
    specialty: 'Cardiology',
    hospital: 'Kaiser Permanente Mission Bay',
    hospitalId: 'kaiser_mission_bay',
    price: '$210',
    savings: '19% below average',
    rating: '4.8',
    reviews: '73',
    distance: '3.4 mi',
    network: 'In-Network',
    marioPick: true,
    yearsExperience: 18,
    acceptingNewPatients: true,
    nextAvailable: 'Tomorrow at 11:00 AM',
    marioPoints: 150
  },
  {
    id: 'dr_lee_chen_cpmc',
    doctorId: 'dr_lee_chen',
    doctorName: 'Dr. Lee Chen',
    specialty: 'Cardiology',
    hospital: 'CPMC Van Ness Campus',
    hospitalId: 'cpmc_van_ness',
    price: '$240',
    savings: '8% below average',
    rating: '4.7',
    reviews: '68',
    distance: '3.0 mi',
    network: 'In-Network',
    marioPick: false,
    yearsExperience: 20,
    acceptingNewPatients: true,
    nextAvailable: 'Oct 15 at 1:00 PM',
    marioPoints: 120
  },
  // Cardiology - Dr. Lina Rodriguez at CPMC
  {
    id: 'dr_lina_rodriguez_cpmc',
    doctorId: 'dr_lina_rodriguez',
    doctorName: 'Dr. Lina Rodriguez',
    specialty: 'Cardiology',
    hospital: 'CPMC Van Ness Campus',
    hospitalId: 'cpmc_van_ness',
    price: '$230',
    savings: '12% below average',
    rating: '4.8',
    reviews: '81',
    distance: '3.1 mi',
    network: 'In-Network',
    marioPick: false,
    yearsExperience: 16,
    acceptingNewPatients: true,
    nextAvailable: 'Oct 17 at 9:30 AM',
    marioPoints: 120
  },
  {
    id: 'dr_robert_mason_sutter',
    doctorId: 'dr_robert_mason',
    doctorName: 'Dr. Robert Mason',
    specialty: 'Cardiology',
    hospital: 'Sutter Health CPMC',
    hospitalId: 'sutter_cpmc',
    price: '$250',
    savings: '4% below average',
    rating: '4.6',
    reviews: '54',
    distance: '4.2 mi',
    network: 'In-Network',
    marioPick: false,
    yearsExperience: 25,
    acceptingNewPatients: false,
    marioPoints: 100
  },
  // Cardiology - Additional providers
  {
    id: 'dr_james_park_ucsf',
    doctorId: 'dr_james_park',
    doctorName: 'Dr. James Park',
    specialty: 'Cardiology',
    hospital: 'UCSF Medical Center',
    hospitalId: 'ucsf',
    price: '$235',
    savings: '10% below average',
    rating: '4.7',
    reviews: '62',
    distance: '2.9 mi',
    network: 'In-Network',
    marioPick: false,
    yearsExperience: 19,
    acceptingNewPatients: true,
    nextAvailable: 'Oct 18 at 3:00 PM',
    marioPoints: 120
  },
  {
    id: 'dr_sarah_thompson_kaiser',
    doctorId: 'dr_sarah_thompson_card',
    doctorName: 'Dr. Sarah Thompson',
    specialty: 'Cardiology',
    hospital: 'Kaiser Permanente Mission Bay',
    hospitalId: 'kaiser_mission_bay',
    price: '$215',
    savings: '17% below average',
    rating: '4.8',
    reviews: '89',
    distance: '3.5 mi',
    network: 'In-Network',
    marioPick: false,
    yearsExperience: 17,
    acceptingNewPatients: true,
    nextAvailable: 'Oct 19 at 10:00 AM',
    marioPoints: 130
  },
  {
    id: 'dr_amanda_wong_stanford',
    doctorId: 'dr_amanda_wong',
    doctorName: 'Dr. Amanda Wong',
    specialty: 'Cardiology',
    hospital: 'Stanford Health Care',
    hospitalId: 'stanford',
    price: '$245',
    savings: '6% below average',
    rating: '4.9',
    reviews: '107',
    distance: '5.4 mi',
    network: 'In-Network',
    marioPick: false,
    yearsExperience: 21,
    acceptingNewPatients: true,
    nextAvailable: 'Oct 20 at 1:30 PM',
    marioPoints: 110
  },
  // Dermatology examples
  {
    id: 'dr_lisa_chang_ucsf',
    doctorId: 'dr_lisa_chang',
    doctorName: 'Dr. Lisa Chang',
    specialty: 'Dermatology',
    hospital: 'UCSF Medical Center',
    hospitalId: 'ucsf',
    price: '$165',
    savings: '19% below average',
    rating: '4.8',
    reviews: '89',
    distance: '1.8 mi',
    network: 'In-Network',
    marioPick: true,
    yearsExperience: 13,
    acceptingNewPatients: true,
    nextAvailable: 'Tomorrow at 1:30 PM',
    marioPoints: 150
  },
  {
    id: 'dr_michael_ortiz_stanford',
    doctorId: 'dr_michael_ortiz',
    doctorName: 'Dr. Michael Ortiz',
    specialty: 'Dermatology',
    hospital: 'Stanford Health Care',
    hospitalId: 'stanford',
    price: '$180',
    savings: '12% below average',
    rating: '4.9',
    reviews: '74',
    distance: '2.4 mi',
    network: 'In-Network',
    marioPick: false,
    yearsExperience: 16,
    acceptingNewPatients: true,
    nextAvailable: 'Oct 16 at 3:00 PM',
    marioPoints: 140
  },
  // Primary Care examples
  {
    id: 'dr_james_wilson_kaiser',
    doctorId: 'dr_james_wilson',
    doctorName: 'Dr. James Wilson',
    specialty: 'Primary Care',
    hospital: 'Kaiser Permanente Mission Bay',
    hospitalId: 'kaiser_mission_bay',
    price: '$145',
    savings: '18% below average',
    rating: '4.9',
    reviews: '84',
    distance: '2.3 mi',
    network: 'In-Network',
    marioPick: true,
    yearsExperience: 18,
    acceptingNewPatients: true,
    nextAvailable: 'Today at 3:30 PM',
    marioPoints: 150
  },
  {
    id: 'dr_angela_patel_cpmc',
    doctorId: 'dr_angela_patel',
    doctorName: 'Dr. Angela Patel',
    specialty: 'Primary Care',
    hospital: 'CPMC Van Ness Campus',
    hospitalId: 'cpmc_van_ness',
    price: '$160',
    savings: '10% below average',
    rating: '4.8',
    reviews: '52',
    distance: '1.9 mi',
    network: 'In-Network',
    marioPick: false,
    yearsExperience: 12,
    acceptingNewPatients: true,
    nextAvailable: 'Tomorrow at 10:00 AM',
    marioPoints: 120
  },
  // Orthopedics - Dr. Sarah Johnson
  {
    id: 'dr_sarah_johnson_ucsf',
    doctorId: 'dr_sarah_johnson',
    doctorName: 'Dr. Sarah Johnson',
    specialty: 'Orthopedics',
    hospital: 'UCSF Medical Center',
    hospitalId: 'ucsf',
    price: '$250',
    savings: '35% below average',
    rating: '4.9',
    reviews: '127',
    distance: '2.1 mi',
    network: 'In-Network',
    marioPick: true,
    yearsExperience: 19,
    acceptingNewPatients: true,
    nextAvailable: 'Tomorrow at 2:30 PM',
    marioPoints: 200,
    bio: 'Dr. Johnson is a board-certified orthopedic surgeon with 19+ years of experience specializing in joint repair, sports medicine, and comprehensive patient care. She emphasizes evidence-based treatment and clear recovery guidance for optimal outcomes.',
    education: 'UCSF School of Medicine — MD, Orthopedic Surgery Fellowship',
    experience: '19+ years',
    languagesSpoken: ['English', 'Spanish'],
    costs: {
      consultation: '$250',
      followUp: '$180',
      procedures: {
        'Physical Therapy Session': '$200',
        'Joint Injection': '$350'
      }
    },
    insuranceAccepted: ['Blue Cross Blue Shield', 'Aetna', 'Cigna', 'UnitedHealth', 'Medicare']
  }
];

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
export function getUniqueHospitalCount(specialtyId: string): number {
  const pairings = getProviderHospitalPairingsBySpecialty(specialtyId);
  const uniqueHospitals = new Set(pairings.map(p => p.hospitalId));
  return uniqueHospitals.size;
}