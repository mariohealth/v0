#!/usr/bin/env python3
"""
Mario Health - Full Data Verification & Diagnostics
Context: Routing/CORS fixed, frontend working, but MRI endpoints return no data.
Goal: Run deep backend verification across procedures, pricing, and provider coverage.
"""

import os
import sys
import subprocess
import json
from pathlib import Path
from datetime import datetime
from collections import defaultdict

try:
    from supabase import create_client, Client
except ImportError:
    print("ERROR: supabase-py not installed. Install with: pip install supabase")
    sys.exit(1)

# Load environment variables
script_dir = Path(__file__).parent
backend_dir = script_dir.parent
env_file = backend_dir / "mario-health-api" / ".env"

supabase_url = None
supabase_key = None

if env_file.exists():
    with open(env_file) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                if key == "SUPABASE_URL":
                    supabase_url = value.strip()
                elif key == "SUPABASE_KEY":
                    supabase_key = value.strip()

if not supabase_url or not supabase_key:
    print("ERROR: SUPABASE_URL and SUPABASE_KEY must be set in backend/mario-health-api/.env")
    sys.exit(1)

def main():
    print("=== Mario Health — Full Data Verification & Diagnostics ===\n")
    
    # Step 1: Environment Check
    print("=== Step 1. Environment Check ===")
    print(f"SUPABASE_URL: {supabase_url}")
    print(f"PYTHON PATH: {subprocess.check_output(['which', 'python3']).decode().strip()}")
    try:
        psql_path = subprocess.check_output(['which', 'psql']).decode().strip()
        print(f"PostgreSQL Client: {psql_path}")
    except:
        print("PostgreSQL Client: not found (using Supabase client instead)")
    print()
    
    # Connect to Supabase
    try:
        supabase = create_client(supabase_url, supabase_key)
        print("✓ Connected to Supabase\n")
    except Exception as e:
        print(f"ERROR: Could not connect to Supabase: {e}")
        sys.exit(1)
    
    # Step 2: Verify database connectivity and procedure families
    print("=== Step 2. Verify Database Connectivity and Procedure Families ===")
    try:
        procedures_result = supabase.table("procedure").select("id,family_id").execute()
        families_result = supabase.table("procedure_family").select("id,name").execute()
        
        family_map = {f.get('id'): f.get('name', 'Unknown') for f in families_result.data}
        family_counts = defaultdict(int)
        
        for proc in procedures_result.data:
            fam_id = proc.get('family_id')
            if fam_id:
                fam_name = family_map.get(fam_id, 'Unknown')
                family_counts[fam_name] += 1
        
        total_procedures = len(procedures_result.data)
        total_families = len(family_counts)
        
        print(f"Total procedures: {total_procedures}")
        print(f"Total families: {total_families}\n")
        print("Procedure families:")
        for fam_name in sorted([f for f in family_counts.keys() if f]):
            print(f"  - {fam_name} ({family_counts[fam_name]} procedures)")
    except Exception as e:
        print(f"ERROR: {e}")
    print()
    
    # Step 3: Pricing coverage scan across all major families
    print("=== Step 3. Pricing Coverage Scan Across Major Families ===")
    try:
        # Get families
        families_result = supabase.table("procedure_family").select("id,name").execute()
        family_map = {f.get('id'): f.get('name', 'Unknown') for f in families_result.data}
        
        # Key families to check
        key_family_keywords = ['MRI', 'CT', 'X-ray', 'Ultrasound', 'Lab', 'Echo', 'PET', 'Screening', 'Biopsy']
        key_family_ids = {
            fid for fid, fname in family_map.items() 
            if fname and any(kw.lower() in fname.lower() for kw in key_family_keywords)
        }
        
        # Get procedures in key families
        procedures_result = supabase.table("procedure").select("id,slug,name,family_id").execute()
        
        # Get pricing data
        pricing_result = supabase.table("procedure_pricing").select("procedure_id").execute()
        pricing_proc_ids = {p.get('procedure_id') for p in pricing_result.data if p.get('procedure_id')}
        
        # Calculate coverage
        coverage_data = {}
        for proc in procedures_result.data:
            fam_id = proc.get('family_id')
            if fam_id in key_family_ids:
                fam_name = family_map.get(fam_id, 'Unknown')
                if fam_name not in coverage_data:
                    coverage_data[fam_name] = {'total': 0, 'with_pricing': 0}
                coverage_data[fam_name]['total'] += 1
                if proc.get('id') in pricing_proc_ids:
                    coverage_data[fam_name]['with_pricing'] += 1
        
        print("Coverage by family:")
        for fam_name in sorted([f for f in coverage_data.keys() if f], key=lambda x: coverage_data[x]['with_pricing'] / max(coverage_data[x]['total'], 1), reverse=True):
            data = coverage_data[fam_name]
            coverage_pct = round(100.0 * data['with_pricing'] / data['total'], 1) if data['total'] > 0 else 0
            print(f"  {fam_name}: {data['with_pricing']}/{data['total']} procedures ({coverage_pct}% coverage)")
    except Exception as e:
        print(f"ERROR: {e}")
        coverage_data = {}
    print()
    
    # Step 4: Identify procedures with zero pricing data
    print("=== Step 4. Procedures with Zero Pricing Data ===")
    try:
        # Get all procedures
        procedures_result = supabase.table("procedure").select("id,slug,name,family_id").execute()
        
        # Get pricing data
        pricing_result = supabase.table("procedure_pricing").select("procedure_id").execute()
        pricing_proc_ids = {p.get('procedure_id') for p in pricing_result.data if p.get('procedure_id')}
        
        # Get families
        families_result = supabase.table("procedure_family").select("id,name").execute()
        family_map = {f.get('id'): f.get('name', 'Unknown') for f in families_result.data}
        
        # Find procedures without pricing
        no_pricing = []
        for proc in procedures_result.data:
            if proc.get('id') not in pricing_proc_ids:
                fam_id = proc.get('family_id')
                fam_name = family_map.get(fam_id, 'Unknown')
                no_pricing.append({
                    'slug': proc.get('slug', 'unknown'),
                    'name': proc.get('name', 'Unknown'),
                    'family_name': fam_name
                })
        
        # Sort by family, then name (handle None values)
        no_pricing.sort(key=lambda x: (x['family_name'] or '', x['name'] or ''))
        
        print(f"Found {len(no_pricing)} procedures with zero pricing data (showing first 50):")
        for proc in no_pricing[:50]:
            print(f"  {proc['slug']} ({proc['name']}) [{proc['family_name']}]")
        if len(no_pricing) > 50:
            print(f"  ... and {len(no_pricing) - 50} more")
    except Exception as e:
        print(f"ERROR: {e}")
    print()
    
    # Step 5: Verify key RPCs and backend code references
    print("=== Step 5. Verify Key RPCs and Backend Code References ===")
    try:
        backend_path = backend_dir / "mario-health-api"
        
        # Search for RPC references
        print("Searching for 'search_procedures_v2':")
        result = subprocess.run(
            ['grep', '-r', 'search_procedures_v2', str(backend_path)],
            capture_output=True, text=True
        )
        if result.stdout:
            for line in result.stdout.strip().split('\n')[:10]:
                print(f"  {line}")
        else:
            print("  Not found")
        
        print("\nSearching for 'get_procedure_providers':")
        result = subprocess.run(
            ['grep', '-r', 'get_procedure_providers', str(backend_path)],
            capture_output=True, text=True
        )
        if result.stdout:
            for line in result.stdout.strip().split('\n')[:10]:
                print(f"  {line}")
        else:
            print("  Not found")
        
        print("\nSearching for 'procedure_pricing':")
        result = subprocess.run(
            ['grep', '-r', 'procedure_pricing', str(backend_path)],
            capture_output=True, text=True
        )
        if result.stdout:
            for line in result.stdout.strip().split('\n')[:10]:
                print(f"  {line}")
        else:
            print("  Not found")
    except Exception as e:
        print(f"ERROR: {e}")
    print()
    
    # Step 6: Test live endpoints (if backend is running)
    print("=== Step 6. Test Live Endpoints ===")
    test_slugs = ['brain-mri', 'ct-head', 'xray-chest', 'ultrasound-abdomen', 'lab-cbc']
    api_base = "http://localhost:8000"
    
    for slug in test_slugs:
        print(f"\n--- Testing {slug} ---")
        try:
            result = subprocess.run(
                ['curl', '-s', f"{api_base}/api/v1/procedures/{slug}"],
                capture_output=True, text=True, timeout=5
            )
            if result.returncode == 0:
                try:
                    data = json.loads(result.stdout)
                    proc_data = data.get('procedure', {})
                    providers = data.get('providers', [])
                    print(f"  Status: OK")
                    print(f"  Procedure: {proc_data.get('name', 'N/A')}")
                    print(f"  Provider count: {len(providers)}")
                except json.JSONDecodeError:
                    print(f"  Response: {result.stdout[:200]}")
            else:
                print(f"  Status: Connection failed (backend may not be running)")
        except subprocess.TimeoutExpired:
            print(f"  Status: Timeout (backend may not be running)")
        except Exception as e:
            print(f"  Status: Error - {e}")
    print()
    
    # Step 7: Generate summary report
    print("=== Step 7. Generate Summary Report ===")
    diagnostics_dir = backend_dir / "diagnostics"
    diagnostics_dir.mkdir(exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    output_file = diagnostics_dir / f"procedure_coverage_report_{timestamp}.md"
    
    # Re-run coverage calculation if it failed
    if 'coverage_data' not in locals() or not coverage_data:
        try:
            families_result = supabase.table("procedure_family").select("id,name").execute()
            family_map = {f.get('id'): f.get('name', 'Unknown') for f in families_result.data}
            key_family_keywords = ['MRI', 'CT', 'X-ray', 'Ultrasound', 'Lab', 'Echo', 'PET', 'Screening', 'Biopsy']
            key_family_ids = {
                fid for fid, fname in family_map.items() 
                if fname and any(kw.lower() in fname.lower() for kw in key_family_keywords)
            }
            procedures_result = supabase.table("procedure").select("id,slug,name,family_id").execute()
            pricing_result = supabase.table("procedure_pricing").select("procedure_id").execute()
            pricing_proc_ids = {p.get('procedure_id') for p in pricing_result.data if p.get('procedure_id')}
            coverage_data = {}
            for proc in procedures_result.data:
                fam_id = proc.get('family_id')
                if fam_id in key_family_ids:
                    fam_name = family_map.get(fam_id, 'Unknown')
                    if fam_name not in coverage_data:
                        coverage_data[fam_name] = {'total': 0, 'with_pricing': 0}
                    coverage_data[fam_name]['total'] += 1
                    if proc.get('id') in pricing_proc_ids:
                        coverage_data[fam_name]['with_pricing'] += 1
        except:
            coverage_data = {}
    
    # Re-run no_pricing if it failed
    if 'no_pricing' not in locals():
        try:
            procedures_result = supabase.table("procedure").select("id,slug,name,family_id").execute()
            pricing_result = supabase.table("procedure_pricing").select("procedure_id").execute()
            pricing_proc_ids = {p.get('procedure_id') for p in pricing_result.data if p.get('procedure_id')}
            families_result = supabase.table("procedure_family").select("id,name").execute()
            family_map = {f.get('id'): f.get('name', 'Unknown') for f in families_result.data}
            no_pricing = []
            for proc in procedures_result.data:
                if proc.get('id') not in pricing_proc_ids:
                    fam_id = proc.get('family_id')
                    fam_name = family_map.get(fam_id, 'Unknown')
                    no_pricing.append({
                        'slug': proc.get('slug', 'unknown'),
                        'name': proc.get('name', 'Unknown'),
                        'family_name': fam_name
                    })
            no_pricing.sort(key=lambda x: (x['family_name'] or '', x['name'] or ''))
        except:
            no_pricing = []
    
    with open(output_file, 'w') as f:
        f.write(f"# Mario Health Procedure Coverage Report — {timestamp}\n\n")
        f.write("## Summary of Coverage by Family\n\n")
        f.write("| Family | Total Procedures | With Pricing | Coverage % |\n")
        f.write("|--------|-----------------|--------------|-------------|\n")
        
        # Write coverage data
        for fam_name in sorted([f for f in coverage_data.keys() if f]):
            data = coverage_data[fam_name]
            coverage_pct = round(100.0 * data['with_pricing'] / data['total'], 1) if data['total'] > 0 else 0
            f.write(f"| {fam_name} | {data['total']} | {data['with_pricing']} | {coverage_pct}% |\n")
        
        f.write("\n## Procedures with Zero Pricing Data\n\n")
        f.write(f"Total: {len(no_pricing)} procedures\n\n")
        f.write("| Slug | Name | Family |\n")
        f.write("|------|------|--------|\n")
        for proc in no_pricing[:100]:  # Top 100
            f.write(f"| `{proc['slug']}` | {proc['name']} | {proc['family_name']} |\n")
        
        f.write("\n## MRI Procedures Status\n\n")
        mri_procs = [p for p in no_pricing if 'mri' in p['slug'].lower() or 'mri' in p['name'].lower()]
        f.write(f"**Total MRI procedures without pricing: {len(mri_procs)}**\n\n")
        for proc in mri_procs:
            f.write(f"- `{proc['slug']}` ({proc['name']})\n")
        
        f.write("\n## Recommendations\n\n")
        f.write("1. **Seed pricing data** for all MRI procedures\n")
        f.write("2. **Verify RPC functions** are correctly filtering results\n")
        f.write("3. **Check Type-2 logic** isn't filtering out valid pricing\n")
        f.write("4. **Confirm frontend normalization** maps slugs correctly\n")
    
    print(f"✅ Report saved to {output_file}\n")
    print("Verification complete!")

if __name__ == "__main__":
    main()

