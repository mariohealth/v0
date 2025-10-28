# API Integration Checklist for Mario Health MVP

This document provides a comprehensive checklist for API integration, including expected endpoints, TypeScript types, mock data structure, environment variables, error handling, and test cases for acceptance criteria verification.

## 📋 Expected API Endpoints

Based on the API contract and current implementation:

### Core Search & Provider Endpoints
- [ ] **GET** `/api/search` - Search for healthcare providers
- [ ] **GET** `/api/providers/:id` - Get provider details
- [ ] **GET** `/api/providers/:id/time-slots` - Get available time slots
- [ ] **GET** `/api/procedures` - Get list of medical procedures
- [ ] **GET** `/api/insurance/providers` - Get insurance providers

### Booking & Appointment Endpoints
- [ ] **POST** `/api/bookings` - Create new booking
- [ ] **GET** `/api/bookings/:bookingId` - Get booking details
- [ ] **DELETE** `/api/bookings/:bookingId/cancel` - Cancel booking

### Insurance & Verification Endpoints
- [ ] **POST** `/api/insurance/verify` - Verify insurance coverage

### Backend Implementation Status
- [x] **GET** `/search` - Basic search endpoint (FastAPI)
- [x] **GET** `/procedure-categories` - Procedure categories endpoint (FastAPI)
- [ ] Additional endpoints need implementation

## 🔧 Request/Response TypeScript Types

### Core Types (from `src/lib/api.ts`)

```typescript
// Search Parameters
interface SearchParams {
    procedure: string;
    location?: string;
    insuranceProvider?: string;
    maxDistance?: number;
    priceRange?: [number, number];
    minRating?: number;
    types?: string[];
}

// Provider Data Structure
interface Provider {
    id: string;
    name: string;
    specialty: string;
    rating: number;
    reviewCount: number;
    address: string | AddressObject;
    distance: string;
    priceRange: { min: number; max: number };
    acceptedInsurance: string[];
    phone?: string;
    website?: string;
    images?: string[];
    reviews?: Review[];
    availability?: string;
    badges?: string[];
    type?: string;
    neighborhood?: string;
    acceptsInsurance?: boolean;
    price: number;
    originalPrice?: number;
    negotiatedRate?: number;
    standardRate?: number;
    savingsPercent?: number;
    savings?: number;
    availableTimeSlots?: TimeSlot[];
}

// Booking Data
interface BookingData {
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

// API Responses
interface SearchResponse {
    providers: Provider[];
    totalCount: number;
    filters: {
        priceRange: [number, number];
        locations: string[];
        insuranceProviders: string[];
        specialties: string[];
    };
}

interface BookingResponse {
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

// Error Handling
interface ApiError {
    message: string;
    code: string;
    details?: any;
}
```

### UI Component Types (from `src/types/api.ts`)

```typescript
// Loading and Error States
interface LoadingState {
    isLoading: boolean;
    error?: string;
}

// Filter and Sort Options
interface FilterState {
    priceRange: [number, number];
    types: string[];
    minRating: number;
}

interface SortOption {
    value: 'price' | 'rating' | 'distance';
    label: string;
}

// Form Validation
interface FormField {
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
```

## 🎭 Current Mock Data Structure

### Provider Mock Data (from `src/lib/mockData.ts`)

```typescript
// Extended Provider Interface for Mock Data
interface ProviderImage {
    id: string;
    url: string;
    alt: string;
    type: 'facility' | 'staff' | 'equipment';
}

interface Review {
    id: string;
    patientName: string;
    rating: number;
    date: string;
    comment: string;
    procedure?: string;
}

interface TimeSlot {
    id: string;
    date: string; // ISO format: "2025-10-26"
    time: string; // "09:00 AM"
    available: boolean;
}
```

### Mock Data Features
- [x] 12 sample providers with realistic data
- [x] Provider types: hospital, clinic, imaging_center, lab
- [x] Complete provider details including reviews and images
- [x] Generated time slots for booking
- [x] Filtering helper functions
- [x] Realistic pricing and savings calculations

## 🌍 Environment Variables

### Required Environment Variables (from `env.example`)

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://api.mariohealth.com

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Analytics and Monitoring
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=your_ga_id
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn

# Optional: Feature Flags
NEXT_PUBLIC_ENABLE_AI_CHAT=false
NEXT_PUBLIC_ENABLE_REAL_TIME_BOOKING=true
NEXT_PUBLIC_ENABLE_INSURANCE_VERIFICATION=true
```

### Backend Environment Variables (from backend config)

```bash
# Supabase Backend Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_key

