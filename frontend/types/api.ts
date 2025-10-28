// ✅ src/types/api.ts
// Central export file for shared API types and validation schemas

import { z } from 'zod';

// ============================================================================
// BASE TYPES & SCHEMAS
// ============================================================================

/**
 * Base API response wrapper for all endpoints
 */
export interface ApiResponse<T = any> {
    data?: T;
    error?: ApiError;
    message?: string;
    success: boolean;
}

/**
 * Standard API error structure
 */
export interface ApiError {
    message: string;
    code: string;
    details?: Record<string, any>;
    statusCode?: number;
}

// Zod schema for API error validation
export const ApiErrorSchema = z.object({
    message: z.string(),
    code: z.string(),
    details: z.record(z.any()).optional(),
    statusCode: z.number().optional(),
});

// ============================================================================
// SEARCH & PROVIDER TYPES
// ============================================================================

/**
 * Search parameters for provider search endpoint
 * @example { procedure: "MRI scan", location: "New York, NY", maxDistance: 10 }
 */
export interface SearchParams {
    procedure: string;
    location?: string;
    insuranceProvider?: string;
    maxDistance?: number;
    priceRange?: [number, number];
    minRating?: number;
    types?: string[];
}

// Zod schema for search parameters validation
export const SearchParamsSchema = z.object({
    procedure: z.string().min(1, 'Procedure is required'),
    location: z.string().optional(),
    insuranceProvider: z.string().optional(),
    maxDistance: z.number().min(0).max(100).optional(),
    priceRange: z.tuple([z.number().min(0), z.number().min(0)]).optional(),
    minRating: z.number().min(1).max(5).optional(),
    types: z.array(z.string()).optional(),
});

/**
 * Provider address - can be string or structured object
 * @example "123 Main St, New York, NY 10001" or { street: "123 Main St", city: "New York", state: "NY", zip: "10001" }
 */
export type ProviderAddress = string | {
    street: string;
    city: string;
    state: string;
    zip: string;
};

/**
 * Provider type enumeration
 */
export type ProviderType = 'physician' | 'specialist' | 'clinic' | 'hospital' | 'imaging_center' | 'lab';

/**
 * Comprehensive provider information
 * @example Provider with full details including reviews, time slots, and pricing
 */
export interface Provider {
    id: string;
    name: string;
    specialty: string;
    rating: number;
    reviewCount: number;
    address: ProviderAddress;
    distance: string;
    priceRange: { min: number; max: number };
    acceptedInsurance: string[];
    phone?: string;
    website?: string;
    images?: string[];
    reviews?: Review[];
    availability?: string;
    badges?: string[];
    type?: ProviderType;
    neighborhood?: string;
    acceptsInsurance?: boolean;
    price: number;
    originalPrice?: number;
    negotiatedRate?: number;
    standardRate?: number;
    savingsPercent?: number;
    savings?: number;
    availableTimeSlots?: TimeSlot[];

    // Extended fields for provider detail pages
    about?: string;
    specialties?: string[];
    languages?: string[];
    parkingAvailable?: boolean;
    wheelchairAccessible?: boolean;
    requiresReferral?: boolean;
    newPatientAccepted?: boolean;
}

// Zod schema for provider validation
export const ProviderSchema = z.object({
    id: z.string(),
    name: z.string(),
    specialty: z.string(),
    rating: z.number().min(0).max(5),
    reviewCount: z.number().min(0),
    address: z.union([
        z.string(),
        z.object({
            street: z.string(),
            city: z.string(),
            state: z.string(),
            zip: z.string(),
        })
    ]),
    distance: z.string(),
    priceRange: z.object({
        min: z.number().min(0),
        max: z.number().min(0),
    }),
    acceptedInsurance: z.array(z.string()),
    phone: z.string().optional(),
    website: z.string().url().optional(),
    images: z.array(z.string().url()).optional(),
    reviews: z.array(z.lazy(() => ReviewSchema)).optional(),
    availability: z.string().optional(),
    badges: z.array(z.string()).optional(),
    type: z.enum(['physician', 'specialist', 'clinic', 'hospital', 'imaging_center', 'lab']).optional(),
    neighborhood: z.string().optional(),
    acceptsInsurance: z.boolean().optional(),
    price: z.number().min(0),
    originalPrice: z.number().min(0).optional(),
    negotiatedRate: z.number().min(0).optional(),
    standardRate: z.number().min(0).optional(),
    savingsPercent: z.number().min(0).max(100).optional(),
    savings: z.number().min(0).optional(),
    availableTimeSlots: z.array(z.lazy(() => TimeSlotSchema)).optional(),
    about: z.string().optional(),
    specialties: z.array(z.string()).optional(),
    languages: z.array(z.string()).optional(),
    parkingAvailable: z.boolean().optional(),
    wheelchairAccessible: z.boolean().optional(),
    requiresReferral: z.boolean().optional(),
    newPatientAccepted: z.boolean().optional(),
});

