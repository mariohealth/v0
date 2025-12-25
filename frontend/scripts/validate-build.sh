#!/bin/bash
set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Starting Build Validation...${NC}"

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
FRONTEND_DIR="$( cd "$SCRIPT_DIR/.." && pwd )"

cd "$FRONTEND_DIR"

# 1. Check next.config.mjs for 'output: export'
echo -e "${BLUE}Step 1: Checking next.config.mjs for 'output: export'...${NC}"
if grep -E "^\s*output:\s*'export'" next.config.mjs > /dev/null; then
    echo -e "${GREEN}✅ Found 'output: export' in next.config.mjs${NC}"
else
    echo -e "${RED}❌ ERROR: 'output: export' is missing or commented out in next.config.mjs${NC}"
    echo -e "This is required for Firebase Hosting deployment."
    echo -e "Please ensure the following line is present and NOT commented out:"
    echo -e "    output: 'export',"
    exit 1
fi

# 2. Run npm run build
echo -e "${BLUE}Step 2: Running npm run build...${NC}"
npm run build

# 3. Verify /out directory exists
echo -e "${BLUE}Step 3: Verifying /out directory...${NC}"
if [ -d "out" ]; then
    echo -e "${GREEN}✅ /out directory created successfully${NC}"
else
    echo -e "${RED}❌ ERROR: /out directory was not created after build${NC}"
    exit 1
fi

# 4. Verify critical files exist
echo -e "${BLUE}Step 4: Verifying critical files...${NC}"

CRITICAL_FILES=("index.html" "_next")
for FILE in "${CRITICAL_FILES[@]}"; do
    if [ -e "out/$FILE" ]; then
        echo -e "${GREEN}✅ Critical file found: out/$FILE${NC}"
    else
        echo -e "${RED}❌ ERROR: Critical file missing: out/$FILE${NC}"
        exit 1
    fi
done

echo -e "\n${GREEN}✨ BUILD VALIDATION SUCCESSFUL! ✨${NC}"
echo -e "${GREEN}You are ready to deploy to Firebase.${NC}"

