#!/bin/bash
set -euo pipefail

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 Phase 3: Setting Up Environment Files"
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

export FRONTEND_DIR="${FRONTEND_DIR:-./mario-health-frontend}"
export BACKEND_DIR="${BACKEND_DIR:-./backend/mario-health-api}"

# Create .env.firebase template if it doesn't exist
if [ ! -f .env.firebase ]; then
    echo "📝 Creating .env.firebase template..."
    cat > .env.firebase <<EOF
# Firebase Configuration
FIREBASE_PROJECT_ID=mario-health
FIREBASE_SITE_ID=mario-health

# Cloud Run Configuration
CLOUD_RUN_SERVICE_ID=mario-health-api
CLOUD_RUN_REGION=us-central1

# Directory Configuration
FRONTEND_DIR=./mario-health-frontend
BACKEND_DIR=./backend/mario-health-api
EOF
    echo "✅ Created .env.firebase template"
    echo "⚠️  Please edit .env.firebase with your actual values before continuing!"
else
    echo "✅ .env.firebase already exists"
fi

# Create/update frontend .env.example
if [ -d "$FRONTEND_DIR" ]; then
    echo "📝 Creating/updating frontend .env.example..."
    cat > "$FRONTEND_DIR/.env.example" <<EOF
# Firebase Configuration
# Get these values from Firebase Console → Project Settings → Your apps → Web app
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$FIREBASE_PROJECT_ID.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$FIREBASE_PROJECT_ID.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_BASE_URL=http://localhost:3000
EOF
    echo "✅ Created $FRONTEND_DIR/.env.example"
    
    # Create .env.local if it doesn't exist
    if [ ! -f "$FRONTEND_DIR/.env.local" ]; then
        echo "📝 Creating $FRONTEND_DIR/.env.local from template..."
        cp "$FRONTEND_DIR/.env.example" "$FRONTEND_DIR/.env.local"
        echo "✅ Created $FRONTEND_DIR/.env.local"
        echo "⚠️  Please update $FRONTEND_DIR/.env.local with your Firebase Web app credentials!"
        echo "   Get them from: Firebase Console → Project Settings → Your apps → Web app"
    else
        echo "✅ $FRONTEND_DIR/.env.local already exists"
    fi
else
    echo "⚠️  Frontend directory not found: $FRONTEND_DIR"
fi

echo ""
echo "✅ Environment setup complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Next Steps:"
echo "   1. Get Firebase Web app credentials from Firebase Console"
echo "   2. Update $FRONTEND_DIR/.env.local with your Firebase API keys"
echo "   3. Run the next phase: make frontend"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

