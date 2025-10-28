# API Adapter Documentation

The API Adapter (`/lib/api/adapter.ts`) provides a centralized, consistent interface for all API calls with seamless switching between mock and real APIs.

## 🚀 One-Line Switching

To switch between mock and real APIs, simply change one environment variable:

```bash
# Use mock data (default for development)
NEXT_PUBLIC_USE_MOCK_API=true

# Use real API
NEXT_PUBLIC_USE_MOCK_API=false
```

## ✨ Features

### 1. **Consistent Interface**
- All API calls go through the same interface regardless of mock/real mode
- Maintains backward compatibility with existing code
- Type-safe with full TypeScript support

### 2. **Retry Logic & Timeout Handling**
- Automatic retry with exponential backoff
- Configurable timeout and retry settings
- Smart retry logic (doesn't retry 4xx client errors)

### 3. **Development Logging**
- Automatic request/response logging in development mode
- Performance timing for each request
- Error logging with context

### 4. **Response Transformation**
- Transforms AC's backend response format to frontend types
- Handles field name mapping (e.g., `facility_type` → `type`)
- Consistent data structure across mock and real APIs

### 5. **Environment Configuration**
```bash
# API Mode (true = mock, false = real)
NEXT_PUBLIC_USE_MOCK_API=true

# Real API URL (only used when mock=false)
NEXT_PUBLIC_API_URL=https://api.mariohealth.com

# Performance Settings
NEXT_PUBLIC_API_TIMEOUT=10000        # Request timeout in ms
NEXT_PUBLIC_API_MAX_RETRIES=3         # Max retry attempts
NEXT_PUBLIC_API_RETRY_DELAY=1000      # Base delay for retries in ms
```

## 📖 Usage

### Basic Usage
```typescript
import { apiAdapter, searchProviders, getProviderDetails } from '@/lib/api/adapter';

// Using the adapter instance
const providers = await apiAdapter.searchProviders({
  procedure: 'MRI Scan',
  location: 'New York',
  priceRange: [500, 1000]
});

// Using individual functions (backward compatible)
const provider = await getProviderDetails('provider-123');
```

### Checking API Mode
```typescript
import { apiAdapter } from '@/lib/api/adapter';

if (apiAdapter.isMockMode()) {
  console.log('Using mock data');
} else {
  console.log('Using real API:', apiAdapter.getApiUrl());
}
```

## 🔄 API Methods

### Search
- `searchProviders(params)` - Search for healthcare providers
- `getProviderDetails(id)` - Get detailed provider information

### Booking
- `createBooking(data)` - Create a new appointment booking
- `getBookingDetails(bookingId)` - Get booking information
- `cancelBooking(bookingId)` - Cancel an existing booking
- `getAvailableTimeSlots(providerId, date?)` - Get available appointment slots

### Insurance
- `verifyInsurance(memberId, providerId)` - Verify insurance coverage
- `getInsuranceProviders()` - Get list of accepted insurance providers

### Procedures
- `getProcedures(query?)` - Search for medical procedures

## 🛠️ Development

### Mock Data
- Mock responses simulate real API behavior
- Includes realistic delays and data
- Supports all search filters and parameters

### Real API Integration
- Transforms AC backend responses to frontend format
- Handles authentication headers
- Manages request/response logging

### Error Handling
- Consistent error format across mock and real APIs
- Automatic retry for network errors
- Detailed error logging in development

## 🔧 Customization

### Adding New Endpoints
1. Add method to both `MockApiClient` and `RealApiClient`
2. Add corresponding method to `ApiAdapter`
3. Export individual function for backward compatibility
4. Update types if needed

### Modifying Retry Logic
Adjust environment variables:
```bash
NEXT_PUBLIC_API_MAX_RETRIES=5
NEXT_PUBLIC_API_RETRY_DELAY=2000
```

### Custom Timeouts
```bash
NEXT_PUBLIC_API_TIMEOUT=15000  # 15 seconds
```

## 🐛 Troubleshooting

### Mock Mode Not Working
- Check `NEXT_PUBLIC_USE_MOCK_API=true` in `.env.local`
- Restart development server after changing environment variables

### Real API Errors
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check network connectivity
- Review browser console for detailed error logs

### Performance Issues
- Adjust timeout settings for slow networks
- Reduce retry attempts for faster failure detection
- Check development logs for request timing

## 📝 Migration Guide

### From Old API Client
Replace imports:
```typescript
// Old
import { apiClient } from '@/lib/api';

// New
import { apiAdapter } from '@/lib/api/adapter';
// OR
import { searchProviders } from '@/lib/api/adapter';
```

### Environment Setup
1. Copy `env.example` to `.env.local`
2. Set `NEXT_PUBLIC_USE_MOCK_API=true` for development
3. Configure real API URL when ready for production

The API adapter maintains full backward compatibility, so existing code will continue to work without changes.
