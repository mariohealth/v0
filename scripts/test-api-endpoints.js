#!/usr/bin/env node
/**
 * API Endpoint Validation Script
 * Tests all frontend API calls against backend endpoints
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Helper to make requests
async function testEndpoint(endpoint, method = 'GET', body = null, headers = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const result = {
        endpoint,
        method,
        status: 0,
        statusText: '',
        success: false,
        error: null,
        responsePreview: null,
        suggestedFix: null,
    };

    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);
        const responseText = await response.text();

        result.status = response.status;
        result.statusText = response.statusText;
        result.success = response.ok;

        // Get preview of response
        try {
            const json = JSON.parse(responseText);
            result.responsePreview = JSON.stringify(json).substring(0, 100);
        } catch {
            result.responsePreview = responseText.substring(0, 100);
        }

        // Suggest fixes based on status
        if (response.status === 404) {
            result.suggestedFix = 'Check if route exists in backend or if /api/v1 prefix is missing';
        } else if (response.status === 401 || response.status === 403) {
            result.suggestedFix = 'Add authentication token (Bearer token)';
        } else if (response.status === 500) {
            result.suggestedFix = 'Backend endpoint has server error';
        } else if (response.status === 422) {
            result.suggestedFix = 'Request validation failed - check required parameters';
        }

        if (!response.ok && !result.suggestedFix) {
            result.suggestedFix = `HTTP ${response.status}: ${response.statusText}`;
        }
    } catch (error) {
        result.error = error.message;
        result.suggestedFix = 'Network error - check if backend is running at ' + API_BASE_URL;
    }

    return result;
}

// Test all endpoints from mapping table
async function runTests() {
    console.log('🔍 Testing API Endpoints...\n');
    console.log(`Backend URL: ${API_BASE_URL}\n`);

    const results = [];

    // Core endpoints
    results.push(await testEndpoint('/api/v1/categories'));
    results.push(await testEndpoint('/api/v1/categories/imaging/families'));
    results.push(await testEndpoint('/api/v1/families/x-ray/procedures'));
    results.push(await testEndpoint('/api/v1/procedures/chest-x-ray-2-views'));
    results.push(await testEndpoint('/api/v1/search?q=mri&zip_code=02138&radius=25'));
    results.push(await testEndpoint('/api/v1/codes/71046'));
    results.push(await testEndpoint('/api/v1/providers/prov_001'));
    results.push(await testEndpoint('/api/v1/providers/prov_001/time-slots?date=2024-01-01'));

    // Bookings
    results.push(await testEndpoint('/api/v1/bookings', 'POST', {
        provider_id: 'prov_001',
        procedure_id: 'proc_001',
        appointment_date: '2024-01-01',
        appointment_time: '10:00',
        patient_name: 'Test Patient',
        patient_email: 'test@example.com',
    }));
    results.push(await testEndpoint('/api/v1/bookings/booking_001'));
    results.push(await testEndpoint('/api/v1/bookings/booking_001/cancel', 'DELETE'));

    // Insurance
    results.push(await testEndpoint('/api/v1/insurance/verify', 'POST', {
        member_id: 'mem_001',
        provider_id: 'prov_001',
    }));
    results.push(await testEndpoint('/api/v1/insurance/providers'));

    // User endpoints (may need auth)
    results.push(await testEndpoint('/api/v1/user/preferences'));
    results.push(await testEndpoint('/api/v1/user/preferences', 'PUT', {
        preferences: {
            default_zip: '02138',
        },
    }));
    results.push(await testEndpoint('/api/v1/user/saved-searches'));
    results.push(await testEndpoint('/api/v1/user/saved-searches', 'POST', {
        search: {
            query: 'test',
            user_id: 'user_001',
        },
    }));

    // Health check
    results.push(await testEndpoint('/health'));
    results.push(await testEndpoint('/api/v1/whoami'));

    // Generate report
    generateReport(results);
}

function generateReport(results) {
    const total = results.length;
    const passing = results.filter(r => r.success).length;
    const warnings = results.filter(r => !r.success && r.status > 0).length;
    const errors = results.filter(r => r.status === 0 || r.error).length;
    const passRate = ((passing / total) * 100).toFixed(1);

    console.log('\n' + '='.repeat(80));
    console.log('API ENDPOINT VALIDATION REPORT');
    console.log('='.repeat(80) + '\n');

    console.log('| Endpoint | Method | HTTP Code | Result | Suggested Fix |');
    console.log('|----------|--------|-----------|--------|----------------|');

    results.forEach(r => {
        const status = r.success ? '✅ Working' : (r.status === 0 ? '❌ Network Error' : `⚠️ ${r.statusText}`);
        const code = r.status || 'N/A';
        const fix = r.suggestedFix || '–';
        const endpoint = r.endpoint.length > 40 ? r.endpoint.substring(0, 37) + '...' : r.endpoint;

        console.log(`| ${endpoint} | ${r.method} | ${code} | ${status} | ${fix.substring(0, 30)} |`);
    });

    console.log('\n' + '='.repeat(80));
    console.log('SUMMARY');
    console.log('='.repeat(80));
    console.log(`Total endpoints tested: ${total}`);
    console.log(`✅ Passing: ${passing} (${passRate}%)`);
    console.log(`⚠️  Warnings: ${warnings}`);
    console.log(`❌ Errors: ${errors}`);
    console.log(`Environment base URL: ${API_BASE_URL}`);

    if (errors > 0) {
        console.log('\n🔧 Next recommended step: Start backend server');
        console.log('   cd backend/mario-health-api');
        console.log('   uvicorn app.main:app --reload');
    } else if (warnings > 0) {
        console.log('\n⚠️  Some endpoints returned errors - check authentication or parameters');
    } else {
        console.log('\n✅ All endpoints are working correctly!');
    }
}

// Run tests
runTests().catch(console.error);
