-- Table for listing US insurance carriers
DROP TABLE IF EXISTS insurance_carriers CASCADE;
CREATE TABLE IF NOT EXISTS insurance_carriers (
    id TEXT PRIMARY KEY,
    name TEXT,
    is_used BOOLEAN,
    created_at TIMESTAMP DEFAULT NOW()
);
-- Row-level security (if using Supabase RLS)
ALTER TABLE insurance_carriers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON insurance_carriers
    FOR SELECT USING (true);
