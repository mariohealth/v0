#!/bin/bash
# === Mario Health — Provider Data Verification & Diagnostics ===
# Purpose: Verify provider_location structure, data completeness, and linkage to procedure_pricing.

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
    echo ""
    echo "Alternatively, use the Python version: python3 backend/scripts/verify_provider_data_v2.py"
    exit 1
fi

# Database connection string
DB_URL="postgresql://postgres.anvremdouphhucqrxgoq:${SUPABASE_DB_PASS}@aws-1-us-east-1.pooler.supabase.com:5432/postgres"

echo "=== Mario Health — Provider Data Verification & Diagnostics ==="
echo ""

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo -e "${RED}ERROR: psql not found. Please install PostgreSQL client tools.${NC}"
    echo "Or use the Python version: python3 backend/scripts/verify_provider_data_v2.py"
    exit 1
fi

echo "=== Checking schema ==="
psql "$DB_URL" -c "\d provider_location" || {
    echo -e "${RED}ERROR: Could not connect to database or describe table${NC}"
    echo "Please check your SUPABASE_DB_PASS and database connection"
    echo "Or use the Python version: python3 backend/scripts/verify_provider_data_v2.py"
    exit 1
}

echo ""
echo "=== Counting providers and checking missing fields ==="
psql "$DB_URL" -c "
  SELECT
    COUNT(*) AS total_providers,
    COUNT(*) FILTER (WHERE provider_name IS NULL AND name IS NULL) AS missing_name,
    COUNT(*) FILTER (WHERE city IS NULL OR state IS NULL) AS missing_city_state,
    COUNT(*) FILTER (WHERE latitude IS NULL OR longitude IS NULL) AS missing_coordinates
  FROM provider_location;
"

echo ""
echo "=== Geographic coverage by state ==="
psql "$DB_URL" -c "
  SELECT state, COUNT(*) AS providers
  FROM provider_location
  WHERE state IS NOT NULL
  GROUP BY state
  ORDER BY providers DESC
  LIMIT 20;
"

echo ""
echo "=== Providers linked to pricing ==="
# Check if provider_location_id column exists
HAS_PLID=$(psql "$DB_URL" -Atc "SELECT 1 FROM information_schema.columns WHERE table_name='procedure_pricing' AND column_name='provider_location_id' LIMIT 1" 2>/dev/null || echo "")
if [[ "$HAS_PLID" == "1" ]]; then
  psql "$DB_URL" -c "
    SELECT
      COUNT(DISTINCT pp.provider_location_id) AS providers_with_pricing,
      COUNT(DISTINCT pl.id) AS total_providers,
      ROUND(100.0 * COUNT(DISTINCT pp.provider_location_id)::NUMERIC / NULLIF(COUNT(DISTINCT pl.id),0), 1) AS coverage_percent
    FROM provider_location pl
    LEFT JOIN procedure_pricing pp ON pp.provider_location_id = pl.id;
  "
else
  psql "$DB_URL" -c "
    SELECT
      COUNT(DISTINCT pp.provider_id) AS providers_with_pricing,
      COUNT(DISTINCT pl.provider_id) AS total_providers,
      ROUND(100.0 * COUNT(DISTINCT pp.provider_id)::NUMERIC / NULLIF(COUNT(DISTINCT pl.provider_id),0), 1) AS coverage_percent
    FROM provider_location pl
    LEFT JOIN procedure_pricing pp ON pp.provider_id = pl.provider_id;
  "
fi

echo ""
echo "=== Top providers by number of priced procedures ==="
# Check if provider_location_id column exists
HAS_PLID=$(psql "$DB_URL" -Atc "SELECT 1 FROM information_schema.columns WHERE table_name='procedure_pricing' AND column_name='provider_location_id' LIMIT 1" 2>/dev/null || echo "")
if [[ "$HAS_PLID" == "1" ]]; then
  psql "$DB_URL" -c "
    SELECT
      pl.id AS provider_location_id,
      COALESCE(pl.provider_name, pl.name, 'Unknown') AS name,
      pl.city,
      pl.state,
      COUNT(pp.procedure_id) AS priced_procedures,
      MIN(pp.price) AS min_price,
      MAX(pp.price) AS max_price
    FROM provider_location pl
    JOIN procedure_pricing pp ON pp.provider_location_id = pl.id
    GROUP BY pl.id, pl.provider_name, pl.name, pl.city, pl.state
    ORDER BY priced_procedures DESC
    LIMIT 20;
  "
