export interface MarioMedication {
    id: string;
    name: string;
    genericName?: string;
    priceRange: string;
    pharmacyCount: number;
}

export const marioMedicationsData: MarioMedication[] = [
    {
        id: 'lipitor',
        name: 'Lipitor',
        genericName: 'Atorvastatin 20mg',
        priceRange: '$15 - $45',
        pharmacyCount: 8,
    },
    {
        id: 'metformin',
        name: 'Metformin',
        genericName: 'Metformin 500mg',
        priceRange: '$4 - $12',
        pharmacyCount: 12,
    },
    {
        id: 'lisinopril',
        name: 'Lisinopril',
        genericName: 'Lisinopril 10mg',
        priceRange: '$8 - $20',
        pharmacyCount: 10,
    },
    {
        id: 'amoxicillin',
        name: 'Amoxicillin',
        genericName: 'Amoxicillin 500mg',
        priceRange: '$10 - $25',
        pharmacyCount: 15,
    },
    {
        id: 'omeprazole',
        name: 'Omeprazole',
        genericName: 'Omeprazole 20mg',
        priceRange: '$12 - $30',
        pharmacyCount: 9,
    },
    {
        id: 'albuterol',
        name: 'Albuterol',
        genericName: 'Albuterol Inhaler',
        priceRange: '$25 - $60',
        pharmacyCount: 11,
    },
];

