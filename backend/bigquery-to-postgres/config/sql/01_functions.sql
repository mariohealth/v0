-- Database Functions and Procedures
-- Reusable logic for triggers and application code

-- Function to automatically update location from lat/lon coordinates
DROP FUNCTION IF EXISTS update_location_from_coords() CASCADE;
CREATE OR REPLACE FUNCTION update_location_from_coords()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
        NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
    ELSE
        NEW.location = NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_location_from_coords() IS
'Automatically creates a PostGIS geography point from latitude and longitude columns';
