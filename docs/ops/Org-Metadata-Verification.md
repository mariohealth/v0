# Org Metadata Deployment Verification

**Status:** ⏳ Waiting for backend deployment

## 1. API Response Verification

### A) Check nyc_006 org metadata (exact curl jq output):

```bash
curl -s "https://mario-health-api-gateway-x5pghxd.uc.gateway.dev/api/v1/procedures/brain-mri/orgs" \
  | jq '.orgs[] | select(.org_id=="nyc_006") | {org_id, org_name, address, phone, city, state, zip_code, min_price, max_price}'
```

**Expected Output (after deploy):**
```json
{
  "org_id": "nyc_006",
  "org_name": "Lenox Hill Hospital",
  "address": "100 E 77th St",
  "phone": "12124342000",
  "city": "New York",
  "state": "NY",
  "zip_code": "10075",
  "min_price": "300.0",
  "max_price": "540.0"
}
{
  "org_id": "nyc_006",
  "org_name": "Lenox Hill Hospital",
  "address": "100 E 77th St",
  "phone": "12124342000",
  "city": "New York",
  "state": "NY",
  "zip_code": "10075",
  "min_price": "1200.0",
  "max_price": "1600.0"
}
```

**Current Output (before deploy):**
- All metadata fields are `null`
- Only pricing fields present

### B) Verify keys include metadata:

```bash
curl -s "https://mario-health-api-gateway-x5pghxd.uc.gateway.dev/api/v1/procedures/brain-mri/orgs" \
  | jq '.orgs[0] | keys | sort'
```

**Expected:** Should include `address`, `city`, `latitude`, `longitude`, `org_name`, `org_type`, `phone`, `state`, `zip_code`

## 2. Frontend Smoke Test

### Setup:
```bash
cd frontend
export NEXT_PUBLIC_API_BASE_URL="https://mario-health-api-gateway-x5pghxd.uc.gateway.dev/api/v1"
npm run dev
```

### Test Steps:

1. **Procedure Results Page** (`http://localhost:3000/procedures/brain-mri`)
   - ✅ **Verify:** Org cards display `org_name` (e.g., "Lenox Hill Hospital")
   - ❌ **Should NOT show:** `org_id` (e.g., "nyc_006") as the primary label

2. **Click Org Card**
   - ✅ **Verify:** Browser navigates to `/orgs/{org_id}?procedure=brain-mri`
   - Example: `/orgs/nyc_006?procedure=brain-mri`

3. **Org Detail Page** (`/orgs/nyc_006?procedure=brain-mri`)
   - ✅ **Header:** Shows org name (not org_id)
   - ✅ **Location Section:** Displays address, city, state, zip (if present)
   - ✅ **Contact Section:** Displays phone number (if present)
   - ✅ **About Section:** Collapsible "About This Imaging Center" section

## 3. Browser Network Verification

1. Open DevTools → Network tab
2. Filter by "orgs"
3. Find request: `GET /api/v1/procedures/brain-mri/orgs`
4. **Verify Request URL:** `https://mario-health-api-gateway-x5pghxd.uc.gateway.dev/api/v1/procedures/brain-mri/orgs`
5. **Inspect Response:** Should include populated `org_name`, `address`, `phone`, etc.

## Verification Checklist

- [ ] API returns `org_name: "Lenox Hill Hospital"` for nyc_006 (not null)
- [ ] API returns populated `address`, `phone`, `city`, `state`, `zip_code`
- [ ] Procedure results page shows org names (not org_ids) in cards
- [ ] Clicking org card navigates to `/orgs/{id}?procedure=brain-mri`
- [ ] Org detail page renders org name in header
- [ ] Org detail page shows Location section with address
- [ ] Org detail page shows Contact section with phone

## Quick Verification Script

Run: `./verify_org_metadata.sh`

This will automatically check:
- API response includes org_name
- org_name is populated (not null)
- All metadata keys are present

