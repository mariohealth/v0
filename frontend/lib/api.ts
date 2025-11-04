// Import centralized types and validation schemas
import {
    SearchParams,
    SearchResponse,
    Provider,
    BookingData,
    BookingResponse,
    TimeSlot,
    ApiError,
    ApiResponse,
    ProcedureSearchResponse,
    InsuranceProvidersResponse,
    InsuranceVerificationRequest,
    InsuranceVerificationResponse,
    ApiSchemas,
    BackendSearchResponse,
    BackendProcedureCategoriesResponse,
    SearchError,
} from '../types/api';
import { z } from 'zod';
import { getAuthToken } from './auth-token';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Enhanced API client with validation and error handling
 * Uses centralized types from /types/api.ts
 */
class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    /**
     * Generic request method with validation and error handling
     * @param endpoint - API endpoint path
     * @param options - Fetch options
     * @param validateResponse - Optional Zod schema for response validation
     * @returns Promise with typed response
     */
    private async request<T>(
        endpoint: string,
        options: RequestInit = {},
        validateResponse?: (data: any) => T
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

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

        const config: RequestInit = {
            ...options,
            headers,
        };

        // Add timeout handling
        const timeoutMs = 30000; // 30 seconds
        const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => {
                reject(new Error('Request timeout'));
            }, timeoutMs);
        });

        try {
            const response = await Promise.race([
                fetch(url, config),
                timeoutPromise
            ]);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));

                // Handle rate limiting
                if (response.status === 429) {
                    const retryAfter = response.headers.get('Retry-After');
                    const searchError: SearchError = {
                        name: 'RateLimitError',
                        message: errorData.message || 'Too many requests',
                        type: 'RATE_LIMIT_ERROR',
                        retryable: true,
                        retryAfter: retryAfter ? parseInt(retryAfter) : 60,
                        statusCode: response.status,
                        details: errorData
                    };
                    throw searchError;
                }

                // Handle server errors
                if (response.status >= 500) {
                    const searchError: SearchError = {
                        name: 'ServerError',
                        message: errorData.message || `Server error: ${response.status}`,
                        type: 'SERVER_ERROR',
                        retryable: true,
                        statusCode: response.status,
                        details: errorData
                    };
                    throw searchError;
                }

                // Handle client errors
                const apiError: ApiError = {
                    message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
                    code: errorData.code || 'HTTP_ERROR',
                    details: errorData.details,
                    statusCode: response.status,
                };
                throw new Error(JSON.stringify(apiError));
            }

            const data = await response.json();

            // Validate response if schema provided
            if (validateResponse) {
                try {
                    return validateResponse(data);
                } catch (validationError) {
                    const searchError: SearchError = {
                        name: 'ValidationError',
                        message: 'Invalid response format',
                        type: 'MALFORMED_RESPONSE',
                        retryable: false,
                        statusCode: response.status,
                        details: { validationError: validationError instanceof Error ? validationError.message : 'Unknown validation error' }
                    };
                    throw searchError;
                }
            }

            return data;
        } catch (error) {
            if (error instanceof Error) {
                // Handle timeout errors
                if (error.message === 'Request timeout') {
                    const searchError: SearchError = {
                        name: 'TimeoutError',
                        message: 'Request timed out',
                        type: 'TIMEOUT_ERROR',
                        retryable: true,
                        details: { timeout: timeoutMs }
                    };
                    throw searchError;
                }

                // Handle network errors
                if (error.name === 'TypeError' && error.message.includes('fetch')) {
                    const searchError: SearchError = {
                        name: 'NetworkError',
                        message: 'Network connection failed',
                        type: 'NETWORK_ERROR',
                        retryable: true,
                        details: { originalError: error.message }
                    };
                    throw searchError;
                }

                // Try to parse as API error
                try {
                    const apiError = JSON.parse(error.message) as ApiError;
                    throw new Error(apiError.message);
                } catch {
                    // If it's already a SearchError, re-throw it
                    if ('type' in error) {
                        throw error;
                    }
                    throw error;
                }
            }
            throw new Error('An unexpected error occurred');
        }
    }

    /**
     * Search for healthcare providers
     * @param params - Search parameters
     * @returns Promise with search results
     */
    async searchProviders(params: SearchParams): Promise<SearchResponse> {
        try {
            // Validate and sanitize input parameters
            const validatedParams = ApiSchemas.SearchParams.parse(params);

            // Sanitize procedure name to handle special characters
            const sanitizedProcedure = validatedParams.procedure
                .trim()
                .replace(/[<>\"'&]/g, '') // Remove potentially problematic characters
                .substring(0, 200); // Limit length

            if (!sanitizedProcedure) {
                const searchError: SearchError = {
                    name: 'ValidationError',
                    message: 'Procedure name is required and cannot be empty',
                    type: 'VALIDATION_ERROR',
                    retryable: false,
                    details: { originalProcedure: validatedParams.procedure }
                };
                throw searchError;
            }

            const searchParams = new URLSearchParams();
            searchParams.append('procedure', sanitizedProcedure);

            if (validatedParams.location) {
                const sanitizedLocation = validatedParams.location.trim().substring(0, 100);
                searchParams.append('location', sanitizedLocation);
            }
            if (validatedParams.insuranceProvider) {
                const sanitizedInsurance = validatedParams.insuranceProvider.trim().substring(0, 50);
                searchParams.append('insuranceProvider', sanitizedInsurance);
            }
            if (validatedParams.maxDistance) searchParams.append('maxDistance', validatedParams.maxDistance.toString());
            if (validatedParams.priceRange) {
                searchParams.append('minPrice', validatedParams.priceRange[0].toString());
                searchParams.append('maxPrice', validatedParams.priceRange[1].toString());
            }
            if (validatedParams.minRating) searchParams.append('minRating', validatedParams.minRating.toString());
            if (validatedParams.types && validatedParams.types.length > 0) {
                searchParams.append('types', validatedParams.types.join(','));
            }

            const response = await this.request<SearchResponse>(
                `/api/v1/search?${searchParams.toString()}`,
                {},
                (data) => ApiSchemas.SearchResponse.parse(data)
            );

            // Check for empty results
            if (!response.providers || response.providers.length === 0) {
                const searchError: SearchError = {
                    name: 'EmptyResultsError',
                    message: 'No providers found matching your search criteria',
                    type: 'EMPTY_RESULTS',
                    retryable: false,
                    details: { searchParams: validatedParams }
                };
                throw searchError;
            }

            return response;
        } catch (error) {
            // If it's already a SearchError, re-throw it
            if (error && typeof error === 'object' && 'type' in error) {
                throw error;
            }

            // Handle validation errors
            if (error instanceof Error && error.message.includes('validation')) {
                const searchError: SearchError = {
                    name: 'ValidationError',
                    message: 'Invalid search parameters',
                    type: 'VALIDATION_ERROR',
                    retryable: false,
                    details: { originalError: error.message }
                };
                throw searchError;
            }

            // Re-throw other errors
            throw error;
        }
    }

    /**
     * Get detailed information about a specific provider
     * @param id - Provider ID
     * @returns Promise with provider details
     */
    async getProviderDetails(id: string): Promise<Provider> {
        if (!id || typeof id !== 'string') {
            throw new Error('Provider ID is required');
        }

        return this.request<Provider>(
            `/api/v1/providers/${id}`,
            {},
            (data) => ApiSchemas.Provider.parse(data)
        );
    }

    /**
     * Create a new appointment booking
     * @param data - Booking information
     * @returns Promise with booking confirmation
     */
    async createBooking(data: BookingData): Promise<BookingResponse> {
        // Validate booking data
        const validatedData = ApiSchemas.BookingData.parse(data);

        return this.request<BookingResponse>(
            '/api/v1/bookings',
            {
                method: 'POST',
                body: JSON.stringify(validatedData),
            },
            (response) => ApiSchemas.BookingResponse.parse(response)
        );
    }

    /**
     * Get details of a specific booking
     * @param bookingId - Booking ID
     * @returns Promise with booking details
     */
    async getBookingDetails(bookingId: string): Promise<BookingResponse> {
        if (!bookingId || typeof bookingId !== 'string') {
            throw new Error('Booking ID is required');
        }

        return this.request<BookingResponse>(
            `/api/v1/bookings/${bookingId}`,
            {},
            (data) => ApiSchemas.BookingResponse.parse(data)
        );
    }

    /**
     * Cancel an existing booking
     * @param bookingId - Booking ID
     * @returns Promise with cancellation confirmation
     */
    async cancelBooking(bookingId: string): Promise<{ success: boolean }> {
        if (!bookingId || typeof bookingId !== 'string') {
            throw new Error('Booking ID is required');
        }

        return this.request<{ success: boolean }>(`/api/v1/bookings/${bookingId}/cancel`, {
            method: 'DELETE',
        });
    }

    /**
     * Get available time slots for a provider
     * @param providerId - Provider ID
     * @param date - Optional specific date
     * @returns Promise with available time slots
     */
    async getAvailableTimeSlots(providerId: string, date?: string): Promise<TimeSlot[]> {
        if (!providerId || typeof providerId !== 'string') {
            throw new Error('Provider ID is required');
        }

        const params = date ? `?date=${date}` : '';
        return this.request<TimeSlot[]>(
            `/api/v1/providers/${providerId}/time-slots${params}`,
            {},
            (data) => z.array(ApiSchemas.TimeSlot).parse(data)
        );
    }

    /**
     * Verify insurance coverage for a patient
     * @param memberId - Insurance member ID
     * @param providerId - Provider ID
     * @returns Promise with verification results
     */
    async verifyInsurance(memberId: string, providerId: string): Promise<InsuranceVerificationResponse> {
        const requestData: InsuranceVerificationRequest = { memberId, providerId };

        // Validate request data
        const validatedData = ApiSchemas.InsuranceVerificationRequest.parse(requestData);

        return this.request<InsuranceVerificationResponse>(
            '/api/v1/insurance/verify',
            {
                method: 'POST',
                body: JSON.stringify(validatedData),
            },
            (data) => ApiSchemas.InsuranceVerificationResponse.parse(data)
        );
    }

    /**
     * Get list of available medical procedures
     * @param query - Optional search query
     * @returns Promise with procedures list
     */
    async getProcedures(query?: string): Promise<ProcedureSearchResponse> {
        const params = query ? `?q=${encodeURIComponent(query)}` : '';
        return this.request<ProcedureSearchResponse>(
            `/api/v1/procedures${params}`,
            {},
            (data) => ApiSchemas.ProcedureSearchResponse.parse(data)
        );
    }

    /**
     * Get list of accepted insurance providers
     * @returns Promise with insurance providers list
     */
    async getInsuranceProviders(): Promise<InsuranceProvidersResponse> {
        return this.request<InsuranceProvidersResponse>(
            '/api/v1/insurance/providers',
            {},
            (data) => ApiSchemas.InsuranceProvidersResponse.parse(data)
        );
    }

    // ============================================================================
    // BACKEND API METHODS (Current Implementation)
    // ============================================================================

    /**
     * Search products using current backend API
     * @param query - Search query
     * @returns Promise with backend search results
     */
    async searchProducts(query: string): Promise<BackendSearchResponse> {
        if (!query || typeof query !== 'string') {
            throw new Error('Search query is required');
        }

        return this.request<BackendSearchResponse>(`/api/v1/search?q=${encodeURIComponent(query)}`);
    }

    /**
     * Get procedure categories using current backend API
     * @returns Promise with procedure categories
     */
    async getProcedureCategories(): Promise<BackendProcedureCategoriesResponse> {
        return this.request<BackendProcedureCategoriesResponse>('/api/v1/categories');
    }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();

// Export individual functions for convenience with proper typing
export const searchProviders = (params: SearchParams) => apiClient.searchProviders(params);
export const getProviderDetails = (id: string) => apiClient.getProviderDetails(id);
export const createBooking = (data: BookingData) => apiClient.createBooking(data);
export const getBookingDetails = (bookingId: string) => apiClient.getBookingDetails(bookingId);
export const cancelBooking = (bookingId: string) => apiClient.cancelBooking(bookingId);
export const getAvailableTimeSlots = (providerId: string, date?: string) =>
    apiClient.getAvailableTimeSlots(providerId, date);
export const verifyInsurance = (memberId: string, providerId: string) =>
    apiClient.verifyInsurance(memberId, providerId);
export const getProcedures = (query?: string) => apiClient.getProcedures(query);
export const getInsuranceProviders = () => apiClient.getInsuranceProviders();

// Backend API functions
export const searchProducts = (query: string) => apiClient.searchProducts(query);
export const getProcedureCategories = () => apiClient.getProcedureCategories();

// Re-export types for backward compatibility
export type {
    SearchParams,
    SearchResponse,
    Provider,
    BookingData,
    BookingResponse,
    TimeSlot,
    ApiError,
    ApiResponse,
    SearchError,
} from '../types/api';