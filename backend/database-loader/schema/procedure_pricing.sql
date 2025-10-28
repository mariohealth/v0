DROP TABLE IF EXISTS procedure_pricing;
CREATE TABLE IF NOT EXISTS procedure_pricing (
    id TEXT PRIMARY KEY,
    procedure_id TEXT REFERENCES procedure(id),
    carrier_id TEXT,
    carrier_name TEXT,
    price NUMERIC,
    updated_at TIMESTAMP
);