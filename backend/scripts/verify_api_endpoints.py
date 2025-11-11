#!/usr/bin/env python3
"""
Mario Health — API Endpoint Verification (Procedures & Providers)
Tests all key API endpoints for procedures and providers.
"""

import requests
import json
import sys
from datetime import datetime
from pathlib import Path

API_URL = "http://localhost:8000/api/v1"
TIMEOUT = 10

def test_endpoint(name, url, method="GET", data=None, expected_status=200):
    """Test an API endpoint and return results."""
    try:
        if method == "GET":
            response = requests.get(url, timeout=TIMEOUT)
        elif method == "POST":
            response = requests.post(url, json=data, timeout=TIMEOUT)
        else:
            return {"error": f"Unsupported method: {method}"}
        
        result = {
            "name": name,
            "url": url,
            "status_code": response.status_code,
            "success": response.status_code == expected_status,
            "response_time_ms": response.elapsed.total_seconds() * 1000
        }
        
        try:
            result["data"] = response.json()
        except:
            result["data"] = response.text[:200] if response.text else None
        
        return result
    except requests.exceptions.ConnectionError:
        return {
            "name": name,
            "url": url,
            "error": "Connection refused - backend may not be running",
            "success": False,
            "status_code": "CONN_ERR"
        }
    except requests.exceptions.Timeout:
        return {
            "name": name,
            "url": url,
            "error": "Request timeout - backend may not be running",
            "success": False,
            "status_code": "TIMEOUT"
        }
    except Exception as e:
        return {
            "name": name,
            "url": url,
            "error": str(e),
            "success": False
        }

