#!/bin/bash
set -euo pipefail

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "☁️  Phase 8: Deploying to Firebase Hosting"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Load environment variables
if [ -f .env.firebase ]; then
    set -a
    source .env.firebase
    set +a
fi

if [ -z "${FIREBASE_PROJECT_ID:-}" ] || [ -z "${FIREBASE_SITE_ID:-}" ]; then
    echo "❌ Required environment variables not set. Please run tools/00_prereqs.sh first."
    exit 1
fi

export FRONTEND_DIR="${FRONTEND_DIR:-./frontend}"
export BACKEND_DIR="${BACKEND_DIR:-./backend/mario-health-api}"

# Build frontend
if [ ! -d "$FRONTEND_DIR" ]; then
    echo "❌ Frontend directory not found: $FRONTEND_DIR"
    exit 1
fi

echo "📦 Building frontend..."
cd "$FRONTEND_DIR"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build Next.js app
echo "🔨 Building Next.js application..."
npm run build

# Check if build was successful
if [ ! -d ".next" ]; then
    echo "❌ Build failed - .next directory not found"
    exit 1
fi

# Copy index.html to root for Firebase Hosting
if [ -f ".next/server/app/index.html" ]; then
    echo "📋 Copying index.html to root for Firebase Hosting..."
    cp .next/server/app/index.html .next/index.html
    echo "✅ index.html copied to root"
fi

echo "✅ Frontend build complete"

cd - > /dev/null

# Deploy to Firebase Hosting
echo ""
echo "🚀 Deploying to Firebase Hosting..."
firebase deploy --only hosting

# Get deployment URLs
echo ""
echo "✅ Deployment complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Deployment URLs:"
echo ""
echo "   Frontend (Firebase Hosting):"
echo "   - https://$FIREBASE_SITE_ID.web.app"
echo "   - https://$FIREBASE_SITE_ID.firebaseapp.com"
echo ""

# Get Cloud Run URL
if [ -n "${CLOUD_RUN_SERVICE_ID:-}" ] && [ -n "${CLOUD_RUN_REGION:-}" ]; then
    BACKEND_URL=$(gcloud run services describe "$CLOUD_RUN_SERVICE_ID" \
        --region "$CLOUD_RUN_REGION" \
        --project "$FIREBASE_PROJECT_ID" \
        --format='value(status.url)' 2>/dev/null || echo "N/A")
    
    echo "   Backend (Cloud Run):"
    echo "   - $BACKEND_URL"
    echo ""
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Deployment successful!"
echo ""
echo "Next steps:"
echo "  1. Test your deployed site: https://$FIREBASE_SITE_ID.web.app"
echo "  2. Test API endpoints: https://$FIREBASE_SITE_ID.web.app/api/..."
echo "  3. Verify authentication flow"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