else
  psql "$DB_URL" -c "
    SELECT
      pl.provider_id,
      COALESCE(pl.provider_name, pl.name, 'Unknown') AS name,
      pl.city,
      pl.state,
      COUNT(pp.procedure_id) AS priced_procedures,
      MIN(pp.price) AS min_price,
      MAX(pp.price) AS max_price
    FROM provider_location pl
    JOIN procedure_pricing pp ON pp.provider_id = pl.provider_id
    GROUP BY pl.provider_id, pl.provider_name, pl.name, pl.city, pl.state
    ORDER BY priced_procedures DESC
    LIMIT 20;
  "
fi

echo ""
echo "=== Detecting orphan pricing records ==="
# Check if provider_location_id column exists
HAS_PLID=$(psql "$DB_URL" -Atc "SELECT 1 FROM information_schema.columns WHERE table_name='procedure_pricing' AND column_name='provider_location_id' LIMIT 1" 2>/dev/null || echo "")
if [[ "$HAS_PLID" == "1" ]]; then
  psql "$DB_URL" -c "
    SELECT COUNT(*) AS orphan_pricing_records
    FROM procedure_pricing pp
    LEFT JOIN provider_location pl ON pp.provider_location_id = pl.id
    WHERE pl.id IS NULL;
  "
else
  psql "$DB_URL" -c "
    SELECT COUNT(*) AS orphan_pricing_records
    FROM procedure_pricing
    WHERE provider_id NOT IN (SELECT provider_id FROM provider_location WHERE provider_id IS NOT NULL);
  "
fi

timestamp=$(date +"%Y-%m-%d_%H-%M-%S")
output="backend/diagnostics/provider_data_report_${timestamp}.md"
mkdir -p backend/diagnostics

{
  echo "# Mario Health Provider Data Diagnostics — ${timestamp}"
  echo ""
  echo "## Summary"
  psql "$DB_URL" -t -c "
    SELECT COUNT(*) AS total_providers FROM provider_location;
  " | sed 's/^[[:space:]]*//'
  echo ""
  echo "## Missing Field Breakdown"
  psql "$DB_URL" -t -c "
    SELECT
      COUNT(*) FILTER (WHERE provider_name IS NULL AND name IS NULL) AS missing_name,
      COUNT(*) FILTER (WHERE latitude IS NULL OR longitude IS NULL) AS missing_coordinates
    FROM provider_location;
  " | sed 's/^[[:space:]]*//'
  echo ""
  echo "## State Coverage (Top 10)"
  psql "$DB_URL" -t -c "
    SELECT state, COUNT(*) AS providers
    FROM provider_location
    WHERE state IS NOT NULL
    GROUP BY state
    ORDER BY providers DESC
    LIMIT 10;
  " | sed 's/^[[:space:]]*//'
  echo ""
  echo "## Providers Linked to Pricing"
  HAS_PLID=$(psql "$DB_URL" -Atc "SELECT 1 FROM information_schema.columns WHERE table_name='procedure_pricing' AND column_name='provider_location_id' LIMIT 1" 2>/dev/null || echo "")
  if [[ "$HAS_PLID" == "1" ]]; then
    psql "$DB_URL" -t -c "
      SELECT
        COUNT(DISTINCT pp.provider_location_id) AS providers_with_pricing,
        COUNT(DISTINCT pl.id) AS total_providers,
        ROUND(100.0 * COUNT(DISTINCT pp.provider_location_id)::NUMERIC / NULLIF(COUNT(DISTINCT pl.id),0), 1) AS coverage_percent
      FROM provider_location pl
      LEFT JOIN procedure_pricing pp ON pp.provider_location_id = pl.id;
    " | sed 's/^[[:space:]]*//'
  else
    psql "$DB_URL" -t -c "
      SELECT
        COUNT(DISTINCT pp.provider_id) AS providers_with_pricing,
        COUNT(DISTINCT pl.provider_id) AS total_providers,
        ROUND(100.0 * COUNT(DISTINCT pp.provider_id)::NUMERIC / NULLIF(COUNT(DISTINCT pl.provider_id),0), 1) AS coverage_percent
      FROM provider_location pl
      LEFT JOIN procedure_pricing pp ON pp.provider_id = pl.provider_id;
    " | sed 's/^[[:space:]]*//'
  fi
} > "$output"

echo ""
echo -e "${GREEN}✅ Provider data diagnostics complete — report saved to $output${NC}"

