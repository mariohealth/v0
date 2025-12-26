-- Table for consumer friendly / user facing specialties
DROP TABLE IF EXISTS specialty CASCADE;
CREATE TABLE IF NOT EXISTS specialty (
    id TEXT PRIMARY KEY,
    name TEXT,
    slug TEXT,
    is_used BOOLEAN,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
-- Row-level security (if using Supabase RLS)
ALTER TABLE specialty ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON specialty
    FOR SELECT USING (true);
