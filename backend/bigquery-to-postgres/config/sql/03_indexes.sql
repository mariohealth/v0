-- Database Indexes
-- Performance optimization for queries

-- Zip Codes indexes
CREATE INDEX IF NOT EXISTS idx_zip_code ON zip_codes(zip_code);
CREATE INDEX IF NOT EXISTS idx_zip_location ON zip_codes USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_zip_state ON zip_codes(state_code);
