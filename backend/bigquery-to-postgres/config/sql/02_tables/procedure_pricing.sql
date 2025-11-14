DROP TABLE IF EXISTS procedure_pricing;
CREATE TABLE IF NOT EXISTS procedure_pricing (
    id TEXT PRIMARY KEY,
    procedure_id TEXT REFERENCES procedure(id),
    provider_id TEXT,
<<<<<<< HEAD
=======
    provider_name TEXT,
    provider_location_id TEXT,
>>>>>>> 178385b (Everything to support procedure pricing at the org level API route, fixed and improved other routes, proc to specialty mapping  (#17))
    carrier_id TEXT,
    carrier_name TEXT,
    price NUMERIC,
    updated_at TIMESTAMP
);

-- Row-level security (if using Supabase RLS)
ALTER TABLE procedure_pricing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON procedure_pricing
    FOR SELECT USING (true);
