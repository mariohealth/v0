#!/usr/bin/env python3
"""
Comprehensive End-to-End CORS and Authentication Test Suite for Mario Health
Tests FastAPI backend and Next.js frontend integration
"""

import requests
import json
import base64
import sys
from typing import Dict, List, Tuple, Optional
from urllib.parse import urlparse

# Configuration
BACKEND_URL = "http://127.0.0.1:8000"
FRONTEND_URL = "http://localhost:3000"
TEST_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://mario-health-frontend.vercel.app",
]

# Test results
results = {
    "passed": 0,
    "failed": 0,
    "warnings": 0,
    "details": []
}


def log_test(name: str):
    """Print test header"""
    print(f"\n{'='*70}")
    print(f"TEST: {name}")
    print(f"{'='*70}")


def log_result(passed: bool, message: str, details: Optional[Dict] = None):
    """Log test result"""
    status = "✓ PASSED" if passed else "✗ FAILED"
    print(f"{status}: {message}")
    if details:
        for key, value in details.items():
            print(f"  {key}: {value}")
    
    results["details"].append({
        "passed": passed,
        "message": message,
        "details": details or {}
    })
    
    if passed:
        results["passed"] += 1
    else:
        results["failed"] += 1


def log_warning(message: str, details: Optional[Dict] = None):
    """Log warning"""
    print(f"⚠ WARNING: {message}")
    if details:
        for key, value in details.items():
            print(f"  {key}: {value}")
    results["warnings"] += 1
    results["details"].append({
        "passed": None,
        "message": message,
        "details": details or {},
        "warning": True
    })


def decode_jwt(token: str) -> Optional[Dict]:
    """Decode JWT token (without verification)"""
    try:
        parts = token.split('.')
        if len(parts) < 2:
            return None
        
        payload = parts[1]
        # Add padding if needed
        padding = 4 - len(payload) % 4
        if padding != 4:
            payload += '=' * padding
        
        decoded = base64.urlsafe_b64decode(payload)
        return json.loads(decoded)
    except Exception as e:
        return {"error": str(e)}


def check_backend_health() -> bool:
    """Test 1: Check if backend is running"""
    log_test("1. Backend Health Check")
    
    try:
        response = requests.get(f"{BACKEND_URL}/health", timeout=5)
        if response.status_code == 200:
            log_result(True, "Backend is running", {
                "status": response.status_code,
                "response": response.json()
            })
            return True
        else:
            log_result(False, f"Backend returned status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        log_result(False, "Backend is not accessible", {
            "url": BACKEND_URL,
            "suggestion": "Start backend with: cd backend/mario-health-api && uvicorn app.main:app --reload"
        })
        return False
    except Exception as e:
        log_result(False, f"Error checking backend: {str(e)}")
        return False


def get_frontend_token() -> Optional[str]:
    """Test 2: Get token from frontend"""
    log_test("2. Frontend Token Endpoint Check")
    
    try:
        response = requests.get(f"{FRONTEND_URL}/api/auth/token", timeout=5)
        if response.status_code == 200:
            data = response.json()
            token = data.get("token")
            
            if token:
                log_result(True, "Token retrieved successfully", {
                    "token_preview": f"{token[:50]}...",
                    "token_length": len(token)
                })
                
                # Decode token claims
                claims = decode_jwt(token)
                if claims and "error" not in claims:
                    print("\n  Token Claims (decoded):")
                    print(f"    iss: {claims.get('iss', 'N/A')}")
                    print(f"    aud: {claims.get('aud', 'N/A')}")
                    print(f"    exp: {claims.get('exp', 'N/A')}")
                    print(f"    email: {claims.get('email', 'N/A')}")
                
                return token
            else:
                log_warning("Token endpoint returned 200 but no token in response", {
                    "response": data
                })
                return None
        else:
            log_warning(f"Token endpoint returned status {response.status_code}", {
                "url": f"{FRONTEND_URL}/api/auth/token"
            })
            return None
    except requests.exceptions.ConnectionError:
        log_warning("Frontend token endpoint not accessible", {
            "url": f"{FRONTEND_URL}/api/auth/token",
            "note": "This is okay if frontend auth is not configured yet"
        })
        return None
    except Exception as e:
        log_warning(f"Error getting token: {str(e)}")
        return None


