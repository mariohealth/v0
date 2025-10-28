DROP TABLE IF EXISTS procedure_pricing;
CREATE TABLE IF NOT EXISTS procedure_pricing (
    id TEXT PRIMARY KEY,
    procedure_id TEXT REFERENCES procedure(id),
    provider_id TEXT,
    carrier_id TEXT,
    carrier_name TEXT,
    price NUMERIC,
    updated_at TIMESTAMP
);

-- Foreign key from procedure_pricing to provider_location
ALTER TABLE procedure_pricing
ADD CONSTRAINT fk_provider_location
FOREIGN KEY (provider_id) REFERENCES provider_location(provider_id);