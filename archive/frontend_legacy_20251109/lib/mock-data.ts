// Type definitions matching future API contracts

export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    icon: string;
    procedureCount: number;
}

export interface ProcedureFamily {
    id: string;
    name: string;
    slug: string;
    categorySlug: string;
    description: string;
    procedureCount: number;
    icon?: string;
}

export interface Procedure {
    id: string;
    name: string;
    category: string;           // Keep for backward compatibility
    familySlug: string;         // NEW - links to family
    categorySlug: string;       // NEW - clearer naming
    description: string;
    averagePrice: number;
    priceRange: {
        min: number;
        max: number;
    };
    imageUrl?: string;
    commonReasons?: string[];   // NEW - why patients get this
    typicalDuration?: string;   // NEW - how long it takes
}

export interface Provider {
    id: string;
    name: string;
    type: 'hospital' | 'clinic' | 'specialist';
    location: {
        city: string;
        state: string;
        address: string;
    };
    rating: number;
    reviewCount: number;
    verified: boolean;
}

export interface PriceQuote {
    id: string;
    procedureId: string;
    providerId: string;
    price: number;
    inclusions: string[];
    exclusions: string[];
    validUntil: string;
    provider: Provider;
}

// Mock data for development
export const MOCK_CATEGORIES: Category[] = [
    {
        id: '1',
        name: 'Surgery',
        slug: 'surgery',
        description: 'Surgical procedures and operations',
        icon: '🏥',
        procedureCount: 45
    },
    {
        id: '2',
        name: 'Diagnostics & Imaging',
        slug: 'diagnostics',
        description: 'Medical tests, scans, and imaging services',
        icon: '🔬',
        procedureCount: 32
    },
    {
        id: '3',
        name: 'Cardiology',
        slug: 'cardiology',
        description: 'Heart and cardiovascular care',
        icon: '❤️',
        procedureCount: 28
    },
    {
        id: '4',
        name: 'Orthopedics',
        slug: 'orthopedics',
        description: 'Bone, joint, and muscle treatments',
        icon: '🦴',
        procedureCount: 38
    },
    {
        id: '5',
        name: 'Women\'s Health',
        slug: 'womens-health',
        description: 'OB/GYN and reproductive health services',
        icon: '👶',
        procedureCount: 24
    },
    {
        id: '6',
        name: 'Gastroenterology',
        slug: 'gastroenterology',
        description: 'Digestive system and GI procedures',
        icon: '🫀',
        procedureCount: 20
    }
];

