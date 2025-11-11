#!/bin/bash
# Procedure Coverage Verification Script
# Purpose: Determine which procedure categories currently have pricing/provider data in Supabase.
# Context: MRI pricing missing; need to see if this is MRI-specific or system-wide.

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get database password from environment
if [ -z "$SUPABASE_DB_PASS" ]; then
    echo -e "${RED}ERROR: SUPABASE_DB_PASS environment variable not set${NC}"
    echo "Please set it: export SUPABASE_DB_PASS=your_password"
    echo "Or create backend/.env with: SUPABASE_DB_PASS=your_password"
    exit 1
fi

# Database connection string
DB_URL="postgresql://postgres.anvremdouphhucqrxgoq:${SUPABASE_DB_PASS}@aws-1-us-east-1.pooler.supabase.com:5432/postgres"

# Report file
REPORT_FILE="$(dirname "$0")/../VERIFICATION_PROCEDURE_COVERAGE.md"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPORT_FILE="$SCRIPT_DIR/../VERIFICATION_PROCEDURE_COVERAGE.md"

echo "=== Mario Health Procedure Coverage Scan ==="
echo "Timestamp: $(date -u +"%Y-%m-%d %H:%M:%S UTC")"
echo ""

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo -e "${RED}ERROR: psql not found. Please install PostgreSQL client tools.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Connected to Supabase database${NC}"
echo ""

# Step 1: Check total procedure families
echo "=== Step 1. Check total procedure families ==="
psql "$DB_URL" -c "
  SELECT DISTINCT family_name
  FROM procedure
  ORDER BY family_name;
" 2>&1 | grep -v "rows)" | grep -v "^$" || true
echo ""

# Step 2: Check pricing coverage for key families
echo "=== Step 2. Check pricing coverage for key families ==="
psql "$DB_URL" -c "
  WITH fams AS (
    SELECT id, slug, name, family_name
    FROM procedure
    WHERE family_name ILIKE ANY(ARRAY['%MRI%', '%CT%', '%X-ray%', '%Ultrasound%', '%Lab%'])
  )
  SELECT
    f.family_name,
    COUNT(DISTINCT f.id) AS total_procedures,
    COUNT(DISTINCT pp.procedure_id) AS procedures_with_pricing,
    ROUND(100.0 * COUNT(DISTINCT pp.procedure_id)::NUMERIC / NULLIF(COUNT(DISTINCT f.id), 0), 1) AS coverage_percent
  FROM fams f
  LEFT JOIN procedure_pricing pp ON f.id = pp.procedure_id
  GROUP BY f.family_name
  ORDER BY coverage_percent DESC NULLS LAST;
" 2>&1 | grep -v "rows)" | grep -v "^$" || true
echo ""

# Step 3: Top 20 procedures with provider counts
echo "=== Step 3. Top 20 procedures with provider counts ==="
psql "$DB_URL" -c "
  SELECT 
    p.slug, 
    p.name,
    p.family_name,
    COUNT(pp.id) AS provider_count
  FROM procedure p
  LEFT JOIN procedure_pricing pp ON pp.procedure_id = p.id
  GROUP BY p.slug, p.name, p.family_name
  ORDER BY provider_count DESC
  LIMIT 20;
" 2>&1 | grep -v "rows)" | grep -v "^$" || true
echo ""

# Step 4: Check RPC schema
echo "=== Step 4. Check RPC schema for search_procedures functions ==="
psql "$DB_URL" -c "
  SELECT routine_schema, routine_name, routine_type
  FROM information_schema.routines
  WHERE routine_name ILIKE '%search_procedures%'
  ORDER BY routine_schema, routine_name;
" 2>&1 | grep -v "rows)" | grep -v "^$" || true
echo ""

# Step 5: Spot-check procedures with pricing
echo "=== Step 5. Spot-check procedures that have pricing ==="
psql "$DB_URL" -c "
  SELECT 
    f.family_name, 
    f.name, 
    f.slug, 
    pp.price, 
    pp.updated_at
  FROM procedure f
  JOIN procedure_pricing pp ON f.id = pp.procedure_id
  WHERE f.family_name ILIKE ANY(ARRAY['%MRI%', '%CT%', '%X-ray%', '%Ultrasound%', '%Lab%'])
  ORDER BY pp.updated_at DESC
  LIMIT 20;
" 2>&1 | grep -v "rows)" | grep -v "^$" || true
echo ""

# Step 6: Check for MRI-specific procedures
echo "=== Step 6. MRI-specific procedure check ==="
psql "$DB_URL" -c "
  SELECT 
    p.slug,
    p.name,
    p.family_name,
    COUNT(pp.id) AS provider_count,
    MIN(pp.price) AS min_price,
    ROUND(AVG(pp.price), 2) AS avg_price,
    MAX(pp.price) AS max_price
  FROM procedure p
  LEFT JOIN procedure_pricing pp ON pp.procedure_id = p.id
  WHERE p.slug ILIKE '%mri%' OR p.name ILIKE '%mri%'
  GROUP BY p.slug, p.name, p.family_name
  ORDER BY provider_count DESC;
" 2>&1 | grep -v "rows)" | grep -v "^$" || true
echo ""

