#!/bin/bash
#
# Manual API Test Script (Non-blocking)
# Run this manually to test API endpoints before deployment
#

set -e

echo "🧪 Testing API endpoints..."

API_URL="${NEXT_PUBLIC_API_URL:-https://mario-health-api-gateway-x5pghxd.uc.gateway.dev}"

echo "📍 API URL: $API_URL"
echo ""

# Test search endpoint
echo "🔍 Testing search endpoint..."
SEARCH_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -m 5 "$API_URL/api/v1/search?q=mri&zip_code=10001&radius=25" || echo "HTTP_CODE:000")

HTTP_CODE=$(echo "$SEARCH_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Search endpoint: OK"
else
    echo "⚠️  Search endpoint: HTTP $HTTP_CODE (may be expected if backend is down)"
fi

# Test health endpoint (if available)
echo ""
echo "🏥 Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -m 5 "$API_URL/health" 2>/dev/null || echo "HTTP_CODE:000")
HEALTH_CODE=$(echo "$HEALTH_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)

if [ "$HEALTH_CODE" = "200" ]; then
    echo "✅ Health endpoint: OK"
elif [ "$HEALTH_CODE" = "000" ]; then
    echo "⚠️  Health endpoint: Not available (may be expected)"
else
    echo "⚠️  Health endpoint: HTTP $HEALTH_CODE"
fi

echo ""
echo "✅ Manual API test complete (non-blocking)"
echo "💡 To test with different API URL: NEXT_PUBLIC_API_URL=<url> ./scripts/test-api.sh"

