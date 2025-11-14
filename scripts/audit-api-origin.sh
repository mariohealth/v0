#!/bin/bash

# 🧭 Mario Health — Firebase vs Cloud Run API Origin Audit
# Goal: detect if the API endpoint or hosting source changed (Cloud Run → Firebase)

echo "============================================================"
echo "🏥 Mario Health API Origin Audit ($(date))"
echo "============================================================"

# 1️⃣  Check Firebase config in frontend and root
echo ""
echo "🔧 Checking firebase.json, .firebaserc, and hosting rewrites..."
if [ -f "firebase.json" ]; then
    cat firebase.json
    echo ""
    echo "--- Rewrites/API rules in firebase.json ---"
    grep -E "rewrite|function|api" firebase.json || echo "No rewrite/function/api rules found"
else
    echo "❌ No firebase.json found"
fi

if [ -f ".firebaserc" ]; then
    echo ""
    echo "--- .firebaserc contents ---"
    cat .firebaserc
else
    echo "❌ No .firebaserc found"
fi

# 2️⃣  Check if Firebase Functions API was deployed
echo ""
echo "⚙️ Checking functions/ directory or backend/functions presence..."
if [ -d "functions" ]; then
    echo "✅ Found functions/ directory"
    echo "--- Exported functions ---"
    grep -R "exports\." functions 2>/dev/null | head -20 || echo "No exports found"
elif [ -d "backend/functions" ]; then
    echo "✅ Found backend/functions/ directory"
    echo "--- Exported functions ---"
    grep -R "exports\." backend/functions 2>/dev/null | head -20 || echo "No exports found"
else
    echo "❌ No functions folder found"
fi

# 3️⃣  Inspect environment configs for API base references
echo ""
echo "🔍 Checking .env files for API origins"
echo "--- .env files with API/BASE/URL ---"
find . -maxdepth 3 -name ".env*" -type f 2>/dev/null | while read envfile; do
    if grep -qE "API|BASE|URL" "$envfile" 2>/dev/null; then
        echo "📄 $envfile:"
        grep -E "API|BASE|URL" "$envfile" 2>/dev/null | grep -v "^#" || true
    fi
done

echo ""
echo "--- NEXT_PUBLIC_API references in frontend ---"
grep -R "NEXT_PUBLIC_API" frontend 2>/dev/null | head -20 || echo "No NEXT_PUBLIC_API found"

# 4️⃣  Check Next.js rewrites (Firebase proxy vs Cloud Run)
echo ""
echo "🧱 Inspecting next.config.* for rewrites"
if [ -f "frontend/next.config.mjs" ] || [ -f "frontend/next.config.js" ] || [ -f "frontend/next.config.ts" ]; then
    for config in frontend/next.config.*; do
        if [ -f "$config" ]; then
            echo "📄 $config:"
            grep -A 10 "rewrites" "$config" 2>/dev/null || echo "No rewrites found"
            grep -i "api" "$config" 2>/dev/null | head -5 || true
        fi
    done
else
    echo "❌ No next.config.* found in frontend/"
fi

# 5️⃣  Detect Cloud Run endpoint references
echo ""
echo "🌐 Searching for Cloud Run URLs (run.app, cloud.goog)"
echo "--- run.app references ---"
grep -r "run\.app" frontend backend 2>/dev/null | head -10 || echo "No run.app URLs found"

echo ""
echo "--- cloudfunctions.net references ---"
grep -r "cloudfunctions\.net" frontend backend 2>/dev/null | head -10 || echo "No cloudfunctions.net URLs found"

echo ""
echo "--- firebaseapp.com references ---"
grep -r "firebaseapp\.com" frontend backend 2>/dev/null | head -10 || echo "No firebaseapp.com URLs found"

# 6️⃣  Compare Firebase Hosting deploy history
echo ""
echo "🕓 Checking firebase deploy logs"
if [ -f "firebase-debug.log" ]; then
    echo "--- Recent deploy completions ---"
    grep "Deploy complete" firebase-debug.log 2>/dev/null | tail -5 || echo "No deploy completions found"
    echo ""
    echo "--- Recent hosting activity ---"
    grep "hosting" firebase-debug.log 2>/dev/null | tail -10 || echo "No hosting activity found"
else
    echo "❌ No firebase-debug.log found"
fi

# 7️⃣  Check if hosting target changed recently
echo ""
echo "🔄 Checking git history for Firebase config changes"
echo "--- Recent changes to Firebase config files ---"
git log -p -n 5 -- firebase.json .firebaserc frontend/next.config.* 2>/dev/null | head -60 || echo "No git history found or not a git repo"

# 8️⃣  Print summary hint
echo ""
echo "============================================================"
echo "✅ Look for clues:"
echo "- If firebase.json has a 'rewrites' rule pointing /api/* → something like '/__/functions/api', then API is on Firebase Functions."
echo "- If .env.local uses FIREBASE_API_BASE_URL or NEXT_PUBLIC_FIREBASE_API_URL, frontend is hitting Firebase instead of Cloud Run."
echo "- If Cloud Run URLs (run.app) appear in .env.production but not .env.local, deployment may have diverged."
echo "============================================================"