def test_cors_preflight(origin: str) -> bool:
    """Test CORS preflight OPTIONS request"""
    try:
        response = requests.options(
            f"{BACKEND_URL}/api/v1/categories",
            headers={
                "Origin": origin,
                "Access-Control-Request-Method": "GET",
                "Access-Control-Request-Headers": "authorization,content-type",
            },
            timeout=5
        )
        
        acao = response.headers.get("Access-Control-Allow-Origin", "")
        acam = response.headers.get("Access-Control-Allow-Methods", "")
        acah = response.headers.get("Access-Control-Allow-Headers", "")
        
        if response.status_code in [200, 204]:
            if acao == origin or acao == "*":
                log_result(True, f"CORS preflight accepted for {origin}", {
                    "status": response.status_code,
                    "Access-Control-Allow-Origin": acao,
                    "Access-Control-Allow-Methods": acam,
                    "Access-Control-Allow-Headers": acah,
                })
                return True
            else:
                log_result(False, f"CORS preflight: Expected '{origin}', got '{acao}'", {
                    "status": response.status_code,
                    "expected_origin": origin,
                    "actual_acao": acao,
                })
                return False
        else:
            log_result(False, f"CORS preflight failed: Status {response.status_code}", {
                "origin": origin,
                "status": response.status_code,
            })
            return False
    except Exception as e:
        log_result(False, f"CORS preflight error: {str(e)}", {
            "origin": origin,
        })
        return False


def test_cors_preflight_all() -> None:
    """Test 3: CORS Preflight (OPTIONS) Requests"""
    log_test("3. CORS Preflight (OPTIONS) Requests")
    
    for origin in TEST_ORIGINS:
        test_cors_preflight(origin)


def test_public_endpoint(endpoint: str, require_cors: bool = True) -> bool:
    """Test a public endpoint"""
    try:
        response = requests.get(
            f"{BACKEND_URL}{endpoint}",
            headers={
                "Origin": "http://localhost:3000",
                "Content-Type": "application/json",
            },
            timeout=5
        )
        
        acao = response.headers.get("Access-Control-Allow-Origin", "")
        cors_headers = {
            "Access-Control-Allow-Origin": acao,
            "Access-Control-Allow-Credentials": response.headers.get("Access-Control-Allow-Credentials", ""),
            "Access-Control-Allow-Methods": response.headers.get("Access-Control-Allow-Methods", ""),
        }
        
        if response.status_code == 200:
            if require_cors and not acao:
                log_warning(f"Public endpoint accessible but missing CORS headers", {
                    "endpoint": endpoint,
                    "status": response.status_code,
                })
                return True
            else:
                log_result(True, f"Public endpoint accessible", {
                    "endpoint": endpoint,
                    "status": response.status_code,
                    "cors_headers": cors_headers,
                })
                return True
        else:
            log_result(False, f"Public endpoint failed: Status {response.status_code}", {
                "endpoint": endpoint,
                "status": response.status_code,
                "response": response.text[:200],
            })
            return False
    except Exception as e:
        log_result(False, f"Error testing endpoint {endpoint}: {str(e)}")
        return False


def test_public_endpoints() -> None:
    """Test 4: Public Endpoint Tests"""
    log_test("4. Public Endpoint Tests (No Auth Required)")
    
    public_endpoints = [
        "/api/v1/categories",
        "/health",
    ]
    
    # Try a procedure endpoint (may not exist, that's okay)
    try:
        response = requests.get(f"{BACKEND_URL}/api/v1/procedures/test", timeout=2)
        if response.status_code != 404:
            public_endpoints.append("/api/v1/procedures/test")
    except:
        pass
    
    for endpoint in public_endpoints:
        test_public_endpoint(endpoint)


def test_protected_endpoint(token: str) -> None:
    """Test 5: Protected Endpoint with Token"""
    log_test("5. Protected Endpoint Tests (With Valid Token)")
    
    try:
        response = requests.get(
            f"{BACKEND_URL}/api/v1/categories",
            headers={
                "Origin": "http://localhost:3000",
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
            },
            timeout=5
        )
        
        acao = response.headers.get("Access-Control-Allow-Origin", "")
        
        if response.status_code == 200:
            log_result(True, "Protected endpoint accessible with valid token", {
                "status": response.status_code,
                "Access-Control-Allow-Origin": acao,
            })
        elif response.status_code == 401:
            log_warning("Protected endpoint returned 401", {
                "status": response.status_code,
                "response": response.json() if response.content else "No content",
                "note": "Endpoint may require auth or token may be invalid",
            })
        else:
            log_result(False, f"Protected endpoint failed: Status {response.status_code}", {
                "status": response.status_code,
                "response": response.text[:200],
            })
    except Exception as e:
        log_result(False, f"Error testing protected endpoint: {str(e)}")


