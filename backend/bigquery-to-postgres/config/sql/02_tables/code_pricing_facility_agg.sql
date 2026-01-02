DROP TABLE IF EXISTS code_pricing_facility_agg;
CREATE TABLE IF NOT EXISTS code_pricing_facility_agg (
    carrier_id TEXT,
    carrier_plan_id TEXT,
    hospital_id TEXT,
    billing_code TEXT,
    billing_code_type TEXT,
    billing_code_type_version TEXT,
    count_rows INTEGER,
    count_distinct_npi INTEGER,
    min_professional_rate NUMERIC,
    avg_professional_rate NUMERIC,
    max_professional_rate NUMERIC,

    min_institutional_rate NUMERIC,
    avg_institutional_rate NUMERIC,
    max_institutional_rate NUMERIC,

    min_total_rate NUMERIC,
    avg_total_rate NUMERIC,
    max_total_rate NUMERIC,

    created_at TIMESTAMP DEFAULT NOW()
);

-- Row-level security (if using Supabase RLS)
ALTER TABLE code_pricing_facility_agg ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON code_pricing_facility_agg
    FOR SELECT USING (true);
