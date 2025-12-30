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
echo -e "${BLUE}Step 1: Validating production output mode in next.config.mjs...${NC}"
if ! NODE_ENV=production node --input-type=module <<'NODE'
import config from './next.config.mjs';

if (config.output === 'export') {
  console.log('✅ output is set to "export" when NODE_ENV=production');
  process.exit(0);
}

console.error('❌ ERROR: next.config.mjs did not export "output: \'export\'" in production.');
console.error('Please ensure the config resolves to output: \'export\' when NODE_ENV=production without forcing it in development.');
process.exit(1);
NODE
then
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

