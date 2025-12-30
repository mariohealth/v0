-- Table for mapping specialties to their representative procedures
-- Used to determine "typical" visit costs for each specialty
DROP TABLE IF EXISTS specialty_procedure_map CASCADE;
CREATE TABLE IF NOT EXISTS specialty_procedure_map (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    specialty_id TEXT REFERENCES specialty(id) NOT NULL,
    procedure_id TEXT REFERENCES procedure(id) NOT NULL,
    visit_type TEXT NOT NULL, -- 'standard', 'extended', 'complex'
    is_representative BOOLEAN DEFAULT false, -- Mark the "typical" visit
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(specialty_id, procedure_id, visit_type)
);

-- Indexes for performance
CREATE INDEX idx_specialty_procedure_map_specialty ON specialty_procedure_map(specialty_id);
CREATE INDEX idx_specialty_procedure_map_procedure ON specialty_procedure_map(procedure_id);
CREATE INDEX idx_specialty_procedure_map_representative ON specialty_procedure_map(is_representative) WHERE is_representative = true;

-- Row-level security (if using Supabase RLS)
ALTER TABLE specialty_procedure_map ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON specialty_procedure_map
    FOR SELECT USING (true);

