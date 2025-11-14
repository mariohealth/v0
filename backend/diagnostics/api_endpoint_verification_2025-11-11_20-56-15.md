# API Endpoint Verification Report — 2025-11-11_20-56-15

**API Base URL:** http://localhost:8000/api/v1

**Summary:** 0/8 endpoints successful

## Test Results

| Endpoint | Status | Response Time (ms) | Notes |
|----------|--------|---------------------|-------|
| Procedure Search (q=mri) | ✗ Request timeout | N/A | Request timeout |
| Procedure Detail (brain-mri) | ✗ Request timeout | N/A | Request timeout |
| Procedure Providers (brain-mri) | ✗ Request timeout | N/A | Request timeout |
| Provider List | ✗ Request timeout | N/A | Request timeout |
| Procedure Detail (ct-head) | ✗ Request timeout | N/A | Request timeout |
| Procedure Detail (xray-chest) | ✗ Request timeout | N/A | Request timeout |
| Procedure Detail (ultrasound-abdomen) | ✗ Request timeout | N/A | Request timeout |
| Procedure Detail (lab-cbc) | ✗ Request timeout | N/A | Request timeout |

## Detailed Findings

## Recommendations

1. **Backend Status**: Ensure backend is running on `http://localhost:8000`
2. **Start Backend**: Run `cd backend/mario-health-api && python3 -m uvicorn app.main:app --reload`
3. **MRI Pricing**: Seed pricing data for MRI procedures (as identified in previous diagnostics)
4. **Provider Linkage**: Fix orphan pricing records (985 records need provider_location entries)
