#!/usr/bin/env python3
"""
Procedure Coverage Verification Script (Supabase Client Version)
Uses Supabase Python client instead of direct PostgreSQL connection.
"""

import os
import sys
from pathlib import Path
from datetime import datetime

try:
    from supabase import create_client, Client
except ImportError:
    print("ERROR: supabase-py not installed. Install with: pip install supabase")
    sys.exit(1)

# Load environment variables
script_dir = Path(__file__).parent
backend_dir = script_dir.parent
env_file = backend_dir / "mario-health-api" / ".env"

# Read .env file manually
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

def run_rpc(supabase: Client, function_name: str, params: dict):
    """Execute an RPC function."""
    try:
        result = supabase.rpc(function_name, params).execute()
        return result.data if result.data else []
    except Exception as e:
        print(f"ERROR calling {function_name}: {e}")
        return []

def run_query_via_rpc(supabase: Client, query_description: str):
    """Run queries using RPC functions or table queries."""
    # For now, we'll use table queries where possible
    try:
        # Try to get procedures
        result = supabase.table("procedure").select("id,slug,name,family_name").limit(1000).execute()
        return result.data if result.data else []
    except Exception as e:
        print(f"ERROR in {query_description}: {e}")
        return []

def main():
    print("=== Mario Health Procedure Coverage Scan (Supabase Client) ===")
    print(f"Timestamp: {datetime.now().isoformat()}\n")
    
    try:
        supabase = create_client(supabase_url, supabase_key)
        print("✓ Connected to Supabase\n")
    except Exception as e:
        print(f"ERROR: Could not connect to Supabase: {e}")
        sys.exit(1)
    
    results = {}
    
    # Step 1: Get procedure families
    print("=== Step 1. Check total procedure families ===")
    try:
        # Get families
        families_result = supabase.table("procedure_family").select("id,name").execute()
        family_map = {f.get('id'): f.get('name', 'Unknown') for f in families_result.data}
        
        # Get procedures and count by family
        procedures_result = supabase.table("procedure").select("family_id").execute()
        families = {}
        for proc in procedures_result.data:
            fam_id = proc.get('family_id')
            fam_name = family_map.get(fam_id, 'Unknown')
            families[fam_name] = families.get(fam_name, 0) + 1
        
        results['families'] = list(families.keys())
        print(f"Found {len(families)} procedure families:")
        for fam in sorted(families.keys())[:20]:
            print(f"  - {fam} ({families[fam]} procedures)")
        if len(families) > 20:
            print(f"  ... and {len(families) - 20} more")
    except Exception as e:
        print(f"ERROR: {e}")
    print()
    
    # Step 2: Check pricing coverage
    print("=== Step 2. Check pricing coverage for key families ===")
    try:
        # Get families
        families_result = supabase.table("procedure_family").select("id,name").execute()
        family_map = {f.get('id'): f.get('name', 'Unknown') for f in families_result.data}
        
        # Get procedures in key families
        key_families = ['MRI', 'CT', 'X-ray', 'Ultrasound', 'Lab']
        key_family_ids = {fid for fid, fname in family_map.items() if any(kf.lower() in fname.lower() for kf in key_families)}
        
        procedures_result = supabase.table("procedure").select("id,slug,name,family_id").execute()
        
        coverage_data = {}
        for proc in procedures_result.data:
            fam_id = proc.get('family_id')
            if fam_id in key_family_ids:
                fam_name = family_map.get(fam_id, 'Unknown')
                if fam_name not in coverage_data:
                    coverage_data[fam_name] = {'total': 0, 'with_pricing': 0}
                coverage_data[fam_name]['total'] += 1
        
        # Check pricing for these procedures
        pricing_result = supabase.table("procedure_pricing").select("procedure_id").execute()
        pricing_proc_ids = {p.get('procedure_id') for p in pricing_result.data if p.get('procedure_id')}
        
        for proc in procedures_result.data:
            fam_id = proc.get('family_id')
            if fam_id in key_family_ids:
                fam_name = family_map.get(fam_id, 'Unknown')
                if proc.get('id') in pricing_proc_ids:
                    if fam_name in coverage_data:
                        coverage_data[fam_name]['with_pricing'] += 1
        
        results['coverage'] = []
        for fam, data in coverage_data.items():
            total = data['total']
            with_pricing = data['with_pricing']
            coverage_pct = round(100.0 * with_pricing / total, 1) if total > 0 else 0
            results['coverage'].append({
                'family_name': fam,
                'total_procedures': total,
                'procedures_with_pricing': with_pricing,
                'coverage_percent': coverage_pct
            })
            print(f"  {fam}: {with_pricing}/{total} procedures ({coverage_pct}%)")
    except Exception as e:
        print(f"ERROR: {e}")
    print()
    
    # Step 3: Top procedures with provider counts
    print("=== Step 3. Top 20 procedures with provider counts ===")
    try:
        # Get pricing counts per procedure
        pricing_result = supabase.table("procedure_pricing").select("procedure_id").execute()
        proc_counts = {}
        for p in pricing_result.data:
            proc_id = p.get('procedure_id')
            if proc_id:
                proc_counts[proc_id] = proc_counts.get(proc_id, 0) + 1
        
        # Get procedure details and families
        families_result = supabase.table("procedure_family").select("id,name").execute()
        family_map = {f.get('id'): f.get('name', 'Unknown') for f in families_result.data}
        
        procedures_result = supabase.table("procedure").select("id,slug,name,family_id").execute()
        proc_details = {p.get('id'): p for p in procedures_result.data}
        
        # Combine and sort
        top_procedures = []
        for proc_id, count in sorted(proc_counts.items(), key=lambda x: x[1], reverse=True)[:20]:
            proc = proc_details.get(proc_id, {})
            fam_id = proc.get('family_id')
            fam_name = family_map.get(fam_id, 'Unknown')
            top_procedures.append({
                'slug': proc.get('slug', 'unknown'),
                'name': proc.get('name', 'Unknown'),
                'family_name': fam_name,
                'provider_count': count
            })
            print(f"  {proc.get('slug', 'unknown')} ({proc.get('name', 'Unknown')}) - {count} providers [{fam_name}]")
        
        results['top_procedures'] = top_procedures
    except Exception as e:
        print(f"ERROR: {e}")
    print()
    
    # Step 4: Check RPC functions (via information_schema would require direct DB access)
    print("=== Step 4. Check RPC schema ===")
    print("Note: RPC schema check requires direct database access.")
    print("Known RPC functions from code:")
    print("  - search_procedures_v2 (used in search_service.py)")
    print("  - get_procedure_detail (used in procedure_service.py)")
    print()
    
    # Step 5: MRI-specific check
    print("=== Step 5. MRI-specific procedure check ===")
    try:
        # Get families
        families_result = supabase.table("procedure_family").select("id,name").execute()
        family_map = {f.get('id'): f.get('name', 'Unknown') for f in families_result.data}
        
        # Get MRI procedures (by slug or name containing mri)
        all_procs = supabase.table("procedure").select("id,slug,name,family_id").execute()
        mri_procs = [p for p in all_procs.data if 'mri' in p.get('slug', '').lower() or 'mri' in p.get('name', '').lower()]
        
        # Get pricing for MRI procedures
        pricing_result = supabase.table("procedure_pricing").select("procedure_id,price").execute()
        pricing_by_proc = {}
        for p in pricing_result.data:
            proc_id = p.get('procedure_id')
            if proc_id:
                if proc_id not in pricing_by_proc:
                    pricing_by_proc[proc_id] = []
                pricing_by_proc[proc_id].append(float(p.get('price', 0)))
        
        results['mri_procedures'] = []
        for proc in mri_procs:
            proc_id = proc.get('id')
            prices = pricing_by_proc.get(proc_id, [])
            count = len(prices)
            fam_id = proc.get('family_id')
            fam_name = family_map.get(fam_id, 'Unknown')
            if count > 0:
                min_price = min(prices)
                max_price = max(prices)
                print(f"  ✓ {proc.get('slug')} ({proc.get('name')}) - {count} providers, ${min_price:.2f}-${max_price:.2f}")
            else:
                print(f"  ✗ {proc.get('slug')} ({proc.get('name')}) - NO PRICING DATA")
            
            results['mri_procedures'].append({
                'slug': proc.get('slug'),
                'name': proc.get('name'),
                'family_name': fam_name,
                'provider_count': count,
                'min_price': min(prices) if prices else None,
                'max_price': max(prices) if prices else None
            })
    except Exception as e:
        print(f"ERROR: {e}")
    print()
    
    # Generate report
    report_path = backend_dir / "VERIFICATION_PROCEDURE_COVERAGE.md"
    generate_report(report_path, results)
    print(f"\n✓ Report generated: {report_path}")

