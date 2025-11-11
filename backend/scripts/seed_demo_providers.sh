#!/bin/bash
# === Mario Health — Sample Provider & Pricing Seed (Demo Data) ===

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get database password from environment
if [ -z "$SUPABASE_DB_PASS" ]; then
    echo -e "${RED}ERROR: SUPABASE_DB_PASS environment variable not set${NC}"
    echo "Please set it: export SUPABASE_DB_PASS=your_password"
    exit 1
fi

# Database connection string
DB_URL="postgresql://postgres.anvremdouphhucqrxgoq:${SUPABASE_DB_PASS}@aws-1-us-east-1.pooler.supabase.com:5432/postgres"

echo "=== Mario Health — Sample Provider & Pricing Seed ==="
echo ""

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo -e "${RED}ERROR: psql not found. Please install PostgreSQL client tools.${NC}"
    echo "Or use the Python version: python3 backend/scripts/seed_demo_providers.py"
    exit 1
fi

echo "Seeding demo providers and MRI pricing..."
echo ""

# Step 1: Insert demo providers
echo "Step 1: Inserting demo providers..."
psql "$DB_URL" << 'EOF'
-- Insert demo providers
-- Note: Using provider_id (numeric) and provider_name fields
INSERT INTO provider_location (provider_id, provider_name, city, state, latitude, longitude, address, zip_code)
VALUES
  (1001, 'City Imaging Center', 'New York', 'NY', 40.713, -74.006, '123 Main St', '10001'),
  (1002, 'UCSF Radiology Clinic', 'San Francisco', 'CA', 37.763, -122.457, '456 Market St', '94102'),
  (1003, 'Chicago MRI Specialists', 'Chicago', 'IL', 41.878, -87.629, '789 State St', '60601')
ON CONFLICT (provider_id) DO UPDATE SET
  provider_name = EXCLUDED.provider_name,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  address = EXCLUDED.address,
  zip_code = EXCLUDED.zip_code;
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Demo providers inserted${NC}"
else
    echo -e "${RED}✗ Failed to insert providers${NC}"
    exit 1
fi

echo ""

# Step 2: Link sample pricing to MRI procedures
echo "Step 2: Linking pricing to MRI procedures..."
psql "$DB_URL" << 'EOF'
-- Link sample pricing to MRI procedures
-- Note: Using numeric provider_id from provider_location
INSERT INTO procedure_pricing (procedure_id, provider_id, price, updated_at)
SELECT 
  p.id, 
  pl.provider_id, 
  (400 + random() * 150)::INT, 
  NOW()
FROM procedure p
CROSS JOIN provider_location pl
WHERE p.slug LIKE '%mri%'
  AND pl.provider_id IN (1001, 1002, 1003)
ON CONFLICT (procedure_id, provider_id) DO UPDATE SET
  price = EXCLUDED.price,
  updated_at = EXCLUDED.updated_at;
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ MRI pricing linked to providers${NC}"
else
    echo -e "${RED}✗ Failed to link pricing${NC}"
    exit 1
fi

echo ""

# Step 3: Verify the seed
echo "Step 3: Verifying seed..."
psql "$DB_URL" -c "
SELECT 
  pl.provider_name,
  pl.city,
  pl.state,
  COUNT(pp.id) AS pricing_records,
  MIN(pp.price) AS min_price,
  MAX(pp.price) AS max_price,
  ROUND(AVG(pp.price), 2) AS avg_price
FROM provider_location pl
LEFT JOIN procedure_pricing pp ON pp.provider_id = pl.provider_id
WHERE pl.provider_id IN (1001, 1002, 1003)
GROUP BY pl.provider_id, pl.provider_name, pl.city, pl.state
ORDER BY pl.provider_id;
"

echo ""
echo -e "${GREEN}✅ Demo providers and MRI pricing seeded!${NC}"

