import { auth } from './firebase';
import { mockProceduresFallback, type MockProcedureFallback } from '@/mock/live/searchProceduresFallback';
import { getMockProvidersForProcedure, type MockProviderFallback } from '@/mock/live/providersFallback';

import { getApiBaseUrl } from './api-base';




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
    type?: 'procedure';
}


export interface DoctorResult {
    provider_id: string;
    provider_name: string;
    specialty: string;
    hospital_name?: string;
    price?: string;
    rating?: string | number;
    match_score?: number;
    type?: 'doctor';
}

export interface SpecialtyResult {
    specialty_id: string;
    specialty_name: string;
    doctor_count?: number;
    match_score?: number;
    type?: 'specialty';
}


export type UnifiedResult =
    | ({ type: 'procedure' } & SearchResult)
    | ({ type: 'doctor' } & DoctorResult)
    | ({ type: 'specialty' } & SpecialtyResult);


export interface SearchResponse {
    query: string;
    location?: string | null;
    radius_miles?: number;
    results_count: number;
    results: UnifiedResult[];
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
    _dataSource?: 'api' | 'mock'; // Internal flag to track data source
}

export interface Specialty {
    id: string;
    display_name: string;
    grouping?: string;
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

export interface Org {
    org_id: string;
    org_name: string;
    carrier_name?: string;
    min_price: number | string;
    savings?: string;
    distance_miles?: number;
    count_provider: number;
    in_network?: boolean;
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
}

export interface ProcedureOrgsResponse {
    procedure_id: string;
    procedure_name: string;
    procedure_slug: string;
    orgs: Org[];
    total_count: number;
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
 * Smart Auth Fetch: Attempts authenticated request, falls back to plain fetch on potential CORS/Auth failures
 */
async function fetchSmartAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const token = await getAuthToken();

    // If no token, just do a normal fetch
    if (!token) {
        return fetch(url, options);
    }

    try {
        // Attempt with Auth
        const response = await fetchWithAuth(url, options);

        // If we get a 401/403 or it's a CORS failure (which usually manifests as a TypeError in fetch),
        // we might want to retry without auth for public endpoints like search.
        if (response.status === 401 || response.status === 403) {
            console.warn('[API] Auth failed (401/403), retrying without authentication...');
            return fetch(url, options);
        }

        return response;
    } catch (error) {
        // Catch network errors (likely CORS preflight failures on Gateway)
        console.error('[API] fetchWithAuth failed, likely CORS or Network issue. Retrying without auth...', error);
        return fetch(url, options);
    }
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

    const url = `${getApiBaseUrl()}/search?${params.toString()}`;

    console.log('[API] Searching procedures:', { query, location, radius_miles, url });

