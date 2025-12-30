#!/bin/bash
set -e

echo "🚀 Mario Health - Firebase Deployment Script"
echo "============================================"

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/../.." && pwd )"

cd "$PROJECT_ROOT"

echo "Running pre-deployment validation..."
./frontend/scripts/validate-build.sh

echo "🔥 Deploying to Firebase Hosting..."
firebase deploy --only hosting --project=mario-mrf-data

echo ""
echo "✅ Deployment complete!"
echo "🌐 Production URL: https://mario-mrf-data.web.app"
echo ""
echo "🧪 Manual verification checklist:"
echo "  1. Open production URL"
echo "  2. Type 'brain' in search bar"
echo "  3. Verify autocomplete dropdown appears"
echo "  4. Check console for: [SmartSearch] Found X procedures"
echo ""
echo "🧰 Local verification checklist (run before or instead of deploying):"
echo "  • cd frontend"
echo "  • NODE_ENV=production npm run build"
echo "  • Confirm 'out/' directory or configured export path is generated"
echo "  • firebase deploy --only hosting"

