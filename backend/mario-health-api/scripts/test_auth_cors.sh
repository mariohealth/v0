#!/bin/bash
# Comprehensive test script for CORS and authentication
# Usage: ./test_auth_cors.sh [token] [api_url]
#
# Examples:
#   ./test_auth_cors.sh  # Test without token
#   ./test_auth_cors.sh $(curl -s http://localhost:3000/api/auth/token | jq -r .token)  # Test with token
#   ./test_auth_cors.sh <token> http://localhost:8000  # Test against local backend

TOKEN="${1:-}"
API_URL="${2:-http://127.0.0.1:8000}"

echo "=========================================="
echo "Testing CORS and Authentication"
echo "=========================================="
echo "API URL: $API_URL"
echo "Token: ${TOKEN:0:20}..."  # Show first 20 chars only
echo ""

# Test 1: Health check (no CORS needed)
echo "1. Health Check (no CORS)..."
curl -s -X GET "$API_URL/health" | jq '.' || echo "Failed"
echo ""

# Test 2: CORS preflight (OPTIONS request)
echo "2. CORS Preflight (OPTIONS)..."
RESPONSE=$(curl -s -X OPTIONS \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: authorization,content-type" \
  -v "$API_URL/api/v1/categories" 2>&1)
echo "$RESPONSE" | grep -E "(< HTTP|< access-control)" || echo "⚠️  No CORS headers found"
echo ""

# Test 3: GET public endpoint without auth
echo "3. Public Endpoint (no auth required)..."
RESPONSE=$(curl -s -X GET \
  -H "Origin: http://localhost:3000" \
  -H "Content-Type: application/json" \
  -v "$API_URL/api/v1/categories" 2>&1)
HTTP_STATUS=$(echo "$RESPONSE" | grep -oP '< HTTP/\d\.\d \K\d{3}')
CORS_ORIGIN=$(echo "$RESPONSE" | grep -i "access-control-allow-origin" | head -1)
echo "HTTP Status: $HTTP_STATUS"
echo "$CORS_ORIGIN"
echo ""

# Test 4: Whoami endpoint without token (should fail)
echo "4. Whoami Endpoint WITHOUT token (should return 401)..."
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X GET \
  -H "Origin: http://localhost:3000" \
  -H "Content-Type: application/json" \
  "$API_URL/api/v1/whoami")
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
echo "HTTP Status: $HTTP_STATUS"
echo "$RESPONSE" | grep -v "HTTP_STATUS" | jq '.' 2>/dev/null || echo "$RESPONSE" | grep -v "HTTP_STATUS"
echo ""

# Test 5: Whoami endpoint with invalid token (should fail)
if [ -n "$TOKEN" ]; then
    echo "5. Whoami Endpoint WITH token..."
    RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X GET \
      -H "Origin: http://localhost:3000" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      "$API_URL/api/v1/whoami")
    HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
    echo "HTTP Status: $HTTP_STATUS"
    echo "$RESPONSE" | grep -v "HTTP_STATUS" | jq '.' 2>/dev/null || echo "$RESPONSE" | grep -v "HTTP_STATUS"
    echo ""
    
    # Test 6: Test authenticated endpoint with token
    echo "6. Authenticated Endpoint (categories) WITH token..."
    RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X GET \
      -H "Origin: http://localhost:3000" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      "$API_URL/api/v1/categories")
    HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
    echo "HTTP Status: $HTTP_STATUS"
    echo "$RESPONSE" | grep -v "HTTP_STATUS" | jq '.[:2]' 2>/dev/null || echo "$RESPONSE" | grep -v "HTTP_STATUS" | head -5
    echo ""
    
    # Test 7: Test with expired/invalid token
    echo "7. Testing with invalid token format..."
    INVALID_TOKEN="invalid.token.here"
    RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X GET \
      -H "Origin: http://localhost:3000" \
      -H "Authorization: Bearer $INVALID_TOKEN" \
      -H "Content-Type: application/json" \
      "$API_URL/api/v1/whoami")
    HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
    echo "HTTP Status: $HTTP_STATUS"
    echo "$RESPONSE" | grep -v "HTTP_STATUS" | jq '.' 2>/dev/null || echo "$RESPONSE" | grep -v "HTTP_STATUS"
    echo ""
else
    echo "5-7. Skipping token tests (no token provided)"
    echo "   To test with token, run: ./test_auth_cors.sh \$(curl -s http://localhost:3000/api/auth/token | jq -r .token)"
    echo ""
fi

# Test 8: Whoami test endpoint (no auth required)
echo "8. Whoami Test Endpoint (no auth required)..."
curl -s -X GET "$API_URL/api/v1/whoami/test" | jq '.'
echo ""

echo "=========================================="
echo "Test Summary"
echo "=========================================="
echo "✓ Check backend logs for detailed token verification logs"
echo "✓ Verify CORS headers are present for localhost:3000"
echo "✓ Check that token claims (iss, aud, email) are logged"
echo ""
echo "Done!"

