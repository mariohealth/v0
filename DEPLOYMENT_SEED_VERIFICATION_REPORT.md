# Deployment + Seed + Verification Report
## specialty_procedure_map Table

**Date:** December 30, 2024  
**Status:** ⚠️ AWAITING MANUAL SQL EXECUTION

---

## Executive Summary

The `specialty_procedure_map` table schema and seed data (66 rows) are ready for deployment. Due to Supabase access constraints, **manual SQL execution in the Supabase Dashboard is required** before seeding can proceed.

---

## Step 1: Table Deployment ⚠️ MANUAL STEP REQUIRED

### Issue Encountered
- Direct PostgreSQL connection requires `SUPABASE_DB_PASS` which is not in repository `.env` files
- Supabase Python client doesn't support DDL operations
- `setup_schemas.py` requires direct PostgreSQL connection string

### Solution: Manual SQL Execution

**Execute this SQL in Supabase SQL Editor:**
(https://supabase.com/dashboard/project/anvremdouphhucqrxgoq/sql)

```sql
-- Table for mapping specialties to their representative procedures
DROP TABLE IF EXISTS specialty_procedure_map CASCADE;
CREATE TABLE IF NOT EXISTS specialty_procedure_map (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    specialty_id TEXT REFERENCES specialty(id) NOT NULL,
    procedure_id TEXT REFERENCES procedure(id) NOT NULL,
    visit_type TEXT NOT NULL,
    is_representative BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(specialty_id, procedure_id, visit_type)
);

CREATE INDEX idx_specialty_procedure_map_specialty ON specialty_procedure_map(specialty_id);
CREATE INDEX idx_specialty_procedure_map_procedure ON specialty_procedure_map(procedure_id);
CREATE INDEX idx_specialty_procedure_map_representative ON specialty_procedure_map(is_representative) WHERE is_representative = true;

ALTER TABLE specialty_procedure_map ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON specialty_procedure_map FOR SELECT USING (true);
```

**Commands Attempted:**
```bash
# Attempted automated deployment
cd backend/bigquery-to-postgres
python3 scripts/setup_schemas.py  # Failed: No POSTGRES_DB_URL
python3 deploy_table_direct.py     # Failed: No SUPABASE_DB_PASS
python3 deploy_via_sql_api.py      # Output: Manual execution required
```

---

## Step 2: Seed Data Preparation ✅ COMPLETE

### Seed File Updated
**File:** `backend/mario-health-data-pipeline/seeds/specialty_procedure_map.csv`

**Changes Made:**
- Updated from 64 rows to **66 rows** (matching current specialty count in Supabase)
- Added rows for specialty IDs 65 and 66
- All rows map to `proc_office_visit` with `visit_type='standard'` and `is_representative=true`

**Verification:**
```bash
wc -l backend/mario-health-data-pipeline/seeds/specialty_procedure_map.csv
# Result: 67 lines (66 data rows + 1 header)
```

**Sample rows:**
```csv
specialty_id,procedure_id,visit_type,is_representative
1,proc_office_visit,standard,true
2,proc_office_visit,standard,true
...
65,proc_office_visit,standard,true
66,proc_office_visit,standard,true
```

---

## Step 3: Seeding ⚠️ PENDING TABLE CREATION

Once the table is created in Step 1, run:

```bash
cd backend/mario-health-data-pipeline
dbt seed --select specialty_procedure_map
```

**Expected Output:**
```
Running with dbt=1.x.x
Found 1 seed
Completed successfully
Done. PASS=1 WARN=0 ERROR=0 SKIP=0 TOTAL=1
```

---

## Step 4: Verification ⚠️ PENDING DEPLOYMENT

Once seeding completes, run:

```bash
cd backend/bigquery-to-postgres
python3 verify_specialty_procedure_map.py
```

### Expected Verification Results

#### Query 1: Row Count
```sql
SELECT COUNT(*) FROM specialty_procedure_map;
```
**Expected:** 66 rows  
**Status:** ⏳ Pending

#### Query 2: Representative Count
```sql
SELECT COUNT(DISTINCT specialty_id) 
FROM specialty_procedure_map 
WHERE is_representative = true 
  AND visit_type = 'standard';
```
**Expected:** 66 unique specialties  
**Status:** ⏳ Pending

#### Query 3: Missing Specialties
```sql
SELECT s.id, s.name 
FROM specialty s
LEFT JOIN specialty_procedure_map spm ON s.id = spm.specialty_id
WHERE spm.specialty_id IS NULL;
```
**Expected:** 0 rows (all specialties mapped)  
**Status:** ⏳ Pending

#### Query 4: FK Integrity (specialty_id)
```sql
SELECT COUNT(*) FROM specialty_procedure_map spm
LEFT JOIN specialty s ON spm.specialty_id = s.id
WHERE s.id IS NULL;
```
**Expected:** 0 orphans  
**Status:** ⏳ Pending

#### Query 5: FK Integrity (procedure_id)
```sql
SELECT COUNT(*) FROM specialty_procedure_map spm
LEFT JOIN procedure p ON spm.procedure_id = p.id
WHERE p.id IS NULL;
```
**Expected:** 0 orphans  
**Status:** ⏳ Pending

#### Query 6: proc_office_visit Reference
```sql
SELECT COUNT(*) 
FROM specialty_procedure_map 
WHERE procedure_id = 'proc_office_visit';
```
**Expected:** 66 rows (all)  
**Status:** ⏳ Pending

---

## Current Status Summary

| Step | Status | Details |
|------|--------|---------|
| 1. Table Schema Ready | ✅ DONE | SQL file created |
| 2. Seed Data Ready | ✅ DONE | CSV updated to 66 rows |
| 3. Deploy Table | ⚠️ BLOCKED | Requires manual SQL execution |
| 4. Seed Data | ⏳ PENDING | Waiting for table creation |
| 5. Verification | ⏳ PENDING | Waiting for seeding |

---

## Files Created/Modified

### Modified Files
1. `backend/mario-health-data-pipeline/seeds/specialty_procedure_map.csv`
   - Added rows 65 and 66
   - Total: 66 data rows + 1 header

### New Files Created
1. `backend/bigquery-to-postgres/config/sql/02_tables/specialty_procedure_map.sql` ✅
2. `backend/bigquery-to-postgres/config/sql/02_tables/README_SPECIALTY_PROCEDURE_MAP.md` ✅
3. `backend/bigquery-to-postgres/verify_specialty_procedure_map.py` ✅
4. `backend/bigquery-to-postgres/SPECIALTY_PROCEDURE_MAP_VERIFICATION.md` ✅
5. `backend/bigquery-to-postgres/VERIFY_SPECIALTY_MAP_QUICKSTART.md` ✅
6. `backend/bigquery-to-postgres/check_supabase_tables.py` ✅
7. `backend/bigquery-to-postgres/baseline_verification.py` ✅
8. `SPECIALTY_PROCEDURE_MAP_VERIFICATION_REPORT.md` ✅
9. `DEPLOY_SPECIALTY_PROCEDURE_MAP.md` ✅
10. `DEPLOYMENT_SEED_VERIFICATION_REPORT.md` ✅ (this file)

### Configuration Updates
1. `backend/bigquery-to-postgres/config/tables.py`
   - Added `specialty_procedure_map` to TABLES dictionary ✅

---

## Next Actions Required

### Immediate (Manual)
1. **Execute SQL in Supabase Dashboard** (see Step 1)
2. **Verify table creation:**
   ```sql
   SELECT COUNT(*) FROM specialty_procedure_map;
   -- Should return 0 (empty table, ready for seeding)
   ```

### Automated (After Table Exists)
3. **Seed the data:**
   ```bash
   cd backend/mario-health-data-pipeline
   dbt seed --select specialty_procedure_map
   ```

4. **Run verification:**
   ```bash
   cd backend/bigquery-to-postgres
   python3 verify_specialty_procedure_map.py
   ```

5. **Update this report** with final PASS/FAIL results

---

## Workaround for Future Deployments

To enable automated deployments, add to `backend/bigquery-to-postgres/.env`:

```env
POSTGRES_DB_URL=postgresql://postgres.anvremdouphhucqrxgoq:[PASSWORD]@aws-1-us-east-1.pooler.supabase.com:5432/postgres
```

Or use Supabase CLI:
```bash
brew install supabase/tap/supabase
supabase link --project-ref anvremdouphhucqrxgoq
supabase db push
```

---

**Report Status:** PARTIAL COMPLETION  
**Blocker:** Manual SQL execution required  
**Ready for:** Seeding (once table created)  
**Verification:** Pending full deployment

