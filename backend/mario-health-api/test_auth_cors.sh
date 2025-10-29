#!/bin/bash
# Test script for CORS and authentication
# Usage: ./test_auth_cors.sh [token]

TOKEN="${1:-}"

echo "Testing CORS and Authentication"
echo "================================"
echo ""

# Test 1: CORS preflight (OPTIONS request)
echo "1. Testing CORS preflight (OPTIONS)..."
curl -X OPTIONS \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: authorization,content-type" \
  -v http://127.0.0.1:8000/api/v1/categories 2>&1 | grep -E "(< HTTP|< access-control)"

echo ""
echo ""

# Test 2: GET without auth (should work for public endpoints)
echo "2. Testing GET /api/v1/categories without auth..."
curl -X GET \
  -H "Origin: http://localhost:3000" \
  -H "Content-Type: application/json" \
  -v http://127.0.0.1:8000/api/v1/categories 2>&1 | grep -E "(< HTTP|< access-control)"

echo ""
echo ""

# Test 3: GET with auth (if token provided)
if [ -n "$TOKEN" ]; then
    echo "3. Testing GET /api/v1/categories with auth..."
    curl -X GET \
      -H "Origin: http://localhost:3000" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -v http://127.0.0.1:8000/api/v1/categories 2>&1 | grep -E "(< HTTP|< access-control)"
else
    echo "3. Skipping auth test (no token provided)"
    echo "   To test with auth, run: ./test_auth_cors.sh \$(curl -s http://localhost:3000/api/auth/token | jq -r .token)"
fi

echo ""
echo ""
echo "Done!"

