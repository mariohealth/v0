# 📝 dbt Quick Reference

Essential commands for daily development.

---

## 🚀 Setup (First Time Only)

```bash
# Create virtual environment
python -m venv venv

# Activate it
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Test connection
dbt debug
```

---

## 🔄 Daily Workflow

```bash
# 1. Activate environment
source venv/bin/activate

# 2. Run data ingestion
python scripts/ingest_uhc_data.py

# 3. Run transformations
dbt run

# 4. Test data quality
dbt test
```

---

## 🛠️ Common Commands

### **Running Models**

```bash
dbt run                          # Run all models
dbt run --select model_name      # Run specific model
dbt run --select model_name+     # Run model + downstream
dbt run --select +model_name     # Run model + upstream
dbt run --select tag:daily       # Run models with tag
dbt run --target prod            # Run in prod environment
```

### **Testing**

```bash
dbt test                         # Test all models
dbt test --select model_name     # Test specific model
dbt test --select test_type:unique  # Run specific test type
```

### **Development**

```bash
dbt compile                      # Check SQL syntax
dbt compile --select model_name  # Compile specific model
dbt show --select model_name     # Preview compiled SQL
```

### **Documentation**

```bash
dbt docs generate                # Generate docs
dbt docs serve                   # View docs (localhost:8080)
```

### **Debugging**

```bash
dbt run --select model_name --debug     # Verbose logging
dbt run --fail-fast                      # Stop on first error
dbt ls                                   # List all models
dbt ls --select model_name+              # List dependencies
```

---

## 📁 File Locations

- **Models:** `models/staging/`, `models/marts/`
- **Tests:** `models/staging/schema.yml`
- **Logs:** `logs/dbt.log`
- **Compiled SQL:** `target/compiled/`
- **Config:** `dbt_project.yml`, `profiles.yml`

---

## 🎯 Model Selection Syntax

```bash
# By name
--select my_model

# By path
--select staging.stg_procedures

# By tag
--select tag:daily

# Multiple models
--select model_a model_b

# With dependencies
--select my_model+              # Downstream
--select +my_model              # Upstream  
--select +my_model+             # Both

# By status
--select state:modified         # Changed models only
--select state:modified+        # Changed + downstream
```

---

## 💾 Materialization Types

```sql
-- View (default) - Query on read
{{ config(materialized='view') }}

-- Table - Rebuild entire table
{{ config(materialized='table') }}

-- Incremental - Append new rows only
{{ config(materialized='incremental') }}

-- Ephemeral - CTE (no table created)
{{ config(materialized='ephemeral') }}
```

---

## 🧪 Common Tests

```yaml
# In schema.yml
columns:
  - name: id
    tests:
      - unique
      - not_null
      - relationships:
          to: ref('other_table')
          field: id
      - accepted_values:
          values: ['A', 'B', 'C']
```

---

## 🚨 Troubleshooting

| Issue | Fix |
|-------|-----|
| Can't connect to BigQuery | `dbt debug`, check `profiles.yml` |
| Compilation error | `dbt compile --select model_name` |
| Test failures | `dbt test --select model_name` |
| Slow query | Add partitions/clusters in config |
| Import error | `pip install -r requirements.txt` |

---

## 💡 Pro Tips

- Use `dbt run --select state:modified+` to run only changed models
- Add `{{ ref('model_name') }}` for dependencies (never hardcode table names)
- Partition large tables by date for better performance
- Use `schema.yml` to document all models
- Run `dbt test` before every commit

---

**More info:** `dbt --help` or https://docs.getdbt.com/
