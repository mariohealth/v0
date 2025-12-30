-- Index for bounding-box queries on provider_location
-- Supports efficient spatial filtering before haversine distance calculation
-- Used by GET /api/v1/specialties/{slug}/providers

CREATE INDEX IF NOT EXISTS idx_provider_location_lat_lng
ON provider_location(latitude, longitude);

-- Optional: Add covering index with frequently accessed columns
-- Uncomment if query performance metrics show benefit
-- CREATE INDEX IF NOT EXISTS idx_provider_location_lat_lng_covering
-- ON provider_location(latitude, longitude, provider_id, org_id, city, state, zip_code);

COMMENT ON INDEX idx_provider_location_lat_lng IS 
'Composite index for bounding-box prefilter on provider location queries';

