#!/bin/bash
# Local Dev CORS + Auth Test Script
# Tests CORS preflight and authenticated requests from localhost:3000
#
# Usage:
#   ./scripts/test-cors-local-dev.sh [gateway_url] [firebase_token]
#
# Examples:
#   ./scripts/test-cors-local-dev.sh
#   ./scripts/test-cors-local-dev.sh https://mario-health-api-gateway-x5pghxd.uc.gateway.dev
#   ./scripts/test-cors-local-dev.sh https://mario-health-api-gateway-x5pghxd.uc.gateway.dev $(firebase auth:print-token)

set -e

GATEWAY_URL="${1:-https://mario-health-api-gateway-x5pghxd.uc.gateway.dev}"
FIREBASE_TOKEN="${2:-}"

ORIGIN="http://localhost:3000"
API_BASE="${GATEWAY_URL}/api/v1"

echo "=========================================="
echo "🧪 CORS + Firebase Auth Local Dev Test"
echo "=========================================="
echo "Gateway URL: $GATEWAY_URL"
echo "Origin: $ORIGIN"
echo "Token: ${FIREBASE_TOKEN:0:30}..."  # Show first 30 chars only
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

test_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ PASS${NC}: $2"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC}: $2"
        ((FAILED++))
    fi
}

# Test 1: Health Check (no CORS needed)
echo "1️⃣  Testing Health Check..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${GATEWAY_URL}/health")
if [ "$HTTP_CODE" = "200" ]; then
    test_result 0 "Health check returns 200"
else
    test_result 1 "Health check returned $HTTP_CODE (expected 200)"
fi
echo ""

# Test 2: CORS Preflight (OPTIONS)
echo "2️⃣  Testing CORS Preflight (OPTIONS)..."
OPTIONS_RESPONSE=$(curl -s -X OPTIONS \
  -H "Origin: $ORIGIN" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: authorization,content-type" \
  -w "\nHTTP_CODE:%{http_code}" \
  "${API_BASE}/categories" 2>&1)

HTTP_CODE=$(echo "$OPTIONS_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
HAS_CORS_ORIGIN=$(echo "$OPTIONS_RESPONSE" | grep -i "access-control-allow-origin" | grep -i "$ORIGIN" || echo "")

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "204" ]; then
    if [ -n "$HAS_CORS_ORIGIN" ]; then
        test_result 0 "OPTIONS returns $HTTP_CODE with correct CORS origin"
    else
        test_result 1 "OPTIONS returns $HTTP_CODE but missing CORS origin header"
    fi
else
    test_result 1 "OPTIONS returned $HTTP_CODE (expected 200 or 204)"
fi
echo ""

# Test 3: Public Endpoint (No Auth)
echo "3️⃣  Testing Public Endpoint (No Auth)..."
GET_RESPONSE=$(curl -s -X GET \
  -H "Origin: $ORIGIN" \
  -H "Content-Type: application/json" \
  -w "\nHTTP_CODE:%{http_code}" \
  "${API_BASE}/categories" 2>&1)

HTTP_CODE=$(echo "$GET_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
HAS_CORS_ORIGIN=$(echo "$GET_RESPONSE" | grep -i "access-control-allow-origin" | grep -i "$ORIGIN" || echo "")

if [ "$HTTP_CODE" = "200" ]; then
    if [ -n "$HAS_CORS_ORIGIN" ]; then
        test_result 0 "GET returns 200 with correct CORS headers"
    else
        test_result 1 "GET returns 200 but missing CORS origin header"
    fi
else
    test_result 1 "GET returned $HTTP_CODE (expected 200)"
fi
echo ""

# Test 4: Authenticated Endpoint (Without Token - Should Fail)
echo "4️⃣  Testing Authenticated Endpoint (No Token - Expected 401)..."
AUTH_RESPONSE=$(curl -s -X GET \
  -H "Origin: $ORIGIN" \
  -H "Content-Type: application/json" \
  -w "\nHTTP_CODE:%{http_code}" \
  "${API_BASE}/whoami" 2>&1)

HTTP_CODE=$(echo "$AUTH_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)

if [ "$HTTP_CODE" = "401" ]; then
    test_result 0 "Unauthenticated request correctly returns 401"
else
    test_result 1 "Unauthenticated request returned $HTTP_CODE (expected 401)"
fi
echo ""

# Test 5: Authenticated Endpoint (With Token - If Provided)
if [ -n "$FIREBASE_TOKEN" ]; then
    echo "5️⃣  Testing Authenticated Endpoint (With Token)..."
    AUTH_RESPONSE=$(curl -s -X GET \
      -H "Origin: $ORIGIN" \
      -H "Authorization: Bearer $FIREBASE_TOKEN" \
      -H "Content-Type: application/json" \
      -w "\nHTTP_CODE:%{http_code}" \
      "${API_BASE}/whoami" 2>&1)

    HTTP_CODE=$(echo "$AUTH_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
    HAS_CORS_ORIGIN=$(echo "$AUTH_RESPONSE" | grep -i "access-control-allow-origin" | grep -i "$ORIGIN" || echo "")

    if [ "$HTTP_CODE" = "200" ]; then
        if [ -n "$HAS_CORS_ORIGIN" ]; then
            test_result 0 "Authenticated request returns 200 with CORS headers"
        else
            test_result 1 "Authenticated request returns 200 but missing CORS headers"
        fi
    elif [ "$HTTP_CODE" = "401" ]; then
        test_result 1 "Token appears invalid (returned 401)"
    else
        test_result 1 "Unexpected status code: $HTTP_CODE"
    fi
    echo ""
else
    echo "5️⃣  Skipping authenticated test (no token provided)"
    echo "   To test with token: ./scripts/test-cors-local-dev.sh $GATEWAY_URL <your_firebase_token>"
    echo ""
fi

# Summary
echo "=========================================="
echo "📊 Test Summary"
echo "=========================================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed! CORS and Auth are configured correctly.${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed. Check the output above for details.${NC}"
    exit 1
fi

