# Specialty Procedure Map - Verification Quickstart

## Quick Verification (Automated)

Run the Python verification script for an automated check:

```bash
cd backend/bigquery-to-postgres
python verify_specialty_procedure_map.py
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
   ✓ Correct row count: 64 rows

3. Checking representative procedures...
   ✓ All 64 specialties have exactly 1 representative procedure

4. Checking specialty_id foreign key integrity...
   ✓ No orphan specialty_ids (checked 64 unique IDs)

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

## Manual Verification (SQL)

For detailed SQL-based verification, see: **`SPECIALTY_PROCEDURE_MAP_VERIFICATION.md`**

### Key Checks

1. **Table exists:**
   ```sql
   SELECT COUNT(*) FROM specialty_procedure_map;
   -- Expected: 64
   ```

2. **Each specialty has representative:**
   ```sql
   SELECT COUNT(DISTINCT specialty_id) 
   FROM specialty_procedure_map 
   WHERE is_representative = true;
   -- Expected: 64
   ```

3. **No foreign key violations:**
   ```sql
   SELECT COUNT(*) FROM specialty_procedure_map spm
   LEFT JOIN specialty s ON spm.specialty_id = s.id
   WHERE s.id IS NULL;
   -- Expected: 0
   ```

4. **Indexes exist:**
   ```sql
   SELECT indexname FROM pg_indexes 
   WHERE tablename = 'specialty_procedure_map';
   -- Expected: 4 indexes
   ```

---

## Troubleshooting

### Script fails with "Table not found"

**Deploy the table:**
```bash
cd backend/bigquery-to-postgres
python scripts/setup_schemas.py
```

### Script shows "0 rows"

**Seed the data:**
```bash
cd backend/mario-health-data-pipeline
dbt seed --select specialty_procedure_map
```

### Some checks fail

Review the detailed output and consult `SPECIALTY_PROCEDURE_MAP_VERIFICATION.md` for specific SQL queries to debug the issue.

---

## What Gets Verified

| Check | What It Does | Expected Result |
|-------|-------------|-----------------|
| 1. Table Exists | Confirms table is created in Supabase | ✓ Table accessible |
| 2. Row Count | Counts total rows | 64 rows |
| 3. Representatives | Each specialty has 1 representative | 64 unique specialties |
| 4. Specialty FK | No orphan specialty_ids | 0 orphans |
| 5. Procedure FK | proc_office_visit exists | ✓ Found |
| 6. Visit Types | Only valid visit_type values | 'standard' |
| 7. Functional Query | Test actual usage | ✓ Can retrieve data |

---

## Next Steps After Verification

Once all checks pass:

1. ✅ Use the table in API endpoints for specialty search
2. ✅ Calculate average specialist visit costs
3. ✅ Display representative procedures in UI
4. ✅ Extend with specialty-specific procedures (e.g., EKG for cardiologists)

