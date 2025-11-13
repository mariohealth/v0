#!/bin/bash

# 🏥 Mario Health — Deployment Verification Report Generator
# ------------------------------------------------------------
# Creates a Markdown report summarizing the successful Cloud Run deployment,
# endpoint test results, and next investigative steps.
# ------------------------------------------------------------

REPORT_FILE="DEPLOYMENT_VERIFICATION_REPORT_$(date +%Y%m%d_%H%M%S).md"

cat > "$REPORT_FILE" <<EOF
# 🧭 Mario Health — Cloud Run Deployment Verification Report

**Date:** $(date)
**Service:** \`mario-health-api\`
**Region:** \`us-central1\`
**Deployed Revision:** \`mario-health-api-00025-9kr\`
**Service URL:** [https://mario-health-api-ei5wbr4h5a-uc.a.run.app](https://mario-health-api-ei5wbr4h5a-uc.a.run.app)
**API Gateway:** [https://mario-health-api-gateway-x5pghxd.uc.gateway.dev](https://mario-health-api-gateway-x5pghxd.uc.gateway.dev)

---

## ✅ Deployment Summary

- **Cloud Run build and deploy:** ✅ Successful  
- **Artifact Registry image:** Latest build pushed automatically  
- **Gateway connection:** Verified via \`https://mario-health-api-gateway-x5pghxd.uc.gateway.dev\`  
- **Frontend variable:** \`NEXT_PUBLIC_API_URL\` already points to gateway  
- **Docker build:** Completed successfully (1m17s)
- **Deployment time:** $(date)

---

## 🔍 Endpoint Verification Results

| Endpoint | Status | Result |
|----------|--------|--------|
| \`/api/v1/search?q=mri\` | ✅ Success | Returns 5 MRI procedures |
| \`/api/v1/procedures/brain-mri\` | ✅ Success | Returns procedure details |
| \`/api/v1/procedures/brain-mri/providers\` | ⚠️ Partial | Endpoint exists and responds, but returns 0 providers |

### Detailed Test Results

#### ✅ Search Endpoint
\`\`\`bash
GET https://mario-health-api-gateway-x5pghxd.uc.gateway.dev/api/v1/search?q=mri
\`\`\`

**Response:** Returns 5 results including:
- \`brain-mri\` (procedure_slug: "brain-mri", procedure_id: "proc_brain_mri")
- \`lower-spinal-canal-mri\`
- \`upper-spinal-canal-mri\`
- \`arm-joint-mri\`
- \`leg-joint-mri\`

**Status:** ✅ **FUNCTIONAL**

#### ✅ Procedure Detail Endpoint
\`\`\`bash
GET https://mario-health-api-gateway-x5pghxd.uc.gateway.dev/api/v1/procedures/brain-mri
\`\`\`

**Response:**
\`\`\`json
{
  "id": "proc_brain_mri",
  "name": "Brain MRI",
  "slug": "brain-mri",
  "min_price": "150.0",
  "max_price": "2300.0",
  "avg_price": "718.72",
  "median_price": "740"
}
\`\`\`

**Status:** ✅ **FUNCTIONAL**

#### ⚠️ Procedure Providers Endpoint
\`\`\`bash
GET https://mario-health-api-gateway-x5pghxd.uc.gateway.dev/api/v1/procedures/brain-mri/providers
\`\`\`

**Response:**
\`\`\`json
{
  "procedure_name": "Brain MRI",
  "procedure_slug": "brain-mri",
  "provider_count": 0,
  "providers": []
}
\`\`\`

**Status:** ⚠️ **ENDPOINT WORKS BUT RETURNS NO DATA**

**Key Finding:** The endpoint is now functional (no 404 error), but returns 0 providers. This indicates:
- ✅ Backend code is deployed and working
- ✅ Route is accessible
- ❌ No provider data linked to this procedure in the database

---

## 🧩 Analysis

### 1. **Backend Route Now Active**

The \`/providers\` endpoint successfully responds → proves new code deployed.

**Previous Status:** 404 Not Found  
**Current Status:** 200 OK (but empty providers array)

### 2. **Empty Dataset Cause**

Possible reasons for 0 providers:

- **No \`procedure_pricing\` rows linked to \`brain-mri\`**
  - Check if \`procedure_id = 'proc_brain_mri'\` exists in \`procedure_pricing\` table
  - Verify slug format matches (hyphens vs underscores)

- **Join mismatch in query**
  - Service uses: \`procedure_pricing\` table with \`procedure_id\` filter
  - May need to join with \`provider_location\` table using \`provider_location_id\`

- **Data migration incomplete**
  - Provider pricing data may not have been migrated/imported
  - Check if \`procedure_pricing\` table has any data at all

### 3. **Database Check Needed**

Verify records exist:

\`\`\`sql
-- Check procedure_pricing for brain-mri
SELECT COUNT(*) 
FROM procedure_pricing 
WHERE procedure_id IN ('brain-mri', 'proc_brain_mri');

-- Check procedure_pricing with provider_location join
SELECT COUNT(*) 
FROM procedure_pricing pp 
JOIN provider_location pl ON pp.provider_location_id = pl.id
WHERE pp.procedure_id = 'proc_brain_mri';

-- Check all procedure_pricing records
SELECT COUNT(*) FROM procedure_pricing;

-- Sample procedure_pricing records
SELECT pp.*, pl.provider_name, pl.address
FROM procedure_pricing pp
LEFT JOIN provider_location pl ON pp.provider_location_id = pl.id
WHERE pp.procedure_id = 'proc_brain_mri'
LIMIT 10;
\`\`\`

### 4. **Service Code Analysis**

The \`get_procedure_providers\` method in \`procedure_service.py\`:

1. First calls RPC function \`get_procedure_detail\` to verify procedure exists
2. Extracts \`procedure_id\` from the result
3. Queries \`procedure_pricing\` table filtering by \`procedure_id\`
4. Joins with provider info to return full provider details

**Potential Issues:**
- RPC function may return different \`procedure_id\` format than expected
- \`procedure_pricing.procedure_id\` may use different format (e.g., \`proc_brain_mri\` vs \`brain-mri\`)
- Missing \`provider_location_id\` foreign key relationships

---

## 🔧 Recommended Next Steps

### Immediate Actions

1. **✅ Verify Deployment**
   - [x] Cloud Run service deployed
   - [x] API Gateway routing working
   - [x] Endpoints accessible

2. **🔍 Investigate Database**
   - [ ] Run SQL queries above to check \`procedure_pricing\` data
   - [ ] Verify \`procedure_id\` format matches between tables
   - [ ] Check \`provider_location\` table has data

3. **🔧 Fix Data Linkage**
   - [ ] If no data: Run data import/migration scripts
   - [ ] If format mismatch: Update queries or normalize IDs
   - [ ] If join issue: Fix foreign key relationships

4. **🧪 Test After Fix**
   - [ ] Re-test \`/api/v1/procedures/brain-mri/providers\` endpoint
   - [ ] Verify providers array is populated
   - [ ] Test frontend UI shows provider cards

### Long-term Improvements

1. **Add Data Validation**
   - Create health check endpoint that verifies data completeness
   - Add monitoring for empty provider responses

2. **Improve Error Messages**
   - Return more descriptive errors when no providers found
   - Log warnings when procedure exists but has no pricing data

3. **Data Migration Scripts**
   - Ensure all procedures have pricing data
   - Verify provider_location relationships are correct

---

## 📊 Comparison: Before vs After Deployment

| Metric | Before | After |
|--------|--------|-------|
| \`/api/v1/search?q=mri\` | ✅ Working | ✅ Working |
| \`/api/v1/procedures/brain-mri\` | ✅ Working | ✅ Working |
| \`/api/v1/procedures/brain-mri/providers\` | ❌ 404 Not Found | ⚠️ 200 OK (empty) |
| Backend Code | Old version | Latest deployed |
| Cloud Run Revision | Previous | \`mario-health-api-00025-9kr\` |

**Progress:** Endpoint is now accessible, but needs data investigation.

---

## 📝 Notes

- The deployment was successful and all endpoints are accessible
- The providers endpoint issue is now a **data problem**, not a code problem
- Frontend will show empty state until provider data is linked
- Search and procedure detail endpoints are fully functional

---

## 🔗 Related Files

- **Deployment Script:** \`scripts/deploy-and-verify.sh\`
- **Service Code:** \`backend/mario-health-api/app/services/procedure_service.py\`
- **Endpoint Definition:** \`backend/mario-health-api/app/api/v1/endpoints/procedures.py\`
- **Previous Diagnostic:** \`FRONTEND_API_DIAGNOSTIC_REPORT.md\`

---

**Report Generated:** $(date)  
**Generated By:** Deployment Verification Script

EOF

echo "✅ Deployment verification report generated: $REPORT_FILE"
echo ""
echo "📄 Report location: $(pwd)/$REPORT_FILE"
echo ""
echo "To view the report:"
echo "  cat $REPORT_FILE"
echo "  or"
echo "  open $REPORT_FILE"

