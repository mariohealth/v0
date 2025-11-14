#!/bin/bash
# === Mario Health — API Endpoint Verification (Procedures & Providers) ===

API_URL="http://localhost:8000/api/v1"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=== Testing API Endpoints ==="
echo "API URL: $API_URL"
echo ""

# Check if backend is running
if ! curl -s "$API_URL/health" > /dev/null 2>&1; then
    echo -e "${RED}❌ Backend not running on $API_URL${NC}"
    echo ""
    echo "To start the backend:"
    echo "  cd backend/mario-health-api"
    echo "  source .venv/bin/activate"
    echo "  python3 -m uvicorn app.main:app --reload"
    echo ""
    exit 1
fi

echo -e "${GREEN}✓ Backend is running${NC}"
echo ""

# Test 1: Procedure Search
echo "=== Testing Procedure Search ==="
RESULT=$(curl -s "$API_URL/search?q=mri" 2>&1)
if echo "$RESULT" | jq -e '.results' > /dev/null 2>&1; then
    COUNT=$(echo "$RESULT" | jq '.results | length')
    if [ "$COUNT" -gt 0 ]; then
        echo -e "${GREEN}✅ Found $COUNT procedures${NC}"
        echo "$RESULT" | jq '.results[0:3] | map({procedure_id, procedure_name, procedure_slug})'
    else
        echo -e "${YELLOW}⚠️  Empty results (expected until seeding is done)${NC}"
        echo "$RESULT" | jq '.'
    fi
else
    echo -e "${RED}❌ Error or invalid response${NC}"
    echo "$RESULT" | head -5
fi
echo ""

# Test 2: Procedure Detail
echo "=== Testing Procedure Detail ==="
RESULT=$(curl -s "$API_URL/procedures/brain-mri" 2>&1)
if echo "$RESULT" | jq -e '.id' > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Procedure found${NC}"
    echo "$RESULT" | jq '{id, name, slug, family_name}'
elif echo "$RESULT" | jq -e '.detail' > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Procedure not found${NC}"
    echo "$RESULT" | jq '.'
else
    echo -e "${RED}❌ Error or invalid response${NC}"
    echo "$RESULT" | head -5
fi
echo ""

# Test 3: Providers for MRI
echo "=== Testing Providers for MRI ==="
RESULT=$(curl -s "$API_URL/procedures/brain-mri/providers" 2>&1)
if echo "$RESULT" | jq -e '.providers' > /dev/null 2>&1; then
    COUNT=$(echo "$RESULT" | jq '.providers | length')
    if [ "$COUNT" -gt 0 ]; then
        echo -e "${GREEN}✅ Found $COUNT providers${NC}"
        echo "$RESULT" | jq '{slug:"brain-mri", provider_count:(.providers | length), sample:(.providers[0:2] | map({name, price}))}'
    else
        echo -e "${YELLOW}⚠️  No providers found (expected - MRI has no pricing data)${NC}"
        echo "$RESULT" | jq '{slug:"brain-mri", provider_count:(.providers | length)}'
    fi
else
    echo -e "${RED}❌ Error or invalid response${NC}"
    echo "$RESULT" | head -5
fi
echo ""

# Test 4: Provider Detail (using a sample provider ID)
echo "=== Testing Provider Detail Endpoint ==="
# Try to get a provider ID from pricing data or use a known ID
PROVIDER_ID="sf_001_1851457980"  # Sample provider ID from our earlier checks
RESULT=$(curl -s "$API_URL/providers/$PROVIDER_ID" 2>&1)
if echo "$RESULT" | jq -e '.provider_id' > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Provider found${NC}"
    echo "$RESULT" | jq '{provider_id, provider_name, city, state}'
elif echo "$RESULT" | jq -e '.detail' > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Provider not found (ID: $PROVIDER_ID)${NC}"
    echo "$RESULT" | jq '.'
else
    echo -e "${YELLOW}⚠️  Provider endpoint requires specific provider ID${NC}"
    echo "Note: There's no list endpoint - use /api/v1/providers/{provider_id}"
    echo "$RESULT" | head -5
fi
echo ""

echo "✅ API endpoint checks complete"

