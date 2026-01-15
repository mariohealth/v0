#!/bin/bash
# Quick CORS test for local development

echo "🧪 Testing CORS for local development..."
echo ""

# Test localhost:3000
echo "Testing localhost:3000:"
curl -s -I -X OPTIONS http://localhost:8000/health \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" | grep -i "access-control"

echo ""

# Test localhost:3001
echo "Testing localhost:3001:"
curl -s -I -X OPTIONS http://localhost:8000/health \
  -H "Origin: http://localhost:3001" \
  -H "Access-Control-Request-Method: GET" | grep -i "access-control"

echo ""

# Test 127.0.0.1:3000
echo "Testing 127.0.0.1:3000:"
curl -s -I -X OPTIONS http://localhost:8000/health \
  -H "Origin: http://127.0.0.1:3000" \
  -H "Access-Control-Request-Method: GET" | grep -i "access-control"

echo ""

# Test 127.0.0.1:3001
echo "Testing 127.0.0.1:3001:"
curl -s -I -X OPTIONS http://localhost:8000/health \
  -H "Origin: http://127.0.0.1:3001" \
  -H "Access-Control-Request-Method: GET" | grep -i "access-control"

echo ""
echo "✅ If you see 'access-control-allow-origin' headers above, CORS is working!"
