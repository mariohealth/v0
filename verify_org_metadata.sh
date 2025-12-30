#!/bin/bash
set -e

echo "=== Org Metadata Deployment Verification ==="
echo ""

echo "1. Checking API response for nyc_006..."
curl -s "https://mario-health-api-gateway-x5pghxd.uc.gateway.dev/api/v1/procedures/brain-mri/orgs" \
  | jq '.orgs[] | select(.org_id=="nyc_006") | {org_id, org_name, address, phone, city, state, zip_code, min_price, max_price}'

echo ""
echo "2. Checking available keys in first org row..."
curl -s "https://mario-health-api-gateway-x5pghxd.uc.gateway.dev/api/v1/procedures/brain-mri/orgs" \
  | jq '.orgs[0] | keys | sort'

echo ""
echo "3. Verifying org_name is populated (not null)..."
ORG_NAME=$(curl -s "https://mario-health-api-gateway-x5pghxd.uc.gateway.dev/api/v1/procedures/brain-mri/orgs" \
  | jq -r '.orgs[] | select(.org_id=="nyc_006") | .org_name' | head -1)

if [ "$ORG_NAME" != "null" ] && [ -n "$ORG_NAME" ]; then
  echo "✅ SUCCESS: org_name is populated: $ORG_NAME"
else
  echo "❌ FAIL: org_name is null or missing"
  exit 1
fi

echo ""
echo "=== Verification Complete ==="
