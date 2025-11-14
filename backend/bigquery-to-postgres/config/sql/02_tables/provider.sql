-- Table for providers
DROP TABLE IF EXISTS provider CASCADE;
CREATE TABLE IF NOT EXISTS provider (
    id TEXT PRIMARY KEY,
    provider_id TEXT NOT NULL,
    name_prefix TEXT,
    first_name TEXT,
    middle_name TEXT,
    last_name TEXT,
    name_suffix TEXT,
    credential TEXT,
    specialty_id TEXT,
    license_number TEXT,
    license_state_code TEXT,
    specialty_name TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
-- Row-level security (if using Supabase RLS)
ALTER TABLE provider ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON provider
    FOR SELECT USING (true);
