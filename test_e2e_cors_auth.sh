#!/bin/bash
# End-to-End CORS and Authentication Test Script for Mario Health
# Tests FastAPI backend and Next.js frontend integration

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKEND_URL="${BACKEND_URL:-http://127.0.0.1:8000}"
FRONTEND_URL="${FRONTEND_URL:-http://localhost:3000}"
TEST_ORIGINS=(
    "http://localhost:3000"
    "http://127.0.0.1:3000"
    "https://mario-health-frontend.vercel.app"
)

# Test results tracking
PASSED=0
FAILED=0
WARNINGS=0

# Function to print test header
print_test() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}TEST: $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Function to check status
check_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ PASSED${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC}"
        ((FAILED++))
    fi
}

# Function to log request/response
log_request() {
    echo -e "\n${YELLOW}Request:${NC}"
    echo "  URL: $1"
    echo "  Method: $2"
    [ -n "$3" ] && echo "  Headers: $3"
}

log_response() {
    echo -e "\n${YELLOW}Response:${NC}"
    echo "  Status: $1"
    [ -n "$2" ] && echo "  Headers: $2"
    [ -n "$3" ] && echo "  Body: $3"
}

# Start testing
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  Mario Health E2E CORS & Authentication Test Suite          ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"

# Step 1: Check if backend is running
print_test "1. Backend Health Check"
echo "Checking if backend is accessible at $BACKEND_URL..."
HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" "$BACKEND_URL/health" || echo -e "\n000")
HEALTH_STATUS=$(echo "$HEALTH_RESPONSE" | tail -n 1)
HEALTH_BODY=$(echo "$HEALTH_RESPONSE" | sed '$d')

if [ "$HEALTH_STATUS" = "200" ]; then
    echo -e "${GREEN}✓ Backend is running${NC}"
    echo "  Response: $HEALTH_BODY"
    ((PASSED++))
else
    echo -e "${RED}✗ Backend is not accessible (Status: $HEALTH_STATUS)${NC}"
    echo -e "${YELLOW}⚠  Please start the backend with: cd backend/mario-health-api && uvicorn app.main:app --reload${NC}"
    ((FAILED++))
    exit 1
fi

# Step 2: Check if frontend is running and get token
print_test "2. Frontend Token Endpoint Check"
echo "Checking if frontend token endpoint is accessible at $FRONTEND_URL/api/auth/token..."
TOKEN_RESPONSE=$(curl -s -w "\n%{http_code}" "$FRONTEND_URL/api/auth/token" || echo -e "\n000")
TOKEN_STATUS=$(echo "$TOKEN_RESPONSE" | tail -n 1)
TOKEN_BODY=$(echo "$TOKEN_RESPONSE" | sed '$d')

