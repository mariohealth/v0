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
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mario-health-api-ei5wbr4h5a-uc.a.run.app';
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

if (!API_BASE_URL || API_BASE_URL === 'your_api_url') {
  console.error('⚠️  NEXT_PUBLIC_API_URL is not configured. Please set it in your .env.local file.');
}

/**
 * Token cache for storing authentication tokens in memory
 */
interface TokenCache {
  token: string | null;
  expiresAt: number; // Timestamp in milliseconds
}

let tokenCache: TokenCache = {
  token: null,
  expiresAt: 0,
};

// Buffer time before expiration to refresh token (5 minutes)
const TOKEN_REFRESH_BUFFER = 5 * 60 * 1000;

/**
 * Check if the current token is valid and not expired
 */
function isTokenValid(): boolean {
  if (!tokenCache.token) {
    return false;
  }
  // Check if token expires within the buffer time
  return Date.now() < (tokenCache.expiresAt - TOKEN_REFRESH_BUFFER);
}

/**
 * Get authentication token from Next.js API route
 * Includes caching and automatic refresh
 * 
 * @returns Promise with the identity token
 * @throws Error if token generation fails
 */
export async function getAuthToken(): Promise<string> {
  // Return cached token if still valid
  if (isTokenValid()) {
    return tokenCache.token!;
  }

  try {
    // Fetch new token from Next.js API route
    const response = await fetch('/api/auth/token', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || `Failed to get auth token: ${response.status}`;

      trackError(new Error(errorMessage), { endpoint: '/api/auth/token', status: response.status });
      throw new Error(errorMessage);
    }

    const data = await response.json();

    if (!data.token) {
      throw new Error('No token returned from auth endpoint');
    }

    // Cache the token
    // Calculate expiration time (default to 50 minutes if not provided, to account for buffer)
    const expiresIn = data.expiresIn || 3600;
    tokenCache = {
      token: data.token,
      expiresAt: Date.now() + (expiresIn * 1000),
    };

    return data.token;
  } catch (error) {
    // Clear cache on error
    tokenCache = { token: null, expiresAt: 0 };

    if (error instanceof Error) {
      trackError(error, { endpoint: '/api/auth/token' });
      throw new Error(`Authentication failed: ${error.message}`);
    }

    throw new Error('Authentication failed: Unknown error');
  }
}

/**
 * Generic fetch wrapper with error handling, analytics, CORS detection, and authentication
 */
async function fetchFromApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  if (!API_BASE_URL || API_BASE_URL === 'your_api_url') {
    const error = new Error('API URL is not configured. Please set NEXT_PUBLIC_API_URL in .env.local');
    trackError(error, { endpoint: 'api-config' });
    throw error;
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const startTime = performance.now();

  // Get authentication token
  let authToken: string;
  try {
    authToken = await getAuthToken();
  } catch (error) {
    const authError = error instanceof Error ? error : new Error('Failed to get authentication token');
    trackError(authError, { endpoint, errorType: 'auth' });
    throw new Error(`Authentication failed: ${authError.message}`);
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
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

      // Handle 401 Unauthorized - token may have expired, try refreshing
      if (response.status === 401 || response.status === 403) {
        // Clear token cache and retry once
        tokenCache = { token: null, expiresAt: 0 };

        try {
          const newToken = await getAuthToken();
          const retryResponse = await fetch(url, {
            ...options,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${newToken}`,
              ...options.headers,
            },
          });

          if (retryResponse.ok) {
            const data = await retryResponse.json();
            trackApiCall(endpoint, duration, retryResponse.status);
            return data;
          }
        } catch (retryError) {
          // Retry failed, throw user-friendly auth error
          const authError = new Error('Authentication failed. Please refresh.');
          trackError(authError, { endpoint, status: response.status });
          throw authError;
        }
      }

      // Handle server errors (500, 502, 503, 504)
      if (response.status >= 500) {
        const serverError = new Error('Server error. Please try again later.');
        trackApiCall(endpoint, duration, status, serverError.message);
        trackError(serverError, { endpoint, status, duration });
        throw serverError;
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

    // Detect CORS errors specifically (check first, as they're a subset of network errors)
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      // Check if it's likely a CORS error (no response received, browser blocked)
      // CORS errors typically manifest as TypeError: Failed to fetch with no response
      const corsError = new Error(
        'CORS Error: The backend needs to allow requests from your domain. Contact the backend team.'
      );

      trackApiCall(endpoint, duration, 0, 'CORS Error');
      trackError(corsError, { endpoint, duration, errorType: 'CORS' });

      throw corsError;
    }

    // Handle other network errors (connection issues, timeout, etc.)
    if (error instanceof TypeError && (
      error.message.includes('NetworkError') ||
      error.message.includes('network') ||
      error.message.includes('timeout')
    )) {
      const networkError = new Error('Network error. Check your connection.');
      trackApiCall(endpoint, duration, 0, 'Network Error');
      trackError(networkError, { endpoint, duration, errorType: 'Network' });
      throw networkError;
    }

    // Handle authentication errors (already handled above in 401 check, but catch any others)
    if (error instanceof Error && (
      error.message.includes('401') ||
      error.message.includes('403') ||
      error.message.includes('Unauthorized') ||
      error.message.includes('Forbidden') ||
      error.message.includes('Authentication failed')
    )) {
      const authError = new Error('Authentication failed. Please refresh.');
      trackApiCall(endpoint, duration, 0, 'Auth Error');
      trackError(authError, { endpoint, duration, errorType: 'Auth' });
      throw authError;
    }

    // Handle server errors
    if (error instanceof Error && (
      error.message.includes('500') ||
      error.message.includes('502') ||
      error.message.includes('503') ||
      error.message.includes('504') ||
      error.message.includes('Server error')
    )) {
      const serverError = new Error('Server error. Please try again later.');
      trackApiCall(endpoint, duration, 0, 'Server Error');
      trackError(serverError, { endpoint, duration, errorType: 'Server' });
      throw serverError;
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
 * Base fetch wrapper with error handling
 * @param endpoint - API endpoint path (without base URL and version)
 * @param options - Fetch options
 * @returns Promise with typed response
 */
export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const fullEndpoint = endpoint.startsWith('/')
    ? `/api/${API_VERSION}${endpoint}`
    : `/api/${API_VERSION}/${endpoint}`;
  return fetchFromApi<T>(fullEndpoint, options);
}

/**
 * Health check endpoint
 * @returns Health status response
 */
export async function fetchHealthCheck(): Promise<{ status: string; message?: string }> {
  try {
    return await fetchApi<{ status: string; message?: string }>('/health');
  } catch (error) {
    console.error('Failed to fetch health check:', error);
    throw new Error(`Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Fetch all categories
 * @returns Array of categories with family counts
 */
export async function fetchCategories(): Promise<Category[]> {
  try {
    const raw = await fetchApi<RawCategories>('/categories');
    return transformCategories(raw);
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    throw new Error(`Failed to get categories: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get all procedure categories (legacy function, kept for backward compatibility)
 * @returns Array of categories with family counts
 */
export async function getCategories(): Promise<Category[]> {
  return fetchCategories();
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
      params.append('zip_code', zip);
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
