-- User Preferences Table
-- Stores user preferences for personalized experience

CREATE TABLE IF NOT EXISTS user_preferences (
    user_id VARCHAR(255) PRIMARY KEY,
    default_zip VARCHAR(10),
    default_radius INTEGER DEFAULT 50 CHECK (default_radius >= 10 AND default_radius <= 100),
    preferred_insurance_carriers JSONB DEFAULT '[]',
    saved_locations JSONB DEFAULT '[]',
    language VARCHAR(2) DEFAULT 'en' CHECK (language ~ '^[a-z]{2}$'),
    notifications JSONB DEFAULT '{"email": true, "sms": false}',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- Create index on created_at for analytics
CREATE INDEX IF NOT EXISTS idx_user_preferences_created_at ON user_preferences(created_at);

-- Add comment to table
COMMENT ON TABLE user_preferences IS 'Stores user preferences including location defaults, insurance preferences, and saved locations';
COMMENT ON COLUMN user_preferences.user_id IS 'Unique user identifier from authentication system';
COMMENT ON COLUMN user_preferences.default_zip IS 'Default ZIP code for location-based search';
COMMENT ON COLUMN user_preferences.default_radius IS 'Default search radius in miles (10-100)';
COMMENT ON COLUMN user_preferences.preferred_insurance_carriers IS 'Array of preferred insurance provider names';
COMMENT ON COLUMN user_preferences.saved_locations IS 'Array of saved locations (max 5): [{id, name, zip, radius}]';
COMMENT ON COLUMN user_preferences.language IS 'ISO 639-1 language code (e.g., en, es)';
COMMENT ON COLUMN user_preferences.notifications IS 'Notification preferences: {email: boolean, sms: boolean}';

