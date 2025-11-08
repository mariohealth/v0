import { auth } from './firebase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mario-health-api-gateway-x5pghxd.uc.gateway.dev';
const API_URL = API_BASE_URL; // Alias for consistency

export interface SearchResult {
    procedure_id: string;
    procedure_name: string;
    procedure_slug: string;
    family_name: string;
    family_slug: string;
    category_name: string;
    category_slug: string;
    best_price: string;
    avg_price: string;
    price_range: string;
    provider_count: number;
    nearest_provider?: string;
    nearest_distance_miles?: number | null;
    match_score: number;
}

export interface SearchResponse {
    query: string;
    location?: string | null;
    radius_miles?: number;
    results_count: number;
    results: SearchResult[];
}

export interface Provider {
    provider_id: string;
    provider_name: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    phone?: string;
    price?: string;
    distance_miles?: number | null;
}

export interface ProcedureProvidersResponse {
    procedure_id: string;
    procedure_name: string;
    procedure_slug: string;
    providers: Provider[];
    total_count: number;
}

export interface ProviderDetail {
    provider_id: string;
    provider_name: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    phone?: string;
    email?: string;
    website?: string;
    procedures?: Array<{
        procedure_id: string;
        procedure_name: string;
        procedure_slug: string;
        price: string;
    }>;
}

/**
 * Get Firebase ID token for authenticated user (optional)
 * Returns null if user is not authenticated
 */
async function getAuthToken(): Promise<string | null> {
    try {
        const user = auth.currentUser;
        if (!user) {
            return null;
        }
        const token = await user.getIdToken();
        return token;
    } catch (error) {
        console.error('Error getting auth token:', error);
        return null;
    }
}

/**
 * Make an authenticated API request
 */
async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const token = await getAuthToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    // Add auth token if available
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(url, {
        ...options,
        headers,
    });
}

/**
 * Search for procedures by query string
 */
export async function searchProcedures(
    query: string,
    location?: string | null,
    radius_miles?: number
): Promise<SearchResponse> {
    const params = new URLSearchParams({
        q: query,
    });

    if (location) {
        params.append('location', location);
    }

    if (radius_miles) {
        params.append('radius_miles', radius_miles.toString());
    }

    const url = `${API_BASE_URL}/api/v1/search?${params.toString()}`;

    console.log('[API] Searching procedures:', { query, location, radius_miles, url });

    try {
        const response = await fetchWithAuth(url, {
            method: 'GET',
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = `API request failed: ${response.status} ${response.statusText}`;
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.message || errorData.detail || errorMessage;
            } catch {
                errorMessage = errorText || errorMessage;
            }
            console.error('[API] Search error:', {
                status: response.status,
                statusText: response.statusText,
                error: errorMessage,
            });
            throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log('[API] Search success:', { query, resultsCount: data.results_count });
        return data as SearchResponse;
    } catch (error) {
        console.error('[API] Error searching procedures:', error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Failed to search procedures');
    }
}

/**
 * Get providers for a specific procedure
 */
export async function getProcedureProviders(
    procedureSlug: string
): Promise<ProcedureProvidersResponse> {
    const url = `${API_BASE_URL}/api/v1/procedures/${procedureSlug}/providers`;

    console.log('[API] Fetching procedure providers:', { procedureSlug, url });

    try {
        const response = await fetchWithAuth(url, {
            method: 'GET',
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = `API request failed: ${response.status} ${response.statusText}`;
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.message || errorData.detail || errorMessage;
            } catch {
                errorMessage = errorText || errorMessage;
            }
            console.error('[API] Get procedure providers error:', {
                status: response.status,
                statusText: response.statusText,
                error: errorMessage,
            });
            throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log('[API] Get procedure providers success:', {
            procedureSlug,
            providersCount: data.providers?.length || 0,
        });
        return data as ProcedureProvidersResponse;
    } catch (error) {
        console.error('[API] Error fetching procedure providers:', error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Failed to fetch procedure providers');
    }
}

/**
 * Get procedure details by slug
 */
export async function getProcedureBySlug(procedureSlug: string): Promise<SearchResult | null> {
    console.log('[API] Fetching procedure by slug:', { procedureSlug });
    try {
        // First try to get it from search, or we could have a dedicated endpoint
        const response = await searchProcedures(procedureSlug);
        const result = response.results.find((r) => r.procedure_slug === procedureSlug);
        if (result) {
            console.log('[API] Found procedure:', { procedureSlug, procedureName: result.procedure_name });
        } else {
            console.warn('[API] Procedure not found in search results:', { procedureSlug });
        }
        return result || null;
    } catch (error) {
        console.error('[API] Error fetching procedure:', error);
        return null;
    }
}

/**
 * Get provider details by ID
 */
export async function getProviderDetail(providerId: string): Promise<ProviderDetail> {
    const url = `${API_BASE_URL}/api/v1/providers/${providerId}`;

    console.log('[API] Fetching provider detail:', { providerId, url });

    try {
        const response = await fetchWithAuth(url, {
            method: 'GET',
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = `API request failed: ${response.status} ${response.statusText}`;
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.message || errorData.detail || errorMessage;
            } catch {
                errorMessage = errorText || errorMessage;
            }
            console.error('[API] Get provider detail error:', {
                status: response.status,
                statusText: response.statusText,
                error: errorMessage,
            });
            throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log('[API] Get provider detail success:', {
            providerId,
            providerName: data.provider_name,
        });
        return data as ProviderDetail;
    } catch (error) {
        console.error('[API] Error fetching provider detail:', error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Failed to fetch provider detail');
    }
}

