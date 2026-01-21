#!/bin/bash
set -e

# Configuration
SERVICE_URL="https://mario-health-api-ei5wbr4h5a-uc.a.run.app"

echo "🧪 Running Production Smoke Tests against ${SERVICE_URL}..."

# 1. Health Check & SHA Verification
echo -n "   - [Health] Checking /health... "
HEALTH_RESP=$(curl -s "${SERVICE_URL}/health")
if echo "$HEALTH_RESP" | grep -q '"status":"healthy"'; then
    SHA=$(echo "$HEALTH_RESP" | python3 -c "import sys, json; print(json.load(sys.stdin).get('git_sha', 'unknown'))")
    echo "✅ OK (SHA: $SHA)"
else
    echo "❌ FAILED (Response: $HEALTH_RESP)"
    exit 1
fi

# 2. Specialty Search (200 OK)
echo -n "   - [Search] Checking /api/v1/specialties/cardiologist/providers... "
SEARCH_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${SERVICE_URL}/api/v1/specialties/cardiologist/providers?limit=1&zip_code=10001&radius_miles=25")
if [ "$SEARCH_CODE" -eq 200 ]; then
    echo "✅ OK (200)"
else
    echo "❌ FAILED (Code: $SEARCH_CODE)"
    exit 1
fi

# 3. Known Provider (200 OK)
echo -n "   - [Provider] Checking Known NPI (1083971816)... "
PROV_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${SERVICE_URL}/api/v1/providers/1083971816")
if [ "$PROV_CODE" -eq 200 ]; then
    echo "✅ OK (200)"
else
    echo "❌ FAILED (Code: $PROV_CODE)"
    exit 1
fi

# 4. Unknown Provider (404 Not Found)
echo -n "   - [Provider] Checking Unknown NPI (9999999999)... "
UNK_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${SERVICE_URL}/api/v1/providers/9999999999")
if [ "$UNK_CODE" -eq 404 ]; then
    echo "✅ OK (404)"
else
    echo "❌ FAILED (Code: $UNK_CODE)"
    exit 1
fi

echo ""
echo "🎉 ALL SMOKE TESTS PASSED!"
