-- Table for listing the hospital systems
DROP TABLE IF EXISTS hospital_systems CASCADE;
CREATE TABLE IF NOT EXISTS hospital_systems (
    system_id TEXT PRIMARY KEY,
    system_name TEXT,
    headquarters_city TEXT,
    headquarters_state TEXT,
    system_type TEXT,
    total_hospitals TEXT,
    coverage_area TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
-- Row-level security (if using Supabase RLS)
ALTER TABLE hospital_systems ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON hospital_systems
    FOR SELECT USING (true);
