DROP TABLE IF EXISTS codes CASCADE;
CREATE TABLE IF NOT EXISTS codes (
    id TEXT PRIMARY KEY,
    code TEXT,
    code_type TEXT,
    name TEXT,
    description TEXT,
    is_active BOOLEAN,
    category TEXT
    is_packaged BOOLEAN,
    packaging_note TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
-- Row-level security (if using Supabase RLS)
ALTER TABLE codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON codes
    FOR SELECT USING (true);
