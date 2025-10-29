/**
 * API Adapter - Centralized API management with mock/real switching
 * 
 * Features:
 * - One-line environment switching between mock and real APIs
 * - Retry logic with exponential backoff
 * - Request/response logging in development
 * - Response transformation from AC format to frontend types
 * - Consistent error handling
 * - Timeout management
 */

import { mockProviders, filterProviders, Provider, TimeSlot, Review } from '../mockData';
import { getAuthToken } from './auth-token';

// Environment configuration
const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const REQUEST_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000');
const MAX_RETRIES = parseInt(process.env.NEXT_PUBLIC_API_MAX_RETRIES || '3');
const RETRY_DELAY_BASE = parseInt(process.env.NEXT_PUBLIC_API_RETRY_DELAY || '1000');

// Types
export interface SearchParams {
    procedure: string;
    location?: string;
    insuranceProvider?: string;
    maxDistance?: number;
    priceRange?: [number, number];
    minRating?: number;
    types?: string[];
}

export interface SearchResponse {
    providers: Provider[];
    totalCount: number;
    filters: {
        priceRange: [number, number];
        locations: string[];
        insuranceProviders: string[];
        specialties: string[];
    };
}

export interface BookingData {
    providerId: string;
    patientName: string;
    email: string;
    phone: string;
    preferredDate: string;
    insuranceProvider?: string;
    notes?: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    memberId: string;
    reasonForVisit?: string;
}

export interface BookingResponse {
    bookingId: string;
    confirmationNumber: string;
    status: 'confirmed' | 'pending' | 'cancelled';
    appointmentDate: string;
    appointmentTime: string;
    provider: Provider;
    patient: {
        name: string;
        email: string;
        phone: string;
    };
}

export interface ApiError {
    message: string;
    code: string;
    details?: any;
}

// AC API Response Types (what we expect from the backend)
interface ACProvider {
    id: string;
    name: string;
    facility_type: 'hospital' | 'clinic' | 'imaging_center' | 'lab';
    rating: number;
    review_count: number;
    price: number;
    original_price?: number;
    distance_miles: number;
    address: {
        street: string;
        city: string;
        state: string;
        zip: string;
    };
    neighborhood: string;
    availability_text: string;
    image_url?: string;
    badges?: string[];
    accepts_insurance: boolean;
    insurance_partners?: string[];
    about?: string;
    specialties?: string[];
    languages?: string[];
    accepted_insurance?: string[];
    images?: Array<{
        id: string;
        url: string;
        alt: string;
        type: 'facility' | 'staff' | 'equipment';
    }>;
    reviews?: Array<{
        id: string;
        patient_name: string;
        rating: number;
        date: string;
        comment: string;
        procedure?: string;
    }>;
    available_time_slots?: Array<{
        id: string;
        date: string;
        time: string;
        available: boolean;
    }>;
    phone?: string;
    website?: string;
    parking_available?: boolean;
    wheelchair_accessible?: boolean;
    requires_referral?: boolean;
    new_patient_accepted?: boolean;
    negotiated_rate?: number;
    standard_rate?: number;
    savings?: number;
    savings_percent?: number;
}

interface ACSearchResponse {
    providers: ACProvider[];
    total_count: number;
    filters: {
        price_range: [number, number];
        locations: string[];
        insurance_providers: string[];
        specialties: string[];
    };
}

// Response transformation functions
function transformACProviderToProvider(acProvider: ACProvider): Provider {
    return {
        id: acProvider.id,
        name: acProvider.name,
        type: acProvider.facility_type,
        rating: acProvider.rating,
        reviewCount: acProvider.review_count,
        price: acProvider.price,
        originalPrice: acProvider.original_price,
        distance: `${acProvider.distance_miles} miles`,
        address: acProvider.address,
        neighborhood: acProvider.neighborhood,
        availability: acProvider.availability_text,
        imageUrl: acProvider.image_url,
        badges: acProvider.badges,
        acceptsInsurance: acProvider.accepts_insurance,
        insurancePartners: acProvider.insurance_partners,
        about: acProvider.about,
        specialties: acProvider.specialties,
        languages: acProvider.languages,
        acceptedInsurance: acProvider.accepted_insurance,
        images: acProvider.images,
        reviews: acProvider.reviews?.map(review => ({
            id: review.id,
            patientName: review.patient_name,
            rating: review.rating,
            date: review.date,
            comment: review.comment,
            procedure: review.procedure,
        })),
        availableTimeSlots: acProvider.available_time_slots,
        phone: acProvider.phone,
        website: acProvider.website,
        parkingAvailable: acProvider.parking_available,
        wheelchairAccessible: acProvider.wheelchair_accessible,
        requiresReferral: acProvider.requires_referral,
        newPatientAccepted: acProvider.new_patient_accepted,
        negotiatedRate: acProvider.negotiated_rate,
        standardRate: acProvider.standard_rate,
        savings: acProvider.savings,
        savingsPercent: acProvider.savings_percent,
        insurance: acProvider.accepted_insurance,
    };
}