def test_unauthorized() -> None:
    """Test 6: Unauthorized Request"""
    log_test("6. Unauthorized Request Tests (No Token)")
    
    try:
        response = requests.get(
            f"{BACKEND_URL}/api/v1/categories",
            headers={
                "Origin": "http://localhost:3000",
                "Content-Type": "application/json",
            },
            timeout=5
        )
        
        acao = response.headers.get("Access-Control-Allow-Origin", "")
        
        if response.status_code == 200:
            log_result(True, "Public endpoint accessible without auth (expected)", {
                "status": response.status_code,
                "Access-Control-Allow-Origin": acao,
            })
        elif response.status_code == 401:
            log_warning("Endpoint requires auth", {
                "status": response.status_code,
                "note": "Endpoint may be protected",
            })
        else:
            log_result(False, f"Unexpected status: {response.status_code}")
    except Exception as e:
        log_result(False, f"Error testing unauthorized: {str(e)}")


def test_invalid_token() -> None:
    """Test 7: Invalid Token"""
    log_test("7. Invalid Token Tests")
    
    invalid_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
    
    try:
        response = requests.get(
            f"{BACKEND_URL}/api/v1/categories",
            headers={
                "Origin": "http://localhost:3000",
                "Authorization": f"Bearer {invalid_token}",
                "Content-Type": "application/json",
            },
            timeout=5
        )
        
        if response.status_code in [401, 403]:
            log_result(True, "Invalid token correctly rejected", {
                "status": response.status_code,
            })
        elif response.status_code == 200:
            log_warning("Invalid token accepted (may be permissive for public endpoints)", {
                "status": response.status_code,
            })
        else:
            log_result(False, f"Unexpected status for invalid token: {response.status_code}")
    except Exception as e:
        log_result(False, f"Error testing invalid token: {str(e)}")


def test_cors_headers() -> None:
    """Test 8: CORS Headers Verification"""
    log_test("8. CORS Headers Verification")
    
    try:
        response = requests.get(
            f"{BACKEND_URL}/api/v1/categories",
            headers={"Origin": "http://localhost:3000"},
            timeout=5
        )
        
        cors_headers = {}
        for header in response.headers:
            if "access-control" in header.lower():
                cors_headers[header] = response.headers[header]
        
        print("\n  All CORS-related headers:")
        if cors_headers:
            for header, value in cors_headers.items():
                print(f"    {header}: {value}")
            
            acao = response.headers.get("Access-Control-Allow-Origin", "")
            if acao:
                log_result(True, "CORS headers present", {
                    "Access-Control-Allow-Origin": acao,
                    "all_cors_headers": cors_headers,
                })
            else:
                log_result(False, "Missing Access-Control-Allow-Origin header")
        else:
            log_result(False, "No CORS headers found in response")
    except Exception as e:
        log_result(False, f"Error checking CORS headers: {str(e)}")


def print_summary():
    """Print final test summary"""
    print(f"\n{'='*70}")
    print("TEST SUMMARY")
    print(f"{'='*70}")
    print(f"Passed: {results['passed']}")
    print(f"Failed: {results['failed']}")
    print(f"Warnings: {results['warnings']}")
    
    if results['failed'] > 0:
        print(f"\n{'='*70}")
        print("FAILURES DETAILED:")
        print(f"{'='*70}")
        for detail in results['details']:
            if not detail.get('passed') and not detail.get('warning'):
                print(f"\n✗ {detail['message']}")
                if detail['details']:
                    for key, value in detail['details'].items():
                        print(f"  {key}: {value}")


def main():
    """Run all tests"""
    print("\n" + "="*70)
    print("Mario Health E2E CORS & Authentication Test Suite")
    print("="*70)
    
    # Run tests
    backend_ok = check_backend_health()
    if not backend_ok:
        print("\n⚠ Backend is not running. Some tests will be skipped.")
        print("  Start backend with: cd backend/mario-health-api && uvicorn app.main:app --reload")
    else:
        test_cors_preflight_all()
        test_public_endpoints()
        test_unauthorized()
        test_invalid_token()
        test_cors_headers()
    
    token = get_frontend_token()
    if token and backend_ok:
        test_protected_endpoint(token)
    
    # Print summary
    print_summary()
    
    # Exit code
    sys.exit(0 if results['failed'] == 0 else 1)


if __name__ == "__main__":
    main()

