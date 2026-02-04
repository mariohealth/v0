# Mario Health MVP

Healthcare price transparency platform.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (Next.js)     │◄──►│   (FastAPI)     │◄──►│   (Supabase)    │
│                 │    │                 │    │                 │
│ • Search UI     │    │ • Search        │    │ • Procedures    │
│ • Provider Cards│    │ • Providers     │    │ • Categories    │
│ • Booking Flow  │    │ • Bookings      │    │ • Providers     │
│ • Mock Data     │    │ • Insurance     │    │ • Reviews       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Tech Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python
- **Database**: Supabase (PostgreSQL)
- **Authentication**: API Key-based
- **Deployment**: Vercel (Frontend), TBD (Backend)

## 📁 Project Structure
- `/frontend` - Next.js app (Arman)
- `/backend` - APIs & data (AC)
- `/docs` - Documentation
- `/shared` - Shared types & contracts
- `/.github/workflows` - CI/CD & coordination agent

## 🌿 Branch Hygiene
- Never open PRs from long-lived scratch branches.
- Always branch from `main` per feature: `feat/*`, `fix/*`.
- If you cherry-pick into another PR, delete or reset the original scratch branch.

### Branch freshness helper
Run the helper to see how far your branch diverged from `main` and whether it includes cherry-picked patches:
```bash
bash scripts/git/branch_health.sh
```
Optional base ref:
```bash
bash scripts/git/branch_health.sh origin/main
```

## 🚀 Quick Start

### Frontend Setup

1. **Install dependencies:**
```bash
cd frontend
npm install
```

2. **Configure environment:**
```bash
# Copy example env file
cp env.example .env.local

# Edit .env.local and set:
# NEXT_PUBLIC_API_URL=https://mario-health-api-72178908097.us-central1.run.app
# NEXT_PUBLIC_USE_MOCK_API=false
```

3. **Start development server:**
```bash
npm run dev
# Access at http://localhost:3000
```

4. **Verify API connection:**
- Visit `http://localhost:3000/api-status` to check API health
- Check browser console for any errors
- Test search functionality to ensure API calls work

### Backend Setup

The backend is already deployed on Google Cloud Run. To run locally:

```bash
cd backend/mario-health-api
pip install -r requirements.txt
uvicorn app.main:app --reload
# API available at http://localhost:8000
```

**Note:** If running backend locally, update `NEXT_PUBLIC_API_URL` in `.env.local` to `http://localhost:8000`.

## 🔌 API Integration

### Backend API

**Production API URL:** `https://mario-health-api-72178908097.us-central1.run.app`

The frontend integrates with a FastAPI backend running on Google Cloud Run. All API calls automatically convert between backend's snake_case responses and frontend's camelCase types.

### Current Status
- ✅ **Categories**: Get all procedure categories with family counts
- ✅ **Families**: Get families for a category
- ✅ **Procedures**: Get procedures for a family with pricing
- ✅ **Search**: Search procedures by name with optional location filtering
- ✅ **Provider Details**: Get provider information with procedures and pricing
- ✅ **Procedure Details**: Get detailed procedure info with all carrier pricing
- ✅ **Billing Codes**: Get billing code detail with related procedures
- ✅ **User Preferences**: Get and update user preferences
- ✅ **Saved Searches**: CRUD operations for saved searches
- 🆕 **Booking System**: Endpoints scaffolded (stub responses)
- 🆕 **Insurance Verification**: Endpoints scaffolded (stub responses)
- 🆕 **Time Slots**: Endpoint scaffolded (stub responses)

### Environment Variables

Configure these in `.env.local` (frontend) or your deployment platform:

```bash
# Required - Backend API URL
NEXT_PUBLIC_API_URL=https://mario-health-api-72178908097.us-central1.run.app

# Required - Set to 'false' to use real API
NEXT_PUBLIC_USE_MOCK_API=false

# Optional - API performance settings
NEXT_PUBLIC_API_TIMEOUT=10000
NEXT_PUBLIC_API_MAX_RETRIES=3
NEXT_PUBLIC_API_RETRY_DELAY=1000
```

**Important:** Set `NEXT_PUBLIC_USE_MOCK_API=false` to use the real backend API. Mock mode is for development only.

### API Endpoints

All endpoints are documented in `/src/lib/api.ts` and use automatic snake_case → camelCase transformation.

```typescript
// Get all categories
GET /api/v1/categories

// Get families for a category
GET /api/v1/categories/{slug}/families

// Get procedures for a family
GET /api/v1/families/{slug}/procedures

// Get procedure detail
GET /api/v1/procedures/{slug}

// Search procedures
GET /api/v1/search?q=chest&zip=02138&radius=25

// Get provider detail
GET /api/v1/providers/{id}

// Get billing code detail
GET /api/v1/codes/{code}?code_type=CPT
```

### Frontend ↔ Backend API Overview

For a comprehensive overview of all API endpoints, see **[API Overview](./docs/API_OVERVIEW.md)**.

The API Overview includes:
- Complete endpoint reference table
- Status indicators (✅ Production Ready, 🆕 Newly Added, ⚠️ In Progress)
- Alias routes for backward compatibility
- Query parameter compatibility notes
- Authentication requirements
- Newly added endpoints with stub status

**Recently Added Endpoints:**
- 🆕 Booking endpoints (`POST /api/v1/bookings`, `GET /api/v1/bookings/{id}`, `DELETE /api/v1/bookings/{id}/cancel`)
- 🆕 Insurance endpoints (`POST /api/v1/insurance/verify`, `GET /api/v1/insurance/providers`)
- 🆕 Provider time slots (`GET /api/v1/providers/{id}/time-slots`)

