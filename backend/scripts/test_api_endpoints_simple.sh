#!/bin/bash
# === Mario Health — API Endpoint Verification (Procedures & Providers) ===

API_URL="http://localhost:8000/api/v1"

echo "=== Testing Procedure Search ==="
# Note: /api/v1/procedures?q=mri redirects to /api/v1/search?q=mri
# The response has 'results' not 'procedures'
RESULT=$(curl -s -L "$API_URL/procedures?q=mri")
if echo "$RESULT" | jq -e '.results' > /dev/null 2>&1; then
    echo "$RESULT" | jq '.results[0:3] | map({procedure_id: .procedure_id, name: .procedure_name, slug: .procedure_slug})'
elif echo "$RESULT" | jq -e '.procedures' > /dev/null 2>&1; then
    echo "$RESULT" | jq '.procedures[0:3] | map({id, name, slug})'
else
    echo "$RESULT" | jq '.'
fi

echo ""
echo "=== Testing Procedure Detail ==="
curl -s "$API_URL/procedures/brain-mri" | jq '{id, name, slug, family_name}'

echo ""
echo "=== Testing Providers for MRI ==="
curl -s "$API_URL/procedures/brain-mri/providers" | jq '{slug:"brain-mri", provider_count:(.providers | length), sample:(.providers[0:2] | map({name, price}))}'

echo ""
echo "=== Testing Provider List Endpoint ==="
# Note: /api/v1/providers doesn't exist - it requires a provider_id
# This will return 404, but we'll show the response
RESULT=$(curl -s "$API_URL/providers")
if echo "$RESULT" | jq -e '.providers' > /dev/null 2>&1; then
    echo "$RESULT" | jq '.providers[0:3] | map({id, name, city, state})'
else
    echo "$RESULT" | jq '.'
    echo "Note: Provider list endpoint doesn't exist. Use /api/v1/providers/{provider_id} for individual providers."
fi

echo ""
echo "✅ API endpoint checks complete"

