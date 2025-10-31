# 🏥 Mario Health Data Pipeline

Transform healthcare pricing data with dbt + Python on BigQuery.

---

## 📋 What This Does

This pipeline ingests healthcare pricing data from various carriers (UHC, Aetna, etc.) and transforms it into searchable, analysis-ready tables for the Mario Health platform.

**Stack:**
- **dbt Core** - SQL transformations
- **Python 3.11+** - Data ingestion scripts
- **BigQuery** - Data warehouse
- **Cloud Run** - Production deployment (optional)

---

## 🚀 Local Setup (First Time)

### **Prerequisites**

- Python 3.11 or higher
- Google Cloud account with BigQuery enabled
- Git

### **Step 1: Clone & Install** (5 minutes)

```bash
# Clone repository
git clone <your-repo-url>
cd mario-health-data-pipeline

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# macOS/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### **Step 2: GCP Setup**

1. **Authenticate with your dev account**
   ```bash
   gcloud auth application-default login
   ```

### **Step 3: Configure dbt**

1. **Update `profiles.yml`** with your GCP project ID:
   ```yaml
   mario_health:
     target: dev
     outputs:
       dev:
         type: bigquery
         method: service-account
         project: mario-health-prod  # ← Change this
         dataset: analytics_dev
         keyfile: ./gcp-credentials.json  # ← Path to your key
   ```

2. **Test Connection**
   ```bash
   dbt debug
   ```
   
   ✅ You should see "All checks passed!"

---

## 🎯 Daily Development Workflow

### **Running the Pipeline**

```bash
# Activate virtual environment (if not already active)
source venv/bin/activate

# Run Python data ingestion
python scripts/ingest_uhc_data.py

# Run dbt transformations
dbt run

# Run data quality tests
dbt test
```

### **Working on dbt Models**

```bash
# Compile SQL (check for syntax errors, no execution)
dbt compile

# Run specific model
dbt run --select stg_procedures

# Run model and its downstream dependencies
dbt run --select stg_procedures+

# Test specific model
dbt test --select stg_procedures

# Run in dev environment (default)
dbt run --target dev

# Run in prod environment
dbt run --target prod
```

### **Viewing Documentation**

```bash
# Generate documentation
dbt docs generate

# Serve documentation site (opens in browser)
dbt docs serve
```

Opens at `http://localhost:8080` with interactive lineage graphs.

---

## 🛠️ Common Tasks

### **Adding a New Data Source**

1. **Create ingestion script:**
   ```python
   # scripts/ingest_aetna.py
   import pandas as pd
   from google.cloud import bigquery
   
   def main():
       # Fetch data
       df = pd.read_json('gs://bucket/aetna-data.json')
       
       # Load to BigQuery
       client = bigquery.Client()
       client.load_table_from_dataframe(
           df, 'analytics.raw_aetna_prices'
       )
   
   if __name__ == "__main__":
       main()
   ```

2. **Create dbt staging model:**
   ```sql
   -- models/staging/stg_aetna_prices.sql
   SELECT
     cpt_code,
     procedure_name,
     provider_name,
     price,
     'Aetna' as carrier
   FROM {{ source('analytics', 'raw_aetna_prices') }}
   WHERE price > 0
   ```

3. **Run it:**
   ```bash
   python scripts/ingest_aetna.py
   dbt run --select stg_aetna_prices
   ```

### **Testing Your Models**

Add tests in `models/staging/schema.yml`:

```yaml
models:
  - name: stg_procedures
    description: Cleaned healthcare pricing data
    columns:
      - name: cpt_code
        description: CPT procedure code
        tests:
          - unique
          - not_null
      
      - name: price
        description: Procedure price in USD
        tests:
          - not_null
          - dbt_utils.expression_is_true:
              expression: "> 0"
```

Run tests:
```bash
dbt test --select stg_procedures
```

### **Debugging Failed Models**

```bash
# Show compiled SQL
dbt show --select stg_procedures

# Run with verbose logging
dbt run --select stg_procedures --debug

# Check logs
cat logs/dbt.log
```

---

## 🔍 Data Quality Checks

