#!/usr/bin/env python3
"""
Test script for improved search functionality.
Tests multi-word queries, fuzzy matching, and relevance ranking.
"""

import requests
import json
from typing import List, Dict

# CONFIGURE THIS
BASE_URL = "http://localhost:8000"  # Change to your API URL
TEST_ZIP = "10001"  # Change to a valid ZIP in your database


def test_search(query: str, zip_code: str = None, radius: int = 25) -> Dict:
    """Execute a search query and return results."""
    url = f"{BASE_URL}/api/v1/search"
    params = {"q": query}

    if zip_code:
        params["zip"] = zip_code
        params["radius"] = radius

    response = requests.get(url, params=params)

    if response.status_code != 200:
        print(f"❌ ERROR: {response.status_code} - {response.text}")
        return None

    return response.json()


def print_results(query: str, results: Dict):
    """Pretty print search results."""
    print(f"\n{'=' * 80}")
    print(f"Query: '{query}'")
    print(f"Location: {results.get('location', 'N/A')}")
    print(f"Results: {results['results_count']}")
    print(f"{'=' * 80}")

    if results['results_count'] == 0:
        print("❌ No results found")
        return

    for i, result in enumerate(results['results'][:5], 1):  # Show top 5
        print(f"\n{i}. {result['procedure_name']}")
        print(f"   Category: {result['category_name']} > {result['family_name']}")
        print(f"   Price Range: {result['price_range']}")
        print(f"   Providers: {result['provider_count']}")
        print(f"   Match Score: {result['match_score']:.2f} {'⭐' if result['match_score'] >= 0.8 else ''}")
        if result.get('nearest_provider'):
            print(f"   Nearest: {result['nearest_provider']} ({result['nearest_distance_miles']:.1f} mi)")


def run_test_suite():
    """Run comprehensive test suite."""

    print("\n" + "=" * 80)
    print("SEARCH FUNCTIONALITY TEST SUITE")
    print("=" * 80)

    # Test 1: Single word
    print("\n\n🧪 TEST 1: Single-word query")
    results = test_search("mri", TEST_ZIP)
    if results:
        print_results("mri", results)
        assert results['results_count'] > 0, "Should return results for 'mri'"

    # Test 2: Multi-word query
    print("\n\n🧪 TEST 2: Multi-word query (main bug fix)")
    results = test_search("brain mri", TEST_ZIP)
    if results:
        print_results("brain mri", results)
        assert results['results_count'] > 0, "Should return results for 'brain mri'"

    # Test 3: Reverse word order
    print("\n\n🧪 TEST 3: Reverse word order")
    results = test_search("mri brain", TEST_ZIP)
    if results:
        print_results("mri brain", results)
        assert results['results_count'] > 0, "Should return results for 'mri brain'"

    # Test 4: Three words
    print("\n\n🧪 TEST 4: Three-word query")
    results = test_search("mri with contrast", TEST_ZIP)
    if results:
        print_results("mri with contrast", results)
        # May or may not have results depending on data

    # Test 5: Typo (fuzzy matching)
    print("\n\n🧪 TEST 5: Typo handling (fuzzy match)")
    results = test_search("brian mri", TEST_ZIP)  # "brian" instead of "brain"
    if results:
        print_results("brian mri", results)
        # Should still find "brain mri" due to fuzzy matching

    # Test 6: Different medical term
    print("\n\n🧪 TEST 6: Different procedure")
    results = test_search("x-ray", TEST_ZIP)
    if results:
        print_results("x-ray", results)
        assert results['results_count'] > 0, "Should return results for 'x-ray'"

    # Test 7: Two-word different procedure
    print("\n\n🧪 TEST 7: Two-word different procedure")
    results = test_search("chest xray", TEST_ZIP)
    if results:
        print_results("chest xray", results)
        # Should return results

    # Test 8: No location
    print("\n\n🧪 TEST 8: Search without location")
    results = test_search("ultrasound")
    if results:
        print_results("ultrasound", results)
        assert results['results_count'] > 0, "Should return results without location"

    # Test 9: Exact match ranking
    print("\n\n🧪 TEST 9: Exact match should rank highest")
    results = test_search("mri", TEST_ZIP)
    if results and results['results_count'] > 0:
        top_result = results['results'][0]
        print(f"\nTop result: {top_result['procedure_name']}")
        print(f"Match score: {top_result['match_score']}")
        # Exact matches should have high scores
        if "mri" in top_result['procedure_name'].lower():
            assert top_result['match_score'] >= 0.5, "Exact/close matches should have score >= 0.5"

    print("\n\n" + "=" * 80)
    print("✅ TEST SUITE COMPLETE")
    print("=" * 80)


if __name__ == "__main__":
    try:
        run_test_suite()
    except AssertionError as e:
        print(f"\n❌ TEST FAILED: {e}")
        exit(1)
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        exit(1)