/**
 * Patient review for a provider
 * @example { id: "rev1", author: "John D.", rating: 5, comment: "Great experience", date: "2024-01-15" }
 */
export interface Review {
    id: string;
    author: string;
    rating: number;
    comment: string;
    date: string;
}

// Zod schema for review validation
export const ReviewSchema = z.object({
    id: z.string(),
    author: z.string(),
    rating: z.number().min(1).max(5),
    comment: z.string(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

/**
 * Available time slot for booking
 * @example { date: "2024-01-15", time: "09:00", available: true }
 */
export interface TimeSlot {
    date: string;
    time: string;
    available: boolean;
}

// Zod schema for time slot validation
export const TimeSlotSchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    time: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
    available: z.boolean(),
});

/**
 * Search response containing providers and filter options
 * @example SearchResponse with 10 providers and available filters
 */
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

// Zod schema for search response validation
export const SearchResponseSchema = z.object({
    providers: z.array(ProviderSchema),
    totalCount: z.number().min(0),
    filters: z.object({
        priceRange: z.tuple([z.number().min(0), z.number().min(0)]),
        locations: z.array(z.string()),
        insuranceProviders: z.array(z.string()),
        specialties: z.array(z.string()),
    }),
});

// ============================================================================
// BOOKING TYPES
// ============================================================================

/**
 * Booking status enumeration
 */
export type BookingStatus = 'confirmed' | 'pending' | 'cancelled';

/**
 * Patient information for booking
 * @example { firstName: "John", lastName: "Doe", email: "john@example.com", phone: "(555) 123-4567" }
 */
export interface PatientInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    memberId: string;
}

/**
 * Booking request data
 * @example Complete booking form data including patient info and appointment details
 */
export interface BookingData {
    providerId: string;
    patientName: string; // Legacy field - use firstName/lastName instead
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

// Zod schema for booking data validation
export const BookingDataSchema = z.object({
    providerId: z.string().min(1, 'Provider ID is required'),
    patientName: z.string().optional(), // Legacy field
    email: z.string().email('Invalid email format'),
    phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Phone must be in (XXX) XXX-XXXX format'),
    preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    insuranceProvider: z.string().optional(),
    notes: z.string().optional(),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date of birth must be in YYYY-MM-DD format'),
    memberId: z.string().min(1, 'Member ID is required'),
    reasonForVisit: z.string().optional(),
});

/**
 * Booking confirmation response
 * @example Successful booking with confirmation number and appointment details
 */
export interface BookingResponse {
    bookingId: string;
    confirmationNumber: string;
    status: BookingStatus;
    appointmentDate: string;
    appointmentTime: string;
    provider: Pick<Provider, 'id' | 'name' | 'phone' | 'address'>;
    patient: {
        name: string;
        email: string;
        phone: string;
    };
}

// Zod schema for booking response validation
export const BookingResponseSchema = z.object({
    bookingId: z.string(),
    confirmationNumber: z.string(),
    status: z.enum(['confirmed', 'pending', 'cancelled']),
    appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    appointmentTime: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
    provider: z.object({
        id: z.string(),
        name: z.string(),
        phone: z.string().optional(),
        address: z.union([
            z.string(),
            z.object({
                street: z.string(),
                city: z.string(),
                state: z.string(),
                zip: z.string(),
            })
        ]),
    }),
    patient: z.object({
        name: z.string(),
        email: z.string().email(),
        phone: z.string(),
    }),
});

// ============================================================================
// PROCEDURE TYPES
// ============================================================================

/**
 * Medical procedure information
 * @example { id: "proc_mri_brain", name: "MRI Scan (Brain)", category: "Imaging", averagePrice: 850 }
 */
export interface Procedure {
    id: string;
    name: string;
    category: string;
    description: string;
    averagePrice: number;
}

// Zod schema for procedure validation
export const ProcedureSchema = z.object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
    description: z.string(),
    averagePrice: z.number().min(0),
});