export const MOCK_FAMILIES: ProcedureFamily[] = [
    // Surgery families
    {
        id: 'f1',
        name: 'Orthopedic Surgery',
        slug: 'orthopedic-surgery',
        categorySlug: 'surgery',
        description: 'Joint replacements, fracture repairs, and bone surgeries',
        procedureCount: 12
    },
    {
        id: 'f2',
        name: 'General Surgery',
        slug: 'general-surgery',
        categorySlug: 'surgery',
        description: 'Appendectomy, hernia repair, and abdominal surgeries',
        procedureCount: 15
    },
    {
        id: 'f3',
        name: 'Bariatric Surgery',
        slug: 'bariatric-surgery',
        categorySlug: 'surgery',
        description: 'Weight loss surgeries and metabolic procedures',
        procedureCount: 8
    },
    
    // Diagnostics families
    {
        id: 'f4',
        name: 'Blood Tests',
        slug: 'blood-tests',
        categorySlug: 'diagnostics',
        description: 'Laboratory blood work and panels',
        procedureCount: 18
    },
    {
        id: 'f5',
        name: 'Imaging Scans',
        slug: 'imaging-scans',
        categorySlug: 'diagnostics',
        description: 'MRI, CT, X-ray, and ultrasound imaging',
        procedureCount: 10
    },
    {
        id: 'f6',
        name: 'Cardiac Tests',
        slug: 'cardiac-tests',
        categorySlug: 'diagnostics',
        description: 'EKG, stress tests, and heart monitoring',
        procedureCount: 8
    },
    
    // Cardiology families
    {
        id: 'f7',
        name: 'Cardiac Procedures',
        slug: 'cardiac-procedures',
        categorySlug: 'cardiology',
        description: 'Angioplasty, stents, and heart catheterization',
        procedureCount: 12
    },
    {
        id: 'f8',
        name: 'Heart Monitoring',
        slug: 'heart-monitoring',
        categorySlug: 'cardiology',
        description: 'ECG, stress tests, and cardiac monitoring',
        procedureCount: 8
    },
    
    // Orthopedics families
    {
        id: 'f9',
        name: 'Joint Replacement',
        slug: 'joint-replacement',
        categorySlug: 'orthopedics',
        description: 'Hip, knee, and shoulder replacement surgeries',
        procedureCount: 8
    },
    {
        id: 'f10',
        name: 'Sports Medicine',
        slug: 'sports-medicine',
        categorySlug: 'orthopedics',
        description: 'ACL repair, rotator cuff, and athletic injuries',
        procedureCount: 10
    },
    
    // Women's Health families
    {
        id: 'f11',
        name: 'Obstetrics',
        slug: 'obstetrics',
        categorySlug: 'womens-health',
        description: 'Prenatal care, delivery, and postpartum services',
        procedureCount: 12
    },
    {
        id: 'f12',
        name: 'Gynecology',
        slug: 'gynecology',
        categorySlug: 'womens-health',
        description: 'Women\'s reproductive health procedures',
        procedureCount: 8
    },
    
    // Gastroenterology families
    {
        id: 'f13',
        name: 'Endoscopy',
        slug: 'endoscopy',
        categorySlug: 'gastroenterology',
        description: 'Colonoscopy, upper endoscopy, and GI scopes',
        procedureCount: 8
    },
    {
        id: 'f14',
        name: 'GI Diagnostics',
        slug: 'gi-diagnostics',
        categorySlug: 'gastroenterology',
        description: 'Digestive system tests and evaluations',
        procedureCount: 6
    }
];

