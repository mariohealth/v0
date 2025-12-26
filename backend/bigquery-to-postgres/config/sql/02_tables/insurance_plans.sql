-- Table for listing US insurance plans
DROP TABLE IF EXISTS insurance_plans CASCADE;
CREATE TABLE IF NOT EXISTS insurance_plans (
    id TEXT PRIMARY KEY,
    name TEXT,
    carrier_id TEXT,
    type TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
-- Row-level security (if using Supabase RLS)
ALTER TABLE insurance_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON insurance_plans
    FOR SELECT USING (true);
