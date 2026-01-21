#!/bin/bash

# Mario Health API - Deployment Script
# Usage: ./deploy.sh

set -e  # Exit on error

# Ensure we are in the project root (where Dockerfile is)
cd "$(dirname "$0")/.."

echo "=================================================="

# Configuration
PROJECT_ID="mario-mrf-data"
REGION="us-central1"
SERVICE_NAME="mario-health-api"
IMAGE_NAME="us-central1-docker.pkg.dev/${PROJECT_ID}/docker-repo/${SERVICE_NAME}"

# Get Supabase credentials from .env or prompt
if [ -f .env ]; then
    source .env
fi

SUPABASE_URL=${SUPABASE_URL:-"https://anvremdouphhucqrxgoq.supabase.co"}

# Step 0: Verify Secrets & Config
echo ""
echo "🔐 Step 0: Verifying Security Configuration..."
# Fetch key to verify role (requires Secret Manager Access)
KEY_PAYLOAD=$(gcloud secrets versions access latest --secret="supabase-service-role-key" 2>/dev/null)
if [ $? -ne 0 ]; then
    echo "⚠️ Warning: Could not access secret 'supabase-service-role-key' for verification. Continuing (deploy might fail if key is wrong)..."
else
    # Robust Python one-liner to decode JWT payload (standard lib only)
    ROLE=$(python3 -c "
import sys, json, base64
try:
    token = '$KEY_PAYLOAD'
    if not token or '.' not in token:
        print('invalid_token')
        sys.exit(0)
    payload = token.split('.')[1]
    # Fix padding for base64 decoding
    payload += '=' * ((4 - len(payload) % 4) % 4)
    data = base64.urlsafe_b64decode(payload)
    print(json.loads(data).get('role', 'unknown'))
except Exception as e:
    print(f'error_{e}')
")
    if [ "$ROLE" != "service_role" ]; then
        echo "❌ FATAL: Secret 'supabase-service-role-key' has role '$ROLE'. Expected 'service_role'."
        echo "   Please update the secret with the correct Service Role API Key."
        exit 1
    fi
    echo "✅ Secret verified: 'supabase-service-role-key' has role 'service_role'"
fi

# Set ENVIRONMENT default to production if not set (was defaulting to staging unintentionally in past)
ENVIRONMENT=${ENVIRONMENT:-"production"}


# Step 1: Build Docker image
echo ""
echo "📦 Step 1: Building Docker image..."
gcloud builds submit --tag ${IMAGE_NAME}

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed"
    exit 1
fi

echo "✅ Docker image built successfully"

# Step 2: Deploy to Cloud Run
echo ""
echo "🚢 Step 2: Deploying to Cloud Run..."
gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME} \
  --update-env-vars SUPABASE_URL="${SUPABASE_URL}" \
  --update-secrets=SUPABASE_KEY=supabase-service-role-key:latest \
  --region ${REGION} \
  --platform managed \
  --allow-unauthenticated \
  --max-instances 10 \
  --memory 512Mi \
  --cpu 1 \
  --timeout 60

if [ $? -ne 0 ]; then
    echo "❌ Cloud Run deployment failed"
    exit 1
fi

echo ""
echo "✅ Deployment successful!"

# Get service URL
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} --region ${REGION} --format='value(status.url)')

echo ""
echo "🎉 Mario Health API is live!"
echo "=================================================="
echo "📍 URL: ${SERVICE_URL}"
echo "📚 Docs: ${SERVICE_URL}/docs"
echo "🔍 Health: ${SERVICE_URL}/health"
echo ""
echo "Test the API:"
echo "  curl ${SERVICE_URL}/health"
echo "  curl \"${SERVICE_URL}/api/v1/categories\""
echo ""
