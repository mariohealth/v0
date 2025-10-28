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

## 🚀 Quick Start

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Access at http://localhost:3000
```

### Backend Setup
```bash
cd backend/mario-health-api
pip install -r requirements.txt
uvicorn app.main:app --reload
# API available at http://localhost:3000/api
```

## 🔌 API Integration

### Current Status
- ✅ **Procedure Search**: Basic search functionality
- ✅ **Procedure Categories**: Category listing
- 🟡 **Provider Search**: Partial implementation
- 🔴 **Provider Details**: Not implemented
- 🔴 **Booking System**: Not implemented
- 🔴 **Insurance Verification**: Not implemented

### Integration Documentation
- **[Complete Integration Guide](./docs/INTEGRATION_GUIDE.md)** - Detailed API specs, types, and examples
- **[Monday Integration Call](./docs/MONDAY_INTEGRATION.md)** - Handoff checklist and success criteria
- **[API Contract](./docs/API_CONTRACT.md)** - Formal API specification

### Key Endpoints
```bash
# Search providers (HIGH PRIORITY - Missing)
GET /api/search?procedure=MRI%20scan&location=New%20York%2C%20NY

# Get provider details (HIGH PRIORITY - Missing)
GET /api/providers/:id

# Create booking (HIGH PRIORITY - Missing)
POST /api/bookings

# Get procedures (✅ Working)
GET /api/procedures?q=MRI

# Get categories (✅ Working)
GET /api/procedure-categories
```

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

### Backend Testing
```bash
cd backend/mario-health-api
python -m pytest
```

### Integration Testing
- Use the [Integration Guide](./docs/INTEGRATION_GUIDE.md) for API testing
- Follow the [Monday Integration Checklist](./docs/MONDAY_INTEGRATION.md) for handoff testing

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
