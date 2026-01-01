DROP TABLE IF EXISTS billing_code_nucc_specialty_map CASCADE;
CREATE TABLE IF NOT EXISTS billing_code_nucc_specialty_map (
    billing_code_type TEXT,
    billing_code TEXT,
    taxonomy_id TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
-- Row-level security (if using Supabase RLS)
ALTER TABLE billing_code_nucc_specialty_map ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON billing_code_nucc_specialty_map
    FOR SELECT USING (true);