export const MOCK_PROCEDURES: Procedure[] = [
    // Orthopedic Surgery
    {
        id: 'p1',
        name: 'Total Knee Replacement',
        category: 'surgery',
        familySlug: 'orthopedic-surgery',
        categorySlug: 'surgery',
        description: 'Surgical replacement of damaged knee joint with prosthetic implant',
        averagePrice: 25000,
        priceRange: { min: 18000, max: 35000 },
        commonReasons: ['Severe arthritis', 'Joint damage', 'Chronic knee pain'],
        typicalDuration: '2-3 hours'
    },
    {
        id: 'p2',
        name: 'Hip Replacement Surgery',
        category: 'surgery',
        familySlug: 'orthopedic-surgery',
        categorySlug: 'surgery',
        description: 'Replacement of damaged hip joint with artificial implant',
        averagePrice: 28000,
        priceRange: { min: 20000, max: 40000 },
        commonReasons: ['Hip arthritis', 'Hip fracture', 'Joint deterioration'],
        typicalDuration: '2-4 hours'
    },
    {
        id: 'p3',
        name: 'ACL Reconstruction',
        category: 'orthopedics',
        familySlug: 'sports-medicine',
        categorySlug: 'orthopedics',
        description: 'Surgical repair of torn anterior cruciate ligament',
        averagePrice: 12000,
        priceRange: { min: 8000, max: 18000 },
        commonReasons: ['Sports injury', 'Torn ligament', 'Knee instability'],
        typicalDuration: '1-2 hours'
    },
    {
        id: 'p4',
        name: 'Rotator Cuff Repair',
        category: 'orthopedics',
        familySlug: 'sports-medicine',
        categorySlug: 'orthopedics',
        description: 'Surgical repair of torn shoulder rotator cuff',
        averagePrice: 10000,
        priceRange: { min: 7000, max: 15000 },
        commonReasons: ['Shoulder injury', 'Torn tendon', 'Chronic pain'],
        typicalDuration: '1-2 hours'
    },
    
    // Blood Tests
    {
        id: 'p5',
        name: 'Complete Blood Count (CBC)',
        category: 'diagnostics',
        familySlug: 'blood-tests',
        categorySlug: 'diagnostics',
        description: 'Comprehensive blood test measuring blood cell counts',
        averagePrice: 80,
        priceRange: { min: 40, max: 120 },
        commonReasons: ['Annual checkup', 'Anemia diagnosis', 'Infection screening'],
        typicalDuration: '5-10 minutes'
    },
    {
        id: 'p6',
        name: 'Lipid Panel',
        category: 'diagnostics',
        familySlug: 'blood-tests',
        categorySlug: 'diagnostics',
        description: 'Cholesterol and triglyceride blood test',
        averagePrice: 100,
        priceRange: { min: 60, max: 150 },
        commonReasons: ['Heart disease risk', 'Cholesterol check', 'Preventive care'],
        typicalDuration: '5-10 minutes'
    },
    {
        id: 'p7',
        name: 'Hemoglobin A1C',
        category: 'diagnostics',
        familySlug: 'blood-tests',
        categorySlug: 'diagnostics',
        description: 'Blood sugar control test for diabetes management',
        averagePrice: 90,
        priceRange: { min: 50, max: 140 },
        commonReasons: ['Diabetes monitoring', 'Pre-diabetes screening', 'Blood sugar control'],
        typicalDuration: '5-10 minutes'
    },
    
    // Imaging Scans
    {
        id: 'p8',
        name: 'MRI Scan (Brain)',
        category: 'diagnostics',
        familySlug: 'imaging-scans',
        categorySlug: 'diagnostics',
        description: 'Magnetic resonance imaging of the brain',
        averagePrice: 1200,
        priceRange: { min: 800, max: 2000 },
        commonReasons: ['Headaches', 'Neurological symptoms', 'Brain injury'],
        typicalDuration: '30-60 minutes'
    },
    {
        id: 'p9',
        name: 'CT Scan (Abdomen)',
        category: 'diagnostics',
        familySlug: 'imaging-scans',
        categorySlug: 'diagnostics',
        description: 'Computed tomography scan of abdominal area',
        averagePrice: 900,
        priceRange: { min: 600, max: 1500 },
        commonReasons: ['Abdominal pain', 'Digestive issues', 'Internal bleeding'],
        typicalDuration: '15-30 minutes'
    },
    {
        id: 'p10',
        name: 'Ultrasound',
        category: 'diagnostics',
        familySlug: 'imaging-scans',
        categorySlug: 'diagnostics',
        description: 'Imaging using sound waves for soft tissue examination',
        averagePrice: 300,
        priceRange: { min: 150, max: 500 },
        commonReasons: ['Pregnancy monitoring', 'Abdominal exam', 'Vascular screening'],
        typicalDuration: '20-45 minutes'
    },
    
    // General Surgery
    {
        id: 'p11',
        name: 'Appendectomy',
        category: 'surgery',
        familySlug: 'general-surgery',
        categorySlug: 'surgery',
        description: 'Surgical removal of inflamed appendix',
        averagePrice: 8000,
        priceRange: { min: 5000, max: 12000 },
        commonReasons: ['Appendicitis', 'Abdominal infection', 'Emergency surgery'],
        typicalDuration: '30-60 minutes'
    },
    {
        id: 'p12',
        name: 'Hernia Repair',
        category: 'surgery',
        familySlug: 'general-surgery',
        categorySlug: 'surgery',
        description: 'Surgical correction of abdominal wall hernia',
        averagePrice: 6500,
        priceRange: { min: 4000, max: 10000 },
        commonReasons: ['Inguinal hernia', 'Umbilical hernia', 'Abdominal bulge'],
        typicalDuration: '1-2 hours'
    },
    {
        id: 'p13',
        name: 'Gallbladder Removal',
        category: 'surgery',
        familySlug: 'general-surgery',
        categorySlug: 'surgery',
        description: 'Laparoscopic removal of gallbladder (cholecystectomy)',
        averagePrice: 9000,
        priceRange: { min: 6000, max: 14000 },
        commonReasons: ['Gallstones', 'Gallbladder inflammation', 'Chronic pain'],
        typicalDuration: '1-2 hours'
    },
    
    // Cardiac Procedures
    {
        id: 'p14',
        name: 'Coronary Angioplasty',
        category: 'cardiology',
        familySlug: 'cardiac-procedures',
        categorySlug: 'cardiology',
        description: 'Opening blocked heart arteries with balloon and stent',
        averagePrice: 22000,
        priceRange: { min: 15000, max: 35000 },
        commonReasons: ['Blocked arteries', 'Heart attack', 'Chest pain'],
        typicalDuration: '2-3 hours'
    },
    {
        id: 'p15',
        name: 'Cardiac Catheterization',
        category: 'cardiology',
        familySlug: 'cardiac-procedures',
        categorySlug: 'cardiology',
        description: 'Diagnostic procedure to examine heart arteries',
        averagePrice: 8000,
        priceRange: { min: 5000, max: 12000 },
        commonReasons: ['Chest pain', 'Heart disease diagnosis', 'Artery blockage'],
        typicalDuration: '1-2 hours'
    },
    
    // Obstetrics
    {
        id: 'p16',
        name: 'Cesarean Section (C-Section)',
        category: 'womens-health',
        familySlug: 'obstetrics',
        categorySlug: 'womens-health',
        description: 'Surgical delivery of baby through abdominal incision',
        averagePrice: 12000,
        priceRange: { min: 8000, max: 18000 },
        commonReasons: ['Complicated delivery', 'Breech position', 'Emergency delivery'],
        typicalDuration: '45-60 minutes'
    },
    {
        id: 'p17',
        name: 'Normal Vaginal Delivery',
        category: 'womens-health',
        familySlug: 'obstetrics',
        categorySlug: 'womens-health',
        description: 'Natural childbirth with medical support',
        averagePrice: 6000,
        priceRange: { min: 3000, max: 10000 },
        commonReasons: ['Childbirth', 'Labor and delivery'],
        typicalDuration: 'Varies'
    },
    
    // Endoscopy
    {
        id: 'p18',
        name: 'Colonoscopy',
        category: 'gastroenterology',
        familySlug: 'endoscopy',
        categorySlug: 'gastroenterology',
        description: 'Visual examination of colon using flexible camera',
        averagePrice: 2500,
        priceRange: { min: 1500, max: 4000 },
        commonReasons: ['Colon cancer screening', 'GI bleeding', 'Polyp removal'],
        typicalDuration: '30-60 minutes'
    },
    {
        id: 'p19',
        name: 'Upper Endoscopy (EGD)',
        category: 'gastroenterology',
        familySlug: 'endoscopy',
        categorySlug: 'gastroenterology',
        description: 'Examination of upper digestive tract',
        averagePrice: 2000,
        priceRange: { min: 1200, max: 3500 },
        commonReasons: ['Stomach pain', 'Acid reflux', 'Ulcer diagnosis'],
        typicalDuration: '15-30 minutes'
    },
    
    // Bariatric Surgery
    {
        id: 'p20',
        name: 'Gastric Bypass Surgery',
        category: 'surgery',
        familySlug: 'bariatric-surgery',
        categorySlug: 'surgery',
        description: 'Weight loss surgery reducing stomach size',
        averagePrice: 35000,
        priceRange: { min: 25000, max: 50000 },
        commonReasons: ['Obesity', 'Type 2 diabetes', 'Weight loss'],
        typicalDuration: '2-4 hours'
    },
    {
        id: 'p21',
        name: 'Gastric Sleeve Surgery',
        category: 'surgery',
        familySlug: 'bariatric-surgery',
        categorySlug: 'surgery',
        description: 'Surgical removal of portion of stomach',
        averagePrice: 30000,
        priceRange: { min: 22000, max: 45000 },
        commonReasons: ['Severe obesity', 'Metabolic syndrome', 'Weight management'],
        typicalDuration: '1-2 hours'
    }
];

