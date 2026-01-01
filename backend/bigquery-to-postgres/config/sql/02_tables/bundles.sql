DROP TABLE IF EXISTS bundles CASCADE;
CREATE TABLE IF NOT EXISTS bundles (
    id TEXT PRIMARY KEY,
    name TEXT,
    slug TEXT,
    description TEXT,
    primary_cpt_code TEXT,
    category TEXT,
    global_period_days INTEGER,
    is_active BOOLEAN,
    typical_setting TEXT
    estimated_duration_hours INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);
-- Row-level security (if using Supabase RLS)
ALTER TABLE bundles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON bundles
    FOR SELECT USING (true);
