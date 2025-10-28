-- Enable PostGIS for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Enable trigram for fuzzy text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;
