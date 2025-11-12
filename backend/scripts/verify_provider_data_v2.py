#!/usr/bin/env python3
"""
Mario Health — Provider Data Verification & Diagnostics
Purpose: Verify provider_location structure, data completeness, and linkage to procedure_pricing.
"""

import os
import sys
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
    print("=== Mario Health — Provider Data Verification & Diagnostics ===\n")
    
    # Connect to Supabase
    try:
        supabase = create_client(supabase_url, supabase_key)
        print("✓ Connected to Supabase\n")
    except Exception as e:
        print(f"ERROR: Could not connect to Supabase: {e}")
        sys.exit(1)
    
    # Step 1: Check schema
    print("=== Checking Schema ===")
    try:
        sample = supabase.table("provider_location").select("*").limit(1).execute()
        if sample.data:
            print("provider_location table columns:")
            for col in sorted(sample.data[0].keys()):
                print(f"  - {col}")
        else:
            print("  No data in provider_location table")
    except Exception as e:
        print(f"ERROR: {e}")
    print()
    
    # Step 2: Count providers and check missing fields
    print("=== Counting Providers and Checking Missing Fields ===")
    try:
        providers_result = supabase.table("provider_location").select("*").execute()
        providers = providers_result.data
        
        total_providers = len(providers)
        # Check both 'name' and 'provider_name' fields
        missing_name = sum(1 for p in providers if not p.get('name') and not p.get('provider_name'))
        missing_city_state = sum(1 for p in providers if not p.get('city') or not p.get('state'))
        missing_coordinates = sum(1 for p in providers if not p.get('latitude') or not p.get('longitude'))
        
        print(f"Total providers: {total_providers}")
        print(f"Missing name: {missing_name}")
        print(f"Missing city/state: {missing_city_state}")
        print(f"Missing coordinates: {missing_coordinates}")
    except Exception as e:
        print(f"ERROR: {e}")
    print()
    
    # Step 3: Geographic coverage by state
    print("=== Geographic Coverage by State ===")
    try:
        state_counts = defaultdict(int)
        for p in providers:
            state = p.get('state')
            if state:
                state_counts[state] += 1
        
        print("Top 20 states by provider count:")
        for state, count in sorted(state_counts.items(), key=lambda x: x[1], reverse=True)[:20]:
            print(f"  {state}: {count} providers")
    except Exception as e:
        print(f"ERROR: {e}")
    print()
    
    # Step 4: Providers linked to pricing
    print("=== Providers Linked to Pricing ===")
    # Initialize variables for report generation
    providers_with_pricing_location_id = 0
    providers_with_pricing_numeric = 0
    coverage_percent_location_id = 0
    coverage_percent_numeric = 0
    provider_ids = set()
    provider_numeric_ids = set()
    
    try:
        # Get all provider IDs (both composite id and numeric provider_id)
        provider_ids = {p.get('id') for p in providers if p.get('id')}
        provider_numeric_ids = {p.get('provider_id') for p in providers if p.get('provider_id')}
        
        # Get pricing data - check for both provider_location_id and provider_id
        pricing_result = supabase.table("procedure_pricing").select("provider_location_id,provider_id").execute()
        pricing_provider_location_ids = {p.get('provider_location_id') for p in pricing_result.data if p.get('provider_location_id')}
        pricing_provider_ids = {p.get('provider_id') for p in pricing_result.data if p.get('provider_id')}
        
        # Method 1: Using provider_location_id (new schema - CORRECT)
        providers_with_pricing_location_id = len(provider_ids & pricing_provider_location_ids)
        coverage_percent_location_id = round(100.0 * providers_with_pricing_location_id / len(provider_ids), 1) if provider_ids else 0
        
        # Method 2: Using numeric provider_id (legacy method)
        providers_with_pricing_numeric = len(provider_numeric_ids & pricing_provider_ids)
        coverage_percent_numeric = round(100.0 * providers_with_pricing_numeric / len(provider_numeric_ids), 1) if provider_numeric_ids else 0
        
        print(f"Using provider_location_id (pp.provider_location_id = pl.id) [NEW SCHEMA - CORRECT]:")
        print(f"  Providers with pricing: {providers_with_pricing_location_id}")
        print(f"  Total providers: {len(provider_ids)}")
        print(f"  Coverage: {coverage_percent_location_id}%")
        print()
        print(f"Using numeric 'provider_id' field (pp.provider_id = pl.provider_id) [LEGACY]:")
        print(f"  Providers with pricing: {providers_with_pricing_numeric}")
        print(f"  Total providers: {len(provider_numeric_ids)}")
        print(f"  Coverage: {coverage_percent_numeric}%")
    except Exception as e:
        print(f"ERROR: {e}")
    print()
    
    # Step 5: Top providers by number of priced procedures
    print("=== Top Providers by Number of Priced Procedures ===")
    try:
        # Get pricing data with prices - check for both provider_location_id and provider_id
        pricing_result = supabase.table("procedure_pricing").select("provider_location_id,provider_id,procedure_id,price").execute()
        
        # Group by provider (prefer provider_location_id, fallback to provider_id)
        provider_pricing = defaultdict(lambda: {'procedures': [], 'prices': []})
        for p in pricing_result.data:
            # Prefer provider_location_id (new schema)
            provider_key = p.get('provider_location_id') or p.get('provider_id')
            if provider_key:
                provider_pricing[provider_key]['procedures'].append(p.get('procedure_id'))
                price = p.get('price')
                if price:
                    try:
                        provider_pricing[provider_key]['prices'].append(float(price))
                    except:
                        pass
        
        # Get provider details - map by composite id (provider_location.id)
        provider_map_by_id = {p.get('id'): p for p in providers if p.get('id')}
        
        # Also map by numeric provider_id for legacy compatibility
        provider_map = {p.get('provider_id'): p for p in providers if p.get('provider_id')}
        
        # Sort by number of procedures
        top_providers = []
        for provider_key, data in provider_pricing.items():
            proc_count = len(data['procedures'])
            prices = data['prices']
            
            # Try provider_location.id first (new schema)
            provider = provider_map_by_id.get(provider_key)
            if not provider:
                # Fallback to numeric provider_id (legacy)
                provider = provider_map.get(provider_key)
            
            if provider:
                provider_name = provider.get('name') or provider.get('provider_name') or 'Unknown'
                top_providers.append({
                    'id': provider_key,
                    'name': provider_name,
                    'city': provider.get('city', 'N/A'),
                    'state': provider.get('state', 'N/A'),
                    'procedures': proc_count,
                    'min_price': min(prices) if prices else None,
                    'max_price': max(prices) if prices else None
                })
            else:
                # Orphan record
                top_providers.append({
                    'id': provider_key,
                    'name': 'Unknown (orphan)',
                    'city': 'N/A',
                    'state': 'N/A',
                    'procedures': proc_count,
                    'min_price': min(prices) if prices else None,
                    'max_price': max(prices) if prices else None
                })
        
        top_providers.sort(key=lambda x: x['procedures'], reverse=True)
        
        print("Top 20 providers by pricing volume:")
        for p in top_providers[:20]:
            price_range = f"${p['min_price']:.2f}-${p['max_price']:.2f}" if p['min_price'] and p['max_price'] else "N/A"
            print(f"  {p['name']} ({p['city']}, {p['state']}) - {p['procedures']} procedures, {price_range}")
    except Exception as e:
        print(f"ERROR: {e}")
    print()
    
    # Step 6: Detect orphan pricing records
    print("=== Detecting Orphan Pricing Records ===")
    # Initialize variables for report generation
    orphan_count_location_id = 0
    orphan_count_numeric = 0
    
    try:
        if not provider_ids:
            provider_ids = {p.get('id') for p in providers if p.get('id')}
        if not provider_numeric_ids:
            provider_numeric_ids = {p.get('provider_id') for p in providers if p.get('provider_id')}
        pricing_result = supabase.table("procedure_pricing").select("provider_location_id,provider_id").execute()
        
        # Check using provider_location_id (new schema)
        for p in pricing_result.data:
            provider_location_id = p.get('provider_location_id')
            if provider_location_id and provider_location_id not in provider_ids:
                orphan_count_location_id += 1
        
        # Check using numeric provider_id (legacy)
        for p in pricing_result.data:
            provider_id = p.get('provider_id')
            if provider_id and provider_id not in provider_numeric_ids:
                orphan_count_numeric += 1
        
        print(f"Using provider_location_id (pp.provider_location_id NOT IN pl.id) [NEW SCHEMA]:")
        print(f"  Orphan pricing records: {orphan_count_location_id}")
        if orphan_count_location_id > 0:
            print(f"  ⚠️  Warning: {orphan_count_location_id} pricing records reference providers that don't exist")
        print()
        print(f"Using numeric 'provider_id' field (pp.provider_id NOT IN pl.provider_id) [LEGACY]:")
        print(f"  Orphan pricing records: {orphan_count_numeric}")
        if orphan_count_numeric > 0:
            print(f"  ⚠️  Warning: {orphan_count_numeric} pricing records reference providers that don't exist")
    except Exception as e:
        print(f"ERROR: {e}")
    print()
    
    # Step 7: Generate diagnostic summary
    print("=== Generating Diagnostic Summary ===")
    diagnostics_dir = backend_dir / "diagnostics"
    diagnostics_dir.mkdir(exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    output_file = diagnostics_dir / f"provider_data_report_{timestamp}.md"
    
    with open(output_file, 'w') as f:
        f.write(f"# Mario Health Provider Data Diagnostics — {timestamp}\n\n")
        
        f.write("## Summary\n\n")
        f.write(f"- Total providers: {total_providers}\n\n")
        
        f.write("## Missing Field Breakdown\n\n")
        f.write(f"- Missing name: {missing_name}\n")
        f.write(f"- Missing coordinates: {missing_coordinates}\n\n")
        
        f.write("## State Coverage (Top 10)\n\n")
        f.write("| State | Providers |\n")
        f.write("|-------|-----------|\n")
        for state, count in sorted(state_counts.items(), key=lambda x: x[1], reverse=True)[:10]:
            f.write(f"| {state} | {count} |\n")
        f.write("\n")
        
        f.write("## Providers Linked to Pricing\n\n")
        f.write("### Using provider_location_id (pp.provider_location_id = pl.id) [NEW SCHEMA - CORRECT]\n")
        f.write(f"- Providers with pricing: {providers_with_pricing_location_id}\n")
        f.write(f"- Total providers: {len(provider_ids)}\n")
        f.write(f"- Coverage: {coverage_percent_location_id}%\n\n")
        f.write("### Using Numeric 'provider_id' Field (pp.provider_id = pl.provider_id) [LEGACY]\n")
        f.write(f"- Providers with pricing: {providers_with_pricing_numeric}\n")
        f.write(f"- Total providers: {len(provider_numeric_ids)}\n")
        f.write(f"- Coverage: {coverage_percent_numeric}%\n\n")
        
        total_orphans = max(orphan_count_location_id, orphan_count_numeric)
        if total_orphans > 0:
            f.write("## ⚠️ Data Quality Issues\n\n")
            f.write(f"- **Orphan pricing records (provider_location_id)**: {orphan_count_location_id} pricing rows reference providers that don't exist\n")
            f.write(f"- **Orphan pricing records (provider_id)**: {orphan_count_numeric} pricing rows reference providers that don't exist\n")
            f.write("- **Recommendation**: Clean up orphan records or add missing provider records\n\n")
        
        f.write("## Recommendations\n\n")
        f.write("1. **Use correct join field**: Join should use `pp.provider_location_id = pl.id` (new schema), not `pp.provider_id = pl.provider_id` (legacy)\n")
        f.write(f"2. **Fix orphan records**: Address {total_orphans} pricing records that reference non-existent providers\n")
        f.write(f"3. **Increase pricing coverage**: Only {coverage_percent_location_id}% of providers have pricing data (using new schema)\n")
        f.write("4. **Verify data seeding**: Ensure new pricing data uses valid provider_location_id values\n")
    
    print(f"✅ Provider data diagnostics complete — report saved to {output_file}\n")
    print("Verification complete!")

if __name__ == "__main__":
    main()

