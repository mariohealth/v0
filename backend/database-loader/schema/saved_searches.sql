-- Saved Searches Table
-- Stores user's saved searches for quick access

CREATE TABLE IF NOT EXISTS saved_searches (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    query VARCHAR(200) NOT NULL,
    location VARCHAR(100),
    radius INTEGER DEFAULT 50 CHECK (radius >= 5 AND radius <= 100),
    filters JSONB,
    sort_by VARCHAR(50) DEFAULT 'price-asc',
    alert_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_saved_searches_user_id ON saved_searches(user_id);

-- Create index on last_searched_at for sorting
CREATE INDEX IF NOT EXISTS idx_saved_searches_last_searched_at ON saved_searches(last_searched_at DESC);

-- Create composite index for user queries
CREATE INDEX IF NOT EXISTS idx_saved_searches_user_last_searched ON saved_searches(user_id, last_searched_at DESC);

-- Add comment to table
COMMENT ON TABLE saved_searches IS 'Stores user saved searches with query, location, filters, and preferences';
COMMENT ON COLUMN saved_searches.user_id IS 'User identifier from authentication system';
COMMENT ON COLUMN saved_searches.query IS 'Search query text';
COMMENT ON COLUMN saved_searches.filters IS 'JSON object containing saved filters: {priceRange, types, minRating, etc}';
COMMENT ON COLUMN saved_searches.sort_by IS 'Default sort option for this search';
COMMENT ON COLUMN saved_searches.alert_enabled IS 'Whether email alerts are enabled for new results';

