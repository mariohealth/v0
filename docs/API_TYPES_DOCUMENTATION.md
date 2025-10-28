# Mario Health API Types Documentation

This document provides comprehensive documentation for all API types, validation schemas, and usage patterns in the Mario Health frontend application.

## 📁 File Structure

```
frontend/src/
├── types/api.ts          # Central API types and Zod schemas
├── lib/api.ts            # API client with validation
└── lib/mockData.ts       # Mock data (needs alignment with API types)
```

## 🔧 Centralized Types Location

All API types are now centralized in `/types/api.ts` with the following structure:

### Core Types
- `SearchParams` - Provider search parameters
- `Provider` - Healthcare provider information
- `SearchResponse` - Search results with filters
- `BookingData` - Appointment booking information
- `BookingResponse` - Booking confirmation details
- `TimeSlot` - Available appointment times
- `Review` - Patient reviews
- `Procedure` - Medical procedures
- `InsuranceProvider` - Insurance company information

### Validation Schemas
All types have corresponding Zod schemas exported as `ApiSchemas`:

```typescript
import { ApiSchemas } from '../types/api';

// Validate search parameters
const validatedParams = ApiSchemas.SearchParams.parse(searchParams);

// Validate provider data
const validatedProvider = ApiSchemas.Provider.parse(providerData);
```

## 🚀 API Client Usage

The enhanced API client (`/lib/api.ts`) now includes:

### Features
- ✅ **Input Validation**: All request parameters validated with Zod
- ✅ **Response Validation**: API responses validated against schemas
- ✅ **Error Handling**: Standardized error format
- ✅ **Type Safety**: Full TypeScript support
- ✅ **JSDoc Documentation**: Comprehensive inline documentation

### Example Usage

```typescript
import { apiClient, SearchParams } from '../lib/api';

// Search providers with validation
const searchParams: SearchParams = {
  procedure: "MRI scan",
  location: "New York, NY",
  maxDistance: 10,
  priceRange: [100, 500],
  minRating: 4
};

try {
  const results = await apiClient.searchProviders(searchParams);
  console.log(`Found ${results.totalCount} providers`);
} catch (error) {
  console.error('Search failed:', error.message);
}
```

## 📋 API Endpoints

### Current Implementation (Backend)
- `GET /search?q={query}` - Search products/procedures
- `GET /procedure-categories` - List procedure categories

### Planned Implementation (Frontend Contract)
- `GET /api/search` - Search healthcare providers
- `GET /api/providers/:id` - Get provider details
- `POST /api/bookings` - Create appointment booking
- `GET /api/bookings/:id` - Get booking details
- `DELETE /api/bookings/:id/cancel` - Cancel booking
- `GET /api/providers/:id/time-slots` - Get available times
- `POST /api/insurance/verify` - Verify insurance coverage
- `GET /api/procedures` - List medical procedures
- `GET /api/insurance/providers` - List insurance providers

## ⚠️ Data Structure Assumptions & Issues

### 1. Provider Address Flexibility
**Issue**: Frontend supports both string and object address formats
**Impact**: Backend may only support one format
**Recommendation**: Standardize on object format for better validation

### 2. Price Fields Redundancy
**Issue**: Multiple price fields (price, originalPrice, negotiatedRate, standardRate)
**Impact**: Unclear which is the "source of truth"
**Recommendation**: Define clear pricing hierarchy

### 3. Provider Type Enumeration
**Issue**: Frontend defines 6 provider types, backend may have different categorization
**Impact**: Type mismatches between frontend and backend
**Recommendation**: Align with backend data model

### 4. Time Format Inconsistency
**Issue**: Some places use "09:00 AM" format, others use "09:00" 24-hour format
**Impact**: Parsing errors and display inconsistencies
**Recommendation**: Standardize on 24-hour format

### 5. Mock Data vs API Mismatch
**Issue**: Mock data has different field names than API types
**Impact**: Components may break when switching from mock to real API
**Recommendation**: Update mock data to match API types

### 6. Backend API Limitations
**Issue**: Current backend only supports basic search/procedures
**Impact**: Frontend expects full provider/booking functionality
**Recommendation**: Implement missing backend endpoints

### 7. Insurance Verification Assumptions
**Issue**: Frontend assumes specific coverage fields (copay, deductible, coinsurance)
**Impact**: Backend may not support insurance verification yet
**Recommendation**: Implement insurance verification service

### 8. Error Handling Inconsistency
**Issue**: Some endpoints return { error: {...} }, others throw exceptions
**Impact**: Inconsistent error handling in frontend
**Recommendation**: Standardize error response format

## 🔄 Migration Guide

### For Components Using Mock Data
1. Import types from `/types/api.ts`
2. Update component props to use centralized types
3. Replace mock data imports with API client calls

### For New API Endpoints
1. Add types to `/types/api.ts`
2. Create Zod schema for validation
3. Add method to `ApiClient` class
4. Export convenience function

## 📊 Type Exports for AC Reference

All types are exported from `/types/api.ts` and can be imported by AC:

```typescript
// Core API types
export type {
  SearchParams,
  SearchResponse,
  Provider,
  BookingData,
  BookingResponse,
  TimeSlot,
  Review,
  Procedure,
  InsuranceProvider,
  ApiError,
  ApiResponse,
} from '../types/api';

// Validation schemas
export { ApiSchemas } from '../types/api';

// API client functions
export {
  searchProviders,
  getProviderDetails,
  createBooking,
  getBookingDetails,
  cancelBooking,
  getAvailableTimeSlots,
  verifyInsurance,
  getProcedures,
  getInsuranceProviders,
} from '../lib/api';
```

## 🧪 Testing Recommendations

1. **Unit Tests**: Test Zod schemas with valid/invalid data
2. **Integration Tests**: Test API client with mock responses
3. **Type Tests**: Ensure type compatibility between mock and API data
4. **Error Tests**: Test error handling and validation failures

## 📈 Next Steps

1. **Backend Implementation**: Implement missing API endpoints
2. **Mock Data Alignment**: Update mock data to match API types
3. **Component Migration**: Update components to use centralized types
4. **Error Handling**: Implement consistent error handling across all endpoints
5. **Testing**: Add comprehensive test coverage for API types and client
