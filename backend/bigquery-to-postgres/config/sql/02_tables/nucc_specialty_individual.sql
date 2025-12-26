-- Table for specialty for individuals such as providers, these come from NUCC and aren't consumer friendly
DROP TABLE IF EXISTS nucc_specialty_individual CASCADE;
CREATE TABLE IF NOT EXISTS nucc_specialty_individual (
    id TEXT PRIMARY KEY,
    grouping TEXT,
    display_name TEXT,
    definition TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
-- Row-level security (if using Supabase RLS)
ALTER TABLE nucc_specialty_individual ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON nucc_specialty_individual
    FOR SELECT USING (true);