### **Check Data Freshness**

```sql
-- In BigQuery console
SELECT 
  MAX(effective_date) as latest_data,
  COUNT(*) as total_rows
FROM analytics.raw_healthcare_prices;
```

### **Check for Missing Providers**

```sql
SELECT 
  cpt_code,
  procedure_name,
  COUNT(*) as provider_count
FROM analytics.stg_procedures
GROUP BY cpt_code, procedure_name
HAVING COUNT(*) < 3;  -- Flag procedures with few providers
```

### **Check Price Outliers**

```bash
# Run in dbt
dbt test --select stg_procedures
```

---

## 🚨 Troubleshooting

### **"Connection refused" / "Can't connect to BigQuery"**

```bash
# Check credentials file exists
ls -la gcp-credentials.json

# Test GCP authentication
gcloud auth application-default login

# Verify project ID in profiles.yml matches your GCP project
```

### **"Compilation Error" in dbt**

```bash
# Check SQL syntax
dbt compile --select model_name

# Run with debug mode
dbt run --select model_name --debug
```

### **"No rows returned" from Python script**

```python
# Add logging to your script
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

logger.info(f"Fetched {len(df)} rows")  # Debug data fetching
```

### **Python dependencies missing**

```bash
# Reinstall all dependencies
pip install -r requirements.txt --force-reinstall

# Or install specific package
pip install dbt-bigquery --upgrade
```

---

## 📊 Monitoring in BigQuery

### **Check dbt Run History**

```sql
SELECT
  job_id,
  creation_time,
  total_bytes_processed,
  total_slot_ms / 1000 / 60 as minutes_billed,
  state
FROM `region-us`.INFORMATION_SCHEMA.JOBS_BY_PROJECT
WHERE user_email = 'mario-data-pipeline@mario-health-prod.iam.gserviceaccount.com'
ORDER BY creation_time DESC
LIMIT 10;
```

### **Query Costs**

```sql
SELECT
  DATE(creation_time) as date,
  SUM(total_bytes_processed) / POW(10, 12) as tb_processed,
  SUM(total_bytes_processed) / POW(10, 12) * 5 as estimated_cost_usd
FROM `region-us`.INFORMATION_SCHEMA.JOBS_BY_PROJECT
WHERE DATE(creation_time) >= CURRENT_DATE() - 30
GROUP BY date
ORDER BY date DESC;
```

---

## 🚀 Deploying to Production

Once local development is stable, deploy to Cloud Run:

```bash
# Follow GCP_DEPLOYMENT_GUIDE.md
./setup-gcp.sh     # One-time setup
./deploy.sh        # Deploy to Cloud Run
```

This sets up:
- Automated daily runs (Cloud Scheduler)
- Serverless execution (Cloud Run)
- Production monitoring (Cloud Logging)

---

## 🤝 Team Collaboration

### **Branch Strategy**

```bash
# Create feature branch
git checkout -b feature/add-aetna-data

# Make changes, test locally
dbt run --select stg_aetna_prices
dbt test

# Commit and push
git add .
git commit -m "Add Aetna data ingestion and staging model"
git push origin feature/add-aetna-data

# Create PR for review
```

### **Code Review Checklist**

- [ ] dbt models compile without errors (`dbt compile`)
- [ ] Tests pass (`dbt test`)
- [ ] Documentation added (`schema.yml`)
- [ ] No credentials committed (`.gitignore` check)
- [ ] Python scripts have error handling

---

## 📚 Resources

- **dbt Docs:** https://docs.getdbt.com/
- **BigQuery Docs:** https://cloud.google.com/bigquery/docs
- **Mario Health PRD:** `/docs/Mario_Health_Comprehensive_PRD.md`
- **Questions?** Ask Arnaud (AC) or Arman (AZ)

---

## 💡 Tips

- **Incremental models:** For large tables, use `materialized='incremental'` in dbt
- **Partitioning:** Always partition by date in BigQuery (saves $$)
- **Local testing:** Use small data samples in `analytics_dev` dataset
- **Documentation:** Add descriptions in `schema.yml` - your future self will thank you

---

**Happy transforming! 🎉**
