DROP TABLE IF EXISTS procedure_category CASCADE;
CREATE TABLE IF NOT EXISTS procedure_category (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    emoji TEXT UNIQUE NOT NULL,
    description TEXT
);