function transformACSearchResponse(response: ACSearchResponse): SearchResponse {
    return {
        providers: response.providers.map(transformACProviderToProvider),
        totalCount: response.total_count,
        filters: {
            priceRange: response.filters.price_range,
            locations: response.filters.locations,
            insuranceProviders: response.filters.insurance_providers,
            specialties: response.filters.specialties,
        },
    };
}

// Logging utility
function logRequest(method: string, url: string, data?: any) {
    if (process.env.NODE_ENV === 'development') {
        console.group(`🌐 API Request: ${method} ${url}`);
        if (data) {
            console.log('Request Data:', data);
        }
        console.log('Timestamp:', new Date().toISOString());
        console.groupEnd();
    }
}

function logResponse(method: string, url: string, response: any, duration: number) {
    if (process.env.NODE_ENV === 'development') {
        console.group(`✅ API Response: ${method} ${url}`);
        console.log('Response Data:', response);
        console.log('Duration:', `${duration}ms`);
        console.log('Timestamp:', new Date().toISOString());
        console.groupEnd();
    }
}

function logError(method: string, url: string, error: any, duration: number) {
    if (process.env.NODE_ENV === 'development') {
        console.group(`❌ API Error: ${method} ${url}`);
        console.error('Error:', error);
        console.log('Duration:', `${duration}ms`);
        console.log('Timestamp:', new Date().toISOString());
        console.groupEnd();
    }
}

// Retry utility with exponential backoff
async function withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = MAX_RETRIES,
    baseDelay: number = RETRY_DELAY_BASE
): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error as Error;

            if (attempt === maxRetries) {
                throw lastError;
            }

            // Don't retry on client errors (4xx)
            if (error instanceof Error && 'status' in error) {
                const status = (error as any).status;
                if (status >= 400 && status < 500) {
                    throw lastError;
                }
            }

            // Exponential backoff delay
            const delay = baseDelay * Math.pow(2, attempt);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    throw lastError!;
}

// Timeout utility
function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    return Promise.race([
        promise,
        new Promise<never>((_, reject) => {
            setTimeout(() => {
                reject(new Error(`Request timeout after ${timeoutMs}ms`));
            }, timeoutMs);
        })
    ]);
}

// Mock API implementation
class MockApiClient {
    private delay(ms: number = 500): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async searchProviders(params: SearchParams): Promise<SearchResponse> {
        await this.delay();

        logRequest('GET', '/search', params);
        const startTime = Date.now();

        try {
            // Filter mock providers based on search params
            const filteredProviders = filterProviders(
                mockProviders,
                params.procedure,
                params.priceRange,
                params.types,
                params.minRating
            );

            const response: SearchResponse = {
                providers: filteredProviders,
                totalCount: filteredProviders.length,
                filters: {
                    priceRange: [200, 2000],
                    locations: ['Upper East Side', 'Chelsea', 'Midtown', 'Brooklyn Heights'],
                    insuranceProviders: ['UnitedHealthcare', 'Aetna', 'Cigna', 'Blue Cross'],
                    specialties: ['Cardiology', 'Orthopedics', 'Neurology', 'Oncology'],
                },
            };

            const duration = Date.now() - startTime;
            logResponse('GET', '/search', response, duration);

            return response;
        } catch (error) {
            const duration = Date.now() - startTime;
            logError('GET', '/search', error, duration);
            throw error;
        }
    }

