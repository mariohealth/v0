#!/bin/bash

# Mario Health API - Deployment Script
# Usage: ./deploy.sh

set -e  # Exit on error

echo "🚀 Mario Health API - Deploying to Google Cloud Run"
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
  --update-env-vars SUPABASE_URL="${SUPABASE_URL}",ENVIRONMENT="staging" \
  --update-secrets=SUPABASE_KEY=supabase-default-secret-key:latest \
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
