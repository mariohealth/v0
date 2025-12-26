-- Table for listing all aliases of US hospitals
DROP TABLE IF EXISTS hospital_aliases CASCADE;
CREATE TABLE IF NOT EXISTS hospital_aliases (
    hospital_id TEXT,
    alias TEXT,
    alias_type TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
-- Row-level security (if using Supabase RLS)
ALTER TABLE hospital_aliases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON hospital_aliases
    FOR SELECT USING (true);