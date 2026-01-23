DROP TABLE IF EXISTS drug_price_sources CASCADE;
CREATE TABLE IF NOT EXISTS drug_price_sources (
    source_id TEXT PRIMARY KEY,
    source_name TEXT,
    source_type TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
-- Row-level security (if using Supabase RLS)
ALTER TABLE drug_price_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON drug_price_sources
    FOR SELECT USING (true);
