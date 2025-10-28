-- Table for ZIP code geocoding (for user search input)
DROP TABLE IF EXISTS zip_codes;
CREATE TABLE IF NOT EXISTS zip_codes (
    zip TEXT PRIMARY KEY,
    city TEXT,
    state TEXT,
    latitude NUMERIC NOT NULL,
    longitude NUMERIC NOT NULL,
    location GEOGRAPHY(POINT, 4326),
    county TEXT,
    timezone TEXT
);
