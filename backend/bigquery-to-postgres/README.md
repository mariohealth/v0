# BigQuery → Postgres Multi-Table Sync

Automated pipeline for syncing multiple healthcare data tables from BigQuery to Postgres.

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone <repo-url>
cd bigquery-to-postgres
pip install -r requirements.txt
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your credentials
```

### 3. Configure Tables
Edit `config/tables.py` to add/remove tables or change sync modes.

### 4. Set up Postgres Schemas
```bash
psql $POSTGRES_DB_URL < config/postgres_schemas.sql
```

### 5. Run Sync

**Sync all tables:**
```bash
./run_sync.sh
```

**Sync specific tables:**
```bash
./run_sync.sh --tables healthcare_prices carriers
```

**Force full refresh:**
```bash
./run_sync.sh --full-refresh
```

**Single table:**
```bash
python scripts/sync_data.py healthcare_prices
python scripts/sync_data.py carriers --full-refresh
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