/**
 * Procedure search response
 * @example List of procedures matching search query
 */
export interface ProcedureSearchResponse {
    procedures: Procedure[];
}

// Zod schema for procedure search response validation
export const ProcedureSearchResponseSchema = z.object({
    procedures: z.array(ProcedureSchema),
});

// ============================================================================
// INSURANCE TYPES
// ============================================================================

/**
 * Insurance provider information
 * @example { id: "aetna", name: "Aetna", logo: "https://example.com/aetna-logo.png" }
 */
export interface InsuranceProvider {
    id: string;
    name: string;
    logo?: string;
}

// Zod schema for insurance provider validation
export const InsuranceProviderSchema = z.object({
    id: z.string(),
    name: z.string(),
    logo: z.string().url().optional(),
});

/**
 * Insurance verification request
 * @example { memberId: "AET123456789", providerId: "provider-123" }
 */
export interface InsuranceVerificationRequest {
    memberId: string;
    providerId: string;
}

// Zod schema for insurance verification request validation
export const InsuranceVerificationRequestSchema = z.object({
    memberId: z.string().min(1, 'Member ID is required'),
    providerId: z.string().min(1, 'Provider ID is required'),
});

/**
 * Insurance verification response
 * @example { verified: true, coverage: { copay: 25, deductible: 500, coinsurance: 20 } }
 */
export interface InsuranceVerificationResponse {
    verified: boolean;
    coverage: {
        copay?: number;
        deductible?: number;
        coinsurance?: number;
    };
}

// Zod schema for insurance verification response validation
export const InsuranceVerificationResponseSchema = z.object({
    verified: z.boolean(),
    coverage: z.object({
        copay: z.number().min(0).optional(),
        deductible: z.number().min(0).optional(),
        coinsurance: z.number().min(0).max(100).optional(),
    }),
});

/**
 * Insurance providers list response
 * @example List of all accepted insurance providers
 */
export interface InsuranceProvidersResponse {
    providers: InsuranceProvider[];
}

// Zod schema for insurance providers response validation
export const InsuranceProvidersResponseSchema = z.object({
    providers: z.array(InsuranceProviderSchema),
});

// ============================================================================
// BACKEND API TYPES (Current Implementation)
// ============================================================================

/**
 * Current backend search response (from Supabase)
 * @example { results: [{ id: "prod1", name: "MRI Scan", description: "..." }] }
 */
export interface BackendSearchResponse {
    results: Array<{
        id: string;
        name: string;
        description?: string;
        [key: string]: any; // Additional fields from Supabase
    }>;
}

/**
 * Current backend procedure categories response
 * @example { results: [{ id: "cat1", name: "Imaging", slug: "imaging", emoji: "🔬" }] }
 */
export interface BackendProcedureCategoriesResponse {
    results: Array<{
        id: string;
        name: string;
        slug: string;
        emoji: string;
        description?: string;
    }>;
}

// ============================================================================
// UI COMPONENT TYPES
// ============================================================================

/**
 * Filter state for search UI
 * @example { priceRange: [100, 500], types: ["hospital", "clinic"], minRating: 4 }
 */
export interface FilterState {
    priceRange: [number, number];
    types: string[];
    minRating: number;
}

/**
 * Sort option for search results
 * @example { value: "price", label: "Price (Low to High)" }
 */
export interface SortOption {
    value: 'price' | 'rating' | 'distance';
    label: string;
}

/**
 * Booking step for multi-step booking flow
 * @example { id: "patient-info", title: "Patient Information", completed: false }
 */
export interface BookingStep {
    id: string;
    title: string;
    description: string;
    completed: boolean;
}

/**
 * Form field configuration
 * @example Text input field with validation rules
 */
export interface FormField {
    name: string;
    label: string;
    type: 'text' | 'email' | 'tel' | 'date' | 'select' | 'textarea';
    required: boolean;
    placeholder?: string;
    options?: Array<{ value: string; label: string }>;
    validation?: {
        pattern?: RegExp;
        minLength?: number;
        maxLength?: number;
        custom?: (value: string) => string | null;
    };
}

/**
 * Notification for user feedback
 * @example { id: "notif1", type: "success", title: "Booking Confirmed", message: "Your appointment is scheduled" }
 */
export interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    duration?: number;
}

/**
 * User preferences for personalization
 * @example { defaultLocation: "New York, NY", preferredInsuranceProvider: "Aetna" }
 */
export interface UserPreferences {
    defaultLocation?: string;
    preferredInsuranceProvider?: string;
    notificationSettings: {
        email: boolean;
        sms: boolean;
        push: boolean;
    };
}

// Component prop types
export interface BaseComponentProps {
    className?: string;
    children?: React.ReactNode;
}

export interface LoadingState {
    isLoading: boolean;
    error?: string;
}

/**
 * Search error types for better error handling
 */
export interface SearchError extends Error {
    type: 'NETWORK_ERROR' | 'TIMEOUT_ERROR' | 'VALIDATION_ERROR' | 'RATE_LIMIT_ERROR' | 'SERVER_ERROR' | 'MALFORMED_RESPONSE' | 'EMPTY_RESULTS' | 'UNKNOWN_ERROR';
    retryable: boolean;
    retryAfter?: number;
    statusCode?: number;
    details?: Record<string, any>;
}

/**
 * Search state for useSearch hook
 */
export interface SearchState {
    isLoading: boolean;
    error: SearchError | null;
    data: SearchResponse | null;
    retryCount: number;
    lastSearchParams: SearchParams | null;
}

export interface PaginationState {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// ============================================================================
// EXPORT ALL SCHEMAS FOR VALIDATION
// ============================================================================

export const ApiSchemas = {
    // Core schemas
    ApiError: ApiErrorSchema,
    SearchParams: SearchParamsSchema,
    Provider: ProviderSchema,
    Review: ReviewSchema,
    TimeSlot: TimeSlotSchema,
    SearchResponse: SearchResponseSchema,

    // Booking schemas
    BookingData: BookingDataSchema,
    BookingResponse: BookingResponseSchema,

    // Procedure schemas
    Procedure: ProcedureSchema,
    ProcedureSearchResponse: ProcedureSearchResponseSchema,

    // Insurance schemas
    InsuranceProvider: InsuranceProviderSchema,
    InsuranceVerificationRequest: InsuranceVerificationRequestSchema,
    InsuranceVerificationResponse: InsuranceVerificationResponseSchema,
    InsuranceProvidersResponse: InsuranceProvidersResponseSchema,
} as const;

// ============================================================================
// DATA STRUCTURE ASSUMPTIONS & FLAGS
// ============================================================================

/**
 * ⚠️ DATA STRUCTURE ASSUMPTIONS FLAGGED FOR REVIEW:
 * 
 * 1. **Provider Address Flexibility**: 
 *    - Frontend expects both string and object formats for addresses
 *    - Backend may only support one format
 *    - RECOMMENDATION: Standardize on object format for better validation
 * 
 * 2. **Price Fields Redundancy**:
 *    - Multiple price fields: price, originalPrice, negotiatedRate, standardRate
 *    - Unclear which is the "source of truth"
 *    - RECOMMENDATION: Define clear pricing hierarchy
 * 
 * 3. **Provider Type Enumeration**:
 *    - Frontend defines 6 provider types
 *    - Backend may have different categorization
 *    - RECOMMENDATION: Align with backend data model
 * 
 * 4. **Time Format Inconsistency**:
 *    - Some places use "09:00 AM" format
 *    - Others use "09:00" 24-hour format
 *    - RECOMMENDATION: Standardize on 24-hour format
 * 
 * 5. **Mock Data vs API Mismatch**:
 *    - Mock data has different field names than API types
 *    - Some fields exist in mock but not in API contract
 *    - RECOMMENDATION: Update mock data to match API types
 * 
 * 6. **Backend API Limitations**:
 *    - Current backend only supports basic search/procedures
 *    - Frontend expects full provider/booking functionality
 *    - RECOMMENDATION: Implement missing backend endpoints
 * 
 * 7. **Insurance Verification Assumptions**:
 *    - Frontend assumes specific coverage fields (copay, deductible, coinsurance)
 *    - Backend may not support insurance verification yet
 *    - RECOMMENDATION: Implement insurance verification service
 * 
 * 8. **Error Handling Inconsistency**:
 *    - Some endpoints return { error: {...} }
 *    - Others throw exceptions
 *    - RECOMMENDATION: Standardize error response format
 */