# Generate markdown report
echo "=== Generating Markdown Report ==="
{
    cat << EOF
# Procedure Coverage Verification Report

**Generated:** $(date -u +"%Y-%m-%d %H:%M:%S UTC")

## Summary

This report analyzes procedure coverage in Supabase, focusing on identifying which procedures have pricing/provider data.

## 1. Top 20 Procedures with Provider Counts

\`\`\`
EOF

    psql "$DB_URL" -t -c "
      SELECT 
        ROW_NUMBER() OVER (ORDER BY COUNT(pp.id) DESC) as rank,
        p.slug, 
        p.name,
        p.family_name,
        COUNT(pp.id) AS provider_count
      FROM procedure p
      LEFT JOIN procedure_pricing pp ON pp.procedure_id = p.id
      GROUP BY p.slug, p.name, p.family_name
      ORDER BY provider_count DESC
      LIMIT 20;
    " 2>&1 | sed 's/^[[:space:]]*//' | grep -v "^$"
    echo '```'
    echo ""

    cat << EOF
## 2. Coverage by Family

\`\`\`
EOF
    psql "$DB_URL" -t -c "
      WITH fams AS (
        SELECT id, slug, name, family_name
        FROM procedure
        WHERE family_name ILIKE ANY(ARRAY['%MRI%', '%CT%', '%X-ray%', '%Ultrasound%', '%Lab%'])
      )
      SELECT
        f.family_name,
        COUNT(DISTINCT f.id) AS total_procedures,
        COUNT(DISTINCT pp.procedure_id) AS procedures_with_pricing,
        ROUND(100.0 * COUNT(DISTINCT pp.procedure_id)::NUMERIC / NULLIF(COUNT(DISTINCT f.id), 0), 1) AS coverage_percent
      FROM fams f
      LEFT JOIN procedure_pricing pp ON f.id = pp.procedure_id
      GROUP BY f.family_name
      ORDER BY coverage_percent DESC NULLS LAST;
    " 2>&1 | sed 's/^[[:space:]]*//' | grep -v "^$"
    echo '```'
    echo ""

    cat << EOF
## 3. RPC Schema Findings

\`\`\`
EOF
    psql "$DB_URL" -t -c "
      SELECT routine_schema || '.' || routine_name || ' (' || routine_type || ')' as rpc_info
      FROM information_schema.routines
      WHERE routine_name ILIKE '%search_procedures%'
      ORDER BY routine_schema, routine_name;
    " 2>&1 | sed 's/^[[:space:]]*//' | grep -v "^$" || echo "No search_procedures functions found."
    echo '```'
    echo ""

    cat << EOF
## 4. MRI Procedures Status

\`\`\`
EOF
    psql "$DB_URL" -t -c "
      SELECT 
        p.slug,
        p.name,
        p.family_name,
        COUNT(pp.id) AS provider_count,
        CASE 
          WHEN COUNT(pp.id) > 0 THEN '$' || MIN(pp.price)::text || '-' || MAX(pp.price)::text
          ELSE 'N/A'
        END AS price_range
      FROM procedure p
      LEFT JOIN procedure_pricing pp ON pp.procedure_id = p.id
      WHERE p.slug ILIKE '%mri%' OR p.name ILIKE '%mri%'
      GROUP BY p.slug, p.name, p.family_name
      ORDER BY provider_count DESC;
    " 2>&1 | sed 's/^[[:space:]]*//' | grep -v "^$"
    echo '```'
    echo ""

    cat << EOF
## 5. Notes on Null/Empty Pricing Cases

EOF
    echo '### MRI Procedures Missing Pricing Data:'
    echo ""
    psql "$DB_URL" -t -c "
      SELECT '- \`' || p.slug || '\` (' || p.name || ')'
      FROM procedure p
      LEFT JOIN procedure_pricing pp ON pp.procedure_id = p.id
      WHERE (p.slug ILIKE '%mri%' OR p.name ILIKE '%mri%')
      GROUP BY p.slug, p.name
      HAVING COUNT(pp.id) = 0;
    " 2>&1 | sed 's/^[[:space:]]*//' | grep -v "^$" || echo "All MRI procedures have pricing data."
    echo ""

    cat << EOF
## 6. Recommendations

### MRI Missing Pricing Data

**Action Items:**
1. Ask AC to seed pricing data for missing MRI procedures
2. Verify that `search_procedures_v2` RPC is correctly filtering results
3. Check if Type-2 logic is incorrectly filtering out valid pricing data
4. Confirm frontend normalization maps \`mri_brain\` → correct database slug

## 7. Backend Implementation Notes

### get_procedure_providers Implementation

- **Location:** \`backend/mario-health-api/app/services/procedure_service.py\`
- **Method:** Queries \`procedure_pricing\` table directly (not using RPC)
- **Query:** Filters by \`procedure_id\` from \`get_procedure_detail\` RPC result
- **Note:** No Type-2 filtering in this method - returns all pricing records

### search_procedures_v2 RPC

- **Location:** \`backend/mario-health-api/app/services/search_service.py\`
- **RPC Name:** \`search_procedures_v2\`
- **Schema:** Check database for actual schema (likely \`public\`)

## 8. Frontend Normalization

### Slug Normalization

- **Location:** \`frontend/src/lib/api.ts\`
- **Function:** \`generateSlugVariants()\`
- **Mappings:**
  - \`mri_brain\` → \`mri_of_brain\`
  - \`mri_spine\` → \`mri_of_spine\`
  - Underscores → hyphens
  - Underscores → \`_of_\`

**Note:** Frontend tries multiple slug variants when fetching providers.

EOF
} > "$REPORT_FILE"

echo -e "${GREEN}✓ Report generated: $REPORT_FILE${NC}"
echo ""
echo "Verification complete!"

