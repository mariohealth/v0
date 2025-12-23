# Profile Setup Testing Guide

## Overview
This implementation adds Week 1 MVP profile fields (ZIP, Insurance Carrier, Search Radius) to the signup flow and profile page.

## Critical Data Alignment Issue (FIXED)

**Previous Version (WRONG):**
- Had 10 hardcoded carriers with made-up IDs: bcbs, uhc, aetna, etc.
- **PROBLEM:** These IDs don't match the actual data in procedure_pricing table

**Current Version (CORRECT):**
- Only shows carriers that actually have pricing data
- Matches carrier_id values in procedure_pricing table:
  - `cigna_national_oap` → "Cigna (National OAP Plan)"
  - `united_pp1_00` → "UnitedHealthcare (PP1.00 Plan)"

## Parameters & Validation

### ZIP Code
- **Type:** String
- **Format:** 5-digit numeric (e.g., "10001")
- **Validation:** Must match regex `^\d{5}$`
- **Required:** Yes
- **Storage:** `user_preferences.default_zip`

### Insurance Carrier
- **Type:** String (carrier_id)
- **Valid Values:**
  - `cigna_national_oap`
  - `united_pp1_00`
- **Required:** Yes
- **Storage:** `user_preferences.preferred_insurance_carriers` (JSONB array)
- **Note:** Stored as array to support multiple carriers in future, but Week 1 only uses first element

### Search Radius
- **Type:** Integer
- **Range:** 10-100 miles
- **Default:** 60 miles
- **Step:** 5 miles
- **Required:** Yes
- **Storage:** `user_preferences.default_radius`

## API Endpoints

### GET /api/v1/insurance/providers
**Purpose:** Fetch available insurance carriers
**Auth:** None required
**Response:**
```json
{
  "providers": [
    {
      "id": "cigna_national_oap",
      "name": "Cigna (National OAP Plan)",
      "type": "PPO",
      "network": "National"
    },
    {
      "id": "united_pp1_00",
      "name": "UnitedHealthcare (PP1.00 Plan)",
      "type": "PPO",
      "network": "National"
    }
  ]
}
```

### GET /api/v1/user/preferences
**Purpose:** Get user's saved preferences
**Auth:** Required (Firebase token)
**Response:**
```json
{
  "preferences": {
    "user_id": "firebase_user_id",
    "default_zip": "10001",
    "default_radius": 60,
    "preferred_insurance_carriers": ["cigna_national_oap"],
    "saved_locations": [],
    "language": "en",
    "notifications": {
      "email": true,
      "sms": false
    }
  },
  "success": true
}
```

### PUT /api/v1/user/preferences
**Purpose:** Update user preferences
**Auth:** Required (Firebase token)
**Request:**
```json
{
  "preferences": {
    "user_id": "firebase_user_id",
    "default_zip": "10001",
    "default_radius": 60,
    "preferred_insurance_carriers": ["cigna_national_oap"]
  }
}
```

## How to Test

### Prerequisites
1. Backend API running
2. Frontend dev server running
3. Firebase authentication configured
4. Supabase connected with user_preferences table

### Test 1: New User Signup Flow
1. Navigate to `/signup`
2. Create new account with email/password or Google
3. **Expected:** Redirect to `/profile-setup`
4. Fill in:
   - ZIP: Enter valid 5-digit ZIP (e.g., "02115")
   - Carrier: Select "Cigna" or "UnitedHealthcare"
   - Radius: Adjust slider (10-100 miles)
5. Click "Continue to MarioHealth"
6. **Expected:**
   - Preferences saved to database
   - Redirect to `/home`
   - No errors in console

### Test 2: ZIP Code Validation
1. On `/profile-setup`, try entering:
   - 4 digits → Error: "Please enter a valid 5-digit ZIP code"
   - 6 digits → Auto-limited to 5
   - Letters → Filtered out (only numbers accepted)
   - Valid 5 digits → Error clears

