export interface MarioProcedure {
    id: string;
    name: string;
    category: string;
    description: string;
    priceRange: string;
    providerCount: number;
}

export const marioProceduresData: MarioProcedure[] = [
    {
        id: 'mri-brain',
        name: 'MRI Brain',
        category: 'Imaging',
        description: 'Magnetic resonance imaging of the brain',
        priceRange: '$850 - $1,400',
        providerCount: 12,
    },
    {
        id: 'annual-physical',
        name: 'Annual Physical Exam',
        category: 'Primary Care',
        description: 'Comprehensive annual health checkup',
        priceRange: '$95 - $220',
        providerCount: 45,
    },
    {
        id: 'blood-work',
        name: 'Blood Work Panel',
        category: 'Lab Tests',
        description: 'Complete blood count and metabolic panel',
        priceRange: '$75 - $180',
        providerCount: 28,
    },
    {
        id: 'mammogram',
        name: 'Mammogram Screening',
        category: 'Imaging',
        description: 'Breast cancer screening mammogram',
        priceRange: '$125 - $280',
        providerCount: 18,
    },
    {
        id: 'colonoscopy',
        name: 'Colonoscopy',
        category: 'Procedure',
        description: 'Colon cancer screening procedure',
        priceRange: '$695 - $1,200',
        providerCount: 15,
    },
    {
        id: 'x-ray-chest',
        name: 'Chest X-Ray',
        category: 'Imaging',
        description: 'X-ray imaging of the chest',
        priceRange: '$120 - $250',
        providerCount: 22,
    },
];

