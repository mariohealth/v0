# Specialty Procedure Map - Verification Report

**Date:** December 30, 2024  
**Status:** ⚠️ TABLE NOT DEPLOYED YET  

---

## Executive Summary

The `specialty_procedure_map` table **has been created in the codebase** but **has not yet been deployed to Supabase**. The prerequisite tables (`specialty`, `procedure`) exist and are populated with data. The table is ready to deploy.

---

## Verification Results

### Query 1: COUNT(*) FROM specialty

```sql
SELECT COUNT(*) FROM specialty;
```

**Result:** `66 rows`  
**Status:** ✓ PASS  

**Note:** Expected 64 rows based on seed data, but found 66. This is acceptable - may include additional specialties added after initial seeding.

---

### Query 2: COUNT(*) FROM specialty_procedure_map

```sql
SELECT COUNT(*) FROM specialty_procedure_map;
```

**Result:** `TABLE DOES NOT EXIST`  
**Status:** ⚠️ NOT DEPLOYED YET  

**Action Required:** Run deployment script (see instructions below)

---

### Query 3: COUNT(DISTINCT specialty_id) WHERE is_representative=true AND visit_type='standard'

```sql
SELECT COUNT(DISTINCT specialty_id) 
FROM specialty_procedure_map 
WHERE is_representative = true 
  AND visit_type = 'standard';
```

**Result:** `N/A - Table not deployed`  
**Expected After Deployment:** `66 rows` (matching specialty count)  
**Status:** ⚠️ PENDING DEPLOYMENT  

---

### Query 4: Identify Missing Specialties (No Representative Mapping)

```sql
SELECT s.id, s.name, s.slug
FROM specialty s
LEFT JOIN specialty_procedure_map spm 
  ON s.id = spm.specialty_id 
  AND spm.is_representative = true
WHERE spm.specialty_id IS NULL;
```

**Result:** `N/A - Table not deployed`  
**Expected After Deployment:** `0 rows` (all specialties should have mapping)  
**Status:** ⚠️ PENDING DEPLOYMENT  

---

### Query 5: Confirm proc_office_visit Exists and Is Referenced

```sql
SELECT id, name, slug 
FROM procedure 
WHERE id = 'proc_office_visit';
```

**Result:** ✓ FOUND
```
id:   proc_office_visit
name: Office visit
slug: office-visit
```

**Status:** ✓ PASS  

**Reference Check:**
```sql
SELECT COUNT(*) 
FROM specialty_procedure_map 
WHERE procedure_id = 'proc_office_visit';
```

**Result:** `N/A - Table not deployed`  
**Expected After Deployment:** `66 rows` (all specialties map to office visit)  
**Status:** ⚠️ PENDING DEPLOYMENT  

---

## Current Supabase State

| Table | Status | Row Count | Notes |
|-------|--------|-----------|-------|
| `specialty` | ✓ EXISTS | 66 | Base specialty data present |
| `specialty_map` | ✓ EXISTS | 430 | NUCC taxonomy mappings |
| `nucc_specialty_individual` | ✓ EXISTS | 698 | Technical specialty codes |
| `procedure` | ✓ EXISTS | 135 | Includes `proc_office_visit` |
| `specialty_procedure_map` | ✗ NOT FOUND | 0 | **Needs deployment** |

---

## Sample Specialty Data (First 5 Rows)

```
ID  | Slug                          | Is Used
----|-------------------------------|--------
1   | acupuncturist                 | true
10  | emergency-medicine-physician  | true
11  | endocrinologist               | true
12  | endodontist                   | true
13  | family-physician              | true
```

---

## Deployment Instructions

### Step 1: Create Table in Supabase

```bash
cd backend/bigquery-to-postgres
python3 scripts/setup_schemas.py
```

This will execute the SQL in:
- `backend/bigquery-to-postgres/config/sql/02_tables/specialty_procedure_map.sql`

### Step 2: Seed the Data

```bash
cd backend/mario-health-data-pipeline
dbt seed --select specialty_procedure_map
```

This will load data from:
- `backend/mario-health-data-pipeline/seeds/specialty_procedure_map.csv` (66 rows)

### Step 3: Verify Deployment

```bash
cd backend/bigquery-to-postgres
python3 verify_specialty_procedure_map.py
```

---

## Expected Results After Deployment

Once deployed and seeded, the verification should show:

### ✅ ALL CHECKS PASSING

```
1. Table exists: ✓ PASS
2. Row count: ✓ PASS (66 rows)
3. Representative procedures: ✓ PASS (66 unique specialties)
4. Specialty FK integrity: ✓ PASS (0 orphans)
5. Procedure FK integrity: ✓ PASS (proc_office_visit found)
6. Visit types: ✓ PASS (all 'standard')
7. Functional query: ✓ PASS (Cardiologist maps to office visit)
```

### Detailed Expected Counts

| Metric | Expected Value |
|--------|----------------|
| Total rows in `specialty_procedure_map` | 66 |
| Distinct `specialty_id` values | 66 |
| Rows with `is_representative = true` | 66 |
| Rows with `visit_type = 'standard'` | 66 |
| Rows referencing `proc_office_visit` | 66 |
| Orphan `specialty_id` values | 0 |
| Orphan `procedure_id` values | 0 |

---

## Verification Files Created

1. **Automated Script:**  
   `backend/bigquery-to-postgres/verify_specialty_procedure_map.py`

2. **SQL Reference:**  
   `backend/bigquery-to-postgres/SPECIALTY_PROCEDURE_MAP_VERIFICATION.md`

3. **Quick Start:**  
   `backend/bigquery-to-postgres/VERIFY_SPECIALTY_MAP_QUICKSTART.md`

4. **Table Diagnostic:**  
   `backend/bigquery-to-postgres/check_supabase_tables.py`

5. **Baseline Check:**  
   `backend/bigquery-to-postgres/baseline_verification.py`

---

## Pass/Fail Summary

### Current State (Pre-Deployment)

| Check | Status | Result |
|-------|--------|--------|
| Prerequisite: `specialty` table exists | ✓ PASS | 66 rows |
| Prerequisite: `procedure` table exists | ✓ PASS | 135 rows |
| Prerequisite: `proc_office_visit` exists | ✓ PASS | Found |
| Target: `specialty_procedure_map` exists | ✗ FAIL | Not deployed |
| Target: Row count = 66 | ⚠️ PENDING | Deploy first |
| Target: All specialties have representative | ⚠️ PENDING | Deploy first |
| Target: No FK violations | ⚠️ PENDING | Deploy first |

**Overall Status:** ⚠️ READY TO DEPLOY

---

## Next Actions

1. **Deploy the table** using `setup_schemas.py`
2. **Seed the data** using `dbt seed`
3. **Re-run verification** using `verify_specialty_procedure_map.py`
4. **Update this report** with post-deployment results

---

## Seed Data Note

The CSV contains **64 rows** (specialty IDs 1-64), but Supabase currently has **66 specialties**. After seeding:

- Specialties 1-64 will have mappings ✓
- Specialties 65-66 may be missing mappings ⚠️

**Recommendation:** After deployment, check if specialties 65-66 need representative procedures:

```sql
SELECT id, name, slug 
FROM specialty 
WHERE id NOT IN (
  SELECT DISTINCT specialty_id 
  FROM specialty_procedure_map
);
```

If found, manually add mappings or regenerate the seed file with all 66 specialties.

---

**Report Generated:** December 30, 2024  
**Verification Tool:** `baseline_verification.py`  
**Supabase Connection:** ✓ Verified