export const MOCK_PROVIDERS: Provider[] = [
    {
        id: '1',
        name: 'Sunway Medical Centre',
        type: 'hospital',
        location: {
            city: 'Petaling Jaya',
            state: 'Selangor',
            address: 'Jalan Lagoon Selatan, Bandar Sunway'
        },
        rating: 4.6,
        reviewCount: 234,
        verified: true
    },
    {
        id: '2',
        name: 'Dental Care Specialists',
        type: 'clinic',
        location: {
            city: 'Kuala Lumpur',
            state: 'Kuala Lumpur',
            address: 'Bukit Bintang, KL City Centre'
        },
        rating: 4.8,
        reviewCount: 156,
        verified: true
    },
    {
        id: '3',
        name: 'KPJ Ampang Puteri',
        type: 'hospital',
        location: {
            city: 'Ampang',
            state: 'Selangor',
            address: 'Jalan Ampang'
        },
        rating: 4.5,
        reviewCount: 289,
        verified: true
    },
    {
        id: '4',
        name: 'Penang General Hospital',
        type: 'hospital',
        location: {
            city: 'Georgetown',
            state: 'Penang',
            address: 'Jalan Residensi'
        },
        rating: 4.3,
        reviewCount: 567,
        verified: true
    },
    {
        id: '5',
        name: 'Eye Care Vision Clinic',
        type: 'clinic',
        location: {
            city: 'Mont Kiara',
            state: 'Kuala Lumpur',
            address: 'Solaris Dutamas'
        },
        rating: 4.7,
        reviewCount: 98,
        verified: true
    },
    {
        id: '6',
        name: 'Subang Jaya Medical Centre',
        type: 'hospital',
        location: {
            city: 'Subang Jaya',
            state: 'Selangor',
            address: 'Jalan SS12/1'
        },
        rating: 4.4,
        reviewCount: 412,
        verified: true
    }
];

