/**
 * Mario Health Backend API Client
 * 
 * This module provides functions to interact with the Mario Health backend API.
 * All functions convert backend responses (snake_case) to frontend types (camelCase).
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

import { trackApiCall, trackError } from './analytics';
import { getAuthToken } from './auth-token';

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mario-health-api-72178908097.us-central1.run.app';

if (!API_BASE_URL || API_BASE_URL === 'your_api_url') {
    console.error('⚠️  NEXT_PUBLIC_API_URL is not configured. Please set it in your .env.local file.');
}

// Type definitions (simplified - add full types later)
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

export interface CarrierPrice {
    carrierId: string;
    carrierName: string;
    price: number;
    currency: string;
    planType?: string;
    networkStatus?: string;
    lastUpdated?: string;
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
        // Get auth token for Authorization header
        const token = await getAuthToken();

        // Build headers with Authorization if token is available
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string> || {}),
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Log outgoing headers for debugging
        if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
            console.log(`[API Request] ${options.method || 'GET'} ${url}`, {
                headers: { ...headers, Authorization: token ? `Bearer ${token.substring(0, 20)}...` : 'None' },
            });
        }

        const response = await fetch(url, {
            ...options,
            headers,
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
 * Transform snake_case to camelCase for categories
 */
function transformCategory(raw: any): Category {
    return {
        id: raw.id,
        name: raw.name,
        slug: raw.slug,
        emoji: raw.emoji || '',
        description: raw.description,
        familyCount: raw.family_count || 0,
    };
}

/**
 * Transform snake_case to camelCase for families
 */
function transformFamily(raw: any): Family {
    return {
        id: raw.id,
        name: raw.name,
        slug: raw.slug,
        description: raw.description,
        procedureCount: raw.procedure_count || 0,
    };
}

/**
 * Transform snake_case to camelCase for procedures
 */
function transformProcedure(raw: any): Procedure {
    return {
        id: raw.id,
        name: raw.name,
        description: raw.description,
        minPrice: raw.min_price,
        maxPrice: raw.max_price,
        avgPrice: raw.avg_price,
        priceCount: raw.price_count || 0,
    };
}

/**
 * Transform snake_case to camelCase for search results
 */
function transformSearchResult(raw: any): SearchResult {
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
 * Get all procedure categories
 * Endpoint: GET /api/v1/categories
 */
export async function getCategories(): Promise<Category[]> {
    try {
        const data = await fetchFromApi<{ categories: any[] }>('/api/v1/categories');
        return data.categories.map(transformCategory);
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        throw new Error(`Failed to get categories: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Get families for a specific category
 * Endpoint: GET /api/v1/categories/{slug}/families
 */
export async function getFamiliesByCategory(slug: string): Promise<{ categorySlug: string; families: Family[] }> {
    try {
        const data = await fetchFromApi<{ category_slug: string; families: any[] }>(
            `/api/v1/categories/${slug}/families`
        );
        return {
            categorySlug: data.category_slug,
            families: data.families.map(transformFamily),
        };
    } catch (error) {
        console.error(`Failed to fetch families for category '${slug}':`, error);
        throw new Error(`Failed to get families for category '${slug}': ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Get procedures for a specific family
 * Endpoint: GET /api/v1/families/{slug}/procedures
 */
export async function getProceduresByFamily(slug: string): Promise<{ familySlug: string; familyName: string; familyDescription?: string; procedures: Procedure[] }> {
    try {
        const data = await fetchFromApi<{ family_slug: string; family_name: string; family_description?: string; procedures: any[] }>(
            `/api/v1/families/${slug}/procedures`
        );
        return {
            familySlug: data.family_slug,
            familyName: data.family_name,
            familyDescription: data.family_description,
            procedures: data.procedures.map(transformProcedure),
        };
    } catch (error) {
        console.error(`Failed to fetch procedures for family '${slug}':`, error);
        throw new Error(`Failed to get procedures for family '${slug}': ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Search for procedures
 * Endpoint: GET /api/v1/search?q={query}&zip={zip}&radius={radius}
 * @param query - Search query (e.g., 'chest', 'mri')
 * @param zip - Optional 5-digit ZIP code for location-based search
 * @param radius - Optional search radius in miles (default: 25)
 * @returns Search results with procedure information
 */
export async function searchProcedures(
    query: string,
    zip?: string,
    radius: number = 25
): Promise<SearchResult[]> {
    try {
        const params = new URLSearchParams({
            q: query,
        });

        if (zip) {
            params.append('zip_code', zip);
        }
        params.append('radius', radius.toString());

        const data = await fetchFromApi<{ query: string; location?: string; radius_miles: number; results_count: number; results: any[] }>(
            `/api/v1/search?${params.toString()}`
        );

        return data.results.map(transformSearchResult);
    } catch (error) {
        console.error(`Failed to search procedures for '${query}':`, error);
        throw new Error(`Failed to search procedures: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Transform snake_case to camelCase for carrier prices
 */
function transformCarrierPrice(raw: any): CarrierPrice {
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
 * Transform snake_case to camelCase for procedure detail
 */
function transformProcedureDetail(raw: any): ProcedureDetail {
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
        carrierPrices: (raw.carrier_prices || []).map(transformCarrierPrice),
    };
}

/**
 * Get detailed information about a specific procedure
 * Endpoint: GET /api/v1/procedures/{slug}
 * @param slug - Procedure slug (e.g., 'chest-x-ray-2-views')
 * @returns Detailed procedure information with pricing
 */
export async function getProcedureDetail(slug: string): Promise<ProcedureDetail> {
    try {
        const data = await fetchFromApi<any>(`/api/v1/procedures/${slug}`);
        return transformProcedureDetail(data);
    } catch (error) {
        console.error(`Failed to fetch procedure detail for '${slug}':`, error);
        throw new Error(`Failed to get procedure detail for '${slug}': ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

// Export for use in components
export const backendApi = {
    getCategories,
    getFamiliesByCategory,
    getProceduresByFamily,
    searchProcedures,
    getProcedureDetail,
};
