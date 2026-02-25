---
created: 2026-01-02
last_updated: 2026-02-26
owner: mario-health-team
status: active
stage: mvp
---

# Frontend ↔ Backend API Overview

This document provides a comprehensive overview of all API endpoints available in the Mario Health backend API.

## API Base URL

- **Production**: `https://mario-health-api-72178908097.us-central1.run.app`
- **Local**: `http://localhost:8000`

All endpoints are prefixed with `/api/v1` unless otherwise noted.

## API Endpoints

| Resource | Method | Path | Status | Notes |
|----------|--------|------|--------|-------|
| **Categories** | GET | `/api/v1/categories` | ✅ | Get all procedure categories with family counts |
| **Category Families** | GET | `/api/v1/categories/{slug}/families` | ✅ | Get all families within a category |
| **Family Procedures** | GET | `/api/v1/families/{slug}/procedures` | ✅ | Get all procedures within a family with pricing |
| **Procedure Detail** | GET | `/api/v1/procedures/{slug}` | ✅ | Get detailed procedure information with carrier pricing |
| **Procedure Search** | GET | `/api/v1/procedures?q={query}` | ✅ | Alias that redirects to `/api/v1/search` |
| **Search** | GET | `/api/v1/search?q={query}&zip_code={zip}&radius={radius}` | ✅ | Search procedures by name with location filtering |
| **Billing Code** | GET | `/api/v1/codes/{code}?code_type={type}` | ✅ | Get billing code detail with related procedures |
| **Provider Detail** | GET | `/api/v1/providers/{id}` | ✅ | Get provider information with procedures and pricing |
| **Provider Time Slots** | GET | `/api/v1/providers/{id}/time-slots?date={date}` | 🆕 | Get available time slots for a provider (stub) |
| **Bookings** | POST | `/api/v1/bookings` | 🆕 | Create a new appointment booking (stub) |
| **Booking Detail** | GET | `/api/v1/bookings/{bookingId}` | 🆕 | Get booking details (stub) |
| **Cancel Booking** | DELETE | `/api/v1/bookings/{bookingId}/cancel` | 🆕 | Cancel a booking (stub) |
| **Insurance Verify** | POST | `/api/v1/insurance/verify` | 🆕 | Verify insurance coverage (stub) |
| **Insurance Providers** | GET | `/api/v1/insurance/providers` | 🆕 | Get list of insurance providers (stub) |
| **User Preferences** | GET | `/api/v1/user/preferences` | ✅ | Get user preferences |
| **User Preferences** | PUT | `/api/v1/user/preferences` | ✅ | Update user preferences |
| **Saved Searches** | GET | `/api/v1/user/saved-searches` | ✅ | Get all saved searches for user |
| **Saved Searches** | POST | `/api/v1/user/saved-searches` | ✅ | Create a new saved search |
| **Saved Search** | DELETE | `/api/v1/user/saved-searches/{search_id}` | ✅ | Delete a saved search |
| **Whoami** | GET | `/api/v1/whoami` | ✅ | Debug endpoint for authentication |
| **Health Check** | GET | `/health` | ✅ | API health check endpoint |

## Status Legend

- ✅ **Production Ready**: Fully implemented and tested
- 🆕 **Newly Added**: Recently scaffolded, contains stub responses
- ⚠️ **In Progress**: Being implemented

## Alias Routes

The following alias routes exist for backward compatibility:

- `/api/v1/procedure-categories` → `/api/v1/categories` (307 redirect)
- `/api/v1/procedures?q={query}` → `/api/v1/search?q={query}` (307 redirect)

## Query Parameter Compatibility

The search endpoint accepts both parameter names for ZIP code:
- `zip_code` (preferred)
- `zip` (alias, for compatibility)

Example:
- `/api/v1/search?q=mri&zip_code=02138&radius=25`
- `/api/v1/search?q=mri&zip=02138&radius=25` (also works)

## Path Parameter Compatibility

The following endpoints accept both parameter naming conventions:
- `/api/v1/providers/{provider_id}` and `/api/v1/providers/{id}` - Both work
- `/api/v1/procedures/{slug}` and `/api/v1/procedures/{id}` - Both work

FastAPI matches routes by path pattern, not parameter names, so both patterns work.

## Newly Added Endpoints (Stub Status)

The following endpoints have been scaffolded with stub responses:

### Bookings (`/api/v1/bookings`)
- **POST** `/api/v1/bookings` - Create booking
- **GET** `/api/v1/bookings/{bookingId}` - Get booking details
- **DELETE** `/api/v1/bookings/{bookingId}/cancel` - Cancel booking

**Status**: Stub responses implemented. TODO: Implement full booking logic.

### Insurance (`/api/v1/insurance`)
- **POST** `/api/v1/insurance/verify` - Verify insurance coverage
- **GET** `/api/v1/insurance/providers` - Get insurance providers list

**Status**: Stub responses implemented. TODO: Implement insurance verification logic.

### Provider Time Slots (`/api/v1/providers/{id}/time-slots`)
- **GET** `/api/v1/providers/{id}/time-slots?date={date}` - Get available time slots

**Status**: Stub responses implemented. TODO: Implement time slot availability logic.

## Authentication

All endpoints require authentication via Bearer token in the `Authorization` header:

```
Authorization: Bearer <token>
```

Tokens are obtained from the frontend's `/api/auth/token` endpoint.

## Response Format

All endpoints return JSON responses. Successful responses follow this structure:

```json
{
  "data": { ... },
  "status": "success"
}
```

Error responses follow this structure:

```json
{
  "detail": "Error message",
  "status_code": 400
}
```

## Rate Limiting

Currently not implemented. Will be added in future updates.

## CORS Configuration

The API allows requests from:
- `http://localhost:3000`
- `http://127.0.0.1:3000`
- `https://mario.health`
- `https://www.mario.health`
- `https://mario-health-ifzy.vercel.app`

Additional origins can be configured via `ALLOWED_ORIGINS` environment variable.

## Interactive API Documentation

Full interactive API documentation is available at:
- **Swagger UI**: `/docs`
- **ReDoc**: `/redoc`

Both are available at the API base URL (e.g., `https://mario-health-api-72178908097.us-central1.run.app/docs`).

## Testing

Test endpoints using:

1. **Swagger UI**: Visit `/docs` for interactive testing
2. **cURL**: Use command-line tools
3. **Frontend API Status Page**: Visit `/api-status` in development mode

## Related Documentation

- **[API Mapping Table](./API-Mapping-Table.md)** - Detailed frontend-backend route mapping
- **[API Contract](../decisions/API-Contract.md)** - Formal API specification
- **[Routing + Entity Identity Contract](../decisions/Routing-Entity-Identity-Contract.md)** - Canonical routes and entity model
- **[Integration Guide](./Integration-Guide.md)** - Frontend integration guide

