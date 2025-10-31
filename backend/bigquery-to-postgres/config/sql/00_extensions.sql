-- PostgreSQL Extensions
-- Run first to enable required functionality

CREATE EXTENSION IF NOT EXISTS postgis;

COMMENT ON EXTENSION postgis IS 'Geographic objects support';

-- Enable trigram for fuzzy text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;
