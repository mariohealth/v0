-- Foreign Key Constraints
-- Referential integrity between tables

-- can't execute an empty query so:
SELECT 1 FROM zip_codes LIMIT 1;

-- Healthcare Prices -> Zip Codes
-- ALTER TABLE healthcare_prices
--     DROP CONSTRAINT IF EXISTS fk_hp_zip_code;
-- ALTER TABLE healthcare_prices
--     ADD CONSTRAINT fk_hp_zip_code
--     FOREIGN KEY (service_zip_code)
--     REFERENCES zip_codes(zip_code)
--     ON DELETE SET NULL;