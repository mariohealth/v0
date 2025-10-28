/**
 * Raw API Response Types (snake_case)
 * 
 * These types match the exact structure returned by the backend API.
 * The backend uses snake_case for all field names.
 * 
 * Use these types when:
 * - Fetching data from the API
 * - Parsing JSON responses
 * - Type-checking raw API data
 * 
 * For frontend use, convert these to camelCase using adapters.
 */

// ============================================================================
// Categories
// ============================================================================

export interface CategoryResponse {
  id: string;
  name: string;
  slug: string;
  emoji: string;
  description?: string;
  family_count: number;
}

export interface CategoriesResponse {
  categories: CategoryResponse[];
}

// ============================================================================
// Families
// ============================================================================

export interface FamilyResponse {
  id: string;
  name: string;
  slug: string;
  description?: string;
  procedure_count: number;
}

export interface CategoryFamiliesResponse {
  category_slug: string;
  families: FamilyResponse[];
}

// ============================================================================
// Procedures
// ============================================================================

export interface ProcedureResponse {
  id: string;
  name: string;
  description?: string;
  min_price: number | null;
  max_price: number | null;
  avg_price: number | null;
  price_count: number;
}

export interface FamilyProceduresResponse {
  family_slug: string;
  family_name: string;
  procedures: ProcedureResponse[];
}

// ============================================================================
// Procedure Detail
// ============================================================================

export interface CarrierPriceResponse {
  carrier_id: string;
  carrier_name: string;
  price: number;
  currency: string;
  plan_type?: string;
  network_status?: string;
  last_updated?: string;
}

export interface ProcedureDetailResponse {
  id: string;
  name: string;
  slug: string;
  description?: string;
  
  // Family context
  family_id: string;
  family_name: string;
  family_slug: string;
  
  // Category context
  category_id: string;
  category_name: string;
  category_slug: string;
  
  // Pricing summary
  min_price: number | null;
  max_price: number | null;
  avg_price: number | null;
  median_price: number | null;
  
  // All carrier prices
  carrier_prices: CarrierPriceResponse[];
}

// ============================================================================
// Search
// ============================================================================

export interface SearchResultResponse {
  procedure_id: string;
  procedure_name: string;
  procedure_slug: string;
  
  family_name: string;
  family_slug: string;
  category_name: string;
  category_slug: string;
  
  best_price: number;
  avg_price: number;
  price_range: string;
  
  provider_count: number;
  nearest_provider?: string;
  nearest_distance_miles?: number;
}

export interface SearchResponse {
  query: string;
  location?: string;
  radius_miles: number;
  results_count: number;
  results: SearchResultResponse[];
}

// ============================================================================
// Billing Codes
// ============================================================================

export type CodeTypeResponse = 
  | 'CPT' 
  | 'HCPCS' 
  | 'G-CODE' 
  | 'ICD-10-PCS' 
  | 'ICD-10-CM' 
  | 'CDT' 
  | 'DRG';

export interface BillingCodeProcedureMappingResponse {
  procedure_id: string;
  procedure_name: string;
  procedure_slug: string;
  procedure_description?: string;
  
  family_name: string;
  family_slug: string;
  category_name: string;
  category_slug: string;
  
  // Pricing summary for this procedure
  min_price: number | null;
  max_price: number | null;
  avg_price: number | null;
  provider_count: number;
  
  // Code metadata
  code_type: CodeTypeResponse;
  is_primary: boolean;
}

export interface BillingCodeDetailResponse {
  code: string;
  code_type?: CodeTypeResponse;
  description?: string;
  
  // All procedures that use this billing code
  procedures: BillingCodeProcedureMappingResponse[];
  
  // Aggregate pricing across all procedures
  overall_min_price: number | null;
  overall_max_price: number | null;
  overall_avg_price: number | null;
  total_providers: number;
}

// ============================================================================
// Providers
// ============================================================================

export interface ProviderProcedurePricingResponse {
  procedure_id: string;
  procedure_name: string;
  procedure_slug: string;
  
  family_name: string;
  family_slug: string;
  category_name: string;
  category_slug: string;
  
  // Pricing info
  price: number;
  carrier_id: string;
  carrier_name: string;
  last_updated?: string;
}

export interface ProviderDetailResponse {
  provider_id: string;
  provider_name: string;
  
  // Location info
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  latitude?: number;
  longitude?: number;
  
  // Contact info
  phone?: string;
  
  // Statistics
  total_procedures: number;
  avg_price: number | null;
  min_price: number | null;
  max_price: number | null;
  
  // All procedures offered by this provider
  procedures: ProviderProcedurePricingResponse[];
}
