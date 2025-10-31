DROP TABLE IF EXISTS procedure_to_billing_code_map;
CREATE TABLE IF NOT EXISTS procedure_to_billing_code_map (
    billing_code_type TEXT NOT NULL,
    billing_code TEXT NOT NULL,
    procedure_id TEXT NOT NULL
);

-- Row-level security (if using Supabase RLS)
ALTER TABLE procedure_to_billing_code_map ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON procedure_to_billing_code_map
    FOR SELECT USING (true);
