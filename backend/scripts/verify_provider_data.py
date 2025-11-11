#!/usr/bin/env python3
"""
Mario Health — Provider Data Verification & Diagnostics
Context: Pricing data is being seeded. We now need to verify provider_location structure, 
coverage, and linkages to procedure_pricing.
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
    
    # Step 1: Verify provider_location schema (we'll check by querying)
    print("=== Step 1. Verify provider_location Schema ===")
    try:
        # Get a sample record to see columns
        sample = supabase.table("provider_location").select("*").limit(1).execute()
        if sample.data:
            print("Provider_location table columns:")
            for col in sample.data[0].keys():
                print(f"  - {col}")
        else:
            print("  No data in provider_location table")
    except Exception as e:
        print(f"ERROR: {e}")
    print()
    
    # Step 2: Count providers and check basic completeness
    print("=== Step 2. Count Providers and Check Basic Completeness ===")
    try:
        providers_result = supabase.table("provider_location").select("*").execute()
        providers = providers_result.data
        
        total_providers = len(providers)
        # Check both 'name' and 'provider_name' fields
        missing_name = sum(1 for p in providers if not p.get('name') and not p.get('provider_name'))
        missing_location = sum(1 for p in providers if not p.get('city') or not p.get('state'))
        missing_coordinates = sum(1 for p in providers if not p.get('latitude') or not p.get('longitude'))
        
        print(f"Total providers: {total_providers}")
        print(f"Missing name: {missing_name}")
        print(f"Missing location (city/state): {missing_location}")
        print(f"Missing coordinates (lat/lng): {missing_coordinates}")
    except Exception as e:
        print(f"ERROR: {e}")
    print()
    
    # Step 3: Check geographic coverage by state
    print("=== Step 3. Geographic Coverage by State ===")
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
    
    # Step 4: Check how many providers are linked to pricing
    print("=== Step 4. Providers Linked to Pricing ===")
    try:
        # Get all provider numeric IDs (not the composite id field)
        provider_numeric_ids = {p.get('provider_id') for p in providers if p.get('provider_id')}
        
        # Get pricing data
        pricing_result = supabase.table("procedure_pricing").select("provider_id").execute()
        pricing_provider_ids = {p.get('provider_id') for p in pricing_result.data if p.get('provider_id')}
        
        providers_with_pricing = len(provider_numeric_ids & pricing_provider_ids)
        total_providers = len(provider_numeric_ids)
        coverage_percent = round(100.0 * providers_with_pricing / total_providers, 1) if total_providers > 0 else 0
        
        print(f"Providers with pricing: {providers_with_pricing}")
        print(f"Total providers: {total_providers}")
        print(f"Coverage: {coverage_percent}%")
    except Exception as e:
        print(f"ERROR: {e}")
    print()
    
    # Step 5: Spot-check providers with active pricing
    print("=== Step 5. Providers with Active Pricing (Top 20) ===")
    try:
        # Get pricing data with prices
        pricing_result = supabase.table("procedure_pricing").select("provider_id,procedure_id,price").execute()
        
        # Group by provider
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
        
        # Get provider details - map by numeric provider_id (not composite id)
        provider_map = {p.get('provider_id'): p for p in providers if p.get('provider_id')}
        
        # Sort by number of procedures
        top_providers = []
        for provider_id, data in provider_pricing.items():
            proc_count = len(data['procedures'])
            prices = data['prices']
            provider = provider_map.get(provider_id, {})
            # Use provider_name if name is not available
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
        
        top_providers.sort(key=lambda x: x['procedures'], reverse=True)
        
        print("Top 20 providers by pricing volume:")
        for p in top_providers[:20]:
            price_range = f"${p['min_price']:.2f}-${p['max_price']:.2f}" if p['min_price'] and p['max_price'] else "N/A"
            print(f"  {p['name']} ({p['city']}, {p['state']}) - {p['procedures']} procedures, {price_range}")
    except Exception as e:
        print(f"ERROR: {e}")
    print()
    
    # Step 6: Detect orphan records (pricing rows without matching providers)
    print("=== Step 6. Orphan Records Detection ===")
    try:
        # Use numeric provider_id for matching
        provider_numeric_ids = {p.get('provider_id') for p in providers if p.get('provider_id')}
        pricing_result = supabase.table("procedure_pricing").select("provider_id").execute()
        
        orphan_count = 0
        for p in pricing_result.data:
            provider_id = p.get('provider_id')
            if provider_id and provider_id not in provider_numeric_ids:
                orphan_count += 1
        
        print(f"Orphan pricing rows (pricing without matching provider): {orphan_count}")
        if orphan_count > 0:
            print("  ⚠️  Warning: Some pricing records reference providers that don't exist in provider_location")
    except Exception as e:
        print(f"ERROR: {e}")
    print()
    
    # Step 7: Create diagnostic summary
    print("=== Step 7. Generate Diagnostic Summary ===")
    diagnostics_dir = backend_dir / "diagnostics"
    diagnostics_dir.mkdir(exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    output_file = diagnostics_dir / f"provider_data_report_{timestamp}.md"
    
    with open(output_file, 'w') as f:
        f.write(f"# Mario Health Provider Data Diagnostics — {timestamp}\n\n")
        
        f.write("## Provider Summary\n\n")
        f.write(f"- Total providers: {total_providers}\n")
        f.write(f"- Missing name: {missing_name}\n")
        f.write(f"- Missing location (city/state): {missing_location}\n")
        f.write(f"- Missing coordinates (lat/lng): {missing_coordinates}\n\n")
        
        f.write("## State Coverage (Top 10)\n\n")
        f.write("| State | Providers |\n")
        f.write("|-------|-----------|\n")
        for state, count in sorted(state_counts.items(), key=lambda x: x[1], reverse=True)[:10]:
            f.write(f"| {state} | {count} |\n")
        f.write("\n")
        
        f.write("## Providers Linked to Pricing\n\n")
        f.write(f"- Providers with pricing: {providers_with_pricing}\n")
        f.write(f"- Total providers: {total_providers}\n")
        f.write(f"- Coverage: {coverage_percent}%\n\n")
        
        f.write("## Top Providers by Pricing Volume\n\n")
        f.write("| Name | City | State | Procedures | Price Range |\n")
        f.write("|------|------|-------|------------|-------------|\n")
        for p in top_providers[:15]:
            price_range = f"${p['min_price']:.2f}-${p['max_price']:.2f}" if p['min_price'] and p['max_price'] else "N/A"
            f.write(f"| {p['name']} | {p['city']} | {p['state']} | {p['procedures']} | {price_range} |\n")
        f.write("\n")
        
        if orphan_count > 0:
            f.write("## ⚠️ Data Quality Issues\n\n")
            f.write(f"- **Orphan pricing records**: {orphan_count} pricing rows reference providers that don't exist in provider_location\n")
            f.write("- **Recommendation**: Clean up orphan records or add missing provider records\n\n")
        
        f.write("## Recommendations\n\n")
        f.write("1. **Verify provider_location completeness**: Ensure all providers have name, city, state, and coordinates\n")
        f.write("2. **Link pricing to providers**: Increase coverage of providers with pricing data\n")
        f.write("3. **Clean orphan records**: Remove or fix pricing records that reference non-existent providers\n")
        f.write("4. **Geographic coverage**: Consider adding providers in states with low coverage\n")
    
    print(f"✅ Provider data diagnostics complete. Report saved to {output_file}\n")
    print("Verification complete!")

if __name__ == "__main__":
    main()

