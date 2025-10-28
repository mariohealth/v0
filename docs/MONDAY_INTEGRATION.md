# Monday Integration Call - Backend Engineer Handoff

**Prepared for AC**  
*Integration call checklist and success criteria for Mario Health backend implementation*

---

## 📋 Pre-Call Checklist

### ✅ What AC Needs to Prepare

#### 1. Environment Setup
- [ ] **Backend API running locally** (`http://localhost:3000`)
- [ ] **Supabase connection configured** with test data
- [ ] **API key authentication working**
- [ ] **CORS properly configured** for frontend access
- [ ] **Database schema created** (providers, procedures, reviews, bookings)

#### 2. Test Data Ready
- [ ] **Sample providers** (at least 5-10 providers with different types)
- [ ] **Sample procedures** (MRI, CT scan, physical exam, etc.)
- [ ] **Sample reviews** (3-5 reviews per provider)
- [ ] **Sample time slots** (available appointments for next 7 days)
- [ ] **Insurance providers** (Aetna, Blue Cross, Cigna, etc.)

#### 3. API Endpoints Implemented
- [ ] **Search endpoint** (`GET /api/search`) - HIGH PRIORITY
- [ ] **Provider details** (`GET /api/providers/:id`) - HIGH PRIORITY
- [ ] **Procedure search** (`GET /api/procedures`) - Already working
- [ ] **Procedure categories** (`GET /api/procedure-categories`) - Already working

#### 4. Documentation Ready
- [ ] **API documentation** (Swagger/OpenAPI)
- [ ] **Database schema** documented
- [ ] **Sample requests** ready for testing
- [ ] **Error handling** implemented and documented

---

## 🎯 During-Call Checklist

### Phase 1: Environment Verification (5 minutes)
- [ ] **Backend API accessible** from frontend
- [ ] **CORS working** - no browser errors
- [ ] **API key authentication** - test with curl
- [ ] **Database connection** - verify Supabase is responding

### Phase 2: Core Search Integration (15 minutes)
- [ ] **Test search endpoint** with sample queries:
  ```bash
  curl "http://localhost:3000/api/search?procedure=MRI%20scan&location=New%20York%2C%20NY" \
    -H "X-API-Key: your-key"
  ```
- [ ] **Verify response format** matches frontend expectations
- [ ] **Test provider details** endpoint
- [ ] **Check data completeness** - all required fields present

### Phase 3: Frontend Integration (10 minutes)
- [ ] **Update frontend API URL** to point to backend
- [ ] **Test search functionality** in browser
- [ ] **Verify provider cards** display correctly
- [ ] **Check error handling** - test with invalid queries

### Phase 4: Data Validation (10 minutes)
- [ ] **Compare mock data** with API responses
- [ ] **Verify TypeScript types** match API responses
- [ ] **Test edge cases** - empty results, invalid IDs
- [ ] **Check performance** - response times under 2 seconds

### Phase 5: Next Steps Planning (10 minutes)
- [ ] **Identify missing endpoints** (booking, time slots, reviews)
- [ ] **Prioritize implementation** order
- [ ] **Set timeline** for remaining features
- [ ] **Assign responsibilities** for follow-up work

---

## ✅ Success Criteria

### Immediate Success (End of Call)
- [ ] **Frontend can search providers** using backend API
- [ ] **Provider cards display** with real data from backend
- [ ] **No console errors** in browser
- [ ] **API responses** match frontend TypeScript types
- [ ] **Search results** show 5+ providers with complete data

### Short-term Success (This Week)
- [ ] **Provider detail pages** work with backend data
- [ ] **Booking system** basic implementation
- [ ] **Time slot management** functional
- [ ] **Review system** displaying real reviews
- [ ] **Error handling** graceful for all scenarios

### Long-term Success (Next 2 Weeks)
- [ ] **Complete booking flow** end-to-end
- [ ] **Insurance verification** working
- [ ] **Advanced search filters** implemented
- [ ] **Performance optimized** (sub-1 second responses)
- [ ] **Production ready** with proper error handling

---

## 🧪 Test Scenarios

### 1. Basic Search Test
```bash
# Test 1: Search for MRI providers
curl "http://localhost:3000/api/search?procedure=MRI%20scan" \
  -H "X-API-Key: test-key"

# Expected: Array of providers with MRI capabilities
# Verify: All required fields present, proper JSON format
```

### 2. Location Filter Test
```bash
# Test 2: Search with location filter
curl "http://localhost:3000/api/search?procedure=MRI%20scan&location=New%20York%2C%20NY" \
  -H "X-API-Key: test-key"

# Expected: Providers in NYC area
# Verify: Distance field populated, location-specific results
```

