-- Database Triggers
-- Automatic data updates and validations

-- Trigger to auto-update location from coordinates
DROP TRIGGER IF EXISTS zip_codes_update_location ON zip_codes;
CREATE TRIGGER zip_codes_update_location
    BEFORE INSERT OR UPDATE OF latitude, longitude
    ON zip_codes
    FOR EACH ROW
    EXECUTE FUNCTION update_location_from_coords();
