DROP TABLE IF EXISTS procedure;
CREATE TABLE IF NOT EXISTS procedure (
    id TEXT PRIMARY KEY,
    family_id TEXT NOT NULL,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    CONSTRAINT fk_procedure_family_id
     FOREIGN KEY (family_id)
     REFERENCES procedure_family (id)
);
