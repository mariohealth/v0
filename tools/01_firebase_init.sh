#!/bin/bash
set -euo pipefail

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🏗️  Phase 1: Initializing Firebase Project"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Load environment variables
if [ -f .env.firebase ]; then
    set -a
    source .env.firebase
    set +a
fi

if [ -z "${FIREBASE_PROJECT_ID:-}" ]; then
    echo "❌ FIREBASE_PROJECT_ID is not set. Please run tools/00_prereqs.sh first."
    exit 1
fi

# Create .firebaserc
echo "📝 Creating .firebaserc..."
cat > .firebaserc <<EOF
{
  "projects": {
    "default": "$FIREBASE_PROJECT_ID"
  }
}
EOF
echo "✅ Created .firebaserc"

# Create or merge firebase.json
echo "📝 Creating/updating firebase.json..."
if [ -f firebase.json ]; then
    echo "⚠️  firebase.json already exists. Backing up to firebase.json.bak"
    cp firebase.json firebase.json.bak
fi

# Create skeleton firebase.json (hosting config will be finalized in Phase 6)
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
echo "✅ Created firebase.json"

# Set Firebase project
echo "🔧 Setting Firebase project to $FIREBASE_PROJECT_ID..."
firebase use "$FIREBASE_PROJECT_ID" || {
    echo "⚠️  Project may not exist. Creating it..."
    firebase projects:create "$FIREBASE_PROJECT_ID" || echo "⚠️  Project creation may have failed or project already exists"
    firebase use "$FIREBASE_PROJECT_ID"
}
echo "✅ Firebase project set to $FIREBASE_PROJECT_ID"

echo ""
echo "✅ Firebase initialization complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

