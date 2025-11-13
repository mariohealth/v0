#!/bin/bash

# ============================================================
# 🏥 Mario Health — Cloud Run Deploy + Verification Sequence
# ============================================================
# Purpose: Deploy the latest backend code (including /providers endpoint)
#          to Cloud Run, test the API, verify frontend behavior,
#          and confirm data linkage diagnostics.
# ============================================================

set -e  # Exit on error

echo "============================================================"
echo "🚀 Step 1 — Deploy latest backend to Cloud Run"
echo "============================================================"

# Ensure repo up to date
echo "📥 Fetching latest code..."
git fetch --all
git checkout main
git pull origin main

# Configuration (matching existing deploy scripts)
PROJECT_ID="mario-mrf-data"
SERVICE_NAME="mario-health-api"
REGION="us-central1"
IMAGE_NAME="us-central1-docker.pkg.dev/${PROJECT_ID}/docker-repo/${SERVICE_NAME}"

# Navigate to backend API directory
cd backend/mario-health-api

echo ""
echo "📋 Deployment Configuration:"
echo "  Project ID: ${PROJECT_ID}"
echo "  Service Name: ${SERVICE_NAME}"
echo "  Region: ${REGION}"
echo "  Image: ${IMAGE_NAME}"
echo ""

# Check if .env exists for Supabase config
if [ -f .env ]; then
    source .env
    echo "✅ Found .env file"
else
    echo "⚠️  No .env file found - using defaults or environment variables"
fi

SUPABASE_URL=${SUPABASE_URL:-"https://anvremdouphhucqrxgoq.supabase.co"}

# Build Docker image
echo ""
echo "📦 Building Docker image..."
gcloud builds submit --tag ${IMAGE_NAME} --project=${PROJECT_ID}

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed"
    exit 1
fi

echo "✅ Docker image built successfully"

# Deploy to Cloud Run
echo ""
echo "🚢 Deploying to Cloud Run..."
gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME} \
  --update-env-vars SUPABASE_URL="${SUPABASE_URL}",ENVIRONMENT="production" \
  --update-secrets=SUPABASE_KEY=supabase-default-secret-key:latest \
  --region ${REGION} \
  --project ${PROJECT_ID} \
  --platform managed \
  --allow-unauthenticated \
  --max-instances 10 \
  --memory 512Mi \
  --cpu 1 \
  --timeout 60 \
  --quiet

if [ $? -ne 0 ]; then
    echo "❌ Cloud Run deployment failed"
    exit 1
fi

echo "✅ Cloud Run deployment complete."

# Get service URL
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} \
  --region ${REGION} \
  --project ${PROJECT_ID} \
  --format='value(status.url)')

echo ""
echo "📍 Cloud Run Service URL: ${SERVICE_URL}"

# Return to repo root
cd ../../

echo ""
echo "============================================================"
echo "🧪 Step 2 — Verify endpoints are live"
echo "============================================================"

# Cloud Run Gateway URL (API Gateway fronting Cloud Run)
API_BASE="https://mario-health-api-gateway-x5pghxd.uc.gateway.dev"

echo ""
echo "🔍 Testing /api/v1/search?q=mri ..."
SEARCH_RESPONSE=$(curl -s "${API_BASE}/api/v1/search?q=mri")
if echo "$SEARCH_RESPONSE" | jq -e '.results' > /dev/null 2>&1; then
    echo "✅ Search endpoint working"
    echo "$SEARCH_RESPONSE" | jq '.results[0:3] | .[] | {procedure_slug, procedure_name, provider_count}'
else
    echo "❌ Search endpoint failed"
    echo "$SEARCH_RESPONSE" | jq '.' || echo "$SEARCH_RESPONSE"
fi

echo ""
echo "🔍 Testing /api/v1/procedures/brain-mri ..."
PROCEDURE_RESPONSE=$(curl -s "${API_BASE}/api/v1/procedures/brain-mri")
if echo "$PROCEDURE_RESPONSE" | jq -e '.slug' > /dev/null 2>&1; then
    echo "✅ Procedure detail endpoint working"
    echo "$PROCEDURE_RESPONSE" | jq '{slug, name, avg_price, min_price, max_price}'
else
    echo "❌ Procedure detail endpoint failed"
    echo "$PROCEDURE_RESPONSE" | jq '.' || echo "$PROCEDURE_RESPONSE"
fi

echo ""
echo "🔍 Testing /api/v1/procedures/brain-mri/providers ..."
PROVIDERS_RESPONSE=$(curl -s "${API_BASE}/api/v1/procedures/brain-mri/providers")
if echo "$PROVIDERS_RESPONSE" | jq -e '.providers' > /dev/null 2>&1; then
    PROVIDER_COUNT=$(echo "$PROVIDERS_RESPONSE" | jq '.providers | length')
    echo "✅ Providers endpoint working (${PROVIDER_COUNT} providers found)"
    echo "$PROVIDERS_RESPONSE" | jq '{procedure_name, procedure_slug, provider_count: (.providers | length), first_provider: .providers[0] | {provider_name, price_estimate}}'
else
    echo "❌ Providers endpoint failed or returned error"
    echo "$PROVIDERS_RESPONSE" | jq '.' || echo "$PROVIDERS_RESPONSE"
    echo ""
    echo "⚠️  If this returns 404, check:"
    echo "   1. RPC function 'get_procedure_detail' in database"
    echo "   2. Procedure exists with slug 'brain-mri'"
    echo "   3. procedure_pricing table has data for this procedure"
fi

echo ""
echo "============================================================"
echo "🧭 Step 3 — Refresh frontend and verify UI"
echo "============================================================"
echo "⚙️ Expected behavior:"
echo "  • /home?procedure=brain-mri should now show provider cards"
echo "  • /search?q=mri should list MRI results"
echo "  • No more empty state or stub fallback"
echo ""
echo "------------------------------------------------------------"
echo "Manual check:"
echo "  Open the frontend dev server or deployed URL:"
echo "  https://mario-mrf-data.web.app/home?procedure=brain-mri"
echo "  OR"
echo "  http://localhost:3000/home?procedure=brain-mri (if running locally)"
echo "------------------------------------------------------------"
echo ""

echo "============================================================"
echo "📊 Step 4 — Run diagnostics to confirm linkage coverage"
echo "============================================================"

# Run adaptive diagnostics
if [ -f "backend/scripts/adaptive_diagnostics.sh" ]; then
    echo ""
    echo "🔬 Running adaptive diagnostics..."
    bash backend/scripts/adaptive_diagnostics.sh
else
    echo "⚠️  adaptive_diagnostics.sh not found, skipping diagnostics"
fi

echo ""
echo "============================================================"
echo "✅ Full deployment and verification sequence complete!"
echo "============================================================"
echo ""
echo "📋 Summary:"
echo "  • Cloud Run Service: ${SERVICE_URL}"
echo "  • API Gateway: ${API_BASE}"
echo "  • Next steps: Test frontend UI and verify provider data displays"
echo ""

