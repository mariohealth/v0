-- Table for specialty for individuals such as providers
DROP TABLE IF EXISTS specialty_individual CASCADE;
CREATE TABLE IF NOT EXISTS specialty_individual (
    id TEXT PRIMARY KEY,
    grouping TEXT,
    display_name TEXT,
    definition TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
-- Row-level security (if using Supabase RLS)
ALTER TABLE specialty_individual ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON specialty_individual
    FOR SELECT USING (true);
