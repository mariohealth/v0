# Seed & Verify specialty_procedure_map - Execution Checklist

**Date:** December 30, 2024  
**Prerequisites:** ✅ Table `specialty_procedure_map` created in Supabase

---

## Part 1: Seed Data in Supabase (SQL)

Execute this SQL in **Supabase SQL Editor**:
(https://supabase.com/dashboard/project/anvremdouphhucqrxgoq/sql)

### Idempotent Seed SQL (Run in Supabase)

```sql
-- Seed specialty_procedure_map by selecting all specialties
-- Maps each specialty to proc_office_visit as the representative procedure
-- Uses ON CONFLICT to make this idempotent (safe to run multiple times)

INSERT INTO specialty_procedure_map (specialty_id, procedure_id, visit_type, is_representative)
SELECT 
    s.id,
    'proc_office_visit',
    'standard',
    true
FROM specialty s
WHERE s.id IS NOT NULL
ON CONFLICT (specialty_id, procedure_id, visit_type) 
DO UPDATE SET
    is_representative = EXCLUDED.is_representative,
    created_at = CASE 
        WHEN specialty_procedure_map.created_at IS NULL 
        THEN NOW() 
        ELSE specialty_procedure_map.created_at 
    END;

-- Show count after insert
SELECT 
    COUNT(*) as total_rows,
    COUNT(DISTINCT specialty_id) as unique_specialties,
    COUNT(CASE WHEN is_representative = true THEN 1 END) as representative_count
FROM specialty_procedure_map;
```

**Expected Output:**
```
total_rows: 66
unique_specialties: 66
representative_count: 66
```

---

## Part 2: Verification Queries (Run in Supabase)

Execute these verification queries **one by one** in Supabase SQL Editor:

### ✅ Check 1: Total Row Count

```sql
-- Expected: 66 rows
SELECT COUNT(*) as row_count 
FROM specialty_procedure_map;
```

**Expected Result:** `66`

---

### ✅ Check 2: Representative Procedures Count

```sql
-- Expected: 66 unique specialties with representative=true
SELECT COUNT(DISTINCT specialty_id) as unique_specialties_with_rep
FROM specialty_procedure_map
WHERE is_representative = true 
  AND visit_type = 'standard';
```

**Expected Result:** `66`

---

### ✅ Check 3: Missing Specialties (Should be Empty)

```sql
-- Expected: 0 rows (all specialties should be mapped)
SELECT 
    s.id,
    s.name,
    s.slug
FROM specialty s
LEFT JOIN specialty_procedure_map spm 
    ON s.id = spm.specialty_id 
    AND spm.is_representative = true
WHERE spm.specialty_id IS NULL
ORDER BY s.id;
```

**Expected Result:** `0 rows`

---

### ✅ Check 4: FK Integrity - specialty_id (No Orphans)

```sql
-- Expected: 0 rows (no orphan specialty_ids)
SELECT DISTINCT spm.specialty_id
FROM specialty_procedure_map spm
LEFT JOIN specialty s ON spm.specialty_id = s.id
WHERE s.id IS NULL;
```

**Expected Result:** `0 rows`

---

### ✅ Check 5: FK Integrity - procedure_id (No Orphans)

```sql
-- Expected: 0 rows (no orphan procedure_ids)
SELECT DISTINCT spm.procedure_id
FROM specialty_procedure_map spm
LEFT JOIN procedure p ON spm.procedure_id = p.id
WHERE p.id IS NULL;
```

**Expected Result:** `0 rows`

---

### ✅ Check 6: Verify proc_office_visit References

```sql
-- Expected: 66 rows (all should reference proc_office_visit)
SELECT 
    COUNT(*) as rows_with_office_visit,
    COUNT(DISTINCT specialty_id) as unique_specialties
FROM specialty_procedure_map
WHERE procedure_id = 'proc_office_visit';
```

**Expected Result:**
```
rows_with_office_visit: 66
unique_specialties: 66
```

---

### ✅ Check 7: Verify Unique Constraint

```sql
-- Expected: 0 rows (no duplicates on specialty_id + procedure_id + visit_type)
SELECT 
    specialty_id,
    procedure_id,
    visit_type,
    COUNT(*) as duplicate_count
FROM specialty_procedure_map
GROUP BY specialty_id, procedure_id, visit_type
HAVING COUNT(*) > 1;
```

**Expected Result:** `0 rows`

---

### ✅ Check 8: Sample Data Preview

```sql
-- View first 5 mappings to verify data structure
SELECT 
    spm.id,
    spm.specialty_id,
    s.name as specialty_name,
    s.slug as specialty_slug,
    spm.procedure_id,
    p.name as procedure_name,
    spm.visit_type,
    spm.is_representative
FROM specialty_procedure_map spm
JOIN specialty s ON spm.specialty_id = s.id
JOIN procedure p ON spm.procedure_id = p.id
ORDER BY spm.specialty_id
LIMIT 5;
```

**Expected Result:** 5 rows showing specialties 1, 10, 11, 12, 13 (or similar) mapped to "Office visit"

---

### ✅ Check 9: Verify Indexes Exist

```sql
-- Expected: 4 indexes
SELECT 
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'specialty_procedure_map'
  AND schemaname = 'public'
ORDER BY indexname;
```

**Expected Result:** 4 indexes:
1. `specialty_procedure_map_pkey` (primary key on id)
2. `idx_specialty_procedure_map_procedure` (on procedure_id)
3. `idx_specialty_procedure_map_representative` (on is_representative WHERE true)
4. `idx_specialty_procedure_map_specialty` (on specialty_id)

---

### ✅ Check 10: Verify RLS Policy

```sql
-- Expected: 1 policy for public read access
SELECT
    policyname,
    permissive,
    cmd,
    qual
FROM pg_policies
WHERE tablename = 'specialty_procedure_map'
  AND schemaname = 'public';
```

**Expected Result:** 1 row with `policyname = 'Public read access'` and `cmd = 'SELECT'`

---

## Part 3: Fix dbt Installation for Future Use

### Problem
dbt failing under pipx with Python 3.14 (likely compatibility issue)

### Solution: Reinstall with Python 3.12

Execute these commands in your terminal:

```bash
# Step 1: Uninstall current dbt
pipx uninstall dbt-core
pipx uninstall dbt-postgres
pipx uninstall dbt-bigquery

# Step 2: Verify pipx is using correct Python (should be 3.12)
pipx --version
python3.12 --version

# Step 3: Reinstall dbt-core with Python 3.12
pipx install dbt-core --python python3.12

# Step 4: Install dbt adapters with the same Python version
pipx inject dbt-core dbt-postgres dbt-bigquery --python python3.12

# Step 5: Verify installation
dbt --version

# Expected output:
# Core:
#   - installed: 1.x.x
#   - latest: 1.x.x
# 
# Plugins:
#   - postgres: 1.x.x
#   - bigquery: 1.x.x
```

### Alternative: Install in Virtual Environment (More Reliable)

```bash
# Navigate to data pipeline directory
cd backend/mario-health-data-pipeline

# Create venv with Python 3.12
python3.12 -m venv .venv

# Activate venv
source .venv/bin/activate

# Install dbt
pip install dbt-core dbt-postgres dbt-bigquery

# Verify
dbt --version

# Run seeds (when needed)
dbt seed --select specialty_procedure_map

# Deactivate when done
deactivate
```

### Future Seed Commands (After dbt is Fixed)

```bash
# Option 1: Using pipx (if fixed)
cd backend/mario-health-data-pipeline
dbt seed --select specialty_procedure_map

# Option 2: Using venv (recommended)
cd backend/mario-health-data-pipeline
source .venv/bin/activate
dbt seed --select specialty_procedure_map
deactivate
```

---

## Part 4: Final Verification via Python Script

After SQL seeding completes, optionally run the automated verification:

```bash
cd backend/bigquery-to-postgres
python3 verify_specialty_procedure_map.py
```

**Expected Output:**
```
======================================================================
SPECIALTY_PROCEDURE_MAP VERIFICATION REPORT
======================================================================

✓ Connected to Supabase

1. Checking if table exists...
   ✓ Table exists and is accessible

2. Checking row count...
   ✓ Correct row count: 66 rows

3. Checking representative procedures...
   ✓ All 66 specialties have exactly 1 representative procedure

4. Checking specialty_id foreign key integrity...
   ✓ No orphan specialty_ids (checked 66 unique IDs)

5. Checking procedure_id foreign key integrity...
   ✓ proc_office_visit exists and is mapped

6. Checking visit_type values...
   ✓ All visit_types are 'standard' (as expected for initial seed)

7. Testing functional query (Cardiologist)...
   ✓ Found representative procedure for Cardiologist:
     - procedure_id: proc_office_visit
     - visit_type: standard

======================================================================
VERIFICATION SUMMARY
======================================================================
Checks Passed: 7
Checks Failed: 0

✓ ALL CHECKS PASSED - Table is ready for use!
```

---

## Execution Checklist

### Phase 1: Seed Data ✅
- [ ] Execute idempotent seed SQL in Supabase
- [ ] Verify output shows 66 rows inserted

### Phase 2: Verification (Run All 10 Checks) ✅
- [ ] Check 1: Row count = 66
- [ ] Check 2: Representative count = 66
- [ ] Check 3: Missing specialties = 0
- [ ] Check 4: Orphan specialty_ids = 0
- [ ] Check 5: Orphan procedure_ids = 0
- [ ] Check 6: proc_office_visit references = 66
- [ ] Check 7: No duplicate rows = 0
- [ ] Check 8: Sample data looks correct
- [ ] Check 9: All 4 indexes exist
- [ ] Check 10: RLS policy exists

### Phase 3: Fix dbt (For Future) ✅
- [ ] Uninstall current dbt
- [ ] Reinstall with Python 3.12
- [ ] Verify `dbt --version` works

### Phase 4: Optional Python Verification ✅
- [ ] Run `verify_specialty_procedure_map.py`
- [ ] Confirm all 7 checks pass

---

## Success Criteria

✅ All checks pass  
✅ 66 rows seeded  
✅ No FK violations  
✅ No orphan records  
✅ All specialties have representative mapping  
✅ dbt installation fixed for future use

---

**Status After Completion:** READY FOR API IMPLEMENTATION  
**Next Step:** Build specialty search API endpoints

