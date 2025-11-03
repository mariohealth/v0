-- PostgreSQL Extensions
-- Run first to enable required functionality

CREATE EXTENSION IF NOT EXISTS postgis;

COMMENT ON EXTENSION postgis IS 'Geographic objects support';

-- Enable trigram for fuzzy text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Enable unaccent for handling accented characters (optional but recommended)
CREATE EXTENSION IF NOT EXISTS unaccent;
