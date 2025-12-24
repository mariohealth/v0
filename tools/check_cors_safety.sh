#!/bin/bash

# CORS Safety Check for Mario Health Frontend
# This script ensures no absolute gateway URLs are hardcoded in the frontend.

COLOR_RED='\033[0;31m'
COLOR_GREEN='\033[0;32m'
COLOR_YELLOW='\033[1;33m'
COLOR_NC='\033[0m'

echo -e "${COLOR_YELLOW}Running CORS Safety Check...${COLOR_NC}"

# Define forbidden patterns
# We exclude SVG namespaces, common external CDNs, and legitimate external links
FORBIDDEN_GATEWAY="gateway.dev"
FORBIDDEN_PROD_URL="mariohealth.com/api"

FAIL=0

# Search for gateway.dev
VIOLATIONS=$(grep -r "$FORBIDDEN_GATEWAY" frontend/src --exclude-dir=node_modules --exclude=*.md)
if [ ! -z "$VIOLATIONS" ]; then
    echo -e "${COLOR_RED}ERROR: Found hardcoded gateway.dev URLs in frontend/src:${COLOR_NC}"
    echo "$VIOLATIONS"
    FAIL=1
fi

# Search for absolute internal API calls (https://mariohealth.com/api/v1/...)
# This is tricky due to valid external links, so we focus on our domain
VIOLATIONS_INTERNAL=$(grep -r "https://mariohealth.com/api" frontend/src --exclude-dir=node_modules)
if [ ! -z "$VIOLATIONS_INTERNAL" ]; then
    echo -e "${COLOR_RED}ERROR: Found absolute internal API URLs in frontend/src:${COLOR_NC}"
    echo "$VIOLATIONS_INTERNAL"
    FAIL=1
fi

if [ $FAIL -eq 1 ]; then
    echo -e "${COLOR_RED}CORS Safety Check FAILED. Please use getApiBaseUrl() from @/lib/api-base instead.${COLOR_NC}"
    exit 1
else
    echo -e "${COLOR_GREEN}CORS Safety Check PASSED. All internal calls appear same-origin safe.${COLOR_NC}"
    exit 0
fi