Note: Newly added endpoints contain stub responses and are marked for full implementation.

### Integration Documentation
- **[Complete Integration Guide](./docs/INTEGRATION_GUIDE.md)** - Detailed API specs, types, and examples
- **[Monday Integration Call](./docs/MONDAY_INTEGRATION.md)** - Handoff checklist and success criteria
- **[API Contract](./docs/API_CONTRACT.md)** - Formal API specification
- **[Routing + Entity Identity Contract](./docs/ROUTING_ENTITY_IDENTITY_CONTRACT.md)** - Canonical routes and entity model
- **[Deployment Checklist](./docs/DEPLOYMENT_CHECKLIST.md)** - Pre-deployment verification guide
- **[Swagger API Docs](https://mario-health-api-72178908097.us-central1.run.app/docs)** - Interactive API documentation

### TypeScript Types
All API types are centralized in `/frontend/src/types/api.ts`:
- `Provider` - Healthcare provider information
- `SearchParams` - Search query parameters
- `BookingData` - Appointment booking data
- `ApiResponse` - Standard API response wrapper

## 📱 Mobile Testing

For comprehensive mobile testing setup and guidelines, see [MOBILE_TESTING.md](./MOBILE_TESTING.md).

### Quick Mobile Test
```bash
cd frontend
npm run dev
# Access from mobile device: http://[YOUR_IP]:3000
```

### Mobile Features
- ✅ 44px minimum touch targets
- ✅ iOS safe area support
- ✅ Pull-to-refresh functionality
- ✅ Lazy loading for performance
- ✅ iOS keyboard optimization
- ✅ Landscape orientation support
- ✅ Visual touch feedback

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm run test
npm run test:e2e
```

### API Integration Testing

Test the integration between frontend and backend:

```bash
# Run integration tests
npx tsx scripts/test-integration.ts

# Test individual API endpoints
npx tsx scripts/test-api.ts
```

The integration tests validate:
- ✅ All API endpoints are accessible
- ✅ Response structure matches TypeScript types
- ✅ Error handling works correctly
- ✅ Response times are acceptable

### Backend Testing
```bash
cd backend/mario-health-api
python -m pytest
```

### Manual API Testing

1. **Using Swagger UI:**
   - Visit https://mario-health-api-72178908097.us-central1.run.app/docs
   - Test endpoints interactively
   - View response schemas

2. **Using API Status Dashboard (Development):**
   - Visit `http://localhost:3000/api-status`
   - Shows real-time API health
   - Tests all endpoints automatically

### Integration Testing Resources
- Use the [Integration Guide](./docs/INTEGRATION_GUIDE.md) for API testing
- Follow the [Monday Integration Checklist](./docs/MONDAY_INTEGRATION.md) for handoff testing
- Check [Deployment Checklist](./docs/DEPLOYMENT_CHECKLIST.md) for pre-deployment verification

## 🛠️ Development Workflow

### Testing API Connection

1. **Check API Status:**
   ```bash
   curl https://mario-health-api-72178908097.us-central1.run.app/health
   ```

2. **Test Categories Endpoint:**
   ```bash
   curl https://mario-health-api-72178908097.us-central1.run.app/api/v1/categories
   ```

3. **View Integration Status:**
   - Run integration tests: `npx tsx scripts/test-integration.ts`
   - Check API Status page: `http://localhost:3000/api-status`

### Common Issues

**CORS Errors:**
- Backend needs to allow your domain in CORS settings
- Check backend logs for blocked requests
- Contact backend team (AC) to update CORS configuration

**Timeouts:**
- Check network tab in DevTools
- Verify API URL is correct
- Check backend health endpoint

**404 Errors:**
- Verify endpoint path is correct
- Check backend routes match frontend expectations
- Review API version (`/api/v1/`)

### Debugging

- **DevTools Component**: Bottom-right corner in development mode
- **API Status Dashboard**: Visit `/api-status` page
- **Browser Console**: Check for API errors
- **Network Tab**: Inspect request/response payloads

## 📊 Development Status

### Completed Features
- [x] Frontend UI components
- [x] Search interface
- [x] Provider cards display
- [x] Mobile-responsive design
- [x] Basic backend API structure
- [x] Procedure search endpoint
- [x] Procedure categories endpoint

### In Progress
- [ ] Provider search with full data structure
- [ ] Provider detail pages
- [ ] Booking system implementation

### Planned Features
- [ ] Insurance verification
- [ ] Time slot management
- [ ] Review system
- [ ] Payment processing
- [ ] Email notifications
- [ ] Admin dashboard

## 🤝 Contributing

### For Backend Engineers (AC)
1. Review the [Integration Guide](./docs/INTEGRATION_GUIDE.md)
2. Follow the [Monday Integration Checklist](./docs/MONDAY_INTEGRATION.md)
3. Implement missing endpoints in priority order
4. Ensure TypeScript type compatibility

### For Frontend Engineers (Arman)
1. Update API integration as backend endpoints are completed
2. Test all user flows with real data
3. Report any UI issues with backend responses
4. Maintain TypeScript type safety

## 📞 Support

- **Frontend Lead**: Arman
- **Backend Lead**: AC  
- **Project Manager**: DS
- **Documentation**: `/docs/` directory
- **Issues**: Create GitHub issues for bugs or feature requests
