DROP TABLE IF EXISTS procedure_to_billing_codes_map;
CREATE TABLE IF NOT EXISTS procedure_to_billing_codes_map (
    billing_code_type TEXT NOT NULL,
    billing_code TEXT NOT NULL,
    procedure_id TEXT NOT NULL
);
