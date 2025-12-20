/**
 * Mock procedure fallback data for SmartSearch autocomplete
 * 
 * Used when API fails or returns empty results to ensure users
 * always see valid procedure suggestions.
 * 
 * This dataset contains common procedures that users frequently search for.
 */

export interface MockProcedureFallback {
  type: 'procedure';
  slug: string;
  display_name: string;
  category: string;
  procedure_id?: string;
  procedure_name?: string;
  procedure_slug?: string;
  category_name?: string;
  provider_count?: number;
  best_price?: string;
}

export const mockProceduresFallback: MockProcedureFallback[] = [
  {
    type: 'procedure',
    slug: 'brain-mri',
    display_name: 'MRI - Brain',
    category: 'Radiology',
    procedure_id: 'brain-mri',
    procedure_name: 'MRI - Brain',
    procedure_slug: 'brain-mri',
    category_name: 'Radiology',
    provider_count: 12,
    best_price: '850'
  },
  {
    type: 'procedure',
    slug: 'leg-joint-mri',
    display_name: 'MRI - Knee (Leg Joint)',
    category: 'Imaging',
    procedure_id: 'leg-joint-mri',
    procedure_name: 'MRI - Knee (Leg Joint)',
    procedure_slug: 'leg-joint-mri',
    category_name: 'Radiology',
    provider_count: 10,
    best_price: '950'
  },
  {
    type: 'procedure',
    slug: 'ct_abdomen',
    display_name: 'CT Scan - Abdomen',
    category: 'Radiology',
    procedure_id: 'ct_abdomen',
    procedure_name: 'CT Scan - Abdomen',
    procedure_slug: 'ct_abdomen',
    category_name: 'Radiology',
    provider_count: 8,
    best_price: '650'
  },
  {
    type: 'procedure',
    slug: 'chest-ct-scan',
    display_name: 'CT Scan - Chest',
    category: 'Imaging',
    procedure_id: 'chest-ct-scan',
    procedure_name: 'CT Scan - Chest',
    procedure_slug: 'chest-ct-scan',
    category_name: 'Radiology',
    provider_count: 15,
    best_price: '150'
  },
  {
    type: 'procedure',
    slug: 'abdomen-ultrasound',
    display_name: 'Ultrasound - Abdominal',
    category: 'Imaging',
    procedure_id: 'abdomen-ultrasound',
    procedure_name: 'Ultrasound - Abdominal',
    procedure_slug: 'abdomen-ultrasound',
    category_name: 'Radiology',
    provider_count: 9,
    best_price: '350'
  },
  {
    type: 'procedure',
    slug: 'complete-blood-cell-count-blood-test',
    display_name: 'Complete Blood Count (CBC)',
    category: 'Pathology',
    procedure_id: 'complete-blood-cell-count-blood-test',
    procedure_name: 'Complete Blood Count (CBC)',
    procedure_slug: 'complete-blood-cell-count-blood-test',
    category_name: 'Pathology',
    provider_count: 20,
    best_price: '75'
  },
  {
    type: 'procedure',
    slug: 'colonoscopy',
    display_name: 'Colonoscopy',
    category: 'Gastroenterology',
    procedure_id: 'colonoscopy',
    procedure_name: 'Colonoscopy',
    procedure_slug: 'colonoscopy',
    category_name: 'Gastroenterology',
    provider_count: 14,
    best_price: '1200'
  }
];

