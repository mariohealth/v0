-- Indexes for provider name search with pg_trgm
-- Supports fuzzy matching on first_name and last_name

-- GIN trigram indexes for fuzzy name matching
CREATE INDEX IF NOT EXISTS idx_provider_first_name_trgm 
ON provider USING gin (first_name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_provider_last_name_trgm 
ON provider USING gin (last_name gin_trgm_ops);

-- Composite index for efficient name-based queries
CREATE INDEX IF NOT EXISTS idx_provider_names_composite 
ON provider (last_name, first_name, provider_id);

-- Index on provider_location for efficient joins
CREATE INDEX IF NOT EXISTS idx_provider_location_provider_id 
ON provider_location (provider_id);

COMMENT ON INDEX idx_provider_first_name_trgm IS 'Trigram index for fuzzy first name search';
COMMENT ON INDEX idx_provider_last_name_trgm IS 'Trigram index for fuzzy last name search';
COMMENT ON INDEX idx_provider_names_composite IS 'Composite index for name-based provider lookups';
COMMENT ON INDEX idx_provider_location_provider_id IS 'Index for provider_location joins';