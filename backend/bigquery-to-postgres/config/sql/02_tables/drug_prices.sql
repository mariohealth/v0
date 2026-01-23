DROP TABLE IF EXISTS drug_prices CASCADE;
CREATE TABLE IF NOT EXISTS drug_prices (
    rxcui_scd TEXT,
    pharmacy_id TEXT,
    source_id TEXT,
    price TEXT,
    quantity TEXT,
    product_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
-- Row-level security (if using Supabase RLS)
ALTER TABLE drug_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON drug_prices
    FOR SELECT USING (true);
