/**
 * Transform Layer - Converts Backend API Responses (snake_case) to Frontend Types (camelCase)
 * 
 * This module handles the conversion between the backend's snake_case API responses
 * and the frontend's camelCase TypeScript types.
 * 
 * All backend responses use snake_case (e.g., family_count, procedure_count)
 * All frontend types use camelCase (e.g., familyCount, procedureCount)
 */

// Import raw backend types (snake_case)
import type {
  CategoryResponse as RawCategory,
  FamilyResponse as RawFamily,
  ProcedureResponse as RawProcedure,
  ProcedureDetailResponse as RawProcedureDetail,
  SearchResultResponse as RawSearchResult,
  ProviderDetailResponse as RawProviderDetail,
  ProviderProcedurePricingResponse as RawProviderProcedure,
  CarrierPriceResponse as RawCarrierPrice,
  CategoryFamiliesResponse as RawCategoryFamilies,
  FamilyProceduresResponse as RawFamilyProcedures,
  SearchResponse as RawSearchResponse,
  CategoriesResponse as RawCategories,
  BillingCodeDetailResponse as RawBillingCodeDetail,
  BillingCodeProcedureMappingResponse as RawBillingCodeProcedureMapping,
} from '../types/api-responses';

// Import frontend types (camelCase)
import type { Provider, SearchResponse as FrontendSearchResponse } from '../../frontend/types/api';

// ============================================================================
// Type Definitions for Transformed Data
// ============================================================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  emoji: string;
  description?: string;
  familyCount: number;
}

export interface Family {
  id: string;
  name: string;
  slug: string;
  description?: string;
  procedureCount: number;
}

export interface Procedure {
  id: string;
  name: string;
  description?: string;
  minPrice: number | null;
  maxPrice: number | null;
  avgPrice: number | null;
  priceCount: number;
}

export interface ProcedureDetail {
  id: string;
  name: string;
  slug: string;
  description?: string;

  // Family context
  familyId: string;
  familyName: string;
  familySlug: string;

  // Category context
  categoryId: string;
  categoryName: string;
  categorySlug: string;

  // Pricing summary
  minPrice: number | null;
  maxPrice: number | null;
  avgPrice: number | null;
  medianPrice: number | null;

  // All carrier prices
  carrierPrices: CarrierPrice[];
}

export interface CarrierPrice {
  carrierId: string;
  carrierName: string;
  price: number;
  currency: string;
  planType?: string;
  networkStatus?: string;
  lastUpdated?: string;
}

export interface SearchResult {
  procedureId: string;
  procedureName: string;
  procedureSlug: string;

  familyName: string;
  familySlug: string;
  categoryName: string;
  categorySlug: string;

  bestPrice: number;
  avgPrice: number;
  priceRange: string;

  providerCount: number;
  nearestProvider?: string;
  nearestDistanceMiles?: number;
}

export interface ProviderDetail {
  providerId: string;
  providerName: string;

  // Location info
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;

  // Contact info
  phone?: string;

  // Statistics
  totalProcedures: number;
  avgPrice: number | null;
  minPrice: number | null;
  maxPrice: number | null;

  // All procedures offered by this provider
  procedures: ProviderProcedurePricing[];
}

export interface ProviderProcedurePricing {
  procedureId: string;
  procedureName: string;
  procedureSlug: string;

  familyName: string;
  familySlug: string;
  categoryName: string;
  categorySlug: string;

  // Pricing info
  price: number;
  carrierId: string;
  carrierName: string;
  lastUpdated?: string;
}

export interface BillingCodeProcedureMapping {
  procedureId: string;
  procedureName: string;
  procedureSlug: string;
  procedureDescription?: string;

  familyName: string;
  familySlug: string;
  categoryName: string;
  categorySlug: string;

  // Pricing summary for this procedure
  minPrice: number | null;
  maxPrice: number | null;
  avgPrice: number | null;
  providerCount: number;

  // Code metadata
  codeType: string;
  isPrimary: boolean;
}

export interface BillingCodeDetail {
  code: string;
  codeType?: string;
  description?: string;

  // All procedures that use this billing code
  procedures: BillingCodeProcedureMapping[];

  // Aggregate pricing across all procedures
  overallMinPrice: number | null;
  overallMaxPrice: number | null;
  overallAvgPrice: number | null;
  totalProviders: number;
}

// ============================================================================
// Transform Functions
// ============================================================================

/**
 * Transforms a raw category response from backend (snake_case) to frontend format (camelCase)
 */
export function transformCategory(raw: RawCategory): Category {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    emoji: raw.emoji || '',
    description: raw.description,
    familyCount: raw.family_count,
  };
}

/**
 * Transforms a raw family response from backend (snake_case) to frontend format (camelCase)
 */
export function transformFamily(raw: RawFamily): Family {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    description: raw.description,
    procedureCount: raw.procedure_count,
  };
}

/**
 * Transforms a raw procedure response from backend (snake_case) to frontend format (camelCase)
 */
export function transformProcedure(raw: RawProcedure): Procedure {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    minPrice: raw.min_price,
    maxPrice: raw.max_price,
    avgPrice: raw.avg_price,
    priceCount: raw.price_count,
  };
}

/**
 * Transforms a raw procedure detail response from backend (snake_case) to frontend format (camelCase)
 */
