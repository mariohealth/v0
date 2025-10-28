/**
 * Mario Health Backend API Client
 * 
 * This module provides functions to interact with the Mario Health backend API.
 * All functions convert backend responses (snake_case) to frontend types (camelCase)
 * using the transform layer.
 * 
 * Endpoints:
 * - GET /api/v1/categories - Get all procedure categories
 * - GET /api/v1/categories/{slug}/families - Get families for a category
 * - GET /api/v1/families/{slug}/procedures - Get procedures for a family
 * - GET /api/v1/procedures/{slug} - Get procedure detail
 * - GET /api/v1/search - Search procedures
 * - GET /api/v1/codes/{code} - Get billing code detail
 * - GET /api/v1/providers/{id} - Get provider detail
 */

import type {
  CategoriesResponse as RawCategories,
  CategoryFamiliesResponse as RawCategoryFamilies,
  FamilyProceduresResponse as RawFamilyProcedures,
  ProcedureDetailResponse as RawProcedureDetail,
  SearchResponse as RawSearchResponse,
  BillingCodeDetailResponse as RawBillingCodeDetail,
  ProviderDetailResponse as RawProviderDetail,
} from '../types/api-responses';

import {
  transformCategories,
  transformCategoryFamilies,
  transformFamilyProcedures,
  transformProcedureDetail,
  transformSearch,
  transformProviderDetail,
  transformBillingCodeDetail,
  type Category,
  type Family,
  type Procedure,
  type ProcedureDetail,
  type SearchResult,
  type ProviderDetail,
  type BillingCodeDetail,
} from './transforms';
import { trackApiCall, trackError } from './analytics';

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mario-health-api-72178908097.us-central1.run.app';

if (!API_BASE_URL || API_BASE_URL === 'your_api_url') {
  console.error('⚠️  NEXT_PUBLIC_API_URL is not configured. Please set it in your .env.local file.');
}

/**
 * Generic fetch wrapper with error handling, analytics, and CORS detection
 */
async function fetchFromApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  if (!API_BASE_URL || API_BASE_URL === 'your_api_url') {
    const error = new Error('API URL is not configured. Please set NEXT_PUBLIC_API_URL in .env.local');
    trackError(error, { endpoint: 'api-config' });
    throw error;
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const startTime = performance.now();

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const duration = Math.round(performance.now() - startTime);
    const status = response.status;

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.detail || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }

      const apiError = new Error(`API request failed (${response.status}): ${errorMessage}`);
      trackApiCall(endpoint, duration, status, apiError.message);
      trackError(apiError, { endpoint, status, duration });

      throw apiError;
    }

    const data = await response.json();
    trackApiCall(endpoint, duration, status);

    return data;
  } catch (error) {
    const duration = Math.round(performance.now() - startTime);

    // Detect CORS errors specifically
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      const corsError = new Error(
        `CORS Error: The backend needs to allow requests from your domain.\n\n` +
        `Ask AC to add this to backend CORS settings:\n` +
        `ALLOWED_ORIGINS = [\n` +
        `    'http://localhost:3000',\n` +
        `    'https://your-vercel-app.vercel.app'\n` +
        `]`
      );

      trackApiCall(endpoint, duration, 0, 'CORS Error');
      trackError(corsError, { endpoint, duration, errorType: 'CORS' });

      throw corsError;
    }

    if (error instanceof Error) {
      trackApiCall(endpoint, duration, 0, error.message);
      trackError(error, { endpoint, duration });
      throw new Error(`Failed to fetch ${url}: ${error.message}`);
    }

    trackApiCall(endpoint, duration, 0, 'Unknown error');
    trackError(new Error('Unknown error'), { endpoint, duration });

    throw error;
  }
}

/**
 * Get all procedure categories
 * @returns Array of categories with family counts
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const raw = await fetchFromApi<RawCategories>('/api/v1/categories');
    return transformCategories(raw);
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    throw new Error(`Failed to get categories: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get families for a specific category
 * @param slug - Category slug (e.g., 'imaging', 'surgery')
 * @returns Object with category slug and array of families
 */
