-- Database Triggers
-- Automatic data updates and validations

-- Trigger to auto-update location from coordinates
DROP TRIGGER IF EXISTS zip_codes_update_location ON zip_codes;
CREATE TRIGGER zip_codes_update_location
    BEFORE INSERT OR UPDATE OF latitude, longitude
    ON zip_codes
    FOR EACH ROW
    EXECUTE FUNCTION update_location_from_coords();

DROP TRIGGER IF EXISTS provider_loc_update_location ON provider_location;
CREATE TRIGGER provider_loc_update_location
    BEFORE INSERT OR UPDATE OF latitude, longitude
    ON provider_location
    FOR EACH ROW
    EXECUTE FUNCTION update_location_from_coords();