    async getProviderDetails(id: string): Promise<Provider> {
        await this.delay();

        logRequest('GET', `/providers/${id}`);
        const startTime = Date.now();

        try {
            const provider = mockProviders.find(p => p.id === id);
            if (!provider) {
                throw new Error(`Provider with id ${id} not found`);
            }

            const duration = Date.now() - startTime;
            logResponse('GET', `/providers/${id}`, provider, duration);

            return provider;
        } catch (error) {
            const duration = Date.now() - startTime;
            logError('GET', `/providers/${id}`, error, duration);
            throw error;
        }
    }

    async createBooking(data: BookingData): Promise<BookingResponse> {
        await this.delay();

        logRequest('POST', '/bookings', data);
        const startTime = Date.now();

        try {
            const provider = mockProviders.find(p => p.id === data.providerId);
            if (!provider) {
                throw new Error(`Provider with id ${data.providerId} not found`);
            }

            const response: BookingResponse = {
                bookingId: `booking_${Date.now()}`,
                confirmationNumber: `CONF${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                status: 'confirmed',
                appointmentDate: data.preferredDate,
                appointmentTime: '10:00 AM',
                provider,
                patient: {
                    name: data.patientName,
                    email: data.email,
                    phone: data.phone,
                },
            };

            const duration = Date.now() - startTime;
            logResponse('POST', '/bookings', response, duration);

            return response;
        } catch (error) {
            const duration = Date.now() - startTime;
            logError('POST', '/bookings', error, duration);
            throw error;
        }
    }

    async getBookingDetails(bookingId: string): Promise<BookingResponse> {
        await this.delay();

        logRequest('GET', `/bookings/${bookingId}`);
        const startTime = Date.now();

        try {
            // Mock booking response
            const response: BookingResponse = {
                bookingId,
                confirmationNumber: `CONF${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                status: 'confirmed',
                appointmentDate: '2025-10-26',
                appointmentTime: '10:00 AM',
                provider: mockProviders[0],
                patient: {
                    name: 'John Doe',
                    email: 'john@example.com',
                    phone: '(555) 123-4567',
                },
            };

            const duration = Date.now() - startTime;
            logResponse('GET', `/bookings/${bookingId}`, response, duration);

            return response;
        } catch (error) {
            const duration = Date.now() - startTime;
            logError('GET', `/bookings/${bookingId}`, error, duration);
            throw error;
        }
    }

    async cancelBooking(bookingId: string): Promise<{ success: boolean }> {
        await this.delay();

        logRequest('DELETE', `/bookings/${bookingId}/cancel`);
        const startTime = Date.now();

        try {
            const response = { success: true };

            const duration = Date.now() - startTime;
            logResponse('DELETE', `/bookings/${bookingId}/cancel`, response, duration);

            return response;
        } catch (error) {
            const duration = Date.now() - startTime;
            logError('DELETE', `/bookings/${bookingId}/cancel`, error, duration);
            throw error;
        }
    }

    async getAvailableTimeSlots(providerId: string, date?: string): Promise<TimeSlot[]> {
        await this.delay();

        const endpoint = `/providers/${providerId}/time-slots${date ? `?date=${date}` : ''}`;
        logRequest('GET', endpoint);
        const startTime = Date.now();

        try {
            // Generate mock time slots
            const slots: TimeSlot[] = [];
            const today = new Date();

            for (let dayOffset = 1; dayOffset <= 7; dayOffset++) {
                const slotDate = new Date(today);
                slotDate.setDate(slotDate.getDate() + dayOffset);
                const dateStr = slotDate.toISOString().split('T')[0];

                if (date && dateStr !== date) continue;

                const morningTimes = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'];
                const afternoonTimes = ['02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'];

                [...morningTimes, ...afternoonTimes].forEach((time, index) => {
                    const available = Math.random() > 0.3;
                    slots.push({
                        id: `slot-${dayOffset}-${index}`,
                        date: dateStr,
                        time: time,
                        available: available,
                    });
                });
            }

            const duration = Date.now() - startTime;
            logResponse('GET', endpoint, slots, duration);

            return slots;
        } catch (error) {
            const duration = Date.now() - startTime;
            logError('GET', endpoint, error, duration);
            throw error;
        }
    }

    async verifyInsurance(memberId: string, providerId: string): Promise<{
        verified: boolean;
        coverage: {
            copay?: number;
            deductible?: number;
            coinsurance?: number;
        };
    }> {
        await this.delay();

        logRequest('POST', '/insurance/verify', { memberId, providerId });
        const startTime = Date.now();

        try {
            const response = {
                verified: Math.random() > 0.2, // 80% success rate
                coverage: {
                    copay: 25,
                    deductible: 500,
                    coinsurance: 0.2,
                },
            };

            const duration = Date.now() - startTime;
            logResponse('POST', '/insurance/verify', response, duration);

            return response;
        } catch (error) {
            const duration = Date.now() - startTime;
            logError('POST', '/insurance/verify', error, duration);
            throw error;
        }
    }

    async getProcedures(query?: string): Promise<{
        procedures: Array<{
            id: string;
            name: string;
            category: string;
            description: string;
            averagePrice: number;
        }>;
    }> {
        await this.delay();

        const endpoint = `/procedures${query ? `?q=${encodeURIComponent(query)}` : ''}`;
        logRequest('GET', endpoint);
        const startTime = Date.now();

        try {
            const procedures = [
                { id: '1', name: 'MRI Scan', category: 'Imaging', description: 'Magnetic Resonance Imaging', averagePrice: 800 },
                { id: '2', name: 'CT Scan', category: 'Imaging', description: 'Computed Tomography', averagePrice: 600 },
                { id: '3', name: 'Blood Work', category: 'Lab', description: 'Complete Blood Count', averagePrice: 150 },
                { id: '4', name: 'Physical Exam', category: 'Primary Care', description: 'Annual Physical Examination', averagePrice: 300 },
            ];

            const filteredProcedures = query
                ? procedures.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
                : procedures;

            const response = { procedures: filteredProcedures };

            const duration = Date.now() - startTime;
            logResponse('GET', endpoint, response, duration);

            return response;
        } catch (error) {
            const duration = Date.now() - startTime;
            logError('GET', endpoint, error, duration);
            throw error;
        }
    }

    async getInsuranceProviders(): Promise<{
        providers: Array<{
            id: string;
            name: string;
            logo?: string;
        }>;
    }> {
        await this.delay();

        logRequest('GET', '/insurance/providers');
        const startTime = Date.now();

        try {
            const response = {
                providers: [
                    { id: '1', name: 'UnitedHealthcare', logo: '/logos/uhc.png' },
                    { id: '2', name: 'Aetna', logo: '/logos/aetna.png' },
                    { id: '3', name: 'Cigna', logo: '/logos/cigna.png' },
                    { id: '4', name: 'Blue Cross Blue Shield', logo: '/logos/bcbs.png' },
                ],
            };

            const duration = Date.now() - startTime;
            logResponse('GET', '/insurance/providers', response, duration);

            return response;
        } catch (error) {
            const duration = Date.now() - startTime;
            logError('GET', '/insurance/providers', error, duration);
            throw error;
        }
    }
}

// Real API client implementation
class RealApiClient {
    private baseUrl: string;

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
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

