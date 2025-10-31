-- Drop old table if exists
DROP TABLE IF EXISTS procedure_billing_code CASCADE;

-- Unified billing code mapping table
CREATE TABLE IF NOT EXISTS procedure_billing_code (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    procedure_id TEXT NOT NULL REFERENCES procedure(id),
    code TEXT NOT NULL,
    code_type TEXT NOT NULL,  -- 'CPT', 'HCPCS', 'G-CODE', 'ICD-10-PCS', etc.
    description TEXT,
    is_primary BOOLEAN DEFAULT false,  -- Is this the primary code for this procedure?
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(procedure_id, code, code_type)
);

-- Add check constraint for valid code types
ALTER TABLE procedure_billing_code
ADD CONSTRAINT check_valid_code_type
CHECK (code_type IN ('CPT', 'HCPCS', 'MS-DRG', 'G-CODE', 'ICD-10-PCS', 'ICD-10-CM', 'CDT', 'DRG', '???'));

-- Row-level security (if using Supabase RLS)
ALTER TABLE procedure_billing_code ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON procedure_billing_code
    FOR SELECT USING (true);

-- Comment for documentation
COMMENT ON TABLE procedure_billing_code IS 'Maps procedures to various medical billing codes (CPT, HCPCS, G-codes, ICD-10-PCS, etc.)';
COMMENT ON COLUMN procedure_billing_code.code_type IS 'Type of billing code: CPT, HCPCS, G-CODE, ICD-10-PCS, ICD-10-CM, CDT, DRG';
