#!/bin/bash

# Mario Health API Test Script
BASE_URL="${1:-http://localhost:8000}"

echo "Testing Mario Health API at: $BASE_URL"
echo "=========================================="

# Health check
echo -e "\n1. Health Check"
curl -s "$BASE_URL/health" | jq .

# Categories
echo -e "\n2. Categories"
curl -s "$BASE_URL/api/v1/categories" | jq '.categories[0]'

# Search
echo -e "\n3. Search (basic)"
curl -s "$BASE_URL/api/v1/search?q=chest" | jq '.results[0]'

# Search with location
echo -e "\n4. Search (with location)"
curl -s "$BASE_URL/api/v1/search?q=mri&zip=02138&radius=25" | jq '.results[0]'

echo -e "\n=========================================="
echo "Tests completed!"
