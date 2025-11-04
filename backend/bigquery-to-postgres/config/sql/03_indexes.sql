-- Database Indexes
-- Performance optimization for queries

-- Zip Codes indexes
CREATE INDEX IF NOT EXISTS idx_zip_code ON zip_codes(zip_code);
CREATE INDEX IF NOT EXISTS idx_zip_location ON zip_codes USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_zip_state ON zip_codes(state_code);

-- Provider location
CREATE INDEX IF NOT EXISTS idx_provider_location_geo ON provider_location USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_provider_location_zip ON provider_location (zip_code);

-- Procedure pricing
CREATE INDEX IF NOT EXISTS idx_procedure_pricing_provider ON procedure_pricing (provider_id);
CREATE INDEX IF NOT EXISTS idx_procedure_pricing_procedure ON procedure_pricing (procedure_id);

-- Procedure
CREATE INDEX idx_procedure_family ON procedure(family_id);
CREATE INDEX idx_procedure_slug ON procedure(slug);
CREATE INDEX idx_procedure_name ON procedure(name);

-- Create GIN index for fast full-text search
CREATE INDEX IF NOT EXISTS idx_procedure_search_vector ON procedure USING GIN(search_vector);
-- Create GIN index for trigram fuzzy matching on name
CREATE INDEX IF NOT EXISTS idx_procedure_name_trgm ON procedure USING GIN(name gin_trgm_ops);
-- Create GIN index for trigram fuzzy matching on common_name
CREATE INDEX IF NOT EXISTS idx_procedure_common_name_trgm ON procedure USING GIN(common_name gin_trgm_ops);

-- Procedure billing code
CREATE INDEX IF NOT EXISTS idx_billing_code_code ON procedure_billing_code(code);
CREATE INDEX IF NOT EXISTS idx_billing_code_type ON procedure_billing_code(code_type);
CREATE INDEX IF NOT EXISTS idx_billing_code_procedure ON procedure_billing_code(procedure_id);
CREATE INDEX IF NOT EXISTS idx_billing_code_code_type ON procedure_billing_code(code, code_type);


-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_saved_searches_user_id ON saved_searches(user_id);
-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_saved_searches_created_at ON saved_searches(created_at);
-- Create index on query for search functionality
CREATE INDEX IF NOT EXISTS idx_saved_searches_query ON saved_searches(query);


-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
-- Create index on created_at for analytics
CREATE INDEX IF NOT EXISTS idx_user_preferences_created_at ON user_preferences(created_at);
