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
    slug: 'mri_brain', 
    display_name: 'MRI - Brain', 
    category: 'Radiology',
    procedure_id: 'mri_brain',
    procedure_name: 'MRI - Brain',
    procedure_slug: 'mri_brain',
    category_name: 'Radiology',
    provider_count: 12,
    best_price: '850'
  },
  { 
    type: 'procedure', 
    slug: 'mri_spine', 
    display_name: 'MRI - Spine', 
    category: 'Radiology',
    procedure_id: 'mri_spine',
    procedure_name: 'MRI - Spine',
    procedure_slug: 'mri_spine',
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
    slug: 'xray_chest', 
    display_name: 'X-Ray - Chest', 
    category: 'Radiology',
    procedure_id: 'xray_chest',
    procedure_name: 'X-Ray - Chest',
    procedure_slug: 'xray_chest',
    category_name: 'Radiology',
    provider_count: 15,
    best_price: '150'
  },
  { 
    type: 'procedure', 
    slug: 'ultrasound_pelvis', 
    display_name: 'Ultrasound - Pelvis', 
    category: 'Radiology',
    procedure_id: 'ultrasound_pelvis',
    procedure_name: 'Ultrasound - Pelvis',
    procedure_slug: 'ultrasound_pelvis',
    category_name: 'Radiology',
    provider_count: 9,
    best_price: '350'
  },
  { 
    type: 'procedure', 
    slug: 'blood_panel_basic', 
    display_name: 'Blood Test - Basic Panel', 
    category: 'Pathology',
    procedure_id: 'blood_panel_basic',
    procedure_name: 'Blood Test - Basic Panel',
    procedure_slug: 'blood_panel_basic',
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

