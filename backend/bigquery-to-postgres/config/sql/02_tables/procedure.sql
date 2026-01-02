DROP TABLE IF EXISTS procedure CASCADE;
CREATE TABLE IF NOT EXISTS procedure (
    id TEXT PRIMARY KEY,
    family_id TEXT NOT NULL,

    -- Core identification fields
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,

    -- Descriptive fields
    description TEXT,
    common_name VARCHAR(200),  -- User-friendly search term (e.g., "Brain Scan" for "MRI - Brain")

    -- Search optimization
    search_terms TEXT,  -- String of comma separated keywords for search matching

    -- Clinical information fields
    typical_duration VARCHAR(100),  -- e.g., "30-45 minutes"
    preparation TEXT,  -- What patients need to do before the procedure
    common_reasons TEXT[],  -- Array of common reasons patients need this procedure

    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_procedure_family_id
     FOREIGN KEY (family_id)
     REFERENCES procedure_family (id)
);

-- Add generated column for full-text search
ALTER TABLE procedure
ADD COLUMN IF NOT EXISTS search_vector tsvector
GENERATED ALWAYS AS (
    to_tsvector('english',
        name || ' ' ||
        COALESCE(common_name, '') || ' ' ||
        COALESCE(description, '')
    )
) STORED;

-- Row-level security (if using Supabase RLS)
ALTER TABLE procedure ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON procedure
    FOR SELECT USING (true);
