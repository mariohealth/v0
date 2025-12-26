-- Table for consumer friendly / user facing specialties
DROP TABLE IF EXISTS specialty_map CASCADE;
CREATE TABLE IF NOT EXISTS specialty_map (
    taxonomy_id TEXT,
    specialty_id TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
-- Row-level security (if using Supabase RLS)
ALTER TABLE specialty_map ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON specialty_map
    FOR SELECT USING (true);
