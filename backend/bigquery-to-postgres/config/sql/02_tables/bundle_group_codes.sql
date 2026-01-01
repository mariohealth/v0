DROP TABLE IF EXISTS bundle_group_codes CASCADE;
CREATE TABLE IF NOT EXISTS bundle_group_codes (
    id TEXT PRIMARY KEY,
    bundle_group_id TEXT,
    code_id TEXT,
    frequency TEXT,
    is_default BOOLEAN,
    display_order INTEGER,
    why_billed TEXT,
    is_surprise_charge BOOLEAN,
    created_at TIMESTAMP DEFAULT NOW()
);
-- Row-level security (if using Supabase RLS)
ALTER TABLE bundle_group_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON bundle_group_codes
    FOR SELECT USING (true);
