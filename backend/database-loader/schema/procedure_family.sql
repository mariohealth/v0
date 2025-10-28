DROP TABLE IF EXISTS procedure_family CASCADE;
CREATE TABLE IF NOT EXISTS procedure_family (
    id TEXT PRIMARY KEY,
    category_id TEXT NOT NULL,
    name TEXT,
    slug TEXT,
    description TEXT,
    CONSTRAINT fk_procedure_family_category_id
     FOREIGN KEY (category_id)
     REFERENCES procedure_category (id)
);
