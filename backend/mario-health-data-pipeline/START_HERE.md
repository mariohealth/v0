# 📦 Mario Health Data Pipeline - Complete Package

Everything you need to run dbt + Python transformations locally and deploy to GCP.

---

## 📂 What's Included

### **Core Documentation**

1. **[README.md](computer:///mnt/user-data/outputs/README.md)** ⭐ **START HERE**
   - Complete local setup guide (10-15 min)
   - Daily development workflow
   - Common tasks and troubleshooting
   - **Focus:** Local dbt development on your machine

2. **[DBT_QUICK_REFERENCE.md](computer:///mnt/user-data/outputs/DBT_QUICK_REFERENCE.md)**
   - Essential dbt commands cheat sheet
   - Model selection syntax
   - Testing and debugging tips
   - Keep this open while developing

3. **[GCP_DEPLOYMENT_GUIDE.md](computer:///mnt/user-data/outputs/GCP_DEPLOYMENT_GUIDE.md)**
   - Production deployment to Cloud Run
   - Automated scheduling with Cloud Scheduler
   - Monitoring and cost optimization
   - **Use after:** Local dev is stable (Sprint 3+)

### **Complete Codebase**

4. **[mario-health-data-pipeline.tar.gz](computer:///mnt/user-data/outputs/mario-health-data-pipeline.tar.gz)**
   - All code files ready to run
   - Includes: Python scripts, dbt models, Docker config, deployment scripts
   - Extract and start coding immediately

---

## 🚀 Quick Start (15 minutes)

### **For Arnaud (AC) - Local Development**

```bash
# 1. Extract files
tar -xzf mario-health-data-pipeline.tar.gz
cd mario-health-data

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Set up GCP (follow README.md Step 2)
# - Create project
# - Enable BigQuery
# - Download service account key
# - Create datasets

# 5. Configure dbt
# Edit profiles.yml with your GCP project ID

# 6. Test connection
dbt debug

# 7. Run your first transformation
dbt run
```

**Total time:** 15 minutes (includes GCP setup)

---

## 📁 File Structure (Inside Tarball)

```
mario-health-data/
├── README.md                    # 📖 Your main guide
├── .gitignore                   # 🔒 Security (prevents committing credentials)
├── requirements.txt             # 📦 Python dependencies
├── dbt_project.yml             # ⚙️  dbt configuration
├── profiles.yml                # 🔗 BigQuery connection
│
├── models/                     # 📊 dbt SQL transformations
│   └── staging/
│       ├── stg_procedures.sql  # Example model
│       └── schema.yml          # Tests & documentation
│
├── scripts/                    # 🐍 Python data ingestion
│   └── ingest_uhc_data.py     # Example ingestion script
│
├── orchestrate.py              # 🎭 Pipeline runner (for Cloud Run)
├── Dockerfile                  # 🐳 Container definition
├── setup-gcp.sh               # 🔧 One-time GCP setup
└── deploy.sh                  # 🚀 Deploy to Cloud Run
```

---

## 🎯 Workflow Overview

### **Phase 1: Local Development (Sprint 1-3)**

1. Write Python ingestion scripts (`scripts/`)
2. Create dbt SQL models (`models/`)
3. Test locally: `dbt run`, `dbt test`
4. Iterate and refine

**You are here** ← Start with README.md

### **Phase 2: Production Deployment (Sprint 4+)**

1. Stable local pipeline ✅
2. Follow GCP_DEPLOYMENT_GUIDE.md
3. Deploy to Cloud Run (serverless)
4. Schedule daily runs
5. Monitor with Cloud Logging

---

## 📚 Document Guide

| Document | When to Use | Time to Read |
|----------|-------------|--------------|
| **README.md** | Setting up locally | 10 min |
| **DBT_QUICK_REFERENCE.md** | Daily development | 2 min |
| **GCP_DEPLOYMENT_GUIDE.md** | Deploying to production | 15 min |

---

## 💡 Key Concepts

### **Local Development (This Week)**

- **Python scripts** fetch data from APIs → load to BigQuery
- **dbt models** transform raw data → create analytics tables
- **Tests** validate data quality
- **All runs on your laptop** (no Cloud Run needed yet)

### **Production Deployment (Later)**

- Same code, packaged in Docker container
- Runs on Cloud Run (serverless, autoscaling)
- Triggered by Cloud Scheduler (daily at 3 AM)
- Costs ~$10-15/month for MVP

---

## 🛠️ Example Use Cases

### **Sprint 1-2: Build Foundation**

```bash
# 1. Create staging model for UHC data
# models/staging/stg_uhc_prices.sql

# 2. Test it locally
dbt run --select stg_uhc_prices
dbt test --select stg_uhc_prices

# 3. Check results in BigQuery
bq query "SELECT COUNT(*) FROM analytics_dev.stg_uhc_prices"
```

### **Sprint 3-4: Add More Carriers**

```python
# 1. Create new ingestion script
# scripts/ingest_aetna.py

# 2. Run it
python scripts/ingest_aetna.py

# 3. Create dbt model
# models/staging/stg_aetna_prices.sql

# 4. Run pipeline
dbt run --select stg_aetna_prices
```

### **Sprint 5-6: Create Search Tables**

```sql
-- models/marts/searchable_procedures.sql
-- Combine all carriers for frontend API

SELECT
  cpt_code,
  procedure_name,
  MIN(price) as min_price,
  AVG(price) as avg_price,
  COUNT(*) as provider_count
FROM {{ ref('stg_procedures') }}
GROUP BY cpt_code, procedure_name
```

---

## ✅ Success Criteria

You'll know the setup is working when:

1. ✅ `dbt debug` shows "All checks passed!"
2. ✅ `dbt run` executes without errors
3. ✅ `dbt test` passes all tests
4. ✅ You can query results in BigQuery console
5. ✅ Data appears in `analytics_dev` dataset

---

## 🚨 Common Issues

### **"Can't find gcp-credentials.json"**

```bash
# Make sure you downloaded the service account key
ls -la gcp-credentials.json

# Should be in project root directory
```

### **"Permission denied on BigQuery"**

```bash
# Re-grant permissions
gcloud projects add-iam-policy-binding mario-health-prod \
  --member="serviceAccount:mario-data-pipeline@mario-health-prod.iam.gserviceaccount.com" \
  --role="roles/bigquery.admin"
```

### **"Module not found" errors**

```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

---

## 📞 Support

**Questions?**
- **README.md** - Most answers are here
- **DBT_QUICK_REFERENCE.md** - Command syntax
- **dbt docs:** https://docs.getdbt.com/
- **Ask team:** Arman (AZ) or Arnaud (AC)

---

## 🎉 Next Steps

1. ✅ Extract tarball
2. ✅ Read README.md
3. ✅ Follow setup steps
4. ✅ Run your first model
5. ✅ Start building your pipeline

**You're ready to go! 🚀**

---

**Last updated:** Sprint 1 (Oct 2025)  
**Maintained by:** Backend team (AC)
