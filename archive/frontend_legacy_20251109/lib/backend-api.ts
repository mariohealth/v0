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
import { API_BASE_URL } from './config';

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

export interface ProcedureProvider {
    providerId: string;
    providerName: string;
    inNetwork: boolean;
    rating: number | null;
    reviews: number;
    distance: number | null;
    priceEstimate: number;
    priceAverage: number | null;
    priceRelativeToAverage: string | null;
    marioPoints: number;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
}

export interface ProcedureProvidersResponse {
    procedureName: string;
    procedureSlug: string;
    providers: ProcedureProvider[];
}

export interface ProviderProcedureDetail {
    providerId: string;
    providerName: string;
    procedureId: string;
    procedureName: string;
    procedureSlug: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    phone?: string;
    website?: string;
    hours?: string;
    estimatedCosts: {
        total: number;
        facilityFee?: number;
        professionalFee?: number;
        suppliesFee?: number;
    };
    averagePrice: number | null;
    savingsVsAverage: number | null;
    inNetwork: boolean;
    rating: number | null;
    reviews: number;
    accreditation?: string;
    staff?: string;
    marioPoints: number;
}

/**
 * Generic fetch wrapper with error handling, analytics, and CORS detection
 */
async function fetchFromApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const startTime = performance.now();

    // Log the full URL being requested
    const urlProtocol = url.startsWith('http://') ? 'http://' : url.startsWith('https://') ? 'https://' : 'relative';
    console.log(`[API] Request URL: ${url} (protocol: ${urlProtocol})`);
    console.log(`[API] API_BASE_URL: ${API_BASE_URL}`);
    console.log(`[API] NEXT_PUBLIC_API_URL: ${process.env.NEXT_PUBLIC_API_URL || 'not set'}`);

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

        // Log fetch failure with full details
        console.error('Fetch failed:', error);
        console.error(`[API] Failed URL: ${url}`);
        console.error(`[API] Endpoint: ${endpoint}`);
        console.error(`[API] API_BASE_URL: ${API_BASE_URL}`);
        console.error(`[API] Error type: ${error instanceof Error ? error.constructor.name : typeof error}`);
        console.error(`[API] Error message: ${error instanceof Error ? error.message : String(error)}`);

        // Detect CORS errors specifically
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
            const corsError = new Error(
                `CORS Error: The backend needs to allow requests from your domain.\n\n` +
                `Request URL: ${url}\n` +
                `Ask AC to add this to backend CORS settings:\n` +
                `ALLOWED_ORIGINS = [\n` +
                `    'http://localhost:3000',\n` +
                `    'https://your-vercel-app.vercel.app'\n` +
                `]`
            );

            trackApiCall(endpoint, duration, 0, 'CORS Error');
            trackError(corsError, { endpoint, duration, errorType: 'CORS', url });

            throw corsError;
        }

        if (error instanceof Error) {
            trackApiCall(endpoint, duration, 0, error.message);
            trackError(error, { endpoint, duration, url });
            throw new Error(`Failed to fetch ${url}: ${error.message}`);
        }

        trackApiCall(endpoint, duration, 0, 'Unknown error');
        trackError(new Error('Unknown error'), { endpoint, duration, url });

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
    // Convert string prices to numbers (backend returns them as strings)
    const bestPrice = typeof raw.best_price === 'string'
        ? parseFloat(raw.best_price)
        : typeof raw.best_price === 'number'
            ? raw.best_price
            : 0;

    const avgPrice = typeof raw.avg_price === 'string'
        ? parseFloat(raw.avg_price)
        : typeof raw.avg_price === 'number'
            ? raw.avg_price
            : 0;

    return {
        procedureId: raw.procedure_id,
        procedureName: raw.procedure_name,
        procedureSlug: raw.procedure_slug,
        familyName: raw.family_name,
        familySlug: raw.family_slug,
        categoryName: raw.category_name,
        categorySlug: raw.category_slug,
        bestPrice,
        avgPrice,
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

// Default search parameters
const DEFAULT_ZIP = "10001";
const DEFAULT_RADIUS = 25;

/**
 * Search for procedures
 * Endpoint: GET /api/v1/search?q={query}&zip={zip}&radius={radius}
 * @param query - Search query (e.g., 'chest', 'mri')
 * @param zip - Optional 5-digit ZIP code for location-based search (defaults to "10001")
 * @param radius - Optional search radius in miles (default: 25)
 * @returns Search results with procedure information
 */
export async function searchProcedures(
    query: string,
    zip?: string,
    radius: number = DEFAULT_RADIUS
): Promise<SearchResult[]> {
    try {
        // Use default ZIP if none provided
        const effectiveZip = zip || DEFAULT_ZIP;
        const effectiveRadius = radius || DEFAULT_RADIUS;

        const params = new URLSearchParams({
            q: query,
            zip_code: effectiveZip,
            radius: effectiveRadius.toString(),
        });

        console.log("✅ Search called with:", {
            query,
            zip: effectiveZip,
            radius: effectiveRadius,
        });

        const data = await fetchFromApi<{ query: string; location?: string; radius_miles: number; results_count: number; results: any[] }>(
            `/api/v1/search?${params.toString()}`
        );

        console.log("✅ Live search API called:", {
            endpoint: `/api/v1/search?${params.toString()}`,
            query: data.query,
            results_count: data.results_count,
            results_length: data.results?.length || 0,
        });

        console.log("🔍 Search response:", {
            query: data.query,
            results_count: data.results_count,
            results_length: data.results?.length || 0,
            first_result: data.results?.[0] || null
        });

        // Ensure results array exists and is not empty
        if (!data.results || !Array.isArray(data.results) || data.results.length === 0) {
            console.log("⚠️  No results returned from API");
            return [];
        }

        const transformedResults = data.results.map(transformSearchResult);

        console.log("🧠 Transformed results:", {
            count: transformedResults.length,
            first_result: transformedResults[0] || null
        });

        return transformedResults;
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

/**
 * Transform snake_case to camelCase for procedure providers
 */
function transformProcedureProvider(raw: any): ProcedureProvider {
    return {
        providerId: raw.provider_id,
        providerName: raw.provider_name,
        inNetwork: raw.in_network || false,
        rating: raw.rating ? parseFloat(raw.rating) : null,
        reviews: raw.reviews || 0,
        distance: raw.distance ? parseFloat(raw.distance) : null,
        priceEstimate: typeof raw.price_estimate === 'string' 
            ? parseFloat(raw.price_estimate) 
            : typeof raw.price_estimate === 'number' 
                ? raw.price_estimate 
                : 0,
        priceAverage: raw.price_average ? parseFloat(raw.price_average) : null,
        priceRelativeToAverage: raw.price_relative_to_average || null,
        marioPoints: raw.mario_points || 0,
        address: raw.address,
        city: raw.city,
        state: raw.state,
        zipCode: raw.zip_code,
    };
}

/**
 * Get all providers offering a specific procedure
 * Endpoint: GET /api/v1/procedures/{slug}/providers
 */
export async function getProcedureProviders(slug: string): Promise<ProcedureProvidersResponse> {
    try {
        const data = await fetchFromApi<any>(`/api/v1/procedures/${slug}/providers`);
        return {
            procedureName: data.procedure_name,
            procedureSlug: data.procedure_slug,
            providers: (data.providers || []).map(transformProcedureProvider),
        };
    } catch (error) {
        console.error(`Failed to fetch procedure providers for '${slug}':`, error);
        throw new Error(`Failed to get procedure providers for '${slug}': ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Get detailed provider-procedure information
 * Endpoint: GET /api/v1/providers/{providerId}/procedures/{slug}
 */
export async function getProviderProcedureDetail(
    providerId: string,
    slug: string
): Promise<ProviderProcedureDetail> {
    try {
        const data = await fetchFromApi<any>(`/api/v1/providers/${providerId}/procedures/${slug}`);
        return {
            providerId: data.provider_id,
            providerName: data.provider_name,
            procedureId: data.procedure_id,
            procedureName: data.procedure_name,
            procedureSlug: data.procedure_slug,
            address: data.address,
            city: data.city,
            state: data.state,
            zipCode: data.zip_code,
            phone: data.phone,
            website: data.website,
            hours: data.hours,
            estimatedCosts: data.estimated_costs || { total: 0 },
            averagePrice: data.average_price ? parseFloat(data.average_price) : null,
            savingsVsAverage: data.savings_vs_average ? parseFloat(data.savings_vs_average) : null,
            inNetwork: data.in_network || false,
            rating: data.rating ? parseFloat(data.rating) : null,
            reviews: data.reviews || 0,
            accreditation: data.accreditation,
            staff: data.staff,
            marioPoints: data.mario_points || 0,
        };
    } catch (error) {
        console.error(`Failed to fetch provider-procedure detail for '${providerId}/${slug}':`, error);
        throw new Error(`Failed to get provider-procedure detail: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

// Export for use in components
export const backendApi = {
    getCategories,
    getFamiliesByCategory,
    getProceduresByFamily,
    searchProcedures,
    getProcedureDetail,
    getProcedureProviders,
    getProviderProcedureDetail,
};
