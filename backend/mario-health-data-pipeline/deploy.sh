#!/bin/bash
# Deploy dbt + Python pipeline to Cloud Run

set -e  # Exit on any error

# Configuration
PROJECT_ID="mario-health-prod"  # Replace with your GCP project ID
SERVICE_NAME="mario-data-pipeline"
REGION="us-central1"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

echo "🚀 Deploying Mario Health data pipeline to Cloud Run..."

# 1. Enable required APIs (first-time setup only)
echo "📦 Enabling GCP APIs..."
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  cloudscheduler.googleapis.com \
  secretmanager.googleapis.com \
  --project=${PROJECT_ID}

# 2. Build container image
echo "🔨 Building container image..."
gcloud builds submit \
  --tag ${IMAGE_NAME} \
  --project=${PROJECT_ID}

# 3. Deploy to Cloud Run
echo "☁️  Deploying to Cloud Run..."
gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME} \
  --platform managed \
  --region ${REGION} \
  --project ${PROJECT_ID} \
  --memory 2Gi \
  --cpu 2 \
  --timeout 30m \
  --max-instances 1 \
  --min-instances 0 \
  --no-allow-unauthenticated \
  --set-secrets=/secrets/gcp-credentials.json=gcp-bigquery-credentials:latest \
  --set-env-vars ENVIRONMENT=production

# 4. Create Cloud Scheduler job (daily at 3 AM UTC)
echo "⏰ Setting up Cloud Scheduler..."
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} \
  --platform managed \
  --region ${REGION} \
  --project ${PROJECT_ID} \
  --format 'value(status.url)')

gcloud scheduler jobs create http ${SERVICE_NAME}-daily \
  --location ${REGION} \
  --schedule "0 3 * * *" \
  --uri "${SERVICE_URL}" \
  --http-method POST \
  --oidc-service-account-email ${PROJECT_ID}@appspot.gserviceaccount.com \
  --project ${PROJECT_ID} \
  || echo "Scheduler job already exists"

echo "✅ Deployment complete!"
echo "Service URL: ${SERVICE_URL}"
echo "Scheduled to run daily at 3 AM UTC"
echo ""
echo "Manual trigger test:"
echo "gcloud run services describe ${SERVICE_NAME} --region ${REGION} --format 'value(status.url)'"
