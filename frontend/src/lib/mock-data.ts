// Type definitions matching future API contracts
export interface Procedure {
    id: string;
    name: string;
    category: string;
    description: string;
    averagePrice: number;
    priceRange: {
        min: number;
        max: number;
    };
    imageUrl?: string;
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

export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    icon: string;
    procedureCount: number;
}

// Mock data for development
export const MOCK_CATEGORIES: Category[] = [
    {
        id: '1',
        name: 'Dental Care',
        slug: 'dental',
        description: 'Dental procedures and treatments',
        icon: '🦷',
        procedureCount: 24
    },
    {
        id: '2',
        name: 'Eye Care',
        slug: 'eye-care',
        description: 'Vision and eye health services',
        icon: '👁️',
        procedureCount: 18
    },
    {
        id: '3',
        name: 'Diagnostics',
        slug: 'diagnostics',
        description: 'Medical tests and imaging',
        icon: '🔬',
        procedureCount: 32
    },
    {
        id: '4',
        name: 'Surgery',
        slug: 'surgery',
        description: 'Surgical procedures',
        icon: '🏥',
        procedureCount: 45
    },
    {
        id: '5',
        name: 'Wellness',
        slug: 'wellness',
        description: 'Preventive care and checkups',
        icon: '💚',
        procedureCount: 15
    },
    {
        id: '6',
        name: 'Specialist Care',
        slug: 'specialist',
        description: 'Specialized medical services',
        icon: '👨‍⚕️',
        procedureCount: 38
    }
];