    try {
        // Use fetchSmartAuth to handle tokens vs CORS preflight issues
        const response = await fetchSmartAuth(url, {
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
 * Safe wrapper for searchProcedures with mock fallback
 * Returns mock procedure data if API fails or returns empty results
 * 
 * @param query - The search query string
 * @returns Promise<SearchResult[]> - Array of procedure results (API or fallback)
 */
export async function safeSearchProcedures(query: string): Promise<SearchResult[]> {
    try {
        const response = await searchProcedures(query);

        // Filter to only procedures for this safe wrapper
        const procedures = (response.results || []).filter(r => r.type === 'procedure') as SearchResult[];

        // If API returns procedures, use them
        if (procedures.length > 0) {
            return procedures;
        }

        // No procedures found in API response - use mock fallback
        console.warn('[safeSearchProcedures] No procedures found in API response, using mock fallback');
        return filterMockProcedures(query);
    } catch (err) {
        // API failed - use mock fallback
        console.warn('[safeSearchProcedures] API failed, using mock fallback:', err);
        return filterMockProcedures(query);
    }
}

/**
 * Filter mock procedures by query string
 * Improved with fuzzy matching to handle "brain mri" against "MRI - Brain"
 */
function filterMockProcedures(query: string): SearchResult[] {
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(w => w.length > 0);

    return mockProceduresFallback
        .filter(p => {
            const displayNameLower = p.display_name.toLowerCase();
            const procedureNameLower = (p.procedure_name || '').toLowerCase();
            const categoryLower = p.category.toLowerCase();
            
            // If query is empty, return no results
            if (queryWords.length === 0) return false;

            // Check if ALL query words match SOME part of the procedure's searchable fields
            // This enables "brain mri" to match "MRI - Brain"
            return queryWords.every(word => 
                displayNameLower.includes(word) ||
                procedureNameLower.includes(word) ||
                categoryLower.includes(word)
            );
        })
        .map(p => ({
            procedure_id: p.procedure_id || p.slug,
            procedure_name: p.procedure_name || p.display_name,
            procedure_slug: p.procedure_slug || p.slug,
            family_name: p.category,
            family_slug: p.category.toLowerCase().replace(/\s+/g, '_'),
            category_name: p.category_name || p.category,
            category_slug: p.category.toLowerCase().replace(/\s+/g, '_'),
            best_price: p.best_price || '0',
            avg_price: p.best_price || '0',
            price_range: `$${p.best_price || '0'}`,
            provider_count: p.provider_count || 0,
            match_score: 0.8,
            type: 'procedure'
        } as SearchResult));
}

/**
 * Get all specialties from the API
 */
export async function getSpecialties(): Promise<{ specialties: Specialty[] }> {
    const url = `${getApiBaseUrl()}/specialties`;
    console.log('[API] Fetching specialties:', { url });

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch specialties: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('[API] Error fetching specialties:', error);
        return { specialties: [] };
    }
}


/**
 * Placeholder for doctor search API
 * Currently returns empty results until backend is ready
 */
export async function searchDoctors(query: string): Promise<DoctorResult[]> {
    console.log('[API] Placeholder: Searching doctors for:', query);
    // Real implementation will fetch from /api/v1/doctors?query=...
    return [];
}


/**
 * Generate slug variants for API calls
 * Returns array of slug variations to try
 */
function generateSlugVariants(slug: string): string[] {
    const variants = [
        slug, // Original slug
        slug.replace(/_/g, '-'), // Underscores to hyphens
        slug.replace(/_/g, '_of_'), // Add "of" between words
        slug.replace(/_/g, ' '), // Underscores to spaces
        slug.replace('mri_brain', 'mri_of_brain'), // Specific MRI brain variant
        slug.replace('mri_spine', 'mri_of_spine'), // Specific MRI spine variant
    ];

    // Remove duplicates
    return [...new Set(variants)];
}

/**
 * Get providers for a specific procedure
 * Restored simple direct API call from b6d802c pattern
 * Type-2 filtering applied AFTER validation (post-validation)
 * Mock fallback temporarily disabled for verification
 */
export async function getProcedureProviders(
    procedureSlug: string
): Promise<ProcedureProvidersResponse> {
    // === Restored core logic from b6d802c (last known-good) ===
    // Note: Keep current API_BASE_URL/fetchWithAuth utilities as-is
    const base = `${getApiBaseUrl()}/procedures/${procedureSlug}/providers`;

    const res = await fetch(base, {
        method: "GET",
    });

    if (!res.ok) {
        throw new Error(`Provider API failed: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    // The working commit returned providers directly on data.providers
    // Preserve the original response structure
    const providers = Array.isArray(data?.providers) ? data.providers : [];

    // Dev log to confirm we are using LIVE data and from which URL
    if (process.env.NODE_ENV === "development") {
        console.log("[API:LIVE] providers url:", base, "count:", providers.length);
    }

    // === Apply modern Type-2 filtering AFTER validating the response ===
    const orgProviders = providers.filter((p: any) =>
        p?.entity_type === 2 ||
        p?.type === "organization" ||
        p?.npi_type === "type2" ||
        p?.provider_type === "organization" ||
        p?.provider_type === "hospital" ||
        p?.provider_type === "clinic"
    );

    // If Type-2 filter yields results, use them; otherwise use original providers
    const finalProviders = orgProviders.length > 0 ? orgProviders : providers;

    // Return the FULL original payload, just swapping providers to finalProviders
    return {
        ...data,
        providers: finalProviders as Provider[],
        total_count: finalProviders.length,
        _dataSource: "api" as const,
    } as ProcedureProvidersResponse;
}

/**
 * Get organizations (facilities) for a specific procedure
 * Aggregates providers into organizations or fetches from a dedicated endpoint
 */
export async function getProcedureOrgs(
    procedureSlug: string
): Promise<ProcedureOrgsResponse> {
    try {
        // For now, we'll use getProcedureProviders and aggregate/map the data
        // In the future, this should call a dedicated API endpoint like /api/v1/procedures/{slug}/orgs
        const providerResponse = await getProcedureProviders(procedureSlug);

        // Group providers by organization (if possible) or map directly if they are already org-like
        // The current backend seems to return "providers" which can be individual doctors OR organizations
        // based on the filtering logic in getProcedureProviders.

        const orgs: Org[] = providerResponse.providers.map((p: any) => ({
            org_id: p.provider_id,
            org_name: p.provider_name,
            carrier_name: p.carrier_name || 'Unknown Carrier', // Placeholder if missing
            min_price: p.price || 0,
            savings: p.savings || undefined,
            distance_miles: p.distance_miles,
            count_provider: p.provider_count || 1,
            in_network: p.in_network ?? true, // Default to true for now if missing
            address: p.address,
            city: p.city,
            state: p.state,
            zip_code: p.zip,
        }));

        return {
            procedure_id: providerResponse.procedure_id,
            procedure_name: providerResponse.procedure_name,
            procedure_slug: providerResponse.procedure_slug,
            orgs: orgs,
            total_count: orgs.length,
        };
    } catch (error) {
        console.error('[API] Error fetching procedure orgs:', error);
        throw error;
    }
}

/**
 * Create mock provider response from fallback data
 */
function createMockProviderResponse(procedureSlug: string): ProcedureProvidersResponse {
    const mockProviders = getMockProvidersForProcedure(procedureSlug);

    // Convert mock providers to Provider format
    const providers: Provider[] = mockProviders.map(p => ({
        provider_id: p.provider_id,
        provider_name: p.provider_name,
        address: p.address,
        city: p.city,
        state: p.state,
        zip: p.zip,
        phone: p.phone,
        price: p.price,
        distance_miles: p.distance_miles || null,
    }));

    // Extract procedure name from slug
    const procedureName = procedureSlug
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    return {
        procedure_id: procedureSlug,
        procedure_name: procedureName,
        procedure_slug: procedureSlug,
        providers,
        total_count: providers.length,
        _dataSource: 'mock' as const,
    };
}

/**
 * Get procedure details by slug
 * Uses the dedicated /procedures/{slug} endpoint with mock data fallback
 */
export async function getProcedureBySlug(procedureSlug: string): Promise<SearchResult | null> {
    const url = `${getApiBaseUrl()}/procedures/${procedureSlug}`;

    console.log('[API] Fetching procedure by slug:', { procedureSlug, url });

    try {
        const response = await fetch(url, {
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
            const result = searchResponse.results.find((r) => r.type === 'procedure' && r.procedure_slug === procedureSlug) as SearchResult | undefined;
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
            const result = searchResponse.results.find((r) => r.type === 'procedure' && r.procedure_slug === procedureSlug) as SearchResult | undefined;
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
        'brain-mri': {
            procedure_id: 'brain-mri',
            procedure_name: 'MRI Scan – Brain',
            procedure_slug: 'brain-mri',
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
    const url = `${getApiBaseUrl()}/providers/${providerId}`;

    console.log('[API] Fetching provider detail:', { providerId, url });

    try {
        const response = await fetch(url, {
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

        // Fallback to mock data if available
        // This supports the "Find Doctors" page which uses dummy IDs like "dr_christopher_davis"
        const { doctors } = require('./data/mario-doctors-data');
        const mockDoctor = doctors.find((d: any) => d.id === providerId);

        if (mockDoctor) {
            console.log('[API] Using mock provider data for', providerId);
            return {
                provider_id: mockDoctor.id,
                provider_name: mockDoctor.name,
                address: '123 Medical Center Dr', // Default fallback
                city: 'San Francisco',
                state: 'CA',
                zip: '94143',
                phone: '(555) 123-4567',
                price: parseInt(mockDoctor.price.replace(/[^0-9]/g, '')) || 200,
                distance_miles: parseFloat(mockDoctor.distance.replace(/[^0-9.]/g, '')) || 2.5,
                specialty: mockDoctor.specialty,
                rating: parseFloat(mockDoctor.rating) || 4.5,
                review_count: parseInt(mockDoctor.reviews) || 0,
            } as ProviderDetail;
        }

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
    const url = `${getApiBaseUrl()}/health-hub?user_id=${encodeURIComponent(userId)}`;

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
    const url = `${getApiBaseUrl()}/rewards?user_id=${encodeURIComponent(userId)}`;

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
    const url = `${getApiBaseUrl()}/rewards/points`;

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
    const url = `${getApiBaseUrl()}/bookings?user_id=${encodeURIComponent(userId)}`;

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
    const url = `${getApiBaseUrl()}/claims?user_id=${encodeURIComponent(userId)}`;

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
    const url = `${getApiBaseUrl()}/requests?user_id=${encodeURIComponent(userId)}`;

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
    const url = `${getApiBaseUrl()}/categories`;

    console.log('[API] Fetching categories:', { url });

    try {
        const response = await fetch(url, {
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
    const url = `${getApiBaseUrl()}/categories/${categorySlug}/families`;

    console.log('[API] Fetching category families:', { categorySlug, url });

    try {
        const response = await fetch(url, {
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
    const url = `${getApiBaseUrl()}/families/${familySlug}/procedures`;

    console.log('[API] Fetching family procedures:', { familySlug, url });

    try {
        const response = await fetch(url, {
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
    const url = `${getApiBaseUrl()}/bookings`;

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
    const url = `${getApiBaseUrl()}/bookings/${bookingId}`;

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
    const url = `${getApiBaseUrl()}/bookings/${bookingId}/cancel`;

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
    const url = `${getApiBaseUrl()}/whoami`;

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

