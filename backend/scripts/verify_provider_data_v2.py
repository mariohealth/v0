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
    try:
        # Get all provider IDs (both composite id and numeric provider_id)
        provider_ids = {p.get('id') for p in providers if p.get('id')}
        provider_numeric_ids = {p.get('provider_id') for p in providers if p.get('provider_id')}
        
        # Get pricing data
        pricing_result = supabase.table("procedure_pricing").select("provider_id").execute()
        pricing_provider_ids = {p.get('provider_id') for p in pricing_result.data if p.get('provider_id')}
        
        # Check both join methods (id and provider_id)
        # Method 1: Using composite id (as in original query - likely incorrect)
        providers_with_pricing_id = len(provider_ids & pricing_provider_ids)
        
        # Method 2: Using numeric provider_id (correct method)
        providers_with_pricing_numeric = len(provider_numeric_ids & pricing_provider_ids)
        
        total_providers = len(provider_ids)
        coverage_percent_id = round(100.0 * providers_with_pricing_id / total_providers, 1) if total_providers > 0 else 0
        coverage_percent_numeric = round(100.0 * providers_with_pricing_numeric / len(provider_numeric_ids), 1) if provider_numeric_ids else 0
        
        print(f"Using composite 'id' field (pp.provider_id = pl.id):")
        print(f"  Providers with pricing: {providers_with_pricing_id}")
        print(f"  Total providers: {total_providers}")
        print(f"  Coverage: {coverage_percent_id}%")
        print()
        print(f"Using numeric 'provider_id' field (pp.provider_id = pl.provider_id) [CORRECT]:")
        print(f"  Providers with pricing: {providers_with_pricing_numeric}")
        print(f"  Total providers: {len(provider_numeric_ids)}")
        print(f"  Coverage: {coverage_percent_numeric}%")
    except Exception as e:
        print(f"ERROR: {e}")
    print()
    
    # Step 5: Top providers by number of priced procedures
    print("=== Top Providers by Number of Priced Procedures ===")
    try:
        # Get pricing data with prices
        pricing_result = supabase.table("procedure_pricing").select("provider_id,procedure_id,price").execute()
        
        # Group by provider (using numeric provider_id)
        provider_pricing = defaultdict(lambda: {'procedures': [], 'prices': []})
        for p in pricing_result.data:
            provider_id = p.get('provider_id')
            if provider_id:
                provider_pricing[provider_id]['procedures'].append(p.get('procedure_id'))
                price = p.get('price')
                if price:
                    try:
                        provider_pricing[provider_id]['prices'].append(float(price))
                    except:
                        pass
        
        # Get provider details - map by numeric provider_id
        provider_map = {p.get('provider_id'): p for p in providers if p.get('provider_id')}
        
        # Also map by composite id for comparison
        provider_map_by_id = {p.get('id'): p for p in providers if p.get('id')}
        
        # Sort by number of procedures
        top_providers = []
        for provider_id, data in provider_pricing.items():
            proc_count = len(data['procedures'])
            prices = data['prices']
            
            # Try numeric provider_id first (correct)
            provider = provider_map.get(provider_id)
            if not provider:
                # Fallback to composite id (if pricing uses composite id)
                provider = provider_map_by_id.get(provider_id)
            
            if provider:
                provider_name = provider.get('name') or provider.get('provider_name') or 'Unknown'
                top_providers.append({
                    'id': provider_id,
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
                    'id': provider_id,
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
    try:
        # Check using composite id (as in original query)
        provider_ids = {p.get('id') for p in providers if p.get('id')}
        pricing_result = supabase.table("procedure_pricing").select("provider_id").execute()
        
        orphan_count_id = 0
        for p in pricing_result.data:
            provider_id = p.get('provider_id')
            if provider_id and provider_id not in provider_ids:
                orphan_count_id += 1
        
        # Check using numeric provider_id (correct method)
        provider_numeric_ids = {p.get('provider_id') for p in providers if p.get('provider_id')}
        orphan_count_numeric = 0
        for p in pricing_result.data:
            provider_id = p.get('provider_id')
            if provider_id and provider_id not in provider_numeric_ids:
                orphan_count_numeric += 1
        
        print(f"Using composite 'id' field (pp.provider_id NOT IN pl.id):")
        print(f"  Orphan pricing records: {orphan_count_id}")
        print()
        print(f"Using numeric 'provider_id' field (pp.provider_id NOT IN pl.provider_id) [CORRECT]:")
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
        f.write("### Using Composite 'id' Field (pp.provider_id = pl.id)\n")
        f.write(f"- Providers with pricing: {providers_with_pricing_id}\n")
        f.write(f"- Total providers: {total_providers}\n")
        f.write(f"- Coverage: {coverage_percent_id}%\n\n")
        f.write("### Using Numeric 'provider_id' Field (pp.provider_id = pl.provider_id) [CORRECT]\n")
        f.write(f"- Providers with pricing: {providers_with_pricing_numeric}\n")
        f.write(f"- Total providers: {len(provider_numeric_ids)}\n")
        f.write(f"- Coverage: {coverage_percent_numeric}%\n\n")
        
        if orphan_count_numeric > 0:
            f.write("## ⚠️ Data Quality Issues\n\n")
            f.write(f"- **Orphan pricing records**: {orphan_count_numeric} pricing rows reference providers that don't exist in provider_location\n")
            f.write("- **Recommendation**: Clean up orphan records or add missing provider records\n\n")
        
        f.write("## Recommendations\n\n")
        f.write("1. **Use correct join field**: Join should use `pp.provider_id = pl.provider_id` (numeric), not `pp.provider_id = pl.id` (composite)\n")
        f.write(f"2. **Fix orphan records**: Address {orphan_count_numeric} pricing records that reference non-existent providers\n")
        f.write(f"3. **Increase pricing coverage**: Only {coverage_percent_numeric}% of providers have pricing data\n")
        f.write("4. **Verify data seeding**: Ensure new pricing data uses valid provider_id values\n")
    
    print(f"✅ Provider data diagnostics complete — report saved to {output_file}\n")
    print("Verification complete!")

if __name__ == "__main__":
    main()

