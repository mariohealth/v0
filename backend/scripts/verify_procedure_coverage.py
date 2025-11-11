#!/usr/bin/env python3
"""
Procedure Coverage Verification Script
Purpose: Determine which procedure categories currently have pricing/provider data in Supabase.
Context: MRI pricing missing; need to see if this is MRI-specific or system-wide.

Read-only queries only - NO insert/update/delete operations.
"""

import os
import sys
from pathlib import Path
from datetime import datetime

# Try to load dotenv if available
try:
    from dotenv import load_dotenv
    load_dotenv_available = True
except ImportError:
    load_dotenv_available = False

try:
    import psycopg2
    from psycopg2.extras import RealDictCursor
except ImportError:
    print("ERROR: psycopg2 not installed. Install with: pip install psycopg2-binary")
    sys.exit(1)

# Load environment variables
script_dir = Path(__file__).parent
backend_dir = script_dir.parent
env_file = backend_dir / ".env"
if env_file.exists() and load_dotenv_available:
    load_dotenv(env_file)
elif env_file.exists():
    # Fallback: read .env manually
    with open(env_file) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                os.environ[key.strip()] = value.strip()

# Database connection
DB_PASS = os.getenv("SUPABASE_DB_PASS")
if not DB_PASS:
    print("ERROR: SUPABASE_DB_PASS environment variable not set")
    print("Please set it in backend/.env or export it before running this script")
    sys.exit(1)

DATABASE_URL = f"postgresql://postgres.anvremdouphhucqrxgoq:{DB_PASS}@aws-1-us-east-1.pooler.supabase.com:5432/postgres"

def run_query(conn, query, description):
    """Execute a read-only query and return results."""
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(query)
            return cur.fetchall()
    except Exception as e:
        print(f"ERROR in {description}: {e}")
        return []

