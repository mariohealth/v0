#!/bin/bash
# One-time GCP setup for Mario Health data pipeline

set -e

PROJECT_ID="mario-health-prod"  # Replace with your GCP project ID
SERVICE_ACCOUNT_NAME="mario-data-pipeline"

echo "🔧 Setting up GCP project for dbt + Python pipeline..."

# 1. Set active project
gcloud config set project ${PROJECT_ID}

# 2. Create service account for BigQuery access
echo "👤 Creating service account..."
gcloud iam service-accounts create ${SERVICE_ACCOUNT_NAME} \
  --display-name "Mario Data Pipeline Service Account" \
  --project ${PROJECT_ID} \
  || echo "Service account already exists"

# 3. Grant BigQuery permissions
echo "🔑 Granting BigQuery permissions..."
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member="serviceAccount:${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/bigquery.dataEditor"

gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member="serviceAccount:${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/bigquery.jobUser"

# 4. Create service account key
echo "🔐 Creating service account key..."
gcloud iam service-accounts keys create gcp-credentials.json \
  --iam-account=${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com \
  --project=${PROJECT_ID}

# 5. Store key in Secret Manager (for Cloud Run)
echo "🗝️  Storing credentials in Secret Manager..."
gcloud secrets create gcp-bigquery-credentials \
  --data-file=gcp-credentials.json \
  --project=${PROJECT_ID} \
  || gcloud secrets versions add gcp-bigquery-credentials \
     --data-file=gcp-credentials.json \
     --project=${PROJECT_ID}

# 6. Grant Cloud Run service account access to secret
gcloud secrets add-iam-policy-binding gcp-bigquery-credentials \
  --member="serviceAccount:${PROJECT_ID}@appspot.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor" \
  --project=${PROJECT_ID}

# 7. Create BigQuery datasets
echo "📊 Creating BigQuery datasets..."
bq mk --dataset --location=US ${PROJECT_ID}:analytics || echo "Dataset 'analytics' exists"
bq mk --dataset --location=US ${PROJECT_ID}:analytics_dev || echo "Dataset 'analytics_dev' exists"

# 8. Clean up local key file (security)
rm gcp-credentials.json
echo "✅ Deleted local credentials file (stored securely in Secret Manager)"

echo ""
echo "✅ GCP setup complete!"
echo ""
echo "Next steps:"
echo "1. Update PROJECT_ID in deploy.sh, profiles.yml, and Dockerfile"
echo "2. Run ./deploy.sh to deploy your pipeline"
echo "3. Test manually: gcloud scheduler jobs run mario-data-pipeline-daily --location us-central1"
