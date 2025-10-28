-- Create trigger to auto-populate location column
CREATE TRIGGER provider_location_update_location
    BEFORE INSERT OR UPDATE OF latitude, longitude
    ON provider_location
    FOR EACH ROW
    EXECUTE FUNCTION update_location_from_coords();

CREATE TRIGGER zip_codes_update_location
    BEFORE INSERT OR UPDATE OF latitude, longitude
    ON zip_codes
    FOR EACH ROW
    EXECUTE FUNCTION update_location_from_coords();