### Test 3: Profile Editing
1. Navigate to `/profile`
2. Find "Location Preferences" section
3. Click edit icon
4. Modify ZIP and/or radius
5. Click "Save" → **Expected:** Values update, edit mode exits
6. Click "Cancel" → **Expected:** Changes discarded, edit mode exits

### Test 4: Insurance Carrier Editing
1. Navigate to `/profile`
2. Find "Insurance Carrier" section
3. Click edit icon
4. Change carrier selection
5. Click "Save" → **Expected:** Carrier updates, edit mode exits

### Test 5: API Integration
```bash
# Get auth token from browser (Firebase)
TOKEN="your_firebase_token"

# Test GET preferences
curl -H "Authorization: Bearer $TOKEN" \
  https://mario-health-api-production-643522268884.us-central1.run.app/api/v1/user/preferences

# Test PUT preferences
curl -X PUT \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "preferences": {
      "user_id": "test",
      "default_zip": "10001",
      "default_radius": 60,
      "preferred_insurance_carriers": ["cigna_national_oap"]
    }
  }' \
  https://mario-health-api-production-643522268884.us-central1.run.app/api/v1/user/preferences
```

### Test 6: Data Persistence
1. Complete profile setup
2. Log out
3. Log back in
4. Navigate to `/profile`
5. **Expected:** Previously saved ZIP, carrier, and radius are displayed

## Common Issues

### Issue: "Not set" shows in profile
**Cause:** User hasn't completed profile setup OR preferences API failing
**Fix:** Check browser console for API errors, verify auth token

### Issue: Wrong carrier names in dropdown
**Cause:** Insurance providers endpoint returning wrong data
**Fix:** Verify GET /api/v1/insurance/providers returns cigna_national_oap and united_pp1_00

### Issue: In-network filtering doesn't work
**Cause:** User selected a carrier_id that doesn't match procedure_pricing data
**Fix:** Ensure carrier dropdown only shows cigna_national_oap and united_pp1_00

### Issue: TypeScript errors
**Cause:** Missing types or incorrect imports
**Fix:** Run `npm install` in frontend directory

## Database Verification

```sql
-- Check user preferences were saved
SELECT * FROM user_preferences
WHERE user_id = 'your_firebase_user_id';

-- Expected result:
-- user_id: firebase_user_id
-- default_zip: "10001"
-- default_radius: 60
-- preferred_insurance_carriers: ["cigna_national_oap"]

-- Verify carriers match pricing data
SELECT DISTINCT carrier_id, carrier_name
FROM procedure_pricing;

-- Expected result:
-- cigna_national_oap | cigna
-- united_pp1_00 | united
```

## Files Changed

**Backend:**
- `/backend/mario-health-api/app/api/v1/endpoints/insurance.py` - Fixed carrier list

**Frontend:**
- `/frontend/src/app/profile-setup/page.tsx` - New onboarding route
- `/frontend/src/components/mario-profile-setup.tsx` - Onboarding component
- `/frontend/src/components/mario-profile-v2.tsx` - Enhanced profile with edit modes
- `/frontend/src/lib/hooks/useUserPreferences.ts` - Preferences API hook
- `/frontend/src/lib/hooks/useInsurance.ts` - Insurance carriers hook
- `/frontend/src/app/signup/page.tsx` - Updated redirect

## What I Missed the First Time

1. **Did not check existing data** - Assumed carrier IDs without verifying database
2. **No build testing** - node_modules not installed, build failed
3. **No integration testing** - Did not verify API calls work
4. **No data model verification** - Did not check procedure_pricing table structure
5. **Wrong carrier IDs** - Created bcbs, uhc, etc. instead of cigna_national_oap, united_pp1_00

## Next Steps

1. Test the corrected implementation
2. Verify carrier filtering works with search
3. Add more carriers when pricing data is loaded
4. Consider creating a carriers reference table instead of hardcoding
