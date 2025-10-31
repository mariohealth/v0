-- Saved Searches Table
-- Stores user's saved searches for quick re-execution and alerts

DROP TABLE IF EXISTS saved_searches CASCADE;

CREATE TABLE IF NOT EXISTS saved_searches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    query VARCHAR(200) NOT NULL,
    location VARCHAR(100),
    filters JSONB DEFAULT '{}',
    alert_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Row-level security (if using Supabase RLS)
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON saved_searches
    FOR SELECT USING (true);

-- Add comment to table
COMMENT ON TABLE saved_searches IS 'Stores user saved searches with query, location, filters, and alert preferences';
COMMENT ON COLUMN saved_searches.user_id IS 'Unique user identifier from authentication system';
COMMENT ON COLUMN saved_searches.query IS 'Original search query';
COMMENT ON COLUMN saved_searches.location IS 'Location/ZIP code used in search';
COMMENT ON COLUMN saved_searches.filters IS 'JSON object with search filters: {priceRange: [min, max], types: [], minRating: number}';
COMMENT ON COLUMN saved_searches.alert_enabled IS 'Whether email alerts are enabled for new matching results';
