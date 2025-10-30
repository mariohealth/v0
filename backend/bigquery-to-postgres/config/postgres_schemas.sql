-- Postgres schemas for all synced tables
-- Run this once to create all table structures

-- Healthcare Prices
CREATE TABLE IF NOT EXISTS healthcare_prices (
    id BIGSERIAL PRIMARY KEY,
    cpt_code VARCHAR(10) NOT NULL,
    cpt_description TEXT,
    carrier_name VARCHAR(255) NOT NULL,
    carrier_id VARCHAR(50),
    price DECIMAL(10, 2) NOT NULL,
    billing_class VARCHAR(50),
    place_of_service VARCHAR(100),
    effective_date DATE,
    last_updated TIMESTAMP DEFAULT NOW(),

    CONSTRAINT price_positive CHECK (price >= 0)
);

CREATE INDEX IF NOT EXISTS idx_hp_cpt_code ON healthcare_prices(cpt_code);
CREATE INDEX IF NOT EXISTS idx_hp_carrier_name ON healthcare_prices(carrier_name);
CREATE INDEX IF NOT EXISTS idx_hp_price ON healthcare_prices(price);
CREATE INDEX IF NOT EXISTS idx_hp_search ON healthcare_prices USING gin(to_tsvector('english', cpt_description));

-- Carriers
CREATE TABLE IF NOT EXISTS carriers (
    carrier_id VARCHAR(50) PRIMARY KEY,
    carrier_name VARCHAR(255) NOT NULL,
    carrier_type VARCHAR(100),
    website VARCHAR(500),
    contact_phone VARCHAR(20),
    last_updated TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_carriers_name ON carriers(carrier_name);

-- CPT Codes
CREATE TABLE IF NOT EXISTS cpt_codes (
    cpt_code VARCHAR(10) PRIMARY KEY,
    description TEXT NOT NULL,
    category VARCHAR(100),
    subcategory VARCHAR(100),
    last_updated TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cpt_category ON cpt_codes(category);
CREATE INDEX IF NOT EXISTS idx_cpt_search ON cpt_codes USING gin(to_tsvector('english', description));

-- Provider Networks
CREATE TABLE IF NOT EXISTS provider_networks (
    provider_id VARCHAR(50) PRIMARY KEY,
    provider_name VARCHAR(255) NOT NULL,
    network_name VARCHAR(255),
    carrier_id VARCHAR(50),
    location VARCHAR(255),
    specialty VARCHAR(100),
    last_updated TIMESTAMP DEFAULT NOW(),

    FOREIGN KEY (carrier_id) REFERENCES carriers(carrier_id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_pn_carrier ON provider_networks(carrier_id);
CREATE INDEX IF NOT EXISTS idx_pn_network ON provider_networks(network_name);
CREATE INDEX IF NOT EXISTS idx_pn_updated ON provider_networks(last_updated);

-- Table comments
COMMENT ON TABLE healthcare_prices IS 'Healthcare pricing data synced from BigQuery';
COMMENT ON TABLE carriers IS 'Insurance carrier information';
COMMENT ON TABLE cpt_codes IS 'CPT code master list with descriptions';
COMMENT ON TABLE provider_networks IS 'Provider network information';
