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

