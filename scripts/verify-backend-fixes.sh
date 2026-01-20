#!/bin/bash

# Verification script for backend fixes
# Tests both endpoints that were returning 500 errors

API_BASE="https://mario-health-api-ei5wbr4h5a-uc.a.run.app/api/v1"

echo "=========================================="
echo "Backend Fix Verification"
echo "=========================================="
echo ""

echo "Test 1: Provider Detail (NPI 1184731119)"
echo "------------------------------------------"
PROVIDER_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "${API_BASE}/providers/1184731119")
HTTP_STATUS=$(echo "$PROVIDER_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$PROVIDER_RESPONSE" | sed '/HTTP_STATUS/d')

echo "Status: $HTTP_STATUS"
if [ "$HTTP_STATUS" = "404" ] || [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ PASS - No longer returning 500"
    echo "Response preview: $(echo "$BODY" | head -c 200)"
else
    echo "❌ FAIL - Still returning $HTTP_STATUS"
    echo "$BODY"
fi
echo ""

echo "Test 2: Brain MRI Orgs"
echo "------------------------------------------"
BRAIN_MRI_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "${API_BASE}/procedures/brain-mri/orgs?zip_code=10016&radius_miles=60")
HTTP_STATUS=$(echo "$BRAIN_MRI_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$BRAIN_MRI_RESPONSE" | sed '/HTTP_STATUS/d')

echo "Status: $HTTP_STATUS"
if [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "404" ]; then
    echo "✅ PASS - No longer timing out"
    echo "Response preview: $(echo "$BODY" | head -c 200)"
else
    echo "❌ FAIL - Still returning $HTTP_STATUS"
    echo "$BODY"
fi
echo ""

echo "=========================================="
echo "Verification Complete"
echo "=========================================="
