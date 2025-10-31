# Mario Health Data Pipeline - GCP Deployment Guide

Serverless dbt + Python pipeline running on Cloud Run, triggered by Cloud Scheduler.

---

## 🚀 Quick Start (30 minutes)

### **Prerequisites**
- GCP account with billing enabled
- `gcloud` CLI installed ([install guide](https://cloud.google.com/sdk/docs/install))
- Docker installed (for local testing)

---

## **Step 1: Initial GCP Setup (5 min)**

```bash
# Authenticate
gcloud auth login
gcloud auth application-default login

# Set your project ID
export PROJECT_ID="mario-health-prod"  # Replace with your project
gcloud config set project $PROJECT_ID

# Run setup script (creates service accounts, datasets, secrets)
chmod +x setup-gcp.sh
./setup-gcp.sh
```

**What this does:**
- Creates BigQuery datasets (`analytics`, `analytics_dev`)
- Creates service account with BigQuery permissions
- Stores credentials in Secret Manager
- Enables required APIs

---

## **Step 2: Update Configuration (2 min)**

Update these files with your GCP project ID:

1. **profiles.yml** (line 5, 14): Replace `mario-health-prod`
2. **deploy.sh** (line 6): Replace `mario-health-prod`
3. **scripts/ingest_uhc_data.py** (line 14): Replace `mario-health-prod`

```bash
# Quick find/replace
find . -type f -exec sed -i '' 's/mario-health-prod/YOUR_PROJECT_ID/g' {} +
```

---

## **Step 3: Deploy to Cloud Run (10 min)**

```bash
# Make deployment script executable
chmod +x deploy.sh

# Deploy (builds container, deploys to Cloud Run, sets up scheduler)
./deploy.sh
```

**What this does:**
- Builds Docker container with dbt + Python
- Deploys to Cloud Run (serverless, autoscaling)
- Creates Cloud Scheduler job (runs daily at 3 AM UTC)

---

## **Step 4: Test the Pipeline (5 min)**

```bash
# Trigger manually (don't wait for scheduled run)
gcloud scheduler jobs run mario-data-pipeline-daily --location us-central1

# Check logs
gcloud run logs read mario-data-pipeline --region us-central1 --limit 50

# Verify data in BigQuery
bq query --use_legacy_sql=false 'SELECT COUNT(*) FROM analytics.raw_healthcare_prices'
```

---

## **Architecture Overview**

```
┌─────────────────┐
│ Cloud Scheduler │  ← Runs daily at 3 AM UTC
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Cloud Run     │  ← Executes orchestrate.py
│   (Container)   │     1. Python data ingestion
│                 │     2. dbt transformations
└────────┬────────┘     3. Quality checks
         │
         ▼
┌─────────────────┐
│    BigQuery     │  ← Analytics warehouse
└─────────────────┘
```

---

## **Local Development**

### **Run Pipeline Locally**

```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/gcp-credentials.json"
export GCP_PROJECT_ID="mario-health-prod"

# Run Python ingestion
python scripts/ingest_uhc_data.py

# Run dbt transformations
dbt run
dbt test

# Or run full pipeline
python orchestrate.py
```

### **Test dbt Models**

```bash
# Compile SQL (check for syntax errors)
dbt compile

# Run specific model
dbt run --select stg_procedures

# Test data quality
dbt test --select stg_procedures

# Generate documentation
dbt docs generate
dbt docs serve  # View at http://localhost:8080
```

---

## **Adding New Data Sources**

### **1. Create Python Ingestion Script**

```python
# scripts/ingest_new_carrier.py
import logging
from google.cloud import bigquery

def main():
    # Your ingestion logic here
    pass

if __name__ == "__main__":
    main()
```

### **2. Add to Orchestrator**

Edit `orchestrate.py`, add to `scripts` list:

```python
scripts = [
    ("python scripts/ingest_uhc_data.py", "UHC data ingestion"),
    ("python scripts/ingest_new_carrier.py", "New carrier ingestion"),  # ← Add this
]
```

### **3. Create dbt Model**

```sql
-- models/staging/stg_new_carrier.sql
SELECT * FROM {{ source('analytics', 'raw_new_carrier') }}
WHERE price > 0
```

### **4. Deploy**

```bash
./deploy.sh  # Redeploys with new code
```

---

## **Monitoring & Debugging**

### **View Logs**

```bash
# Real-time logs
gcloud run logs tail mario-data-pipeline --region us-central1

# Recent logs
gcloud run logs read mario-data-pipeline --region us-central1 --limit 100

# Filter by severity
gcloud run logs read mario-data-pipeline --region us-central1 --log-filter="severity>=ERROR"
```

### **Check Scheduler Status**

```bash
# List scheduled jobs
gcloud scheduler jobs list --location us-central1

# View job details
gcloud scheduler jobs describe mario-data-pipeline-daily --location us-central1

# Manually trigger
gcloud scheduler jobs run mario-data-pipeline-daily --location us-central1
```

### **BigQuery Monitoring**

```sql
-- Check data freshness
SELECT 
  MAX(effective_date) as latest_data,
  COUNT(*) as total_rows
FROM analytics.raw_healthcare_prices;

-- Check for quality issues
SELECT 
  cpt_code,
  COUNT(*) as provider_count,
  MIN(price) as min_price,
  MAX(price) as max_price
FROM analytics.stg_procedures
GROUP BY cpt_code
HAVING COUNT(*) < 3;  -- Flag procedures with few providers
```

---

## **Cost Optimization**

**Expected costs for MVP:**
- Cloud Run: ~$5-10/month (runs ~30 min/day)
- BigQuery: ~$5/month (1M rows, few queries)
- Cloud Scheduler: $0.10/month
- **Total: ~$10-15/month**

**Tips:**
- Cloud Run scales to zero when not running
- BigQuery charges by data scanned (use partitions/clusters)
- Use `--max-instances 1` to prevent concurrent runs

---

## **Troubleshooting**

### **"Permission denied" errors**

```bash
# Re-grant BigQuery permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:mario-data-pipeline@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/bigquery.dataEditor"
```

### **"Container failed to start"**

```bash
# Check container logs
gcloud run logs read mario-data-pipeline --region us-central1 --limit 50

# Test container locally
docker build -t mario-pipeline .
docker run -e GOOGLE_APPLICATION_CREDENTIALS=/secrets/creds.json mario-pipeline
```

### **dbt connection issues**

```bash
# Test BigQuery connection
dbt debug

# Check service account key
ls -la /secrets/gcp-credentials.json
```

---

## **Next Steps**

1. ✅ **Add real data sources** (replace mock data in ingestion scripts)
2. ✅ **Build dbt models** (create marts for search, pricing, etc.)
3. ✅ **Set up alerts** (Cloud Monitoring for failures)
4. ✅ **Add Slack notifications** (implement in orchestrate.py)
5. ✅ **Connect to Supabase** (for frontend API)

---

## **Support**

**Questions?** Ask Arnaud (AC) or check:
- dbt docs: https://docs.getdbt.com/
- Cloud Run docs: https://cloud.google.com/run/docs
- BigQuery docs: https://cloud.google.com/bigquery/docs
