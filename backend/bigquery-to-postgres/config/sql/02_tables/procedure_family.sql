DROP TABLE IF EXISTS procedure_family CASCADE;
CREATE TABLE IF NOT EXISTS procedure_family (
    id TEXT PRIMARY KEY,
    category_id TEXT NOT NULL,
    name TEXT,
    slug TEXT,
    description TEXT
);

-- Row-level security (if using Supabase RLS)
ALTER TABLE procedure_family ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON procedure_family
    FOR SELECT USING (true);
