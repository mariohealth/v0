# Mario Health API Endpoints Summary

**Generated:** 2025-11-10  
**Backend:** FastAPI (Python)  
**Base URL:** `/api/v1`

## Discovered Endpoints

| Endpoint | Method | Description | Example Payload | Connected Frontend File |
|----------|--------|-------------|-----------------|-------------------------|
| `/search` | GET | Search for procedures by name | `?q=mri&zip_code=10001&radius=25` | `frontend/src/lib/api.ts` - `searchProcedures()` |
| `/procedures` | GET | Search procedures (alias, redirects to `/search`) | `?q=mri` | `frontend/src/lib/api.ts` - `searchProcedures()` |
| `/procedures/{slug}` | GET | Get procedure detail by slug | `/procedures/mri-brain` | `frontend/src/lib/api.ts` - `getProcedureBySlug()` |
| `/procedures/{slug}/providers` | GET | Get providers for a procedure | `/procedures/mri-brain/providers` | `frontend/src/lib/api.ts` - `getProcedureProviders()` |
| `/providers/{provider_id}` | GET | Get provider detail | `/providers/prov_001` | `frontend/src/lib/api.ts` - `getProviderDetail()` |
| `/providers/{provider_id}/procedures/{procedure_slug}` | GET | Get provider-procedure detail | `/providers/prov_001/procedures/mri-brain` | ❌ Not connected |
| `/providers/{provider_id}/time-slots` | GET | Get available time slots | `?date=2024-01-01` | ❌ Not connected |
| `/categories` | GET | Get all procedure categories | `/categories` | ❌ Not connected |
| `/categories/{slug}/families` | GET | Get families within a category | `/categories/imaging/families` | ❌ Not connected |
| `/families/{slug}/procedures` | GET | Get procedures within a family | `/families/mri/procedures` | ❌ Not connected |
| `/bookings` | POST | Create appointment booking | `{provider_id, procedure_id, appointment_date, ...}` | ❌ Not connected |
| `/bookings/{booking_id}` | GET | Get booking details | `/bookings/booking_001` | ❌ Not connected |
| `/bookings/{booking_id}/cancel` | DELETE | Cancel booking | `/bookings/booking_001/cancel` | ❌ Not connected |
| `/insurance/verify` | POST | Verify insurance coverage | `{member_id, provider_id}` | ❌ Not connected |
| `/insurance/providers` | GET | Get insurance providers list | `/insurance/providers` | ❌ Not connected |
| `/user/preferences` | GET | Get user preferences | `/user/preferences` | ❌ Not connected |
| `/user/preferences` | PUT | Update user preferences | `{preferences: {...}}` | ❌ Not connected |
| `/user/saved-searches` | GET | Get saved searches | `/user/saved-searches` | ❌ Not connected |
| `/user/saved-searches` | POST | Create saved search | `{search: {...}}` | ❌ Not connected |
| `/user/saved-searches/{search_id}` | DELETE | Delete saved search | `/user/saved-searches/search_001` | ❌ Not connected |
| `/whoami` | GET | Get authenticated user info | `/whoami` | ❌ Not connected |

## Missing Endpoints (Required by Frontend)

The following endpoints are referenced in the frontend but **do not exist** in the backend:

| Endpoint | Method | Description | Frontend Usage |
|----------|--------|-------------|----------------|
| `/health-hub` | GET | Get Health Hub data (appointments, claims, requests, messages, deductible) | `frontend/src/lib/api.ts` - `fetchHealthHubData()` |
| `/rewards` | GET | Get rewards data (points, rewards list) | `frontend/src/lib/api.ts` - `fetchRewardsData()` |
| `/rewards/points` | POST | Update MarioPoints | `frontend/src/lib/api.ts` - `updateMarioPoints()` |
| `/bookings` | GET | Get user's appointments | `frontend/src/lib/api.ts` - `getAppointments()` |
| `/claims` | GET | Get user's claims | `frontend/src/lib/api.ts` - `getClaims()` |
| `/requests` | GET | Get user's concierge requests | `frontend/src/lib/api.ts` - `getConciergeRequests()` |

## Frontend Routes Using API

| Frontend Route | API Endpoints Used | Status |
|----------------|-------------------|--------|
| `/home` | `searchProcedures()`, `getProcedureProviders()` | ✅ Connected |
| `/procedures/[slug]` | `getProcedureBySlug()`, `getProcedureProviders()` | ✅ Connected |
| `/providers/[id]` | `getProviderDetail()` | ✅ Connected |
| `/health-hub` | `fetchHealthHubData()`, `getAppointments()`, `getClaims()`, `getConciergeRequests()` | ⚠️ Missing endpoints |
| `/rewards` | `fetchRewardsData()`, `updateMarioPoints()` | ⚠️ Missing endpoints |
| `/ai` | `createBooking()` (via bookings endpoint) | ⚠️ Not connected |