### 3. Provider Detail Test
```bash
# Test 3: Get specific provider details
curl "http://localhost:3000/api/providers/provider-123" \
  -H "X-API-Key: test-key"

# Expected: Complete provider object with reviews, time slots
# Verify: All extended fields present, reviews array populated
```

### 4. Error Handling Test
```bash
# Test 4: Invalid provider ID
curl "http://localhost:3000/api/providers/invalid-id" \
  -H "X-API-Key: test-key"

# Expected: 404 error with proper error format
# Verify: Error response matches ApiError interface
```

### 5. Frontend Integration Test
- [ ] **Open frontend** (`http://localhost:3000`)
- [ ] **Search for "MRI scan"** in hero search bar
- [ ] **Verify results page** loads with provider cards
- [ ] **Click on provider** to view details
- [ ] **Check all data** displays correctly

---

## 🚨 Common Issues & Solutions

### Issue 1: CORS Errors
**Symptoms**: Browser console shows CORS errors
**Solution**: 
```python
# In FastAPI main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Issue 2: API Key Authentication
**Symptoms**: 401 Unauthorized errors
**Solution**: Ensure API key is passed in headers:
```bash
curl -H "X-API-Key: your-api-key" http://localhost:3000/api/search
```

### Issue 3: Data Structure Mismatch
**Symptoms**: Frontend crashes or displays incorrectly
**Solution**: Verify API response matches TypeScript interfaces in `/frontend/src/types/api.ts`

### Issue 4: Missing Required Fields
**Symptoms**: Provider cards show undefined values
**Solution**: Ensure all required fields are present:
- `id`, `name`, `rating`, `reviewCount`, `price`, `address`, `distance`

### Issue 5: Date/Time Format Issues
**Symptoms**: Date parsing errors
**Solution**: Use consistent formats:
- Dates: `YYYY-MM-DD`
- Times: `HH:MM` (24-hour format)

---

## 📊 Performance Benchmarks

### Response Time Targets
- **Search endpoint**: < 2 seconds
- **Provider details**: < 1 second
- **Procedure search**: < 500ms
- **Time slots**: < 1 second

### Data Volume Expectations
- **Search results**: 10-50 providers per query
- **Provider details**: Complete object with 5-10 reviews
- **Time slots**: 7 days of availability (50-100 slots)
- **Reviews**: 3-10 reviews per provider

---

## 🔄 Rollback Plan

If integration fails during the call:

1. **Immediate**: Switch frontend back to mock data
2. **Short-term**: Fix backend issues identified
3. **Follow-up**: Schedule another integration call within 24 hours

### Rollback Commands
```bash
# Switch frontend to mock data
cd frontend
# Update API_URL in .env.local to use mock data
NEXT_PUBLIC_API_URL=http://localhost:3000/api/mock
```

---

## 📞 Emergency Contacts

- **Frontend Lead**: Arman
- **Backend Lead**: AC
- **Project Manager**: DS
- **Slack Channel**: #mario-health-dev

---

## 📝 Post-Call Action Items

### For AC (Backend)
- [ ] **Fix any issues** identified during testing
- [ ] **Implement missing endpoints** (booking, time slots)
- [ ] **Add comprehensive error handling**
- [ ] **Performance optimization** if needed
- [ ] **Update documentation** with any changes

### For Frontend Team
- [ ] **Update API integration** based on backend changes
- [ ] **Test all user flows** with real data
- [ ] **Report any UI issues** with real data
- [ ] **Performance testing** with backend API

### For Project Management
- [ ] **Update project timeline** based on integration results
- [ ] **Schedule follow-up calls** if needed
- [ ] **Coordinate next sprint** planning
- [ ] **Update stakeholders** on progress

---

## 🎯 Success Metrics

### Technical Metrics
- [ ] **API response time**: < 2 seconds
- [ ] **Error rate**: < 1%
- [ ] **Data completeness**: 100% required fields
- [ ] **Type safety**: No TypeScript errors

### User Experience Metrics
- [ ] **Search functionality**: Works smoothly
- [ ] **Provider cards**: Display correctly
- [ ] **Error messages**: User-friendly
- [ ] **Loading states**: Appropriate feedback

### Business Metrics
- [ ] **Provider coverage**: 10+ providers in test data
- [ ] **Procedure coverage**: 5+ different procedures
- [ ] **Geographic coverage**: Multiple locations
- [ ] **Insurance coverage**: Multiple providers

---

*Prepared for: Monday Integration Call*  
*Date: January 2024*  
*Duration: 60 minutes*  
*Participants: AC (Backend), Arman (Frontend), DS (PM)*