def generate_report(path, results):
    """Generate markdown report."""
    with open(path, 'w') as f:
        f.write("# Procedure Coverage Verification Report\n\n")
        f.write(f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
        f.write("## Summary\n\n")
        f.write(f"- Total procedure families: {len(results.get('families', []))}\n")
        f.write(f"- Key families analyzed: MRI, CT, X-ray, Ultrasound, Lab\n\n")
        
        f.write("## 1. Top 20 Procedures with Provider Counts\n\n")
        f.write("| Rank | Slug | Name | Family | Provider Count |\n")
        f.write("|------|------|------|--------|----------------|\n")
        for i, p in enumerate(results.get('top_procedures', [])[:20], 1):
            f.write(f"| {i} | `{p.get('slug', 'N/A')}` | {p.get('name', 'N/A')} | {p.get('family_name', 'N/A')} | {p.get('provider_count', 0)} |\n")
        f.write("\n")
        
        f.write("## 2. Coverage by Family\n\n")
        f.write("| Family | Total Procedures | With Pricing | Coverage % |\n")
        f.write("|--------|-----------------|--------------|-------------|\n")
        for c in results.get('coverage', []):
            f.write(f"| {c.get('family_name', 'N/A')} | {c.get('total_procedures', 0)} | {c.get('procedures_with_pricing', 0)} | {c.get('coverage_percent', 0)}% |\n")
        f.write("\n")
        
        f.write("## 3. MRI Procedures Status\n\n")
        f.write("| Slug | Name | Family | Provider Count | Price Range |\n")
        f.write("|------|------|--------|----------------|-------------|\n")
        for m in results.get('mri_procedures', []):
            if m.get('provider_count', 0) > 0:
                price_range = f"${m.get('min_price', 0):.2f}-${m.get('max_price', 0):.2f}"
            else:
                price_range = "N/A"
            f.write(f"| `{m.get('slug', 'N/A')}` | {m.get('name', 'N/A')} | {m.get('family_name', 'N/A')} | {m.get('provider_count', 0)} | {price_range} |\n")
        f.write("\n")
        
        f.write("## 4. Recommendations\n\n")
        mri_without = [m for m in results.get('mri_procedures', []) if m.get('provider_count', 0) == 0]
        if mri_without:
            f.write("### MRI Procedures Missing Pricing Data:\n\n")
            for m in mri_without:
                f.write(f"- `{m.get('slug', 'N/A')}` ({m.get('name', 'N/A')})\n")
            f.write("\n**Action Items:**\n")
            f.write("1. Ask AC to seed pricing data for missing MRI procedures\n")
            f.write("2. Verify that `search_procedures_v2` RPC is correctly filtering results\n")
            f.write("3. Check if Type-2 logic is incorrectly filtering out valid pricing data\n")
            f.write("4. Confirm frontend normalization maps `mri_brain` → correct database slug\n\n")

if __name__ == "__main__":
    main()