# API Security
API_KEY=your_api_key  # Optional for authentication
```

## ⚠️ Error Scenarios We're Handling

### Frontend Error Handling Patterns

#### 1. API Client Error Handling (`src/lib/api.ts`)
```typescript
// Generic request wrapper with error handling
private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('An unexpected error occurred');
    }
}
```

#### 2. React Error Boundary (`src/components/ErrorBoundary.tsx`)
- [x] Catches JavaScript errors in component tree
- [x] Displays fallback UI with error details
- [x] Provides retry functionality
- [x] Shows error details in development mode
- [x] Graceful fallback to home page

#### 3. Component-Level Error Handling
- [x] **BookingModal**: Try-catch with user-friendly error messages
- [x] **ImageWithFallback**: Image loading error handling with fallback
- [x] **Form Validation**: Field-level validation with error states

#### 4. Loading States
- [x] **LoadingState** interface for consistent loading/error states
- [x] **SkeletonCard** component for loading placeholders
- [x] **Spinner** component for loading indicators

### Backend Error Handling (FastAPI)

#### Current Implementation
- [x] HTTP exception handling with proper status codes
- [x] API key authentication validation
- [x] CORS middleware for cross-origin requests

#### Error Response Format
```json
{
    "error": {
        "message": "Error description",
        "code": "ERROR_CODE",
        "details": {}
    }
}
```

### Common Error Codes to Handle
- [ ] `VALIDATION_ERROR`: Invalid request data
- [ ] `PROVIDER_NOT_FOUND`: Provider does not exist
- [ ] `BOOKING_NOT_FOUND`: Booking does not exist
- [ ] `TIME_SLOT_UNAVAILABLE`: Requested time slot is not available
- [ ] `INSURANCE_NOT_VERIFIED`: Insurance verification failed
- [ ] `RATE_LIMIT_EXCEEDED`: Too many requests
- [ ] `INTERNAL_SERVER_ERROR`: Server error

## 🧪 Test Cases for AC Verification

### Search Functionality Tests
- [ ] **Search by procedure name**: "MRI scan" returns imaging centers
- [ ] **Search by location**: "New York" filters by location
- [ ] **Search by insurance**: "Aetna" shows only Aetna-accepting providers
- [ ] **Price range filtering**: Min/max price filters work correctly
- [ ] **Rating filtering**: Minimum rating filter works
- [ ] **Provider type filtering**: Hospital/clinic/imaging center filters
- [ ] **Distance filtering**: Max distance parameter works
- [ ] **Empty search results**: Proper empty state display
- [ ] **Search loading states**: Loading indicators during search
- [ ] **Search error handling**: Network errors handled gracefully

### Provider Detail Tests
- [ ] **Provider information display**: All provider details shown correctly
- [ ] **Provider images**: Images load with fallback handling
- [ ] **Provider reviews**: Reviews display with proper formatting
- [ ] **Time slot availability**: Available slots shown correctly
- [ ] **Insurance acceptance**: Insurance information accurate
- [ ] **Contact information**: Phone, website, address displayed
- [ ] **Provider not found**: 404 error handling
- [ ] **Provider loading states**: Loading indicators during data fetch

### Booking Flow Tests
- [ ] **Booking form validation**: Required fields validated
- [ ] **Patient information step**: Form validation works
- [ ] **Insurance verification step**: Insurance data validated
- [ ] **Time slot selection**: Available slots selectable
- [ ] **Booking confirmation**: Success state with confirmation number
- [ ] **Booking error handling**: Network errors handled
- [ ] **Booking loading states**: Loading indicators during submission
- [ ] **Form field validation**: Email, phone, date validation
- [ ] **Insurance verification**: Member ID validation
- [ ] **Booking cancellation**: Cancel functionality works

### Insurance Verification Tests
- [ ] **Valid insurance**: Correct member ID returns coverage details
- [ ] **Invalid insurance**: Invalid member ID returns error
- [ ] **Insurance loading states**: Loading during verification
- [ ] **Coverage details**: Copay, deductible, coinsurance displayed
- [ ] **Insurance error handling**: Network errors handled

### API Integration Tests
- [ ] **API endpoint connectivity**: All endpoints reachable
- [ ] **Authentication**: API key validation works
- [ ] **Rate limiting**: Rate limits enforced
- [ ] **CORS handling**: Cross-origin requests work
- [ ] **Response format**: All responses match expected schema
- [ ] **Error response format**: Error responses consistent
- [ ] **Timeout handling**: Request timeouts handled
- [ ] **Network connectivity**: Offline/online state handling

### Performance Tests
- [ ] **Search response time**: Search results load within 2 seconds
- [ ] **Provider detail loading**: Provider details load within 1 second
- [ ] **Image loading**: Images load with proper optimization
- [ ] **Large dataset handling**: 100+ providers handled efficiently
- [ ] **Concurrent requests**: Multiple simultaneous requests handled

### Accessibility Tests
- [ ] **Screen reader compatibility**: All content accessible
- [ ] **Keyboard navigation**: All interactive elements keyboard accessible
- [ ] **Color contrast**: Text meets WCAG contrast requirements
- [ ] **Focus management**: Focus properly managed in modals
- [ ] **Error announcements**: Errors announced to screen readers

## 🔄 Integration Status

### Completed ✅
- [x] **Frontend TypeScript types defined** - Comprehensive types in `/types/api.ts` with Zod validation
- [x] **Mock data structure implemented** - Complete mock data with realistic provider information
- [x] **API abstraction layer** - `/lib/api/adapter.ts` with mock/real API switching
- [x] **API client with error handling** - Enhanced error handling with retry logic
- [x] **Error boundary implementation** - React error boundaries for graceful error handling
- [x] **Loading state management** - Consistent loading states across components
- [x] **Environment variable configuration** - One-line switching between mock/real APIs
- [x] **Basic backend endpoints** - Search and procedure-categories endpoints implemented
- [x] **Type validation** - Zod schemas for request/response validation
- [x] **Request/response logging** - Development logging for API calls
- [x] **Retry logic** - Exponential backoff for failed requests
- [x] **Timeout handling** - Configurable request timeouts
- [x] **Response transformation** - Backend response format to frontend types

### In Progress 🚧
- [ ] **Backend API endpoint implementation** - Additional endpoints need implementation
- [ ] **Database schema implementation** - Full database schema needs completion
- [ ] **Authentication system** - API key authentication needs implementation
- [ ] **Error response standardization** - Backend error format standardization

### Pending ⏳
- [ ] **Full API endpoint implementation** - All endpoints from checklist need backend implementation
- [ ] **Integration testing** - End-to-end testing with real API
- [ ] **Performance optimization** - API response time optimization
- [ ] **Production deployment configuration** - Production environment setup
- [ ] **Monitoring and logging setup** - Production monitoring and alerting

## 🏗️ Current Implementation Details

### API Adapter Architecture
The frontend uses a sophisticated API adapter pattern located in `/lib/api/adapter.ts`:

```typescript
// One-line switching between mock and real APIs
const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

