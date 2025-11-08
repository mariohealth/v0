#!/bin/bash
set -euo pipefail

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔀 Phase 6: Configuring Firebase Hosting Rewrites"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Load environment variables
if [ -f .env.firebase ]; then
    set -a
    source .env.firebase
    set +a
fi

if [ -z "${FIREBASE_PROJECT_ID:-}" ] || [ -z "${FIREBASE_SITE_ID:-}" ] || [ -z "${CLOUD_RUN_SERVICE_ID:-}" ] || [ -z "${CLOUD_RUN_REGION:-}" ]; then
    echo "❌ Required environment variables not set. Please run tools/00_prereqs.sh first."
    exit 1
fi

export FRONTEND_DIR="${FRONTEND_DIR:-./frontend}"

# Update firebase.json with final hosting configuration
echo "📝 Updating firebase.json with hosting configuration..."
cat > firebase.json <<EOF
{
  "hosting": {
    "site": "$FIREBASE_SITE_ID",
    "public": ".next",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "/api/**",
        "run": {
          "serviceId": "$CLOUD_RUN_SERVICE_ID",
          "region": "$CLOUD_RUN_REGION"
        }
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "X-Frame-Options",
            "value": "SAMEORIGIN"
          }
        ]
      }
    ]
  }
}
EOF
echo "✅ Updated firebase.json"

# Update frontend package.json with build scripts
if [ -d "$FRONTEND_DIR" ]; then
    echo "📝 Updating frontend package.json..."
    cd "$FRONTEND_DIR"
    
    # Check if scripts section exists and update it
    if grep -q '"scripts"' package.json; then
        # Add or update build script
        if grep -q '"build"' package.json; then
            echo "✅ Build script already exists"
        else
            # This would require jq or manual editing - for now just note it
            echo "⚠️  Please ensure package.json has: \"build\": \"next build\""
        fi
        
        # Add firebase deploy script if not present
        if ! grep -q '"firebase:deploy"' package.json; then
            echo "⚠️  Consider adding: \"firebase:deploy\": \"firebase deploy --only hosting\" to package.json scripts"
        fi
    fi
    
    cd - > /dev/null
fi

echo ""
echo "✅ Firebase Hosting configuration complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Configuration Summary:"
echo "   - /api/** → Cloud Run ($CLOUD_RUN_SERVICE_ID)"
echo "   - All other routes → /index.html (SPA routing)"
echo "   - Hosting site: $FIREBASE_SITE_ID"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