export function transformProcedureDetail(raw: RawProcedureDetail): ProcedureDetail {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    description: raw.description,

    // Family context
    familyId: raw.family_id,
    familyName: raw.family_name,
    familySlug: raw.family_slug,

    // Category context
    categoryId: raw.category_id,
    categoryName: raw.category_name,
    categorySlug: raw.category_slug,

    // Pricing summary
    minPrice: raw.min_price,
    maxPrice: raw.max_price,
    avgPrice: raw.avg_price,
    medianPrice: raw.median_price,

    // All carrier prices
    carrierPrices: raw.carrier_prices.map(transformCarrierPrice),
  };
}

/**
 * Transforms carrier price from backend (snake_case) to frontend format (camelCase)
 */
export function transformCarrierPrice(raw: RawCarrierPrice): CarrierPrice {
  return {
    carrierId: raw.carrier_id,
    carrierName: raw.carrier_name,
    price: raw.price,
    currency: raw.currency,
    planType: raw.plan_type,
    networkStatus: raw.network_status,
    lastUpdated: raw.last_updated,
  };
}

/**
 * Transforms search result from backend (snake_case) to frontend format (camelCase)
 */
export function transformSearchResult(raw: RawSearchResult): SearchResult {
  return {
    procedureId: raw.procedure_id,
    procedureName: raw.procedure_name,
    procedureSlug: raw.procedure_slug,

    familyName: raw.family_name,
    familySlug: raw.family_slug,
    categoryName: raw.category_name,
    categorySlug: raw.category_slug,

    bestPrice: raw.best_price,
    avgPrice: raw.avg_price,
    priceRange: raw.price_range,

    providerCount: raw.provider_count,
    nearestProvider: raw.nearest_provider,
    nearestDistanceMiles: raw.nearest_distance_miles,
  };
}

/**
 * Transforms provider detail from backend (snake_case) to frontend format (camelCase)
 */
export function transformProviderDetail(raw: RawProviderDetail): ProviderDetail {
  return {
    providerId: raw.provider_id,
    providerName: raw.provider_name,

    // Location info
    address: raw.address,
    city: raw.city,
    state: raw.state,
    zipCode: raw.zip_code,
    latitude: raw.latitude,
    longitude: raw.longitude,

    // Contact info
    phone: raw.phone,

    // Statistics
    totalProcedures: raw.total_procedures,
    avgPrice: raw.avg_price,
    minPrice: raw.min_price,
    maxPrice: raw.max_price,

    // All procedures offered by this provider
    procedures: raw.procedures.map(transformProviderProcedure),
  };
}

/**
 * Transforms provider procedure pricing from backend (snake_case) to frontend format (camelCase)
 */
export function transformProviderProcedure(raw: RawProviderProcedure): ProviderProcedurePricing {
  return {
    procedureId: raw.procedure_id,
    procedureName: raw.procedure_name,
    procedureSlug: raw.procedure_slug,

    familyName: raw.family_name,
    familySlug: raw.family_slug,
    categoryName: raw.category_name,
    categorySlug: raw.category_slug,

    // Pricing info
    price: raw.price,
    carrierId: raw.carrier_id,
    carrierName: raw.carrier_name,
    lastUpdated: raw.last_updated,
  };
}

/**
 * Batch transform for categories array
 */
export function transformCategories(raw: RawCategories): Category[] {
  return raw.categories.map(transformCategory);
}

/**
 * Batch transform for families array with category info
 */
export function transformCategoryFamilies(raw: RawCategoryFamilies): { categorySlug: string; families: Family[] } {
  return {
    categorySlug: raw.category_slug,
    families: raw.families.map(transformFamily),
  };
}

/**
 * Batch transform for procedures array with family info
 */
export function transformFamilyProcedures(raw: RawFamilyProcedures): { familySlug: string; familyName: string; procedures: Procedure[] } {
  return {
    familySlug: raw.family_slug,
    familyName: raw.family_name,
    procedures: raw.procedures.map(transformProcedure),
  };
}

/**
 * Batch transform for search response
 */
export function transformSearch(raw: RawSearchResponse): { query: string; location?: string; radiusMiles: number; resultsCount: number; results: SearchResult[] } {
  return {
    query: raw.query,
    location: raw.location,
    radiusMiles: raw.radius_miles,
    resultsCount: raw.results_count,
    results: raw.results.map(transformSearchResult),
  };
}

/**
 * Transforms billing code procedure mapping from backend (snake_case) to frontend format (camelCase)
 */
function transformBillingCodeProcedure(raw: RawBillingCodeProcedureMapping): BillingCodeProcedureMapping {
  return {
    procedureId: raw.procedure_id,
    procedureName: raw.procedure_name,
    procedureSlug: raw.procedure_slug,
    procedureDescription: raw.procedure_description,

    familyName: raw.family_name,
    familySlug: raw.family_slug,
    categoryName: raw.category_name,
    categorySlug: raw.category_slug,

    // Pricing summary for this procedure
    minPrice: raw.min_price,
    maxPrice: raw.max_price,
    avgPrice: raw.avg_price,
    providerCount: raw.provider_count,

    // Code metadata
    codeType: raw.code_type,
    isPrimary: raw.is_primary,
  };
}

/**
 * Transforms billing code detail from backend (snake_case) to frontend format (camelCase)
 */
export function transformBillingCodeDetail(raw: RawBillingCodeDetail): BillingCodeDetail {
  return {
    code: raw.code,
    codeType: raw.code_type,
    description: raw.description,

    // All procedures that use this billing code
    procedures: raw.procedures.map(transformBillingCodeProcedure),

    // Aggregate pricing across all procedures
    overallMinPrice: raw.overall_min_price,
    overallMaxPrice: raw.overall_max_price,
    overallAvgPrice: raw.overall_avg_price,
    totalProviders: raw.total_providers,
  };
}