// Mock Price Quotes linking procedures to providers
// NOTE: Updated to use new procedure IDs
export const MOCK_PRICE_QUOTES: PriceQuote[] = [
    // MRI Scan (Brain) - p8
    {
        id: 'quote-1',
        procedureId: 'p8',
        providerId: '1',
        price: 1200,
        inclusions: ['Brain MRI', 'Radiologist report'],
        exclusions: ['Contrast injection'],
        validUntil: '2025-12-31',
        provider: MOCK_PROVIDERS[0]
    },
    {
        id: 'quote-2',
        procedureId: 'p8',
        providerId: '3',
        price: 1100,
        inclusions: ['Brain MRI', 'Radiologist report', 'Follow-up consultation'],
        exclusions: [],
        validUntil: '2025-12-31',
        provider: MOCK_PROVIDERS[2]
    },
    {
        id: 'quote-3',
        procedureId: 'p8',
        providerId: '6',
        price: 950,
        inclusions: ['Brain MRI', 'Basic report'],
        exclusions: ['Detailed radiologist review'],
        validUntil: '2025-12-31',
        provider: MOCK_PROVIDERS[5]
    },
    
    // Complete Blood Count - p5
    {
        id: 'quote-4',
        procedureId: 'p5',
        providerId: '1',
        price: 90,
        inclusions: ['Complete blood count', 'Results consultation'],
        exclusions: [],
        validUntil: '2025-12-31',
        provider: MOCK_PROVIDERS[0]
    },
    {
        id: 'quote-5',
        procedureId: 'p5',
        providerId: '3',
        price: 85,
        inclusions: ['Complete blood count'],
        exclusions: ['Consultation', 'Additional analysis'],
        validUntil: '2025-12-31',
        provider: MOCK_PROVIDERS[2]
    },
    
    // Total Knee Replacement - p1
    {
        id: 'quote-6',
        procedureId: 'p1',
        providerId: '1',
        price: 28000,
        inclusions: ['Surgery', 'Anesthesia', 'Post-op care'],
        exclusions: ['Physical therapy', 'Follow-up visits'],
        validUntil: '2025-12-31',
        provider: MOCK_PROVIDERS[0]
    },
    {
        id: 'quote-7',
        procedureId: 'p1',
        providerId: '3',
        price: 26000,
        inclusions: ['Surgery', 'Hospital stay (2 nights)', 'Pain management'],
        exclusions: ['Physical therapy'],
        validUntil: '2025-12-31',
        provider: MOCK_PROVIDERS[2]
    },
    
    // Coronary Angioplasty - p14
    {
        id: 'quote-8',
        procedureId: 'p14',
        providerId: '1',
        price: 24000,
        inclusions: ['Angioplasty', 'Stent placement', 'Monitoring'],
        exclusions: ['Pre-op testing'],
        validUntil: '2025-12-31',
        provider: MOCK_PROVIDERS[0]
    },
    {
        id: 'quote-9',
        procedureId: 'p14',
        providerId: '3',
        price: 21000,
        inclusions: ['Angioplasty', 'Basic stenting'],
        exclusions: ['Extended monitoring', 'Follow-up care'],
        validUntil: '2025-12-31',
        provider: MOCK_PROVIDERS[2]
    },
    
    // Colonoscopy - p18
    {
        id: 'quote-10',
        procedureId: 'p18',
        providerId: '1',
        price: 2800,
        inclusions: ['Colonoscopy', 'Sedation', 'Pathology if needed'],
        exclusions: ['Polyp removal'],
        validUntil: '2025-12-31',
        provider: MOCK_PROVIDERS[0]
    },
    {
        id: 'quote-11',
        procedureId: 'p18',
        providerId: '3',
        price: 2500,
        inclusions: ['Colonoscopy procedure'],
        exclusions: ['Sedation', 'Anesthesiologist'],
        validUntil: '2025-12-31',
        provider: MOCK_PROVIDERS[2]
    },
    
    // ACL Reconstruction - p3
    {
        id: 'quote-12',
        procedureId: 'p3',
        providerId: '1',
        price: 13000,
        inclusions: ['ACL reconstruction', 'Anesthesia', 'Equipment'],
        exclusions: ['Physical therapy'],
        validUntil: '2025-12-31',
        provider: MOCK_PROVIDERS[0]
    },
    {
        id: 'quote-13',
        procedureId: 'p3',
        providerId: '3',
        price: 11000,
        inclusions: ['Surgery', 'Basic recovery'],
        exclusions: ['Advanced rehabilitation', 'Follow-up'],
        validUntil: '2025-12-31',
        provider: MOCK_PROVIDERS[2]
    }
];