def main():
    print("=== Mario Health Procedure Coverage Scan ===")
    print(f"Timestamp: {datetime.now().isoformat()}\n")
    
    try:
        conn = psycopg2.connect(DATABASE_URL)
        print("✓ Connected to Supabase database\n")
    except Exception as e:
        print(f"ERROR: Could not connect to database: {e}")
        sys.exit(1)
    
    results = {}
    
    # Step 1: Check total procedure families
    print("=== Step 1. Check total procedure families ===")
    query1 = """
        SELECT DISTINCT family_name
        FROM procedure
        ORDER BY family_name;
    """
    families = run_query(conn, query1, "Step 1")
    results['families'] = [f['family_name'] for f in families]
    print(f"Found {len(families)} procedure families:")
    for f in families[:20]:  # Show first 20
        print(f"  - {f['family_name']}")
    if len(families) > 20:
        print(f"  ... and {len(families) - 20} more")
    print()
    
    # Step 2: Check pricing coverage for key families
    print("=== Step 2. Check pricing coverage for key families ===")
    query2 = """
        WITH fams AS (
            SELECT id, slug, name, family_name
            FROM procedure
            WHERE family_name ILIKE ANY(ARRAY['%MRI%', '%CT%', '%X-ray%', '%Ultrasound%', '%Lab%'])
        )
        SELECT
            f.family_name,
            COUNT(DISTINCT f.id) AS total_procedures,
            COUNT(DISTINCT pp.procedure_id) AS procedures_with_pricing,
            ROUND(100.0 * COUNT(DISTINCT pp.procedure_id)::NUMERIC / NULLIF(COUNT(DISTINCT f.id), 0), 1) AS coverage_percent
        FROM fams f
        LEFT JOIN procedure_pricing pp ON f.id = pp.procedure_id
        GROUP BY f.family_name
        ORDER BY coverage_percent DESC NULLS LAST;
    """
    coverage = run_query(conn, query2, "Step 2")
    results['coverage'] = coverage
    print("Coverage by family:")
    for c in coverage:
        print(f"  {c['family_name']}: {c['procedures_with_pricing']}/{c['total_procedures']} procedures ({c['coverage_percent']}%)")
    print()
    
    # Step 3: Top 20 procedures with provider counts
    print("=== Step 3. Top 20 procedures with provider counts ===")
    query3 = """
        SELECT 
            p.slug, 
            p.name,
            p.family_name,
            COUNT(pp.id) AS provider_count
        FROM procedure p
        LEFT JOIN procedure_pricing pp ON pp.procedure_id = p.id
        GROUP BY p.slug, p.name, p.family_name
        ORDER BY provider_count DESC
        LIMIT 20;
    """
    top_procedures = run_query(conn, query3, "Step 3")
    results['top_procedures'] = top_procedures
    print("Top procedures by provider count:")
    for i, p in enumerate(top_procedures, 1):
        print(f"  {i}. {p['slug']} ({p['name']}) - {p['provider_count']} providers [{p['family_name']}]")
    print()
    
    # Step 4: Check RPC schema
    print("=== Step 4. Check RPC schema for search_procedures functions ===")
    query4 = """
        SELECT routine_schema, routine_name, routine_type
        FROM information_schema.routines
        WHERE routine_name ILIKE '%search_procedures%'
        ORDER BY routine_schema, routine_name;
    """
    rpc_functions = run_query(conn, query4, "Step 4")
    results['rpc_functions'] = rpc_functions
    print("Found RPC functions:")
    for rpc in rpc_functions:
        print(f"  - {rpc['routine_schema']}.{rpc['routine_name']} ({rpc['routine_type']})")
    print()
    
    # Step 5: Spot-check procedures with pricing
    print("=== Step 5. Spot-check procedures that have pricing ===")
    query5 = """
        SELECT 
            f.family_name, 
            f.name, 
            f.slug, 
            pp.price, 
            pp.updated_at
        FROM procedure f
        JOIN procedure_pricing pp ON f.id = pp.procedure_id
        WHERE f.family_name ILIKE ANY(ARRAY['%MRI%', '%CT%', '%X-ray%', '%Ultrasound%', '%Lab%'])
        ORDER BY pp.updated_at DESC
        LIMIT 20;
    """
    sample_pricing = run_query(conn, query5, "Step 5")
    results['sample_pricing'] = sample_pricing
    print("Sample procedures with pricing (most recent first):")
    for p in sample_pricing[:10]:
        print(f"  {p['slug']} ({p['name']}) - ${p['price']} [{p['family_name']}] - Updated: {p['updated_at']}")
    print()
    
    # Step 6: Check for MRI-specific procedures
    print("=== Step 6. MRI-specific procedure check ===")
    query6 = """
        SELECT 
            p.slug,
            p.name,
            p.family_name,
            COUNT(pp.id) AS provider_count,
            MIN(pp.price) AS min_price,
            AVG(pp.price) AS avg_price,
            MAX(pp.price) AS max_price
        FROM procedure p
        LEFT JOIN procedure_pricing pp ON pp.procedure_id = p.id
        WHERE p.slug ILIKE '%mri%' OR p.name ILIKE '%mri%'
        GROUP BY p.slug, p.name, p.family_name
        ORDER BY provider_count DESC;
    """
    mri_procedures = run_query(conn, query6, "Step 6")
    results['mri_procedures'] = mri_procedures
    print("MRI procedures:")
    for m in mri_procedures:
        if m['provider_count'] > 0:
            print(f"  ✓ {m['slug']} ({m['name']}) - {m['provider_count']} providers, ${m['min_price']:.2f}-${m['max_price']:.2f}")
        else:
            print(f"  ✗ {m['slug']} ({m['name']}) - NO PRICING DATA")
    print()
    
    conn.close()
    
    # Generate markdown report
    report_path = backend_dir / "VERIFICATION_PROCEDURE_COVERAGE.md"
    generate_report(report_path, results)
    print(f"\n✓ Report generated: {report_path}")

