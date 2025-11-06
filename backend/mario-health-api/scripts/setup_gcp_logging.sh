#!/bin/bash
# Setup GCP logging infrastructure for Mario Health API
# Run this once to configure log exports and monitoring

PROJECT_ID="mario-mrf-data"  # Replace with your GCP project ID
DATASET_ID="api_logs"
SINK_NAME="api-logs-to-bigquery"

echo "🚀 Setting up GCP logging infrastructure..."

# 1. Create BigQuery dataset for log analytics
echo "📊 Creating BigQuery dataset: ${DATASET_ID}"
bq mk --dataset \
  --location=US \
  --description="API logs for analytics and monitoring" \
  ${PROJECT_ID}:${DATASET_ID}

# 2. Create log sink to export API logs to BigQuery
echo "📤 Creating log sink to BigQuery..."
gcloud logging sinks create ${SINK_NAME} \
  bigquery.googleapis.com/projects/${PROJECT_ID}/datasets/${DATASET_ID} \
  --log-filter='
    resource.type="cloud_run_revision"
    AND resource.labels.service_name="mario-health-api"
    AND jsonPayload.message!=""
  ' \
  --project=${PROJECT_ID}

# 3. Get the service account that writes logs
SERVICE_ACCOUNT=$(gcloud logging sinks describe ${SINK_NAME} --format="value(writerIdentity)" --project=${PROJECT_ID})

echo "✅ Log sink created with service account: ${SERVICE_ACCOUNT}"

# 4. Grant BigQuery permissions to the sink service account
echo "🔐 Granting BigQuery permissions..."
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member="${SERVICE_ACCOUNT}" \
  --role="roles/bigquery.dataEditor"

# 5. Create log-based metrics for monitoring
echo "📈 Creating log-based metrics..."

# API latency metric (p95, p99)
gcloud logging metrics create api_latency \
  --description="API request latency in milliseconds" \
  --value-extractor="EXTRACT(jsonPayload.duration_ms)" \
  --log-filter='
    resource.type="cloud_run_revision"
    AND resource.labels.service_name="mario-health-api"
    AND jsonPayload.duration_ms>0
  ' \
  --project=${PROJECT_ID}

# Error rate metric
gcloud logging metrics create api_errors \
  --description="API error count by endpoint" \
  --log-filter='
    resource.type="cloud_run_revision"
    AND resource.labels.service_name="mario-health-api"
    AND (severity="ERROR" OR jsonPayload.status_code>=400)
  ' \
  --project=${PROJECT_ID}

# Search event metric
gcloud logging metrics create search_events \
  --description="Search query count" \
  --log-filter='
    resource.type="cloud_run_revision"
    AND resource.labels.service_name="mario-health-api"
    AND jsonPayload.event_type="search"
  ' \
  --project=${PROJECT_ID}

echo "✅ Log-based metrics created!"

# 6. Create monitoring dashboard (optional - can do via console)
echo "📊 Dashboard creation instructions:"
echo "   1. Go to: https://console.cloud.google.com/monitoring/dashboards"
echo "   2. Create new dashboard: 'Mario Health API'"
echo "   3. Add charts using metrics: api_latency, api_errors, search_events"

# 7. Create alert policy for high error rate
echo "🚨 Creating alert policy for high error rate..."
cat > /tmp/alert-policy.yaml <<EOF
displayName: "High API Error Rate"
conditions:
  - displayName: "Error rate > 5%"
    conditionThreshold:
      filter: 'metric.type="logging.googleapis.com/user/api_errors"'
      comparison: COMPARISON_GT
      thresholdValue: 5
      duration: 300s
      aggregations:
        - alignmentPeriod: 60s
          perSeriesAligner: ALIGN_RATE
notificationChannels: []  # Add Slack webhook after creation
enabled: true
EOF

gcloud alpha monitoring policies create --policy-from-file=/tmp/alert-policy.yaml --project=${PROJECT_ID}

echo ""
echo "✅ GCP Logging Infrastructure Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "   1. Deploy your FastAPI app with structured logging"
echo "   2. Wait 5-10 minutes for logs to appear in BigQuery"
echo "   3. Query logs: https://console.cloud.google.com/bigquery?project=${PROJECT_ID}&d=${DATASET_ID}"
echo "   4. Create dashboard: https://console.cloud.google.com/monitoring"
echo "   5. Set up Slack notifications: https://console.cloud.google.com/monitoring/alerting"
echo ""
echo "💡 Useful queries:"
echo "   - View all API calls: SELECT * FROM \`${PROJECT_ID}.${DATASET_ID}.cloud_run_revision_*\` LIMIT 100"
echo "   - Slow requests: SELECT * WHERE jsonPayload.duration_ms > 1000"
echo "   - Error analysis: SELECT * WHERE severity='ERROR'"