// Usage in components
import { apiAdapter } from './lib/api/adapter';
const results = await apiAdapter.searchProviders(params);
```

### Key Features Implemented:
- **Mock/Real API Switching**: Environment variable controls API mode
- **Retry Logic**: Exponential backoff with configurable retries
- **Request Logging**: Development-mode logging for debugging
- **Response Transformation**: Backend format → Frontend types
- **Timeout Handling**: Configurable request timeouts
- **Error Classification**: Network, validation, rate limit, server errors

### Type Safety & Validation:
- **Zod Schemas**: Runtime validation for all API requests/responses
- **TypeScript Types**: Comprehensive type definitions in `/types/api.ts`
- **Error Handling**: Structured error types with retry logic

### Environment Configuration:
```bash
# .env.local
NEXT_PUBLIC_USE_MOCK_API=true  # Switch to false for real API
NEXT_PUBLIC_API_URL=https://api.mariohealth.com
NEXT_PUBLIC_API_TIMEOUT=10000
NEXT_PUBLIC_API_MAX_RETRIES=3
```

## 📝 Next Steps

1. **Complete Backend Implementation**
   - Implement all missing API endpoints from the checklist
   - Add proper error handling and validation
   - Set up database schema and data loading
   - Implement authentication system

2. **Frontend Integration**
   - ✅ Mock data system already implemented
   - ✅ Error handling already implemented
   - ✅ Loading states already implemented
   - **Next**: Switch to real API by changing environment variable

3. **Testing & Validation**
   - Write integration tests for all endpoints
   - Perform end-to-end testing with real API
   - Validate all acceptance criteria from checklist

4. **Production Readiness**
   - Set up monitoring and logging
   - Configure production environment variables
   - Implement rate limiting and security measures
   - Deploy and test in production environment

---

*This checklist should be updated as the API integration progresses and new requirements are identified.*