export const MOCK_PROCEDURES: Procedure[] = [
    {
        id: '1',
        name: 'Dental Cleaning',
        category: 'dental',
        description: 'Professional teeth cleaning and polishing',
        averagePrice: 150,
        priceRange: { min: 80, max: 250 }
    },
    {
        id: '2',
        name: 'Eye Exam',
        category: 'eye-care',
        description: 'Comprehensive eye examination',
        averagePrice: 100,
        priceRange: { min: 50, max: 200 }
    },
    {
        id: '3',
        name: 'Blood Test Panel',
        category: 'diagnostics',
        description: 'Complete blood count and metabolic panel',
        averagePrice: 120,
        priceRange: { min: 60, max: 180 }
    },
    {
        id: '4',
        name: 'MRI Scan',
        category: 'diagnostics',
        description: 'Magnetic resonance imaging',
        averagePrice: 800,
        priceRange: { min: 500, max: 1500 }
    },
    {
        id: '5',
        name: 'Root Canal',
        category: 'dental',
        description: 'Root canal treatment',
        averagePrice: 900,
        priceRange: { min: 600, max: 1500 }
    },
    {
        id: '6',
        name: 'Annual Physical',
        category: 'wellness',
        description: 'Comprehensive annual health checkup',
        averagePrice: 200,
        priceRange: { min: 100, max: 400 }
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
export const MOCK_PRICE_QUOTES: PriceQuote[] = [
    // Dental Cleaning (procedure 1)
    {
        id: 'quote-1',
        procedureId: '1',
        providerId: '2',
        price: 130,
        inclusions: ['Professional cleaning', 'Polishing', 'Basic consultation'],
        exclusions: ['X-rays', 'Fluoride treatment'],
        validUntil: '2025-12-31',
        provider: MOCK_PROVIDERS[1]
    },
    {
        id: 'quote-2',
        procedureId: '1',
        providerId: '3',
        price: 160,
        inclusions: ['Professional cleaning', 'Polishing', 'X-rays included'],
        exclusions: [],
        validUntil: '2025-12-31',
        provider: MOCK_PROVIDERS[2]
    },
    {
        id: 'quote-3',
        procedureId: '1',
        providerId: '6',
        price: 95,
        inclusions: ['Professional cleaning', 'Polishing'],
        exclusions: ['X-rays', 'Consultation fee'],
        validUntil: '2025-12-31',
        provider: MOCK_PROVIDERS[5]
    },

    // Eye Exam (procedure 2)
    {
        id: 'quote-4',
        procedureId: '2',
        providerId: '5',
        price: 120,
        inclusions: ['Comprehensive exam', 'Visual acuity test', 'Retinal scan'],
        exclusions: ['Prescription glasses'],
        validUntil: '2025-12-31',
        provider: MOCK_PROVIDERS[4]
    },
    {
        id: 'quote-5',
        procedureId: '2',
        providerId: '1',
        price: 110,
        inclusions: ['Basic eye exam', 'Vision test'],
        exclusions: ['Specialist consultation'],
        validUntil: '2025-12-31',
        provider: MOCK_PROVIDERS[0]
    },

    // Blood Test Panel (procedure 3)
    {
        id: 'quote-6',
        procedureId: '3',
        providerId: '1',
        price: 140,
        inclusions: ['Complete blood count', 'Metabolic panel', 'Cholesterol test'],
        exclusions: [],
        validUntil: '2025-12-31',
        provider: MOCK_PROVIDERS[0]
    },
    {
        id: 'quote-7',
        procedureId: '3',
        providerId: '3',
        price: 160,
        inclusions: ['Complete blood count', 'Metabolic panel', 'Liver function'],
        exclusions: ['Urine test'],
        validUntil: '2025-12-31',
        provider: MOCK_PROVIDERS[2]
    },
    {
        id: 'quote-8',
        procedureId: '3',
        providerId: '6',
        price: 105,
        inclusions: ['Basic blood panel'],
        exclusions: ['Specialized tests'],
        validUntil: '2025-12-31',
        provider: MOCK_PROVIDERS[5]
    },

    // MRI Scan (procedure 4)
    {
        id: 'quote-9',
        procedureId: '4',
        providerId: '1',
        price: 1200,
        inclusions: ['Brain MRI', 'Radiologist report'],
        exclusions: ['Contrast injection'],
        validUntil: '2025-12-31',
        provider: MOCK_PROVIDERS[0]
    },
    {
        id: 'quote-10',
        procedureId: '4',
        providerId: '3',
        price: 1100,
        inclusions: ['Brain MRI', 'Radiologist report', 'Follow-up consultation'],
        exclusions: [],
        validUntil: '2025-12-31',
        provider: MOCK_PROVIDERS[2]
    },

    // Root Canal (procedure 5)
    {
        id: 'quote-11',
        procedureId: '5',
        providerId: '2',
        price: 850,
        inclusions: ['Root canal treatment', 'Local anesthesia', 'Temporary filling'],
        exclusions: ['Crown placement'],
        validUntil: '2025-12-31',
        provider: MOCK_PROVIDERS[1]
    },
    {
        id: 'quote-12',
        procedureId: '5',
        providerId: '3',
        price: 1100,
        inclusions: ['Root canal treatment', 'Anesthesia', 'Permanent filling'],
        exclusions: ['Crown'],
        validUntil: '2025-12-31',
        provider: MOCK_PROVIDERS[2]
    },

    // Annual Physical (procedure 6)
    {
        id: 'quote-13',
        procedureId: '6',
        providerId: '1',
        price: 220,
        inclusions: ['Physical exam', 'Basic blood tests', 'Consultation'],
        exclusions: ['Specialist referrals'],
        validUntil: '2025-12-31',
        provider: MOCK_PROVIDERS[0]
    },
    {
        id: 'quote-14',
        procedureId: '6',
        providerId: '6',
        price: 180,
        inclusions: ['Comprehensive physical', 'Basic tests'],
        exclusions: ['ECG', 'Chest X-ray'],
        validUntil: '2025-12-31',
        provider: MOCK_PROVIDERS[5]
    },
    {
        id: 'quote-15',
        procedureId: '6',
        providerId: '3',
        price: 260,
        inclusions: ['Comprehensive physical', 'Full blood panel', 'ECG', 'Chest X-ray'],
        exclusions: [],
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

// Get price quotes for a procedure
export const getQuotesForProcedure = (procedureId: string): PriceQuote[] => {
    return MOCK_PRICE_QUOTES.filter(quote => quote.procedureId === procedureId);
};

// Mock API functions
export const mockApi = {
    getCategories: () => mockApiCall(MOCK_CATEGORIES),
    getProcedures: (category?: string) => {
        const filtered = category
            ? MOCK_PROCEDURES.filter(p => p.category === category)
            : MOCK_PROCEDURES;
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

