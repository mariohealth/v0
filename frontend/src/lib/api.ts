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
 * Uses the dedicated /procedures/{slug} endpoint with mock data fallback
 */
export async function getProcedureBySlug(procedureSlug: string): Promise<SearchResult | null> {
    const url = `${API_BASE_URL}/api/v1/procedures/${procedureSlug}`;

    console.log('[API] Fetching procedure by slug:', { procedureSlug, url });

    try {
        const response = await fetchWithAuth(url, {
            method: 'GET',
        });

        if (!response.ok) {
            // Check if it's a 404 or "not found" error
            if (response.status === 404) {
                console.warn('[API] Procedure not found (404), using mock data fallback:', {
                    procedureSlug,
                });
                return await getMockProcedureData(procedureSlug);
            }

            // Fallback to search if dedicated endpoint fails with other error
            console.warn('[API] Procedure detail endpoint failed, falling back to search:', {
                status: response.status,
                procedureSlug,
            });
            const searchResponse = await searchProcedures(procedureSlug);
            const result = searchResponse.results.find((r) => r.procedure_slug === procedureSlug);
            return result || await getMockProcedureData(procedureSlug);
        }

        const data = await response.json();

        // Check if response indicates "not found"
        if (data.detail && (data.detail.includes('not found') || data.detail.includes('Not found'))) {
            console.warn('[API] Procedure not found in response, using mock data fallback:', {
                procedureSlug,
            });
            return await getMockProcedureData(procedureSlug);
        }

        console.log('[API] Procedure detail success:', {
            procedureSlug,
            procedureName: data.procedure_name,
        });

        // Convert ProcedureDetail to SearchResult format for compatibility
        return {
            procedure_id: data.procedure_id || '',
            procedure_name: data.procedure_name || '',
            procedure_slug: data.procedure_slug || procedureSlug,
            family_name: data.family_name || '',
            family_slug: data.family_slug || '',
            category_name: data.category_name || '',
            category_slug: data.category_slug || '',
            best_price: data.best_price || '',
            avg_price: data.avg_price || '',
            price_range: data.price_range || '',
            provider_count: data.provider_count || 0,
            match_score: 1.0,
        } as SearchResult;
    } catch (error) {
        console.error('[API] Error fetching procedure:', error);
        // Fallback to search on error
        try {
            const searchResponse = await searchProcedures(procedureSlug);
            const result = searchResponse.results.find((r) => r.procedure_slug === procedureSlug);
            if (result) {
                return result;
            }
        } catch (searchError) {
            console.error('[API] Search fallback also failed:', searchError);
        }

        // Final fallback to mock data
        console.warn('[API] All API calls failed, using mock data fallback:', {
            procedureSlug,
        });
        return await getMockProcedureData(procedureSlug);
    }
}

/**
 * Get mock procedure data from local JSON files
 * Falls back to a default structure if no mock file exists
 */
