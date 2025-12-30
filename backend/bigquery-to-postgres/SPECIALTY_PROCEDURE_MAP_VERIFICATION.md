# Specialty Procedure Map - End-to-End Verification

This document contains SQL queries to verify the `specialty_procedure_map` table implementation in Supabase.

## Prerequisites

Before running these verification queries:

```bash
# 1. Create the table
cd backend/bigquery-to-postgres
python scripts/setup_schemas.py

# 2. Seed the data
cd ../mario-health-data-pipeline
dbt seed --select specialty_procedure_map
```

---

## Verification Queries

### 1. Confirm Table Exists in Supabase

```sql
-- Check if table exists and view its structure
SELECT 
    table_name,
    table_schema,
    table_type
FROM information_schema.tables
WHERE table_name = 'specialty_procedure_map'
  AND table_schema = 'public';

-- Expected Result: 1 row showing the table exists
```

**Alternative detailed view:**
```sql
-- View all columns and their types
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'specialty_procedure_map'
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Expected Result: 6 columns (id, specialty_id, procedure_id, visit_type, is_representative, created_at)
```

---

### 2. Confirm dbt Seed Populated Rows

```sql
-- Count total rows
SELECT COUNT(*) as total_rows
FROM specialty_procedure_map;

-- Expected Result: 64 rows (one for each specialty)
```

**Detailed row inspection:**
```sql
-- View sample rows
SELECT 
    id,
    specialty_id,
    procedure_id,
    visit_type,
    is_representative,
    created_at
FROM specialty_procedure_map
ORDER BY specialty_id
LIMIT 10;

-- Expected Result: Shows first 10 specialties mapped to proc_office_visit
```

---

### 3. Confirm Every Specialty Has Exactly One Representative Row

```sql
-- Check that each specialty has exactly one is_representative=true row
SELECT 
    specialty_id,
    COUNT(*) as representative_count
FROM specialty_procedure_map
WHERE is_representative = true
  AND visit_type = 'standard'
GROUP BY specialty_id
HAVING COUNT(*) != 1;

-- Expected Result: 0 rows (all specialties should have exactly 1 representative)
```

**Verify all specialties are covered:**
```sql
-- Count specialties with representative procedures
SELECT 
    COUNT(DISTINCT specialty_id) as specialties_with_rep
FROM specialty_procedure_map
WHERE is_representative = true;

-- Expected Result: 64 (should match total specialty count)
```

**Cross-check with specialty table:**
```sql
-- Find any specialties missing from the map
SELECT 
    s.id,
    s.name,
    s.slug
FROM specialty s
LEFT JOIN specialty_procedure_map spm 
    ON s.id = spm.specialty_id 
    AND spm.is_representative = true
WHERE spm.id IS NULL;

-- Expected Result: 0 rows (all specialties should be mapped)
```

---

### 4. Confirm Foreign Key Integrity

**Check specialty_id foreign key:**
```sql
-- Find any orphan specialty_ids
SELECT DISTINCT spm.specialty_id
FROM specialty_procedure_map spm
LEFT JOIN specialty s ON spm.specialty_id = s.id
WHERE s.id IS NULL;

-- Expected Result: 0 rows (no orphan specialty_ids)
```

**Check procedure_id foreign key:**
```sql
-- Find any orphan procedure_ids
SELECT DISTINCT spm.procedure_id
FROM specialty_procedure_map spm
LEFT JOIN procedure p ON spm.procedure_id = p.id
WHERE p.id IS NULL;

-- Expected Result: 0 rows (no orphan procedure_ids)
```

**Verify proc_office_visit exists:**
```sql
-- Confirm the mapped procedure exists
SELECT 
    id,
    name,
    slug
FROM procedure
WHERE id = 'proc_office_visit';

-- Expected Result: 1 row with name "Office visit"
```

---

### 5. Confirm Indexes Exist

```sql
-- List all indexes on the table
SELECT
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'specialty_procedure_map'
  AND schemaname = 'public';

-- Expected Result: 4 indexes
-- 1. specialty_procedure_map_pkey (primary key on id)
-- 2. idx_specialty_procedure_map_specialty (on specialty_id)
-- 3. idx_specialty_procedure_map_procedure (on procedure_id)
-- 4. idx_specialty_procedure_map_representative (on is_representative where true)
```

