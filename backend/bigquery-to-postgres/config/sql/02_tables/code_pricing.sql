DROP TABLE IF EXISTS code_pricing;
CREATE TABLE IF NOT EXISTS code_pricing (
    hospital_id TEXT,
    billing_code TEXT,
    billing_code_type TEXT,
    billing_code_type_version TEXT,
    npi TEXT,
    healthcare_provider_taxonomy_code TEXT,
    professional_rate NUMERIC,
    institutional_rate NUMERIC,
    total_rate NUMERIC,
    carrier_id TEXT,
    carrier_plan_id TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Row-level security (if using Supabase RLS)
ALTER TABLE code_pricing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON code_pricing
    FOR SELECT USING (true);
