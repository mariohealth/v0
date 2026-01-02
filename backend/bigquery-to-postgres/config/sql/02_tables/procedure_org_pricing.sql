DROP TABLE IF EXISTS procedure_org_pricing;
CREATE TABLE IF NOT EXISTS procedure_org_pricing (
    id TEXT PRIMARY KEY,
    procedure_id TEXT REFERENCES procedure(id),
    org_id TEXT,
    carrier_id TEXT,
    carrier_name TEXT,
    count_provider NUMERIC,

    min_professional_rate NUMERIC,
    max_professional_rate NUMERIC,
    avg_professional_rate NUMERIC,
    min_institutional_rate NUMERIC,
    max_institutional_rate NUMERIC,
    avg_institutional_rate NUMERIC,
    min_total_rate NUMERIC,
    max_total_rate NUMERIC,
    avg_total_rate NUMERIC,

    min_price NUMERIC,
    max_price NUMERIC,
    avg_price NUMERIC,
    org_name TEXT,
    org_type TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    latitude NUMERIC,
    longitude NUMERIC,
    phone TEXT,
    updated_at TIMESTAMP
);

-- Row-level security (if using Supabase RLS)
ALTER TABLE procedure_org_pricing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON procedure_org_pricing
    FOR SELECT USING (true);
