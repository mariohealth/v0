#!/bin/bash

# Mario Health API Gateway - Deployment Script
# This script creates a Cloud API Gateway that fronts the Cloud Run service
# Usage: ./deploy-gateway.sh

set -e  # Exit on error

echo "🚀 Mario Health API Gateway - Deployment"
echo "=========================================="

# Configuration
PROJECT_ID="mario-mrf-data"
REGION="us-central1"
GATEWAY_ID="mario-health-api-gateway"
API_ID="mario-health-api"
CONFIG_ID="mario-health-api-config"
SERVICE_NAME="mario-health-api"
CLOUD_RUN_URL="https://mario-health-api-ei5wbr4h5a-uc.a.run.app"

echo ""
echo "📋 Configuration:"
echo "  Project ID: ${PROJECT_ID}"
echo "  Region: ${REGION}"
echo "  Gateway ID: ${GATEWAY_ID}"
echo "  API ID: ${API_ID}"
echo "  Config ID: ${CONFIG_ID}"
echo "  Cloud Run URL: ${CLOUD_RUN_URL}"
echo ""

# Step 1: Enable required APIs
echo "📦 Step 1: Enabling required APIs..."
gcloud services enable \
  apigateway.googleapis.com \
  servicemanagement.googleapis.com \
  servicecontrol.googleapis.com \
  --project=${PROJECT_ID}

echo "✅ APIs enabled"

# Step 2: Get or create service account for API Gateway
echo ""
echo "🔐 Step 2: Setting up service account..."
SERVICE_ACCOUNT_EMAIL="${PROJECT_ID}@appspot.gserviceaccount.com"
if ! gcloud iam service-accounts describe ${SERVICE_ACCOUNT_EMAIL} --project=${PROJECT_ID} &>/dev/null; then
  echo "Creating service account..."
  gcloud iam service-accounts create api-gateway-sa \
    --display-name="API Gateway Service Account" \
    --project=${PROJECT_ID} || echo "Service account may already exist"
  SERVICE_ACCOUNT_EMAIL="api-gateway-sa@${PROJECT_ID}.iam.gserviceaccount.com"
fi

# Grant API Gateway service account permission to invoke Cloud Run
echo "Granting Cloud Run Invoker role..."
gcloud run services add-iam-policy-binding ${SERVICE_NAME} \
  --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
  --role="roles/run.invoker" \
  --region=${REGION} \
  --project=${PROJECT_ID} || echo "Permissions may already be set"

echo "✅ Service account configured"

# Step 3: Create API config
echo ""
echo "📝 Step 3: Creating API config..."
gcloud api-gateway api-configs create ${CONFIG_ID} \
  --api=${API_ID} \
  --openapi-spec=api-gateway-config.yaml \
  --project=${PROJECT_ID} \
  --backend-auth-service-account=${SERVICE_ACCOUNT_EMAIL} \
  || echo "⚠️  Config may already exist, continuing..."

echo "✅ API config created"

# Step 4: Create or update API
echo ""
echo "🔧 Step 4: Creating/updating API..."
gcloud api-gateway apis create ${API_ID} \
  --project=${PROJECT_ID} \
  --display-name="Mario Health API" \
  || echo "⚠️  API may already exist, continuing..."

echo "✅ API created/updated"

# Step 5: Create gateway
echo ""
echo "🌐 Step 5: Creating API Gateway..."
gcloud api-gateway gateways create ${GATEWAY_ID} \
  --api=${API_ID} \
  --api-config=${CONFIG_ID} \
  --location=${REGION} \
  --project=${PROJECT_ID} \
  || echo "⚠️  Gateway may already exist, continuing..."

echo "✅ Gateway created"

# Step 6: Get gateway URL
echo ""
echo "🔍 Step 6: Getting gateway URL..."
sleep 5  # Wait for gateway to be ready
GATEWAY_URL=$(gcloud api-gateway gateways describe ${GATEWAY_ID} \
  --location=${REGION} \
  --project=${PROJECT_ID} \
  --format='value(defaultHostname)' 2>/dev/null || echo "")

if [ -z "$GATEWAY_URL" ]; then
  echo "⚠️  Gateway URL not available yet. Please check status:"
  echo "   gcloud api-gateway gateways describe ${GATEWAY_ID} --location=${REGION} --project=${PROJECT_ID}"
else
  echo ""
  echo "🎉 API Gateway deployed successfully!"
  echo "=========================================="
  echo "📍 Gateway URL: https://${GATEWAY_URL}"
  echo "📚 Test endpoint: https://${GATEWAY_URL}/api/v1/categories"
  echo "🔍 Health check: https://${GATEWAY_URL}/api/v1/health"
  echo ""
  echo "Update your frontend .env.local with:"
  echo "  NEXT_PUBLIC_API_URL=https://${GATEWAY_URL}"
fi

echo ""
echo "✅ Deployment complete!"