        const requestPromise = fetch(url, config).then(async (response) => {
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const error = new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
                (error as any).status = response.status;
                throw error;
            }

            return await response.json();
        });

        return withTimeout(requestPromise, REQUEST_TIMEOUT);
    }

    async searchProviders(params: SearchParams): Promise<SearchResponse> {
        return withRetry(async () => {
            logRequest('GET', '/search', params);
            const startTime = Date.now();

            try {
                const searchParams = new URLSearchParams();
                searchParams.append('procedure', params.procedure);
                if (params.location) searchParams.append('location', params.location);
                if (params.insuranceProvider) searchParams.append('insuranceProvider', params.insuranceProvider);
                if (params.maxDistance) searchParams.append('maxDistance', params.maxDistance.toString());
                if (params.priceRange) {
                    searchParams.append('minPrice', params.priceRange[0].toString());
                    searchParams.append('maxPrice', params.priceRange[1].toString());
                }
                if (params.minRating) searchParams.append('minRating', params.minRating.toString());
                if (params.types && params.types.length > 0) {
                    searchParams.append('types', params.types.join(','));
                }

                const acResponse = await this.request<ACSearchResponse>(`/search?${searchParams.toString()}`);
                const transformedResponse = transformACSearchResponse(acResponse);

                const duration = Date.now() - startTime;
                logResponse('GET', '/search', transformedResponse, duration);

                return transformedResponse;
            } catch (error) {
                const duration = Date.now() - startTime;
                logError('GET', '/search', error, duration);
                throw error;
            }
        });
    }

    async getProviderDetails(id: string): Promise<Provider> {
        return withRetry(async () => {
            logRequest('GET', `/providers/${id}`);
            const startTime = Date.now();

            try {
                const acProvider = await this.request<ACProvider>(`/providers/${id}`);
                const transformedProvider = transformACProviderToProvider(acProvider);

                const duration = Date.now() - startTime;
                logResponse('GET', `/providers/${id}`, transformedProvider, duration);

                return transformedProvider;
            } catch (error) {
                const duration = Date.now() - startTime;
                logError('GET', `/providers/${id}`, error, duration);
                throw error;
            }
        });
    }

    async createBooking(data: BookingData): Promise<BookingResponse> {
        return withRetry(async () => {
            logRequest('POST', '/bookings', data);
            const startTime = Date.now();

            try {
                const response = await this.request<BookingResponse>('/bookings', {
                    method: 'POST',
                    body: JSON.stringify(data),
                });

                const duration = Date.now() - startTime;
                logResponse('POST', '/bookings', response, duration);

                return response;
            } catch (error) {
                const duration = Date.now() - startTime;
                logError('POST', '/bookings', error, duration);
                throw error;
            }
        });
    }

    async getBookingDetails(bookingId: string): Promise<BookingResponse> {
        return withRetry(async () => {
            logRequest('GET', `/bookings/${bookingId}`);
            const startTime = Date.now();

            try {
                const response = await this.request<BookingResponse>(`/bookings/${bookingId}`);

                const duration = Date.now() - startTime;
                logResponse('GET', `/bookings/${bookingId}`, response, duration);

                return response;
            } catch (error) {
                const duration = Date.now() - startTime;
                logError('GET', `/bookings/${bookingId}`, error, duration);
                throw error;
            }
        });
    }

    async cancelBooking(bookingId: string): Promise<{ success: boolean }> {
        return withRetry(async () => {
            logRequest('DELETE', `/bookings/${bookingId}/cancel`);
            const startTime = Date.now();

            try {
                const response = await this.request<{ success: boolean }>(`/bookings/${bookingId}/cancel`, {
                    method: 'DELETE',
                });

                const duration = Date.now() - startTime;
                logResponse('DELETE', `/bookings/${bookingId}/cancel`, response, duration);

                return response;
            } catch (error) {
                const duration = Date.now() - startTime;
                logError('DELETE', `/bookings/${bookingId}/cancel`, error, duration);
                throw error;
            }
        });
    }

    async getAvailableTimeSlots(providerId: string, date?: string): Promise<TimeSlot[]> {
        return withRetry(async () => {
            const endpoint = `/providers/${providerId}/time-slots${date ? `?date=${date}` : ''}`;
            logRequest('GET', endpoint);
            const startTime = Date.now();

            try {
                const response = await this.request<TimeSlot[]>(endpoint);

                const duration = Date.now() - startTime;
                logResponse('GET', endpoint, response, duration);

                return response;
            } catch (error) {
                const duration = Date.now() - startTime;
                logError('GET', endpoint, error, duration);
                throw error;
            }
        });
    }

    async verifyInsurance(memberId: string, providerId: string): Promise<{
        verified: boolean;
        coverage: {
            copay?: number;
            deductible?: number;
            coinsurance?: number;
        };
    }> {
        return withRetry(async () => {
            logRequest('POST', '/insurance/verify', { memberId, providerId });
            const startTime = Date.now();

            try {
                const response = await this.request('/insurance/verify', {
                    method: 'POST',
                    body: JSON.stringify({ memberId, providerId }),
                });

                const duration = Date.now() - startTime;
                logResponse('POST', '/insurance/verify', response, duration);

                return response;
            } catch (error) {
                const duration = Date.now() - startTime;
                logError('POST', '/insurance/verify', error, duration);
                throw error;
            }
        });
    }

    async getProcedures(query?: string): Promise<{
        procedures: Array<{
            id: string;
            name: string;
            category: string;
            description: string;
            averagePrice: number;
        }>;
    }> {
        return withRetry(async () => {
            const endpoint = `/procedures${query ? `?q=${encodeURIComponent(query)}` : ''}`;
            logRequest('GET', endpoint);
            const startTime = Date.now();

            try {
                const response = await this.request(endpoint);

                const duration = Date.now() - startTime;
                logResponse('GET', endpoint, response, duration);

                return response;
            } catch (error) {
                const duration = Date.now() - startTime;
                logError('GET', endpoint, error, duration);
                throw error;
            }
        });
    }

    async getInsuranceProviders(): Promise<{
        providers: Array<{
            id: string;
            name: string;
            logo?: string;
        }>;
    }> {
        return withRetry(async () => {
            logRequest('GET', '/insurance/providers');
            const startTime = Date.now();

            try {
                const response = await this.request('/insurance/providers');

                const duration = Date.now() - startTime;
                logResponse('GET', '/insurance/providers', response, duration);

                return response;
            } catch (error) {
                const duration = Date.now() - startTime;
                logError('GET', '/insurance/providers', error, duration);
                throw error;
            }
        });
    }
}