def generate_report(path, results):
    """Generate markdown report from results."""
    with open(path, 'w') as f:
        f.write("# Procedure Coverage Verification Report\n\n")
        f.write(f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
        f.write("## Summary\n\n")
        f.write(f"- Total procedure families: {len(results['families'])}\n")
        f.write(f"- Key families analyzed: MRI, CT, X-ray, Ultrasound, Lab\n\n")
        
        f.write("## 1. Top 20 Procedures with Provider Counts\n\n")
        f.write("| Rank | Slug | Name | Family | Provider Count |\n")
        f.write("|------|------|------|--------|----------------|\n")
        for i, p in enumerate(results['top_procedures'], 1):
            f.write(f"| {i} | `{p['slug']}` | {p['name']} | {p['family_name']} | {p['provider_count']} |\n")
        f.write("\n")
        
        f.write("## 2. Coverage by Family\n\n")
        f.write("| Family | Total Procedures | With Pricing | Coverage % |\n")
        f.write("|--------|-----------------|--------------|-------------|\n")
        for c in results['coverage']:
            f.write(f"| {c['family_name']} | {c['total_procedures']} | {c['procedures_with_pricing']} | {c['coverage_percent']}% |\n")
        f.write("\n")
        
        f.write("## 3. RPC Schema Findings\n\n")
        if results['rpc_functions']:
            f.write("| Schema | Function Name | Type |\n")
            f.write("|--------|---------------|------|\n")
            for rpc in results['rpc_functions']:
                f.write(f"| {rpc['routine_schema']} | `{rpc['routine_name']}` | {rpc['routine_type']} |\n")
        else:
            f.write("**No search_procedures functions found.**\n")
        f.write("\n")
        
        f.write("## 4. MRI Procedures Status\n\n")
        f.write("| Slug | Name | Family | Provider Count | Price Range |\n")
        f.write("|------|------|--------|----------------|-------------|\n")
        for m in results['mri_procedures']:
            if m['provider_count'] > 0:
                price_range = f"${m['min_price']:.2f}-${m['max_price']:.2f}"
            else:
                price_range = "N/A"
            f.write(f"| `{m['slug']}` | {m['name']} | {m['family_name']} | {m['provider_count']} | {price_range} |\n")
        f.write("\n")
        
        f.write("## 5. Notes on Null/Empty Pricing Cases\n\n")
        mri_without_pricing = [m for m in results['mri_procedures'] if m['provider_count'] == 0]
        if mri_without_pricing:
            f.write("### MRI Procedures Missing Pricing Data:\n\n")
            for m in mri_without_pricing:
                f.write(f"- `{m['slug']}` ({m['name']})\n")
            f.write("\n")
        else:
            f.write("All MRI procedures have pricing data.\n\n")
        
        f.write("## 6. Recommendations\n\n")
        if mri_without_pricing:
            f.write("### MRI Missing Pricing Data\n\n")
            f.write("The following MRI procedures are missing pricing/provider data:\n\n")
            for m in mri_without_pricing:
                f.write(f"- `{m['slug']}` ({m['name']})\n")
            f.write("\n**Action Items:**\n")
            f.write("1. Ask AC to seed pricing data for missing MRI procedures\n")
            f.write("2. Verify that `search_procedures_v2` RPC is correctly filtering results\n")
            f.write("3. Check if Type-2 logic is incorrectly filtering out valid pricing data\n")
            f.write("4. Confirm frontend normalization maps `mri_brain` → correct database slug\n\n")
        else:
            f.write("All checked procedures have pricing data. If MRI results are still missing:\n")
            f.write("1. Verify frontend normalization is correct\n")
            f.write("2. Check Type-2 filtering logic in backend\n")
            f.write("3. Verify RPC function is returning results correctly\n\n")
        
        f.write("## 7. Backend Implementation Notes\n\n")
        f.write("### get_procedure_providers Implementation\n\n")
        f.write("- **Location:** `backend/mario-health-api/app/services/procedure_service.py`\n")
        f.write("- **Method:** Queries `procedure_pricing` table directly (not using RPC)\n")
        f.write("- **Query:** Filters by `procedure_id` from `get_procedure_detail` RPC result\n")
        f.write("- **Note:** No Type-2 filtering in this method - returns all pricing records\n\n")
        
        f.write("### search_procedures_v2 RPC\n\n")
        f.write("- **Location:** `backend/mario-health-api/app/services/search_service.py`\n")
        f.write("- **RPC Name:** `search_procedures_v2`\n")
        f.write("- **Schema:** Check database for actual schema (likely `public`)\n\n")
        
        f.write("## 8. Frontend Normalization\n\n")
        f.write("### Slug Normalization\n\n")
        f.write("- **Location:** `frontend/src/lib/api.ts`\n")
        f.write("- **Function:** `generateSlugVariants()`\n")
        f.write("- **Mappings:**\n")
        f.write("  - `mri_brain` → `mri_of_brain`\n")
        f.write("  - `mri_spine` → `mri_of_spine`\n")
        f.write("  - Underscores → hyphens\n")
        f.write("  - Underscores → `_of_`\n\n")
        f.write("**Note:** Frontend tries multiple slug variants when fetching providers.\n\n")

if __name__ == "__main__":
    main()

