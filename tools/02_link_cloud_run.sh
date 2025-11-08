#!/bin/bash
set -euo pipefail

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔗 Phase 2: Linking Cloud Run Service"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Load environment variables
if [ -f .env.firebase ]; then
    set -a
    source .env.firebase
    set +a
fi

if [ -z "${FIREBASE_PROJECT_ID:-}" ] || [ -z "${CLOUD_RUN_SERVICE_ID:-}" ] || [ -z "${CLOUD_RUN_REGION:-}" ]; then
    echo "❌ Required environment variables not set. Please run tools/00_prereqs.sh first."
    exit 1
fi

# Verify Cloud Run service exists
echo "🔍 Verifying Cloud Run service exists..."
if ! gcloud run services describe "$CLOUD_RUN_SERVICE_ID" \
    --region "$CLOUD_RUN_REGION" \
    --project "$FIREBASE_PROJECT_ID" &> /dev/null; then
    echo "❌ Cloud Run service '$CLOUD_RUN_SERVICE_ID' not found in region '$CLOUD_RUN_REGION'"
    echo ""
    echo "Please deploy your backend API first:"
    echo "  1. Navigate to: $BACKEND_DIR"
    echo "  2. Deploy with: gcloud run deploy $CLOUD_RUN_SERVICE_ID --source . --region $CLOUD_RUN_REGION"
    echo ""
    echo "Or if the service exists with a different name/region, update .env.firebase"
    exit 1
fi

# Get Cloud Run service URL
SERVICE_URL=$(gcloud run services describe "$CLOUD_RUN_SERVICE_ID" \
    --region "$CLOUD_RUN_REGION" \
    --project "$FIREBASE_PROJECT_ID" \
    --format='value(status.url)')

echo "✅ Cloud Run service found: $SERVICE_URL"

# Verify service is accessible
echo "🔍 Testing service accessibility..."
if curl -s -o /dev/null -w "%{http_code}" "$SERVICE_URL/health" | grep -q "200\|404"; then
    echo "✅ Service is accessible"
else
    echo "⚠️  Service may not be accessible. Check CORS and authentication settings."
fi

echo ""
echo "✅ Cloud Run service linked successfully!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Service Details:"
echo "   Service ID: $CLOUD_RUN_SERVICE_ID"
echo "   Region: $CLOUD_RUN_REGION"
echo "   URL: $SERVICE_URL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

