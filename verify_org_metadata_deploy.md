# Org Metadata Deployment Verification

## Prerequisites
- Backend API deployed with updated `ProcedureOrg` model (Optional metadata fields)
- Frontend running locally with `NEXT_PUBLIC_API_BASE_URL` pointing to production gateway

## 1. API Response Verification

### A) Check nyc_006 org metadata fields:
```bash
curl -s "https://mario-health-api-gateway-x5pghxd.uc.gateway.dev/api/v1/procedures/brain-mri/orgs" \
  | jq '.orgs[] | select(.org_id=="nyc_006") | {org_id, org_name, address, phone, city, state, zip_code, min_price, max_price}'
```

**Expected Output:**
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
```

### B) Verify all metadata keys exist:
```bash
curl -s "https://mario-health-api-gateway-x5pghxd.uc.gateway.dev/api/v1/procedures/brain-mri/orgs" \
  | jq '.orgs[0] | keys | sort'
```

**Expected:** Should include `org_name`, `address`, `phone`, `city`, `state`, `zip_code`, `latitude`, `longitude`, `org_type`

## 2. Frontend Smoke Test

### Setup:
```bash
cd frontend
export NEXT_PUBLIC_API_BASE_URL="https://mario-health-api-gateway-x5pghxd.uc.gateway.dev/api/v1"
npm run dev
```

### Test Steps:
1. Navigate to `http://localhost:3000/procedures/brain-mri`
2. **Verify:** Org cards display `org_name` (e.g., "Lenox Hill Hospital") instead of `org_id` (e.g., "nyc_006")
3. Click an org card
4. **Verify:** Browser navigates to `/orgs/{org_id}?procedure=brain-mri` (e.g., `/orgs/nyc_006?procedure=brain-mri`)
5. **Verify Org Detail Page:**
   - Header shows org name (not org_id)
   - "Location" section displays address, city, state, zip (if present)
   - "Contact" section displays phone number (if present)
   - "About This Imaging Center" section is collapsible

## 3. Browser Network Verification

Open DevTools → Network tab:
1. Filter by "orgs"
2. Find request to `/api/v1/procedures/brain-mri/orgs`
3. **Verify:** Request URL is `https://mario-health-api-gateway-x5pghxd.uc.gateway.dev/api/v1/procedures/brain-mri/orgs`
4. Inspect response payload - should include `org_name`, `address`, `phone`, etc.

## Verification Checklist

- [ ] API returns `org_name` for nyc_006 (not null)
- [ ] API returns `address`, `phone`, `city`, `state`, `zip_code` for nyc_006
- [ ] Procedure results page shows org names (not org_ids)
- [ ] Clicking org card navigates to `/orgs/{id}?procedure=brain-mri`
- [ ] Org detail page renders org name in header
- [ ] Org detail page shows Location section (if address present)
- [ ] Org detail page shows Contact section (if phone present)