// Main API Adapter class
class ApiAdapter {
    private client: MockApiClient | RealApiClient;

    constructor() {
        this.client = USE_MOCK_API ? new MockApiClient() : new RealApiClient();

        if (process.env.NODE_ENV === 'development') {
            console.log(`🔧 API Adapter initialized: ${USE_MOCK_API ? 'MOCK' : 'REAL'} mode`);
            console.log(`📍 API Base URL: ${API_BASE_URL}`);
            console.log(`⏱️  Request Timeout: ${REQUEST_TIMEOUT}ms`);
            console.log(`🔄 Max Retries: ${MAX_RETRIES}`);
        }
    }

    // Search methods
    async searchProviders(params: SearchParams): Promise<SearchResponse> {
        return this.client.searchProviders(params);
    }

    async getProviderDetails(id: string): Promise<Provider> {
        return this.client.getProviderDetails(id);
    }

    // Booking methods
    async createBooking(data: BookingData): Promise<BookingResponse> {
        return this.client.createBooking(data);
    }

    async getBookingDetails(bookingId: string): Promise<BookingResponse> {
        return this.client.getBookingDetails(bookingId);
    }

    async cancelBooking(bookingId: string): Promise<{ success: boolean }> {
        return this.client.cancelBooking(bookingId);
    }

