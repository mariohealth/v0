DROP TABLE IF EXISTS procedure_pricing;
CREATE TABLE IF NOT EXISTS procedure_pricing (
    id TEXT PRIMARY KEY,
    procedure_id TEXT REFERENCES procedure(id),
    org_id TEXT,
    provider_id TEXT,
    provider_name TEXT,
    provider_location_id TEXT,
    carrier_id TEXT,
    carrier_name TEXT,
    price NUMERIC,
    professional_rate_min NUMERIC,
    institutional_rate_min NUMERIC,
    total_rate_min NUMERIC,
    updated_at TIMESTAMP
);

-- Row-level security (if using Supabase RLS)
ALTER TABLE procedure_pricing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON procedure_pricing
    FOR SELECT USING (true);
