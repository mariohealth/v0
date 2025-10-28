-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_provider_location_geo ON provider_location USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_zip_codes_geo ON zip_codes USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_provider_location_zip ON provider_location (zip_code);
CREATE INDEX IF NOT EXISTS idx_procedure_pricing_provider ON procedure_pricing (provider_id);
CREATE INDEX IF NOT EXISTS idx_procedure_pricing_procedure ON procedure_pricing (procedure_id);
CREATE INDEX IF NOT EXISTS idx_procedure_name_search ON procedure USING gin (name gin_trgm_ops);
