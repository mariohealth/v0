-- Foreign Key Constraints
-- Referential integrity between tables

-- Foreign key from
ALTER TABLE procedure_family
    DROP CONSTRAINT IF EXISTS fk_procedure_family_category_id;

ALTER TABLE procedure_family
ADD CONSTRAINT fk_procedure_family_category_id
     FOREIGN KEY (category_id)
     REFERENCES procedure_category (id);

-- Foreign key from procedure_pricing to provider_location
ALTER TABLE procedure_pricing
    DROP CONSTRAINT IF EXISTS fk_provider_location;

ALTER TABLE procedure_pricing
ADD CONSTRAINT fk_provider_location
FOREIGN KEY (provider_location_id) REFERENCES provider_location(id);