## Recommendations

### 1. Create Missing Health Hub Endpoint

**File:** `backend/mario-health-api/app/api/v1/endpoints/healthhub.py`

```python
from fastapi import APIRouter, Depends, Query
from supabase import Client
from app.core.dependencies import get_supabase
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/health-hub", tags=["health-hub"])

class HealthHubData(BaseModel):
    upcoming_appointments: List[dict]
    past_appointments: List[dict]
    concierge_requests: List[dict]
    recent_claims: List[dict]
    messages: List[dict]
    deductible_progress: dict

@router.get("", response_model=HealthHubData)
async def get_health_hub_data(
    user_id: str = Query(..., description="User ID"),
    supabase: Client = Depends(get_supabase)
):
    """Get comprehensive Health Hub data for a user."""
    # TODO: Implement logic to fetch from database
    # For now, return empty structure
    return HealthHubData(
        upcoming_appointments=[],
        past_appointments=[],
        concierge_requests=[],
        recent_claims=[],
        messages=[],
        deductible_progress={"current": 0, "total": 0, "percentage": 0}
    )
```

### 2. Create Missing Rewards Endpoint

**File:** `backend/mario-health-api/app/api/v1/endpoints/rewards.py`

```python
from fastapi import APIRouter, Depends, Query, Body
from supabase import Client
from app.core.dependencies import get_supabase
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/rewards", tags=["rewards"])

class RewardsData(BaseModel):
    current_points: int
    next_milestone: int
    rewards: List[dict]

class UpdatePointsRequest(BaseModel):
    user_id: str
    delta: int

class UpdatePointsResponse(BaseModel):
    total_points: int

@router.get("", response_model=RewardsData)
async def get_rewards_data(
    user_id: str = Query(..., description="User ID"),
    supabase: Client = Depends(get_supabase)
):
    """Get rewards data for a user."""
    # TODO: Implement logic to fetch from database
    return RewardsData(
        current_points=0,
        next_milestone=1000,
        rewards=[]
    )

@router.post("/points", response_model=UpdatePointsResponse)
async def update_points(
    request: UpdatePointsRequest,
    supabase: Client = Depends(get_supabase)
):
    """Update MarioPoints for a user."""
    # TODO: Implement logic to update in database
    return UpdatePointsResponse(total_points=0)
```

### 3. Create Missing Claims Endpoint

**File:** `backend/mario-health-api/app/api/v1/endpoints/claims.py`

```python
from fastapi import APIRouter, Depends, Query
from supabase import Client
from app.core.dependencies import get_supabase
from typing import List
from pydantic import BaseModel

router = APIRouter(prefix="/claims", tags=["claims"])

class Claim(BaseModel):
    id: str
    service: str
    provider: str
    amount: str
    you_owe: str
    date: str
    status: str

@router.get("", response_model=List[Claim])
async def get_claims(
    user_id: str = Query(..., description="User ID"),
    supabase: Client = Depends(get_supabase)
):
    """Get claims for a user."""
    # TODO: Implement logic to fetch from database
    return []
```

### 4. Create Missing Concierge Requests Endpoint

**File:** `backend/mario-health-api/app/api/v1/endpoints/concierge.py`

```python
from fastapi import APIRouter, Depends, Query
from supabase import Client
from app.core.dependencies import get_supabase
from typing import List
from pydantic import BaseModel

router = APIRouter(prefix="/requests", tags=["concierge"])

class ConciergeRequest(BaseModel):
    id: str
    type: str
    status: str
    request_date: str
    expected_date: str

@router.get("", response_model=List[ConciergeRequest])
async def get_concierge_requests(
    user_id: str = Query(..., description="User ID"),
    supabase: Client = Depends(get_supabase)
):
    """Get concierge requests for a user."""
    # TODO: Implement logic to fetch from database
    return []
```

### 5. Update Bookings Endpoint to Support GET

The existing `/bookings` endpoint only supports POST. Add GET support:

```python
@router.get("", response_model=List[BookingResponse])
async def get_bookings(
    user_id: str = Query(..., description="User ID"),
    supabase: Client = Depends(get_supabase)
):
    """Get all bookings for a user."""
    # TODO: Implement logic to fetch from database
    return []
```

## Next Steps

1. Create the missing endpoint files listed above
2. Register new routers in `app/main.py`
3. Implement database queries in service layer
4. Update frontend API client to use correct endpoints
5. Test all endpoints with frontend integration

