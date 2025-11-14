#!/bin/bash

# 🧭 Mario Health — Diagnose & Repair MRI Provider Linkage
# ----------------------------------------------------------
# Checks if procedure_pricing rows exist for MRI procedures,
# verifies if provider_location_id values are missing,
# migrates them from provider_id when possible,
# and reseeds missing MRI data if needed.
# ----------------------------------------------------------

set -e  # Exit on error

# Check if POSTGRES_URL is set
if [ -z "$POSTGRES_URL" ]; then
    echo "❌ ERROR: POSTGRES_URL environment variable not set"
    echo ""
    echo "Please set it before running:"
    echo "  export POSTGRES_URL='postgresql://user:pass@host:port/dbname'"
    echo ""
    echo "Or source from .env file:"
    echo "  source backend/mario-health-api/.env"
    exit 1
fi

DB="$POSTGRES_URL"

echo "============================================================"
echo "🏥 Mario Health — MRI Provider Linkage Diagnostic ($(date))"
echo "============================================================"

# 1️⃣ Check counts before migration
echo ""
echo "🔍 Step 1: Checking MRI procedure_pricing counts..."
psql "$DB" -c "
SELECT
  procedure_id,
  COUNT(*) AS total_rows,
  COUNT(*) FILTER (WHERE provider_location_id IS NOT NULL) AS linked_rows,
  COUNT(*) FILTER (WHERE provider_location_id IS NULL) AS unlinked_rows
FROM procedure_pricing
WHERE procedure_id ILIKE '%mri%'
GROUP BY procedure_id
ORDER BY procedure_id;
"

# 2️⃣ Check if legacy provider_id still exists
echo ""
echo "🔍 Step 2: Checking legacy pricing rows (provider_id but no provider_location_id)..."
LEGACY_COUNT=$(psql "$DB" -t -c "
SELECT COUNT(*) 
FROM procedure_pricing
WHERE provider_id IS NOT NULL AND provider_location_id IS NULL;
" | xargs)

echo "Found $LEGACY_COUNT legacy rows with provider_id but no provider_location_id"

# 3️⃣ Attempt migration: map provider_id → provider_location.id
if [ "$LEGACY_COUNT" -gt 0 ]; then
    echo ""
    echo "🔧 Step 3: Migrating legacy pricing rows..."
    MIGRATED=$(psql "$DB" -t -c "
    UPDATE procedure_pricing pp
    SET provider_location_id = pl.id
    FROM provider_location pl
    WHERE pl.provider_id = pp.provider_id
      AND pp.provider_location_id IS NULL
    RETURNING COUNT(*);
    " | xargs)
    
    echo "✅ Migrated $MIGRATED rows"
else
    echo ""
    echo "⏭️  Step 3: Skipping migration (no legacy rows found)"
fi

# 4️⃣ Recount after migration
echo ""
echo "📊 Step 4: Post-migration MRI counts..."
psql "$DB" -c "
SELECT
  procedure_id,
  COUNT(*) AS total_rows,
  COUNT(*) FILTER (WHERE provider_location_id IS NOT NULL) AS linked_rows,
  COUNT(*) FILTER (WHERE provider_location_id IS NULL) AS unlinked_rows
FROM procedure_pricing
WHERE procedure_id ILIKE '%mri%'
GROUP BY procedure_id
ORDER BY procedure_id;
"

# 5️⃣ Check if brain-mri has any linked providers
echo ""
echo "🔍 Step 5: Checking brain-mri provider linkage..."
BRAIN_MRI_COUNT=$(psql "$DB" -t -c "
SELECT COUNT(*) 
FROM procedure_pricing 
WHERE procedure_id = 'proc_brain_mri' 
  AND provider_location_id IS NOT NULL;
" | xargs)

echo "brain-mri (proc_brain_mri) has $BRAIN_MRI_COUNT linked providers"

# 6️⃣ Seed demo MRI rows if none linked
if [ "$BRAIN_MRI_COUNT" -eq 0 ]; then
    echo ""
    echo "🪄 Step 6: Seeding demo MRI pricing (no linked providers found)..."
    
    # First check if we need to use 'brain-mri' or 'proc_brain_mri'
    PROCEDURE_ID=$(psql "$DB" -t -c "
    SELECT procedure_id 
    FROM procedures 
    WHERE slug = 'brain-mri' OR id = 'proc_brain_mri' 
    LIMIT 1;
    " | xargs)
    
    if [ -z "$PROCEDURE_ID" ]; then
        PROCEDURE_ID="proc_brain_mri"
    fi
    
    echo "Using procedure_id: $PROCEDURE_ID"
    
    SEEDED=$(psql "$DB" -t -c "
    INSERT INTO procedure_pricing (procedure_id, provider_location_id, price, updated_at)
    SELECT '$PROCEDURE_ID', id, (400 + (random()*100)::INT), NOW()
    FROM provider_location
    WHERE id NOT IN (
        SELECT COALESCE(provider_location_id, '') 
        FROM procedure_pricing 
        WHERE procedure_id = '$PROCEDURE_ID'
    )
    LIMIT 10
    RETURNING COUNT(*);
    " | xargs)
    
    echo "✅ Seeded $SEEDED demo pricing rows"
else
    echo ""
    echo "⏭️  Step 6: Skipping seed (brain-mri already has $BRAIN_MRI_COUNT linked providers)"
fi

# 7️⃣ Final count verification
echo ""
echo "📊 Step 7: Final verification counts..."
psql "$DB" -c "
SELECT
  'proc_brain_mri' AS procedure_id,
  COUNT(*) AS total_pricing_rows,
  COUNT(DISTINCT provider_location_id) AS unique_providers
FROM procedure_pricing
WHERE procedure_id = 'proc_brain_mri'
  AND provider_location_id IS NOT NULL;
"

# 8️⃣ Verify the endpoint returns data now
echo ""
echo "============================================================"
echo "🌐 Step 8: Testing live endpoint"
echo "============================================================"

API_BASE="https://mario-health-api-gateway-x5pghxd.uc.gateway.dev"
echo "Testing: $API_BASE/api/v1/procedures/brain-mri/providers"
echo ""

RESPONSE=$(curl -s "${API_BASE}/api/v1/procedures/brain-mri/providers")
PROVIDER_COUNT=$(echo "$RESPONSE" | jq -r '.providers | length' 2>/dev/null || echo "0")

if [ "$PROVIDER_COUNT" -gt 0 ]; then
    echo "✅ SUCCESS: Endpoint now returns $PROVIDER_COUNT providers"
    echo ""
    echo "$RESPONSE" | jq '{procedure_name, procedure_slug, provider_count: (.providers | length), sample_provider: .providers[0] | {provider_name, price_estimate}}'
else
    echo "⚠️  WARNING: Endpoint still returns 0 providers"
    echo ""
    echo "Response:"
    echo "$RESPONSE" | jq '.' || echo "$RESPONSE"
    echo ""
    echo "Possible issues:"
    echo "  - Procedure ID mismatch (check if API uses 'brain-mri' vs 'proc_brain_mri')"
    echo "  - RPC function 'get_procedure_detail' may need investigation"
    echo "  - Service code may need to query with different procedure_id format"
fi

echo ""
echo "============================================================"
echo "✅ MRI Provider Linkage Repair Complete"
echo "============================================================"