export async function getFamiliesByCategory(slug: string): Promise<{ categorySlug: string; families: Family[] }> {
  try {
    const raw = await fetchFromApi<RawCategoryFamilies>(`/api/v1/categories/${slug}/families`);
    return transformCategoryFamilies(raw);
  } catch (error) {
    console.error(`Failed to fetch families for category '${slug}':`, error);
    throw new Error(`Failed to get families for category '${slug}': ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get procedures for a specific family
 * @param slug - Family slug (e.g., 'x-ray', 'mri')
 * @returns Object with family info and array of procedures
 */
export async function getProceduresByFamily(slug: string): Promise<{ familySlug: string; familyName: string; procedures: Procedure[] }> {
  try {
    const raw = await fetchFromApi<RawFamilyProcedures>(`/api/v1/families/${slug}/procedures`);
    return transformFamilyProcedures(raw);
  } catch (error) {
    console.error(`Failed to fetch procedures for family '${slug}':`, error);
    throw new Error(`Failed to get procedures for family '${slug}': ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get detailed information about a specific procedure
 * @param slug - Procedure slug (e.g., 'chest-x-ray-2-views')
 * @returns Detailed procedure information with pricing
 */
export async function getProcedureDetail(slug: string): Promise<ProcedureDetail> {
  try {
    const raw = await fetchFromApi<RawProcedureDetail>(`/api/v1/procedures/${slug}`);
    return transformProcedureDetail(raw);
  } catch (error) {
    console.error(`Failed to fetch procedure detail for '${slug}':`, error);
    throw new Error(`Failed to get procedure detail for '${slug}': ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Search for procedures
 * @param query - Search query (e.g., 'chest', 'mri')
 * @param zip - Optional 5-digit ZIP code for location-based search
 * @param radius - Optional search radius in miles (default: 25)
 * @returns Search results with procedure information
 */
export async function searchProcedures(
  query: string,
  zip?: string,
  radius: number = 25
): Promise<{ query: string; location?: string; radiusMiles: number; resultsCount: number; results: SearchResult[] }> {
  try {
    const params = new URLSearchParams({
      q: query,
    });

    if (zip) {
      params.append('zip', zip);
    }
    params.append('radius', radius.toString());

    const raw = await fetchFromApi<RawSearchResponse>(`/api/v1/search?${params.toString()}`);
    return transformSearch(raw);
  } catch (error) {
    console.error(`Failed to search procedures for '${query}':`, error);
    throw new Error(`Failed to search procedures: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get billing code detail information
 * @param code - Medical billing code (e.g., '71046')
 * @param codeType - Optional code type filter (e.g., 'CPT')
 * @returns Billing code detail with related procedures
 */
export async function getBillingCodeDetail(code: string, codeType?: string): Promise<BillingCodeDetail> {
  try {
    const params = new URLSearchParams();
    if (codeType) {
      params.append('code_type', codeType);
    }

    const endpoint = params.toString()
      ? `/api/v1/codes/${code}?${params.toString()}`
      : `/api/v1/codes/${code}`;

    const raw = await fetchFromApi<RawBillingCodeDetail>(endpoint);
    return transformBillingCodeDetail(raw);
  } catch (error) {
    console.error(`Failed to fetch billing code detail for '${code}':`, error);
    throw new Error(`Failed to get billing code detail: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get detailed information about a provider
 * @param id - Provider ID (e.g., 'prov_001')
 * @returns Detailed provider information with procedures and pricing
 */
export async function getProviderDetail(id: string): Promise<ProviderDetail> {
  try {
    const raw = await fetchFromApi<RawProviderDetail>(`/api/v1/providers/${id}`);
    return transformProviderDetail(raw);
  } catch (error) {
    console.error(`Failed to fetch provider detail for '${id}':`, error);
    throw new Error(`Failed to get provider detail: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Export types for use in components
export type {
  Category,
  Family,
  Procedure,
  ProcedureDetail,
  SearchResult,
  ProviderDetail,
  BillingCodeDetail,
};
