-- Saved Searches Table
-- Stores user's saved searches for quick re-execution and alerts

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

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_saved_searches_user_id ON saved_searches(user_id);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_saved_searches_created_at ON saved_searches(created_at);

-- Create index on query for search functionality
CREATE INDEX IF NOT EXISTS idx_saved_searches_query ON saved_searches(query);

-- Add comment to table
COMMENT ON TABLE saved_searches IS 'Stores user saved searches with query, location, filters, and alert preferences';
COMMENT ON COLUMN saved_searches.user_id IS 'Unique user identifier from authentication system';
COMMENT ON COLUMN saved_searches.query IS 'Original search query';
COMMENT ON COLUMN saved_searches.location IS 'Location/ZIP code used in search';
COMMENT ON COLUMN saved_searches.filters IS 'JSON object with search filters: {priceRange: [min, max], types: [], minRating: number}';
COMMENT ON COLUMN saved_searches.alert_enabled IS 'Whether email alerts are enabled for new matching results';
