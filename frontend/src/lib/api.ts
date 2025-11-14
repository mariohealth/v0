import { auth } from './firebase';

// API Base URL - MUST be set in .env.local
// Format: https://mario-health-api-gateway-x5pghxd.uc.gateway.dev/api/v1
const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

// Validate API_BASE in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    if (!API_BASE || API_BASE.trim() === '') {
        const errorMsg = 'ERROR: NEXT_PUBLIC_API_BASE is not set. API calls will fail.';
        console.error(errorMsg);
        console.error('Please set NEXT_PUBLIC_API_BASE in .env.local');
        console.error('Example: NEXT_PUBLIC_API_BASE=https://mario-health-api-gateway-x5pghxd.uc.gateway.dev/api/v1');
    }
}

// Validate API_BASE at build time (server-side)
if (typeof window === 'undefined' && (!API_BASE || API_BASE.trim() === '')) {
    console.error('ERROR: NEXT_PUBLIC_API_BASE is not set. API calls will fail.');
    console.error('Please set NEXT_PUBLIC_API_BASE in .env.local');
}

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

    if (!API_BASE) {
        throw new Error('NEXT_PUBLIC_API_BASE is not set');
    }

    const url = `${API_BASE}/search?${params.toString()}`;

    console.log('[API] Searching procedures:', { query, location, radius_miles, url });

    try {
        // Simple GET request - no headers, no auth, no CORS preflight
        const response = await fetch(url);

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
 * Get organization-level pricing for a specific procedure
 * @deprecated Use getProcedureOrgs() instead. This endpoint may be removed in the future.
 */
export async function getProcedureProviders(
    procedureSlug: string
): Promise<ProcedureProvidersResponse> {
    if (!API_BASE) {
        throw new Error('NEXT_PUBLIC_API_BASE is not set');
    }

    const url = `${API_BASE}/procedures/${procedureSlug}/providers`;

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
 * Organization-level pricing data
 */
export interface Org {
    org_id: string;
    org_name: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    phone?: string;
    price?: string;
    distance_miles?: number | null;
    in_network?: boolean;
    savings?: string;
    avg_price?: string;
}

export interface ProcedureOrgsResponse {
    procedure_id: string;
    procedure_name: string;
    procedure_slug: string;
    orgs: Org[];
    total_count: number;
}

/**
 * Get organization-level pricing for a specific procedure
 */
export async function getProcedureOrgs(slug: string): Promise<ProcedureOrgsResponse> {
    if (!API_BASE) {
        throw new Error('NEXT_PUBLIC_API_BASE is not set');
    }

    const url = `${API_BASE}/procedures/${slug}/orgs`;

    console.log('[API] Fetching procedure orgs:', { slug, url });

    try {
        // Simple GET request - no headers, no auth, no CORS preflight
        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = `API request failed: ${response.status} ${response.statusText}`;
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.message || errorData.detail || errorMessage;
            } catch {
                errorMessage = errorText || errorMessage;
            }
            console.error('[API] Get procedure orgs error:', {
                status: response.status,
                statusText: response.statusText,
                error: errorMessage,
            });
            throw new Error(errorMessage);
        }

        const data = await response.json();
        
        // Transform backend response to match frontend interface
        // Backend returns: procedure_id, org_id, carrier_id, carrier_name, count_provider, min_price, max_price, avg_price
        // Frontend expects: org_id, org_name, address, city, state, zip, phone, price, distance_miles, in_network, savings, avg_price
        const transformed: ProcedureOrgsResponse = {
            procedure_id: data.procedure_id || '',
            procedure_name: data.procedure_name || '',
            procedure_slug: data.procedure_slug || slug,
            orgs: (data.orgs || []).map((org: any) => ({
                org_id: org.org_id || '',
                org_name: org.org_name || org.carrier_name || `Organization ${org.org_id}`,
                address: org.address || undefined,
                city: org.city || undefined,
                state: org.state || undefined,
                zip: org.zip || undefined,
                phone: org.phone || undefined,
                price: org.min_price ? org.min_price.toString() : (org.price || undefined),
                distance_miles: org.distance_miles !== undefined ? org.distance_miles : null,
                in_network: org.in_network !== undefined ? org.in_network : undefined,
                savings: org.savings || undefined,
                avg_price: org.avg_price ? org.avg_price.toString() : (org.avg_price || undefined),
            })),
            total_count: data.orgs?.length || 0,
        };
        
        console.log('[API] Get procedure orgs success:', {
            slug,
            orgsCount: transformed.orgs?.length || 0,
        });
        return transformed;
    } catch (error) {
        console.error('[API] Error fetching procedure orgs:', error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Failed to fetch procedure orgs');
    }
}

/**
 * Procedure detail from API
 */
export interface ProcedureDetail {
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
    description?: string;
}

/**
 * Get procedure details by slug
 */
export async function getProcedureBySlug(procedureSlug: string): Promise<ProcedureDetail | null> {
    if (!API_BASE) {
        throw new Error('NEXT_PUBLIC_API_BASE is not set');
    }

    const url = `${API_BASE}/procedures/${procedureSlug}`;

    console.log('[API] Fetching procedure by slug:', { procedureSlug, url });

    try {
        // Simple GET request - no headers, no auth, no CORS preflight
        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 404) {
                console.warn('[API] Procedure not found:', { procedureSlug });
                return null;
            }
            const errorText = await response.text();
            let errorMessage = `API request failed: ${response.status} ${response.statusText}`;
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.message || errorData.detail || errorMessage;
            } catch {
                errorMessage = errorText || errorMessage;
            }
            console.error('[API] Get procedure detail error:', {
                status: response.status,
                statusText: response.statusText,
                error: errorMessage,
            });
            throw new Error(errorMessage);
        }

        const data = await response.json();
        
        // Transform backend response to match frontend interface
        // Backend returns: id, name, slug, min_price, max_price, avg_price
        // Frontend expects: procedure_id, procedure_name, procedure_slug, best_price, price_range, provider_count
        const transformed: ProcedureDetail = {
            procedure_id: data.id || data.procedure_id,
            procedure_name: data.name || data.procedure_name,
            procedure_slug: data.slug || data.procedure_slug,
            family_name: data.family_name || '',
            family_slug: data.family_slug || '',
            category_name: data.category_name || '',
            category_slug: data.category_slug || '',
            best_price: data.min_price ? data.min_price.toString() : (data.best_price || '0'),
            avg_price: data.avg_price ? data.avg_price.toString() : (data.avg_price || '0'),
            price_range: data.min_price && data.max_price 
                ? `$${data.min_price} - $${data.max_price}`
                : (data.price_range || 'N/A'),
            provider_count: data.provider_count || 0,
            description: data.description || undefined,
        };
        
        console.log('[API] Get procedure detail success:', {
            procedureSlug,
            procedureName: transformed.procedure_name,
        });
        return transformed;
    } catch (error) {
        console.error('[API] Error fetching procedure detail:', error);
        if (error instanceof Error) {
            throw error;
        }
        return null;
    }
}

