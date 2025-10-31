DROP TABLE IF EXISTS procedure CASCADE;
CREATE TABLE IF NOT EXISTS procedure (
    id TEXT PRIMARY KEY,
    family_id TEXT NOT NULL,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    CONSTRAINT fk_procedure_family_id
     FOREIGN KEY (family_id)
     REFERENCES procedure_family (id)
);

-- Row-level security (if using Supabase RLS)
ALTER TABLE procedure ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON procedure
    FOR SELECT USING (true);