    async getAvailableTimeSlots(providerId: string, date?: string): Promise<TimeSlot[]> {
        return this.client.getAvailableTimeSlots(providerId, date);
    }

    // Insurance methods
    async verifyInsurance(memberId: string, providerId: string): Promise<{
        verified: boolean;
        coverage: {
            copay?: number;
            deductible?: number;
            coinsurance?: number;
        };
    }> {
        return this.client.verifyInsurance(memberId, providerId);
    }

    async getInsuranceProviders(): Promise<{
        providers: Array<{
            id: string;
            name: string;
            logo?: string;
        }>;
    }> {
        return this.client.getInsuranceProviders();
    }

    // Procedure methods
    async getProcedures(query?: string): Promise<{
        procedures: Array<{
            id: string;
            name: string;
            category: string;
            description: string;
            averagePrice: number;
        }>;
    }> {
        return this.client.getProcedures(query);
    }

    // Utility methods
    isMockMode(): boolean {
        return USE_MOCK_API;
    }

    getApiUrl(): string {
        return API_BASE_URL;
    }
}

// Create and export singleton instance
export const apiAdapter = new ApiAdapter();

// Export individual functions for convenience (maintaining backward compatibility)
export const searchProviders = (params: SearchParams) => apiAdapter.searchProviders(params);
export const getProviderDetails = (id: string) => apiAdapter.getProviderDetails(id);
export const createBooking = (data: BookingData) => apiAdapter.createBooking(data);
export const getBookingDetails = (bookingId: string) => apiAdapter.getBookingDetails(bookingId);
export const cancelBooking = (bookingId: string) => apiAdapter.cancelBooking(bookingId);
export const getAvailableTimeSlots = (providerId: string, date?: string) =>
    apiAdapter.getAvailableTimeSlots(providerId, date);
export const verifyInsurance = (memberId: string, providerId: string) =>
    apiAdapter.verifyInsurance(memberId, providerId);
export const getProcedures = (query?: string) => apiAdapter.getProcedures(query);
export const getInsuranceProviders = () => apiAdapter.getInsuranceProviders();

// Export types
export type {
    SearchParams,
    SearchResponse,
    BookingData,
    BookingResponse,
    ApiError,
    Provider,
    TimeSlot,
    Review,
};
