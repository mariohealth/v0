DROP TABLE IF EXISTS bundle_groups CASCADE;
CREATE TABLE IF NOT EXISTS bundle_groups (
    id TEXT PRIMARY KEY,
    bundle_id TEXT,
    name TEXT,
    selection_type TEXT,
    display_order INTEGER,
    is_required BOOLEAN,
    min_selections INTEGER,
    max_selections INTEGER,
    phase TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
-- Row-level security (if using Supabase RLS)
ALTER TABLE bundle_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON bundle_groups
    FOR SELECT USING (true);