// Utility function to simulate API delay
export const mockApiCall = <T,>(data: T, delay = 500): Promise<T> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(data), delay);
    });
};

// Get procedure by ID
export const getProcedureById = (id: string): Procedure | undefined => {
    return MOCK_PROCEDURES.find(p => p.id === id);
};

// Get family by slug
export const getFamilyBySlug = (slug: string): ProcedureFamily | undefined => {
    return MOCK_FAMILIES.find(f => f.slug === slug);
};

// Get families by category
export const getFamiliesByCategory = (categorySlug: string): ProcedureFamily[] => {
    return MOCK_FAMILIES.filter(f => f.categorySlug === categorySlug);
};

// Get procedures by family
export const getProceduresByFamily = (familySlug: string): Procedure[] => {
    return MOCK_PROCEDURES.filter(p => p.familySlug === familySlug);
};

// Get price quotes for a procedure
export const getQuotesForProcedure = (procedureId: string): PriceQuote[] => {
    return MOCK_PRICE_QUOTES.filter(quote => quote.procedureId === procedureId);
};

// Mock API functions
export const mockApi = {
    getCategories: () => mockApiCall(MOCK_CATEGORIES),
    
    // NEW - Family methods
    getFamilies: (categorySlug?: string) => {
        const filtered = categorySlug 
            ? MOCK_FAMILIES.filter(f => f.categorySlug === categorySlug)
            : MOCK_FAMILIES;
        return mockApiCall(filtered);
    },
    
    getFamilyBySlug: (slug: string) => {
        const family = MOCK_FAMILIES.find(f => f.slug === slug);
        return mockApiCall(family || null);
    },
    
    // UPDATED - Procedures now filter by familySlug
    getProcedures: (familySlug?: string, category?: string) => {
        let filtered = MOCK_PROCEDURES;
        
        // Filter by family if provided
        if (familySlug) {
            filtered = filtered.filter(p => p.familySlug === familySlug);
        }
        
        // Filter by category if provided (backward compatibility)
        if (category) {
            filtered = filtered.filter(p => p.category === category || p.categorySlug === category);
        }
        
        return mockApiCall(filtered);
    },
    
    searchProcedures: (query: string) => {
        const filtered = MOCK_PROCEDURES.filter(p =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.description.toLowerCase().includes(query.toLowerCase())
        );
        return mockApiCall(filtered);
    },
    
    getProviders: () => mockApiCall(MOCK_PROVIDERS),
    getProcedureById: (id: string) => mockApiCall(getProcedureById(id)),
    getQuotesForProcedure: (procedureId: string) => mockApiCall(getQuotesForProcedure(procedureId))
};
