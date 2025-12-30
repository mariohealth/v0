# Deploy specialty_procedure_map Table - Step by Step

## Step 1: Create Table in Supabase (Manual)

The table SQL needs to be executed in the **Supabase SQL Editor**:

1. Go to: https://supabase.com/dashboard/project/anvremdouphhucqrxgoq/sql
2. Click "New Query"
3. Paste the following SQL:

```sql
-- Table for mapping specialties to their representative procedures
-- Used to determine "typical" visit costs for each specialty
DROP TABLE IF EXISTS specialty_procedure_map CASCADE;
CREATE TABLE IF NOT EXISTS specialty_procedure_map (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    specialty_id TEXT REFERENCES specialty(id) NOT NULL,
    procedure_id TEXT REFERENCES procedure(id) NOT NULL,
    visit_type TEXT NOT NULL, -- 'standard', 'extended', 'complex'
    is_representative BOOLEAN DEFAULT false, -- Mark the "typical" visit
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(specialty_id, procedure_id, visit_type)
);

-- Indexes for performance
CREATE INDEX idx_specialty_procedure_map_specialty ON specialty_procedure_map(specialty_id);
CREATE INDEX idx_specialty_procedure_map_procedure ON specialty_procedure_map(procedure_id);
CREATE INDEX idx_specialty_procedure_map_representative ON specialty_procedure_map(is_representative) WHERE is_representative = true;

-- Row-level security (if using Supabase RLS)
ALTER TABLE specialty_procedure_map ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON specialty_procedure_map
    FOR SELECT USING (true);
```

4. Click "Run" or press Cmd+Enter

## Step 2: Seed the Data

After the table is created, seed it with data:

```bash
cd backend/mario-health-data-pipeline
dbt seed --select specialty_procedure_map
```

## Step 3: Verify Deployment

Run the verification script:

```bash
cd backend/bigquery-to-postgres
python3 verify_specialty_procedure_map.py
```

## Expected Results

- ✓ Table exists
- ✓ 66 rows seeded
- ✓ All specialties have representative procedures
- ✓ No FK violations
- ✓ All indexes created

## Alternative: Use Supabase Dashboard

If the SQL Editor is not accessible:

1. Go to **Table Editor** in Supabase
2. Click **New Table**
3. Name: `specialty_procedure_map`
4. Add columns manually (see schema above)
5. Add indexes and policies via SQL Editor after table creation