/**
 * Get provider details by ID
 */
export async function getProviderDetail(providerId: string): Promise<ProviderDetail> {
    if (!API_BASE) {
        throw new Error('NEXT_PUBLIC_API_BASE is not set');
    }

    const url = `${API_BASE}/providers/${providerId}`;

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

// Health Hub & Rewards API Types
export interface Appointment {
    id: string;
    provider: string;
    specialty: string;
    date: string;
    time: string;
    status: 'confirmed' | 'pending' | 'cancelled';
    marioPoints?: number;
    isPast?: boolean;
}

export interface ConciergeRequest {
    id: string;
    type: string;
    status: 'in-progress' | 'completed' | 'cancelled';
    requestDate: string;
    expectedDate: string;
}

export interface Claim {
    id: string;
    service: string;
    provider: string;
    amount: string;
    youOwe: string;
    date: string;
    status: 'paid' | 'pending' | 'denied';
}

export interface Message {
    id: string;
    sender: string;
    message: string;
    time: string;
    isNew: boolean;
}

export interface DeductibleProgress {
    current: number;
    total: number;
    percentage: number;
}

export interface HealthHubData {
    upcomingAppointments: Appointment[];
    pastAppointments: Appointment[];
    conciergeRequests: ConciergeRequest[];
    recentClaims: Claim[];
    messages: Message[];
    deductibleProgress: DeductibleProgress;
}

export interface RewardsData {
    currentPoints: number;
    nextMilestone: number;
    rewards: Reward[];
}

export interface Reward {
    id: number;
    title: string;
    pointsRequired: number;
    category: string;
    logo: string;
    brand: string;
    value: string;
    description: string;
    isBookmarked?: boolean;
}

/**
 * Fetch Health Hub data for a user
 */
export async function fetchHealthHubData(userId: string): Promise<HealthHubData> {
    if (!API_BASE) {
        throw new Error('NEXT_PUBLIC_API_BASE is not set');
    }

    const url = `${API_BASE}/health-hub?user_id=${encodeURIComponent(userId)}`;

    console.log('[API] Fetching health hub data:', { userId, url });

    try {
        const response = await fetchWithAuth(url, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('[API] Health hub data success:', { userId });
        return data as HealthHubData;
    } catch (error) {
        console.error('[API] Error fetching health hub data:', error);
        throw error;
    }
}

/**
 * Fetch Rewards data for a user
 */
export async function fetchRewardsData(userId: string): Promise<RewardsData> {
    if (!API_BASE) {
        throw new Error('NEXT_PUBLIC_API_BASE is not set');
    }

    const url = `${API_BASE}/rewards?user_id=${encodeURIComponent(userId)}`;

    console.log('[API] Fetching rewards data:', { userId, url });

    try {
        const response = await fetchWithAuth(url, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('[API] Rewards data success:', { userId });
        return data as RewardsData;
    } catch (error) {
        console.error('[API] Error fetching rewards data:', error);
        throw error;
    }
}

/**
 * Update MarioPoints for a user
 */
export async function updateMarioPoints(userId: string, delta: number): Promise<number> {
    if (!API_BASE) {
        throw new Error('NEXT_PUBLIC_API_BASE is not set');
    }

    const url = `${API_BASE}/rewards/points`;

    console.log('[API] Updating MarioPoints:', { userId, delta, url });

    try {
        const response = await fetchWithAuth(url, {
            method: 'POST',
            body: JSON.stringify({
                user_id: userId,
                delta: delta,
            }),
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
            console.error('[API] Update MarioPoints error:', {
                status: response.status,
                statusText: response.statusText,
                error: errorMessage,
            });
            throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log('[API] Update MarioPoints success:', {
            userId,
            delta,
            newTotal: data.total_points,
        });
        return data.total_points as number;
    } catch (error) {
        console.error('[API] Error updating MarioPoints:', error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Failed to update MarioPoints');
    }
}

/**
 * Get appointments for a user
 */
export async function getAppointments(userId: string): Promise<Appointment[]> {
    if (!API_BASE) {
        throw new Error('NEXT_PUBLIC_API_BASE is not set');
    }

    const url = `${API_BASE}/bookings?user_id=${encodeURIComponent(userId)}`;

    console.log('[API] Fetching appointments:', { userId, url });

    try {
        const response = await fetchWithAuth(url, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('[API] Appointments success:', { userId, count: data.length });
        return data as Appointment[];
    } catch (error) {
        console.error('[API] Error fetching appointments:', error);
        throw error;
    }
}

/**
 * Get claims for a user
 */
export async function getClaims(userId: string): Promise<Claim[]> {
    if (!API_BASE) {
        throw new Error('NEXT_PUBLIC_API_BASE is not set');
    }

    const url = `${API_BASE}/claims?user_id=${encodeURIComponent(userId)}`;

    console.log('[API] Fetching claims:', { userId, url });

    try {
        const response = await fetchWithAuth(url, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('[API] Claims success:', { userId, count: data.length });
        return data as Claim[];
    } catch (error) {
        console.error('[API] Error fetching claims:', error);
        throw error;
    }
}

/**
 * Get concierge requests for a user
 */
export async function getConciergeRequests(userId: string): Promise<ConciergeRequest[]> {
    if (!API_BASE) {
        throw new Error('NEXT_PUBLIC_API_BASE is not set');
    }

    const url = `${API_BASE}/requests?user_id=${encodeURIComponent(userId)}`;

    console.log('[API] Fetching concierge requests:', { userId, url });

    try {
        const response = await fetchWithAuth(url, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('[API] Concierge requests success:', { userId, count: data.length });
        return data as ConciergeRequest[];
    } catch (error) {
        console.error('[API] Error fetching concierge requests:', error);
        throw error;
    }
}

