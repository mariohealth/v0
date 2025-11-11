# Procedure Coverage Verification Scripts

## Purpose

These scripts verify which procedures currently have provider/pricing data in Supabase, helping identify if MRI pricing issues are MRI-specific or system-wide.

## Prerequisites

### For Bash Script (Recommended)
- `psql` (PostgreSQL client) installed
- `SUPABASE_DB_PASS` environment variable set

### For Python Script
- Python 3.x
- `psycopg2-binary` package: `pip install psycopg2-binary`
- `python-dotenv` package (optional): `pip install python-dotenv`
- `SUPABASE_DB_PASS` environment variable set

## Setup

1. Set the database password:
   ```bash
   export SUPABASE_DB_PASS=your_password_here
   ```

   Or create `backend/.env`:
   ```
   SUPABASE_DB_PASS=your_password_here
   ```

## Usage

### Bash Script (Recommended)
```bash
cd backend/scripts
./verify_procedure_coverage.sh
```

### Python Script
```bash
cd backend/scripts
python3 verify_procedure_coverage.py
```

## What It Does

1. **Lists all procedure families** - Shows all distinct procedure families in the database
2. **Checks pricing coverage** - Analyzes coverage for MRI, CT, X-ray, Ultrasound, and Lab procedures
3. **Top 20 procedures** - Shows procedures with the most provider/pricing data
4. **RPC schema check** - Identifies which schema hosts `search_procedures_v2` RPC
5. **Sample pricing data** - Shows recent pricing records for key procedure families
6. **MRI-specific analysis** - Detailed check of all MRI procedures and their pricing status

## Output

The script generates:
- Console output with all query results
- Markdown report: `backend/VERIFICATION_PROCEDURE_COVERAGE.md`

## Report Contents

The generated report includes:
- Top 20 procedures with provider counts
- Coverage statistics by family
- RPC schema findings
- MRI procedures status
- Notes on missing pricing data
- Recommendations for fixing issues
- Backend implementation notes
- Frontend normalization details

## Read-Only Operations

**All queries are read-only** - No insert/update/delete operations are performed.

## Troubleshooting

### "psql: command not found"
Install PostgreSQL client tools:
- macOS: `brew install postgresql`
- Ubuntu/Debian: `sudo apt-get install postgresql-client`
- Or use the Python script instead

### "SUPABASE_DB_PASS not set"
Set the environment variable:
```bash
export SUPABASE_DB_PASS=your_password
```

### Connection errors
- Verify the password is correct
- Check network connectivity to Supabase
- Ensure the database URL format is correct

## Related Files

- `backend/mario-health-api/app/services/procedure_service.py` - Backend implementation
- `backend/mario-health-api/app/services/search_service.py` - Search RPC usage
- `frontend/src/lib/api.ts` - Frontend normalization logic

