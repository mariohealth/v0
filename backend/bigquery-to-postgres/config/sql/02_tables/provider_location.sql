-- Table for provider locations
DROP TABLE IF EXISTS provider_location CASCADE;
CREATE TABLE IF NOT EXISTS provider_location (
    id TEXT PRIMARY KEY,
    provider_id TEXT NOT NULL,
    provider_name TEXT NOT NULL,
    org_id TEXT,
    org_name TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT NOT NULL,
    latitude NUMERIC NOT NULL,
    longitude NUMERIC NOT NULL,
    location GEOGRAPHY(POINT, 4326),
    phone TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
-- Row-level security (if using Supabase RLS)
ALTER TABLE provider_location ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON provider_location
    FOR SELECT USING (true);