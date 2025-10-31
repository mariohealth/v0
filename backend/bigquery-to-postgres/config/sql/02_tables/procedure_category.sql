DROP TABLE IF EXISTS procedure_category CASCADE;
CREATE TABLE IF NOT EXISTS procedure_category (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    emoji TEXT UNIQUE NOT NULL,
    description TEXT
);

-- Row-level security (if using Supabase RLS)
ALTER TABLE procedure_category ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON procedure_category
    FOR SELECT USING (true);
