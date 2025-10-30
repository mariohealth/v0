-- Zip Codes Table
-- US zip code geographic data

DROP TABLE IF EXISTS zip_codes;
CREATE TABLE IF NOT EXISTS zip_codes (
    zip_code TEXT PRIMARY KEY,
    city TEXT,
    county TEXT,
    state_code TEXT,
    latitude NUMERIC NOT NULL,
    longitude NUMERIC NOT NULL,
    location GEOGRAPHY(POINT, 4326), -- Auto-populated by trigger
    last_updated TIMESTAMP DEFAULT NOW(),

    -- Constraints
    CONSTRAINT valid_latitude CHECK (latitude BETWEEN -90 AND 90),
    CONSTRAINT valid_longitude CHECK (longitude BETWEEN -180 AND 180)
);

COMMENT ON TABLE zip_codes IS 'US zip code geographic data with auto-populated PostGIS location';
COMMENT ON COLUMN zip_codes.location IS 'Auto-generated from latitude/longitude via trigger';