async function getMockProcedureData(procedureSlug: string): Promise<SearchResult | null> {
    // Import mock data for known procedures
    const mockDataMap: Record<string, SearchResult> = {
        'mri_brain': {
            procedure_id: 'mri_brain',
            procedure_name: 'MRI Scan – Brain',
            procedure_slug: 'mri_brain',
            family_name: 'MRI Scans',
            family_slug: 'mri',
            category_name: 'Imaging',
            category_slug: 'imaging',
            best_price: '850',
            avg_price: '1200',
            price_range: '$850 - $1,400',
            provider_count: 12,
            match_score: 1.0,
        },
    };

    // Check if we have mock data for this procedure
    if (mockDataMap[procedureSlug]) {
        console.log('[API] Using mock procedure data for', procedureSlug);
        return mockDataMap[procedureSlug];
    }

    // If no mock file exists, return a default structure
    console.warn('[API] No mock data file found for', procedureSlug, '- using default structure');
    return {
        procedure_id: procedureSlug,
        procedure_name: procedureSlug.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '),
        procedure_slug: procedureSlug,
        family_name: 'Procedure',
        family_slug: 'procedure',
        category_name: 'General',
        category_slug: 'general',
        best_price: '0',
        avg_price: '0',
        price_range: 'N/A',
        provider_count: 0,
        match_score: 0.5,
    } as SearchResult;
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
    const url = `${API_BASE_URL}/api/v1/health-hub?user_id=${encodeURIComponent(userId)}`;

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
    const url = `${API_BASE_URL}/api/v1/rewards?user_id=${encodeURIComponent(userId)}`;

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
    const url = `${API_BASE_URL}/api/v1/rewards/points`;

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
    const url = `${API_BASE_URL}/api/v1/bookings?user_id=${encodeURIComponent(userId)}`;

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
    const url = `${API_BASE_URL}/api/v1/claims?user_id=${encodeURIComponent(userId)}`;

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
    const url = `${API_BASE_URL}/api/v1/requests?user_id=${encodeURIComponent(userId)}`;

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

// Additional API functions for other backend endpoints

/**
 * Get all procedure categories
 */
export async function getCategories(): Promise<any> {
    const url = `${API_BASE_URL}/api/v1/categories`;

    console.log('[API] Fetching categories:', { url });

    try {
        const response = await fetchWithAuth(url, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('[API] Categories success:', { count: data.categories?.length || 0 });
        return data;
    } catch (error) {
        console.error('[API] Error fetching categories:', error);
        throw error;
    }
}

/**
 * Get families within a category
 */
export async function getCategoryFamilies(categorySlug: string): Promise<any> {
    const url = `${API_BASE_URL}/api/v1/categories/${categorySlug}/families`;

    console.log('[API] Fetching category families:', { categorySlug, url });

    try {
        const response = await fetchWithAuth(url, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('[API] Category families success:', { categorySlug, count: data.families?.length || 0 });
        return data;
    } catch (error) {
        console.error('[API] Error fetching category families:', error);
        throw error;
    }
}

/**
 * Get procedures within a family
 */
export async function getFamilyProcedures(familySlug: string): Promise<any> {
    const url = `${API_BASE_URL}/api/v1/families/${familySlug}/procedures`;

    console.log('[API] Fetching family procedures:', { familySlug, url });

    try {
        const response = await fetchWithAuth(url, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('[API] Family procedures success:', { familySlug, count: data.procedures?.length || 0 });
        return data;
    } catch (error) {
        console.error('[API] Error fetching family procedures:', error);
        throw error;
    }
}

/**
 * Create a booking
 */
export async function createBooking(bookingData: {
    provider_id: string;
    procedure_id: string;
    appointment_date: string;
    appointment_time: string;
    patient_name: string;
    patient_email: string;
    patient_phone?: string;
    insurance_provider?: string;
    notes?: string;
}): Promise<any> {
    const url = `${API_BASE_URL}/api/v1/bookings`;

    console.log('[API] Creating booking:', { bookingData, url });

    try {
        const response = await fetchWithAuth(url, {
            method: 'POST',
            body: JSON.stringify(bookingData),
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
            throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log('[API] Create booking success:', { bookingId: data.id });
        return data;
    } catch (error) {
        console.error('[API] Error creating booking:', error);
        throw error;
    }
}

/**
 * Get booking details
 */
export async function getBookingDetails(bookingId: string): Promise<any> {
    const url = `${API_BASE_URL}/api/v1/bookings/${bookingId}`;

    console.log('[API] Fetching booking details:', { bookingId, url });

    try {
        const response = await fetchWithAuth(url, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('[API] Booking details success:', { bookingId });
        return data;
    } catch (error) {
        console.error('[API] Error fetching booking details:', error);
        throw error;
    }
}

/**
 * Cancel a booking
 */
export async function cancelBooking(bookingId: string): Promise<any> {
    const url = `${API_BASE_URL}/api/v1/bookings/${bookingId}/cancel`;

    console.log('[API] Cancelling booking:', { bookingId, url });

    try {
        const response = await fetchWithAuth(url, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('[API] Cancel booking success:', { bookingId });
        return data;
    } catch (error) {
        console.error('[API] Error cancelling booking:', error);
        throw error;
    }
}

/**
 * Get authenticated user info
 */
export async function getWhoami(): Promise<any> {
    const url = `${API_BASE_URL}/api/v1/whoami`;

    console.log('[API] Fetching user info:', { url });

    try {
        const response = await fetchWithAuth(url, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('[API] Whoami success:', { authenticated: data.authenticated });
        return data;
    } catch (error) {
        console.error('[API] Error fetching user info:', error);
        throw error;
    }
}