if [ "$TOKEN_STATUS" = "200" ]; then
    TOKEN=$(echo "$TOKEN_BODY" | jq -r '.token' 2>/dev/null || echo "")
    if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
        echo -e "${GREEN}✓ Token retrieved successfully${NC}"
        echo "  Token preview: ${TOKEN:0:50}..."
        ((PASSED++))
        
        # Decode token to get claims
        echo -e "\n${YELLOW}Token Claims (decoded):${NC}"
        TOKEN_PARTS=($(echo $TOKEN | tr '.' ' '))
        if [ ${#TOKEN_PARTS[@]} -ge 2 ]; then
            PAYLOAD="${TOKEN_PARTS[1]}"
            # Add padding if needed
            PADDING=$((4 - ${#PAYLOAD} % 4))
            [ $PADDING -ne 4 ] && PAYLOAD="${PAYLOAD}$(printf '%*s' $PADDING | tr ' ' '=')"
            DECODED=$(echo "$PAYLOAD" | base64 -d 2>/dev/null | jq '.' 2>/dev/null || echo "Could not decode")
            echo "  $DECODED" | head -10
        fi
    else
        echo -e "${YELLOW}⚠ Token endpoint returned 200 but no token in response${NC}"
        echo "  Response: $TOKEN_BODY"
        ((WARNINGS++))
        TOKEN=""
    fi
else
    echo -e "${YELLOW}⚠ Frontend token endpoint not accessible (Status: $TOKEN_STATUS)${NC}"
    echo "  This is okay if frontend auth is not configured yet"
    ((WARNINGS++))
    TOKEN=""
fi

# Step 3: CORS Preflight Tests
print_test "3. CORS Preflight (OPTIONS) Requests"
for ORIGIN in "${TEST_ORIGINS[@]}"; do
    echo -e "\n${YELLOW}Testing origin: $ORIGIN${NC}"
    
    OPTIONS_RESPONSE=$(curl -s -i -X OPTIONS \
        -H "Origin: $ORIGIN" \
        -H "Access-Control-Request-Method: GET" \
        -H "Access-Control-Request-Headers: authorization,content-type" \
        "$BACKEND_URL/api/v1/categories" 2>&1)
    
    OPTIONS_STATUS=$(echo "$OPTIONS_RESPONSE" | grep -i "HTTP/" | awk '{print $2}')
    ACAO=$(echo "$OPTIONS_RESPONSE" | grep -i "access-control-allow-origin" | cut -d: -f2 | xargs)
    ACAM=$(echo "$OPTIONS_RESPONSE" | grep -i "access-control-allow-methods" | cut -d: -f2 | xargs)
    ACAH=$(echo "$OPTIONS_RESPONSE" | grep -i "access-control-allow-headers" | cut -d: -f2 | xargs)
    
    log_request "$BACKEND_URL/api/v1/categories" "OPTIONS" "Origin: $ORIGIN"
    log_response "$OPTIONS_STATUS" "ACAO: $ACAO, ACAM: $ACAM, ACAH: $ACAH"
    
    if [ "$OPTIONS_STATUS" = "200" ] || [ "$OPTIONS_STATUS" = "204" ]; then
        if [ "$ACAO" = "$ORIGIN" ] || [ "$ACAO" = "*" ]; then
            echo -e "${GREEN}✓ CORS preflight accepted for $ORIGIN${NC}"
            ((PASSED++))
        else
            echo -e "${RED}✗ CORS preflight failed: Expected $ORIGIN, got '$ACAO'${NC}"
            ((FAILED++))
        fi
    else
        echo -e "${RED}✗ CORS preflight failed: Status $OPTIONS_STATUS${NC}"
        ((FAILED++))
    fi
done

# Step 4: Public Endpoint Tests
print_test "4. Public Endpoint Tests (No Auth Required)"
PUBLIC_ENDPOINTS=(
    "/api/v1/categories"
    "/api/v1/procedures/chest-x-ray-2-views"
    "/health"
)

for ENDPOINT in "${PUBLIC_ENDPOINTS[@]}"; do
    echo -e "\n${YELLOW}Testing: $ENDPOINT${NC}"
    
    RESPONSE=$(curl -s -i \
        -H "Origin: http://localhost:3000" \
        -H "Content-Type: application/json" \
        "$BACKEND_URL$ENDPOINT" 2>&1)
    
    STATUS=$(echo "$RESPONSE" | grep -i "HTTP/" | awk '{print $2}')
    ACAO=$(echo "$RESPONSE" | grep -i "access-control-allow-origin" | cut -d: -f2 | xargs)
    BODY=$(echo "$RESPONSE" | sed -n '/^$/,$p' | tail -n +2 | head -5)
    
    log_request "$BACKEND_URL$ENDPOINT" "GET" "Origin: http://localhost:3000"
    log_response "$STATUS" "ACAO: $ACAO" "$(echo "$BODY" | head -3)"
    
    if [ "$STATUS" = "200" ]; then
        if [ -n "$ACAO" ]; then
            echo -e "${GREEN}✓ Public endpoint accessible with CORS headers${NC}"
            ((PASSED++))
        else
            echo -e "${YELLOW}⚠ Public endpoint accessible but missing CORS headers${NC}"
            ((WARNINGS++))
        fi
    else
        echo -e "${RED}✗ Public endpoint failed: Status $STATUS${NC}"
        ((FAILED++))
    fi
done

# Step 5: Protected Endpoint Tests (if token available)
if [ -n "$TOKEN" ]; then
    print_test "5. Protected Endpoint Tests (With Valid Token)"
    
    echo -e "\n${YELLOW}Testing with Google ID token${NC}"
    AUTH_RESPONSE=$(curl -s -i \
        -H "Origin: http://localhost:3000" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        "$BACKEND_URL/api/v1/categories" 2>&1)
    
    AUTH_STATUS=$(echo "$AUTH_RESPONSE" | grep -i "HTTP/" | awk '{print $2}')
    AUTH_ACAO=$(echo "$AUTH_RESPONSE" | grep -i "access-control-allow-origin" | cut -d: -f2 | xargs)
    AUTH_BODY=$(echo "$AUTH_RESPONSE" | sed -n '/^$/,$p' | tail -n +2 | head -3)
    
    log_request "$BACKEND_URL/api/v1/categories" "GET" "Authorization: Bearer ${TOKEN:0:30}..., Origin: http://localhost:3000"
    log_response "$AUTH_STATUS" "ACAO: $AUTH_ACAO"
    
    if [ "$AUTH_STATUS" = "200" ]; then
        echo -e "${GREEN}✓ Protected endpoint accessible with valid token${NC}"
        ((PASSED++))
    elif [ "$AUTH_STATUS" = "401" ]; then
        echo -e "${YELLOW}⚠ Protected endpoint returned 401 (auth may be required or token invalid)${NC}"
        echo "  Response: $AUTH_BODY"
        ((WARNINGS++))
    else
        echo -e "${RED}✗ Protected endpoint failed: Status $AUTH_STATUS${NC}"
        ((FAILED++))
    fi
else
    echo -e "${YELLOW}⚠ Skipping protected endpoint tests (no token available)${NC}"
fi

# Step 6: Unauthorized Request Tests
print_test "6. Unauthorized Request Tests (No Token)"
echo -e "\n${YELLOW}Testing endpoint without Authorization header${NC}"

UNAUTH_RESPONSE=$(curl -s -i \
    -H "Origin: http://localhost:3000" \
    -H "Content-Type: application/json" \
    "$BACKEND_URL/api/v1/categories" 2>&1)

UNAUTH_STATUS=$(echo "$UNAUTH_RESPONSE" | grep -i "HTTP/" | awk '{print $2}')
UNAUTH_ACAO=$(echo "$UNAUTH_RESPONSE" | grep -i "access-control-allow-origin" | cut -d: -f2 | xargs)

log_request "$BACKEND_URL/api/v1/categories" "GET" "Origin: http://localhost:3000 (no Authorization)"
log_response "$UNAUTH_STATUS" "ACAO: $UNAUTH_ACAO"

if [ "$UNAUTH_STATUS" = "200" ]; then
    echo -e "${GREEN}✓ Public endpoint accessible without auth (expected)${NC}"
    ((PASSED++))
elif [ "$UNAUTH_STATUS" = "401" ]; then
    echo -e "${YELLOW}⚠ Endpoint requires auth (may be protected)${NC}"
    ((WARNINGS++))
else
    echo -e "${RED}✗ Unexpected status: $UNAUTH_STATUS${NC}"
    ((FAILED++))
fi

# Step 7: Invalid Token Tests
print_test "7. Invalid Token Tests"
echo -e "\n${YELLOW}Testing with invalid token${NC}"

INVALID_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"

INVALID_RESPONSE=$(curl -s -i \
    -H "Origin: http://localhost:3000" \
    -H "Authorization: Bearer $INVALID_TOKEN" \
    -H "Content-Type: application/json" \
    "$BACKEND_URL/api/v1/categories" 2>&1)

INVALID_STATUS=$(echo "$INVALID_RESPONSE" | grep -i "HTTP/" | awk '{print $2}')
INVALID_BODY=$(echo "$INVALID_RESPONSE" | sed -n '/^$/,$p' | tail -n +2 | head -3)

log_request "$BACKEND_URL/api/v1/categories" "GET" "Authorization: Bearer $INVALID_TOKEN"
log_response "$INVALID_STATUS"

if [ "$INVALID_STATUS" = "401" ] || [ "$INVALID_STATUS" = "403" ]; then
    echo -e "${GREEN}✓ Invalid token correctly rejected${NC}"
    ((PASSED++))
elif [ "$INVALID_STATUS" = "200" ]; then
    echo -e "${YELLOW}⚠ Invalid token accepted (may be permissive for public endpoints)${NC}"
    ((WARNINGS++))
else
    echo -e "${RED}✗ Unexpected status for invalid token: $INVALID_STATUS${NC}"
    ((FAILED++))
fi

# Step 8: CORS Headers Verification
print_test "8. CORS Headers Verification"
echo "Checking all required CORS headers in responses..."

CORS_TEST_RESPONSE=$(curl -s -i \
    -H "Origin: http://localhost:3000" \
    "$BACKEND_URL/api/v1/categories" 2>&1)

echo -e "\n${YELLOW}All CORS-related headers:${NC}"
echo "$CORS_TEST_RESPONSE" | grep -i "access-control" || echo "  None found"

ACAO_FINAL=$(echo "$CORS_TEST_RESPONSE" | grep -i "access-control-allow-origin" | cut -d: -f2 | xargs)
ACAC=$(echo "$CORS_TEST_RESPONSE" | grep -i "access-control-allow-credentials" | cut -d: -f2 | xargs)
ACAM=$(echo "$CORS_TEST_RESPONSE" | grep -i "access-control-allow-methods" | cut -d: -f2 | xargs)

if [ -n "$ACAO_FINAL" ]; then
    echo -e "${GREEN}✓ Access-Control-Allow-Origin: $ACAO_FINAL${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ Missing Access-Control-Allow-Origin header${NC}"
    ((FAILED++))
fi

# Final Summary
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}TEST SUMMARY${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo -e "${YELLOW}Warnings: $WARNINGS${NC}"

if [ $FAILED -eq 0 ]; then
    echo -e "\n${GREEN}✓ All critical tests passed!${NC}"
    exit 0
else
    echo -e "\n${RED}✗ Some tests failed. Review the output above.${NC}"
    exit 1
fi

