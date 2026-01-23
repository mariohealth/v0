DROP TABLE IF EXISTS drugs CASCADE;
CREATE TABLE IF NOT EXISTS drugs (
    rxnorm_cui TEXT PRIMARY KEY,
    drug_name TEXT,
    drug_type TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
-- Row-level security (if using Supabase RLS)
ALTER TABLE drugs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON drugs
    FOR SELECT USING (true);
