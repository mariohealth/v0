DROP TABLE IF EXISTS procedure;
CREATE TABLE IF NOT EXISTS procedure (
    id TEXT PRIMARY KEY,
    family_id TEXT NOT NULL,
    name TEXT UNIQUE NOT NULL,
    description TEXT
);
