-- Table for listing US hospitals
DROP TABLE IF EXISTS hospitals CASCADE;
CREATE TABLE IF NOT EXISTS hospitals (
    hospital_id TEXT PRIMARY KEY,
    hospital_name TEXT,
    system_id TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    latitude NUMERIC,
    longitude NUMERIC,
    phone TEXT,
    hospital_type TEXT,
    operational_status TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
-- Row-level security (if using Supabase RLS)
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON hospitals
    FOR SELECT USING (true);