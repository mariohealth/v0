DROP TABLE IF EXISTS procedure_family;
CREATE TABLE IF NOT EXISTS procedure_family (
    id TEXT PRIMARY KEY,
    categoryId TEXT NOT NULL,
    name TEXT,
    slug TEXT,
    description TEXT
);
