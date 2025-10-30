# BigQuery → Postgres Multi-Table Sync

Automated pipeline for syncing multiple healthcare data tables from BigQuery to Postgres.

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone 
cd bigquery-to-postgres
```

### 2. Set Up Python Virtual Environment
```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate

# On Windows:
# venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Configure Environment
```bash
cp .env.example .env
# Edit .env with your credentials (use your favorite editor)
nano .env  # or vim, code, etc.
```

### 5. Configure Tables
Edit `config/tables.py` to add/remove tables or change sync modes:
```bash
nano config/tables.py  # or vim, code, etc.
```

### 6. Set Up Postgres Schemas
```bash
python scripts/setup_schemas.py
```

### 7. Run Your First Sync

**Test with a single table first:**
```bash
python scripts/sync_data.py zip_codes
```

**Once confirmed working, sync all tables:**
```bash
chmod +x run_sync.sh
./run_sync.sh
```

### 8. Deactivate Virtual Environment (when done)
```bash
deactivate
```

## 💡 Virtual Environment Tips

**Why use a virtual environment?**
- Isolates project dependencies from system Python
- Prevents version conflicts with other projects
- Makes dependency management cleaner

**Reactivating for future sessions:**
```bash
cd bigquery-to-postgres
source venv/bin/activate  # macOS/Linux
# venv\Scripts\activate   # Windows
```

**Updating dependencies:**
```bash
source venv/bin/activate
pip install --upgrade -r requirements.txt
```

## 🎯 Quick Command Reference
```bash
# Sync all tables (respects sync_mode in config)
./run_sync.sh

# Force full refresh of all tables
./run_sync.sh --full-refresh

# Sync only specific tables
./run_sync.sh --tables healthcare_prices carriers

# Sync specific tables with full refresh
./run_sync.sh --tables healthcare_prices --full-refresh

# Sync single table (respects sync_mode)
python scripts/sync_data.py healthcare_prices

# Force full refresh of single table
python scripts/sync_data.py healthcare_prices --full-refresh

# Validate all tables
python scripts/validate_data.py

# Validate specific table
python scripts/validate_data.py --table healthcare_prices
```

## 📊 Table Configuration

Tables are configured in `config/tables.py`:
```python
'table_key': {
    'bigquery_table': 'source_table_name',
    'postgres_table': 'destination_table_name',
    'primary_key': 'id_column',
    'required_columns': ['col1', 'col2'],
    'sync_mode': 'full_refresh',  # or 'incremental'
    'incremental_column': 'last_updated',  # required for incremental
}
```

### Sync Modes

**Full Refresh (`full_refresh`):**
- Replaces entire table on each sync
- Best for: Reference data, small tables, or when data changes unpredictably
- Example: CPT codes, carrier info

**Incremental (`incremental`):**
- Only syncs new/updated records based on timestamp column
- Best for: Large tables with append-only or time-stamped updates
- Requires `incremental_column` (e.g., `last_updated`)
- Example: Provider networks, transaction logs

## 🔒 Security: Workload Identity Federation

This project uses **Workload Identity Federation** instead of service account keys for GitHub Actions, following Google Cloud's security best practices.

### Why Workload Identity Federation?

✅ **No long-lived credentials** - No JSON keys to manage or rotate  
✅ **Automatic token rotation** - Tokens expire after each workflow run  
✅ **Least privilege** - Service account only accessible from your GitHub repo  
✅ **Audit trail** - All access logged in Cloud Audit Logs  

### Local Development

For local development, you still need credentials. Choose one option:

**Option 1: Application Default Credentials (Recommended)**
```bash
# Authenticate with your Google account
gcloud auth application-default login

# No need to set GOOGLE_APPLICATION_CREDENTIALS
```

**Option 2: Service Account Key (for CI/CD environments only)**
```bash
# Download key only if absolutely necessary
gcloud iam service-accounts keys create ~/key.json \
    --iam-account=github-bigquery-sync@your-project.iam.gserviceaccount.com

# Set in .env
GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json

# ⚠️ Never commit this key to Git!
```

### Setup Instructions

See [WORKLOAD_IDENTITY_SETUP.md](WORKLOAD_IDENTITY_SETUP.md) for detailed setup steps.

## 📅 Automated Schedule

**GitHub Actions workflows:**

1. **Sync All Tables** - Every Sunday at 2 AM UTC
   - Manual trigger with optional full refresh

2. **Sync Single Table** - Manual trigger only
   - Select specific table
   - Optional full refresh

## 🔧 GitHub Actions Setup

### Required Secrets
- `GCP_SERVICE_ACCOUNT_KEY` - BigQuery credentials JSON
- `GCP_PROJECT_ID` - Your GCP project ID
- `BIGQUERY_DATASET` - Source dataset name
- `POSTGRES_DB_URL` - Postgres connection string

### Manual Triggers

**Sync all tables:**
1. Go to `Actions` → `Sync All Tables`
2. Click `Run workflow`
3. Optional: Check "Force full refresh"

**Sync single table:**
1. Go to `Actions` → `Sync Single Table`
2. Click `Run workflow`
3. Select table from dropdown
4. Optional: Check "Force full refresh"

## 📊 Adding New Tables

1. **Update `config/tables.py`:**
```python
'new_table': {
    'bigquery_table': 'bq_source_table',
    'postgres_table': 'pg_destination_table',
    'primary_key': 'id',
    'required_columns': ['col1', 'col2'],
    'sync_mode': 'full_refresh',
}
```

2. **Add schema to `config/postgres_schemas.sql`:**
```sql
CREATE TABLE IF NOT EXISTS new_table (...);
```

3. **Run schema creation:**
```bash
psql $POSTGRES_DB_URL < config/postgres_schemas.sql
```

4. **Test sync:**
```bash
python scripts/sync_data.py new_table
```

5. **Update GitHub Actions workflow** (if needed):
   - Add table to dropdown in `.github/workflows/sync-single-table.yml`

## 🔍 Validation

**Validate all tables:**
```bash
python scripts/validate_data.py
```

**Validate specific table:**
```bash
python scripts/validate_data.py --table healthcare_prices
```

## ⚠️ Troubleshooting

**Error: "Table not found"**
→ Run `config/postgres_schemas.sql` first

**Incremental sync not working:**
→ Ensure `incremental_column` exists and has index

**Foreign key constraint errors:**
→ Sync parent tables before child tables (e.g., carriers before provider_networks)

**Performance issues:**
→ Adjust `chunksize` in `sync_data.py` (line 75)

## 📝 Logs

- Local: `logs/sync_*.log`
- GitHub Actions: Download from workflow artifacts

## ⏱️ Performance Estimates

| Rows  | Mode        | Runtime   |
|-------|-------------|-----------|
| 100K  | Full        | ~2 min    |
| 100K  | Incremental | ~30 sec   |
| 1M    | Full        | ~15 min   |
| 1M    | Incremental | ~5 min    |