def main():
    print("=== Mario Health — API Endpoint Verification (Procedures & Providers) ===\n")
    
    results = []
    
    # Test 1: Procedure Search
    print("=== Testing Procedure Search ===")
    result = test_endpoint(
        "Procedure Search (q=mri)",
        f"{API_URL}/procedures?q=mri"
    )
    results.append(result)
    
    if result.get("success") and result.get("data"):
        data = result["data"]
        # Handle different response formats
        procedures = data.get("procedures") or data.get("results", [])
        if procedures:
            print(f"✓ Found {len(procedures)} procedures")
            print("First 3 procedures:")
            for proc in procedures[:3]:
                print(f"  - {proc.get('name', 'N/A')} (slug: {proc.get('slug', 'N/A')})")
        else:
            print("⚠️  No procedures found in response")
            print(f"Response keys: {list(data.keys())}")
    elif result.get("error"):
        print(f"✗ {result['error']}")
    else:
        print(f"✗ Request failed: {result.get('status_code', 'unknown')}")
    print()
    
    # Test 2: Procedure Detail
    print("=== Testing Procedure Detail ===")
    result = test_endpoint(
        "Procedure Detail (brain-mri)",
        f"{API_URL}/procedures/brain-mri"
    )
    results.append(result)
    
    if result.get("success") and result.get("data"):
        data = result["data"]
        print(f"✓ Procedure found: {data.get('name', 'N/A')}")
        print(f"  Slug: {data.get('slug', 'N/A')}")
        print(f"  Family: {data.get('family_name', 'N/A')}")
        print(f"  ID: {data.get('id', 'N/A')}")
    elif result.get("error"):
        print(f"✗ {result['error']}")
    else:
        print(f"✗ Request failed: {result.get('status_code', 'unknown')}")
        if result.get("data"):
            print(f"  Response: {result['data']}")
    print()
    
    # Test 3: Providers for MRI
    print("=== Testing Providers for MRI ===")
    result = test_endpoint(
        "Procedure Providers (brain-mri)",
        f"{API_URL}/procedures/brain-mri/providers"
    )
    results.append(result)
    
    if result.get("success") and result.get("data"):
        data = result["data"]
        providers = data.get("providers", [])
        print(f"✓ Found {len(providers)} providers for brain-mri")
        if providers:
            print("Sample providers:")
            for provider in providers[:2]:
                name = provider.get("provider_name") or provider.get("name", "Unknown")
                price = provider.get("price_estimate") or provider.get("price", "N/A")
                print(f"  - {name}: ${price}")
        else:
            print("⚠️  No providers found (this matches our earlier finding that MRI has no pricing data)")
    elif result.get("error"):
        print(f"✗ {result['error']}")
    else:
        print(f"✗ Request failed: {result.get('status_code', 'unknown')}")
        if result.get("data"):
            print(f"  Response: {result['data']}")
    print()
    
    # Test 4: Provider List
    print("=== Testing Provider List Endpoint ===")
    result = test_endpoint(
        "Provider List",
        f"{API_URL}/providers"
    )
    results.append(result)
    
    if result.get("success") and result.get("data"):
        data = result["data"]
        providers = data.get("providers", [])
        if providers:
            print(f"✓ Found {len(providers)} providers")
            print("First 3 providers:")
            for provider in providers[:3]:
                name = provider.get("provider_name") or provider.get("name", "Unknown")
                city = provider.get("city", "N/A")
                state = provider.get("state", "N/A")
                print(f"  - {name} ({city}, {state})")
        else:
            print("⚠️  No providers in response")
            print(f"Response keys: {list(data.keys())}")
    elif result.get("error"):
        print(f"✗ {result['error']}")
    else:
        print(f"✗ Request failed: {result.get('status_code', 'unknown')}")
    print()
    
    # Test 5: Additional procedure tests
    print("=== Testing Additional Procedures ===")
    test_slugs = ["ct-head", "xray-chest", "ultrasound-abdomen", "lab-cbc"]
    
    for slug in test_slugs:
        result = test_endpoint(
            f"Procedure Detail ({slug})",
            f"{API_URL}/procedures/{slug}"
        )
        results.append(result)
        
        if result.get("success"):
            data = result.get("data", {})
            name = data.get("name", "N/A")
            print(f"  ✓ {slug}: {name}")
        else:
            status = result.get("status_code", "error")
            print(f"  ✗ {slug}: {status}")
    print()
    
    # Generate summary report
    print("=== Generating Summary Report ===")
    diagnostics_dir = Path(__file__).parent.parent / "diagnostics"
    diagnostics_dir.mkdir(exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    output_file = diagnostics_dir / f"api_endpoint_verification_{timestamp}.md"
    
    successful = sum(1 for r in results if r.get("success"))
    total = len(results)
    
    with open(output_file, 'w') as f:
        f.write(f"# API Endpoint Verification Report — {timestamp}\n\n")
        f.write(f"**API Base URL:** {API_URL}\n\n")
        f.write(f"**Summary:** {successful}/{total} endpoints successful\n\n")
        
        f.write("## Test Results\n\n")
        f.write("| Endpoint | Status | Response Time (ms) | Notes |\n")
        f.write("|----------|--------|---------------------|-------|\n")
        
        for result in results:
            name = result.get("name", "Unknown")
            status = "✓ Success" if result.get("success") else f"✗ {result.get('status_code', result.get('error', 'Failed'))}"
            response_time = f"{result.get('response_time_ms', 0):.2f}" if result.get("response_time_ms") else "N/A"
            notes = ""
            
            if result.get("error"):
                notes = result["error"]
            elif result.get("success") and result.get("data"):
                data = result["data"]
                if "providers" in str(data):
                    provider_count = len(data.get("providers", []))
                    notes = f"{provider_count} providers"
                elif "procedures" in str(data) or "results" in str(data):
                    proc_count = len(data.get("procedures") or data.get("results", []))
                    notes = f"{proc_count} procedures"
            
            f.write(f"| {name} | {status} | {response_time} | {notes} |\n")
        
        f.write("\n## Detailed Findings\n\n")
        
        # MRI providers finding
        mri_result = next((r for r in results if "brain-mri" in r.get("name", "") and "providers" in r.get("name", "")), None)
        if mri_result and mri_result.get("success"):
            data = mri_result.get("data", {})
            providers = data.get("providers", [])
            f.write(f"### MRI Providers\n\n")
            f.write(f"- **Endpoint**: `/procedures/brain-mri/providers`\n")
            f.write(f"- **Provider Count**: {len(providers)}\n")
            if len(providers) == 0:
                f.write("- **Status**: ⚠️ No providers found (matches database verification - MRI has no pricing data)\n")
            f.write("\n")
        
        f.write("## Recommendations\n\n")
        if successful < total:
            f.write("1. **Backend Status**: Ensure backend is running on `http://localhost:8000`\n")
            f.write("2. **Start Backend**: Run `cd backend/mario-health-api && python3 -m uvicorn app.main:app --reload`\n")
        f.write("3. **MRI Pricing**: Seed pricing data for MRI procedures (as identified in previous diagnostics)\n")
        f.write("4. **Provider Linkage**: Fix orphan pricing records (985 records need provider_location entries)\n")
    
    print(f"✅ API endpoint verification complete — report saved to {output_file}\n")
    
    # Final summary
    print("=== Summary ===")
    print(f"Successful: {successful}/{total}")
    print(f"Failed: {total - successful}/{total}")
    
    if successful == 0:
        print("\n⚠️  All tests failed - backend may not be running")
        print("   Start backend with: cd backend/mario-health-api && python3 -m uvicorn app.main:app --reload")

if __name__ == "__main__":
    main()