**Verify index usage:**
```sql
-- Check that unique constraint is working
SELECT 
    specialty_id,
    procedure_id,
    visit_type,
    COUNT(*) as duplicate_count
FROM specialty_procedure_map
GROUP BY specialty_id, procedure_id, visit_type
HAVING COUNT(*) > 1;

-- Expected Result: 0 rows (unique constraint should prevent duplicates)
```

---

## Additional Verification Queries

### Row-Level Security (RLS) Check

```sql
-- Verify RLS is enabled
SELECT
    tablename,
    rowsecurity
FROM pg_tables
WHERE tablename = 'specialty_procedure_map'
  AND schemaname = 'public';

-- Expected Result: rowsecurity = true
```

**Check RLS policies:**
```sql
-- List policies on the table
SELECT
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE tablename = 'specialty_procedure_map'
  AND schemaname = 'public';

-- Expected Result: 1 policy "Public read access" for SELECT
```

---

### Data Quality Checks

**Visit type validation:**
```sql
-- Confirm only valid visit_types are used
SELECT DISTINCT visit_type
FROM specialty_procedure_map;

-- Expected Result: 'standard' only (for initial seed)
```

**Check for NULL values:**
```sql
-- Ensure no required fields are NULL
SELECT 
    COUNT(*) as rows_with_nulls
FROM specialty_procedure_map
WHERE specialty_id IS NULL
   OR procedure_id IS NULL
   OR visit_type IS NULL;

-- Expected Result: 0 rows
```

---

## Sample Functional Query

**Get representative procedure for a specialty:**
```sql
-- Example: Get the representative procedure for "Cardiologist" (id=4)
SELECT 
    s.id as specialty_id,
    s.name as specialty_name,
    s.slug as specialty_slug,
    p.id as procedure_id,
    p.name as procedure_name,
    p.slug as procedure_slug,
    spm.visit_type,
    spm.is_representative
FROM specialty_procedure_map spm
JOIN specialty s ON spm.specialty_id = s.id
JOIN procedure p ON spm.procedure_id = p.id
WHERE s.slug = 'cardiologist'
  AND spm.is_representative = true;

-- Expected Result: 1 row showing cardiologist mapped to office visit
```

---

## Verification Summary Checklist

Run each query above and confirm:

- [ ] Table exists in public schema
- [ ] 64 rows populated (one per specialty)
- [ ] Each specialty has exactly 1 representative=true row
- [ ] No orphan specialty_id values
- [ ] No orphan procedure_id values
- [ ] 4 indexes exist (primary + 3 custom)
- [ ] Unique constraint working (no duplicates)
- [ ] RLS enabled with public read policy
- [ ] All visit_type values are valid
- [ ] No NULL values in required fields

---

## Troubleshooting

### If table doesn't exist:
```bash
cd backend/bigquery-to-postgres
python scripts/setup_schemas.py
```

### If rows are empty:
```bash
cd backend/mario-health-data-pipeline
dbt seed --select specialty_procedure_map
```

### If foreign key violations:
```sql
-- Check if specialty table is populated
SELECT COUNT(*) FROM specialty;
-- Should return 64

-- Check if procedure table has office_visit
SELECT * FROM procedure WHERE id = 'proc_office_visit';
-- Should return 1 row
```

### If indexes are missing:
```sql
-- Manually create indexes
CREATE INDEX idx_specialty_procedure_map_specialty ON specialty_procedure_map(specialty_id);
CREATE INDEX idx_specialty_procedure_map_procedure ON specialty_procedure_map(procedure_id);
CREATE INDEX idx_specialty_procedure_map_representative ON specialty_procedure_map(is_representative) WHERE is_representative = true;
```

---

## Next Steps After Verification

Once all checks pass, the table is ready for use in:
1. Specialty search API endpoints
2. Specialist pricing calculations
3. Representative procedure lookups
4. Average cost queries by specialty

