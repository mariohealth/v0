# Mario Health Data Verification Workflow

**Last Updated:** 2025-11-11

---

## Purpose

Track, verify, and document the health of procedure, provider, and pricing data in Supabase.

---

## Scripts

### Procedure Verification

- `backend/scripts/verify_procedure_coverage.sh` (Bash version)
  - Checks MRI/CT/etc. coverage by family
  - Requires: `SUPABASE_DB_PASS` environment variable
  - Outputs to: `backend/VERIFICATION_PROCEDURE_COVERAGE.md`

- `backend/scripts/verify_procedure_coverage.py` (Python version)
  - Same functionality as bash version
  - Requires: `psycopg2-binary` package
  - Outputs to: `backend/VERIFICATION_PROCEDURE_COVERAGE.md`

- `backend/scripts/verify_procedure_coverage_supabase.py` (Supabase Client version - Recommended)
  - Uses Supabase Python client (no direct DB connection needed)
  - Requires: `supabase-py` package
  - Reads credentials from: `backend/mario-health-api/.env`
  - Outputs to: `backend/VERIFICATION_PROCEDURE_COVERAGE.md`

### Provider Verification

- `backend/scripts/verify_provider_data.py` (Supabase Client version)
  - Checks provider completeness, state coverage, and linkage to pricing
  - Requires: `supabase-py` package
  - Reads credentials from: `backend/mario-health-api/.env`
  - Outputs to: `backend/diagnostics/provider_data_report_{timestamp}.md`

- `backend/scripts/verify_provider_data_v2.py` (Enhanced version)
  - Same as above with additional join field analysis
  - Shows both composite `id` and numeric `provider_id` join results
  - Outputs to: `backend/diagnostics/provider_data_report_{timestamp}.md`

### Full Data Verification

- `backend/scripts/full_data_verification.py` (Comprehensive verification)
  - Runs complete procedure and provider verification
  - Includes RPC schema checks and code references
  - Outputs to: `backend/diagnostics/procedure_coverage_report_{timestamp}.md`

### API Endpoint Verification

- `backend/scripts/verify_api_endpoints.py` (API testing)
  - Tests all key API endpoints
  - Requires: Backend running on `http://localhost:8000`
  - Outputs to: `backend/diagnostics/api_endpoint_verification_{timestamp}.md`

---

## When to Run

| Scenario | Action |
|----------|--------|
| After seeding new data | Run procedure and provider verification scripts |
| Before a release | Re-run diagnostics to confirm coverage thresholds |
| If API shows 0 results | Recheck `procedure_pricing` and `provider_location` linkages |
| When MRI/CT data missing | Run procedure verification to identify gaps |
| After fixing orphan records | Re-run provider verification to confirm fixes |

---

## Expected Coverage Thresholds

| Data Type | Minimum Healthy Coverage | Current Status |
|-----------|--------------------------|----------------|
| Procedures | ≥ 80% priced | ~20% (101/126 procedures missing pricing) |
| Providers | ≥ 70% with valid coordinates | 100% (all providers have coordinates) |
| MRI/CT Categories | ≥ 100% once seeding complete | 0% (all MRI procedures missing pricing) |
| Provider-Pricing Linkage | ≥ 50% providers linked | 0.3% (3/1000 providers linked) |

---

## Quick Commands

### Procedure Verification

```bash
# Using Supabase client (recommended - no DB password needed)
cd backend/scripts
python3 verify_procedure_coverage_supabase.py

# Using direct database connection (requires SUPABASE_DB_PASS)
export SUPABASE_DB_PASS=your_password
./verify_procedure_coverage.sh
```

### Provider Verification

```bash
# Using Supabase client (recommended)
cd backend/scripts
python3 verify_provider_data_v2.py
```

### Full Verification

```bash
# Comprehensive verification (procedures + providers + RPC checks)
cd backend/scripts
python3 full_data_verification.py
```

### API Endpoint Testing

```bash
# Start backend first
cd backend/mario-health-api
python3 -m uvicorn app.main:app --reload

# In another terminal, run API verification
cd backend/scripts
python3 verify_api_endpoints.py
```

---

## Known Issues

### Critical Issues

1. **MRI Procedures Missing Pricing**
   - All 5 MRI procedures have zero pricing data
   - Procedures: `brain-mri`, `arm-joint-mri`, `leg-joint-mri`, `lower-spinal-canal-mri`, `upper-spinal-canal-mri`
   - **Action**: Seed pricing data for MRI procedures

2. **Orphan Pricing Records**
   - 985 pricing records reference providers that don't exist in `provider_location`
   - **Action**: Fix provider_id mismatches or add missing provider records

3. **Low Provider-Pricing Linkage**
   - Only 0.3% of providers (3/1000) have pricing data linked
   - **Action**: Increase pricing coverage and fix orphan records

### Schema Notes

1. **Join Field Mismatch**
   - `provider_location` uses composite `id` (e.g., "sf_001_1851457980") and numeric `provider_id` (e.g., 1851457980)
   - `procedure_pricing` uses numeric `provider_id`
   - **Correct join**: `pp.provider_id = pl.provider_id` (numeric), NOT `pp.provider_id = pl.id` (composite)

2. **Field Names**
   - `provider_location` uses `provider_name` field (not `name`)
   - Always check both fields when querying provider names

---

## Report Locations

All verification reports are saved to:

- `backend/VERIFICATION_PROCEDURE_COVERAGE.md` - Procedure coverage report
- `backend/diagnostics/procedure_coverage_report_{timestamp}.md` - Full procedure diagnostics
- `backend/diagnostics/provider_data_report_{timestamp}.md` - Provider diagnostics
- `backend/diagnostics/api_endpoint_verification_{timestamp}.md` - API endpoint tests

---

## Troubleshooting

### "SUPABASE_DB_PASS not set"
- **Solution**: Use Supabase client version scripts (no DB password needed)
- Or set: `export SUPABASE_DB_PASS=your_password`

### "Connection refused" or "Request timeout"
- **Solution**: Backend not running. Start with: `cd backend/mario-health-api && python3 -m uvicorn app.main:app --reload`

### "supabase-py not installed"
- **Solution**: `pip install supabase`

### "psycopg2 not installed"
- **Solution**: `pip install psycopg2-binary`
- Or use Supabase client version scripts instead

---

## Next Steps

1. **Seed MRI Pricing Data**: Add pricing data for all 5 MRI procedures
2. **Fix Orphan Records**: Resolve 985 orphan pricing records
3. **Increase Coverage**: Seed pricing data for more procedures and providers
4. **Verify Joins**: Ensure all queries use correct join fields (`provider_id` not `id`)

