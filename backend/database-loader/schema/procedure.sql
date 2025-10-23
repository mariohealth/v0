DROP TABLE IF EXISTS procedure;
CREATE TABLE IF NOT EXISTS procedure (
    id TEXT PRIMARY KEY,
    familyId TEXT NOT NULL,
    name TEXT UNIQUE NOT NULL,
    description TEXT
);