DROP TABLE IF EXISTS pharmacies CASCADE;
CREATE TABLE IF NOT EXISTS pharmacies (
    pharmacy_id TEXT PRIMARY KEY,
    pharmacy_name TEXT,
    pharmacy_type TEXT,
    accepts_insurance TEXT,
    delivery_only TEXT,
    national TEXT,
    region TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
-- Row-level security (if using Supabase RLS)
ALTER TABLE pharmacies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON pharmacies
    FOR SELECT USING (true);
