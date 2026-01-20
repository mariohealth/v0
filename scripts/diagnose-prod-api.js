#!/usr/bin/env node

/**
 * Diagnostic script to test production API endpoints directly
 * Usage: node scripts/diagnose-prod-api.js
 */

const PROD_API_BASE = 'https://mario-health-api-ei5wbr4h5a-uc.a.run.app/api/v1';

async function testEndpoint(name, url, options = {}) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Testing: ${name}`);
    console.log(`URL: ${url}`);
    console.log(`${'='.repeat(60)}`);

    try {
        const response = await fetch(url, {
            method: options.method || 'GET',
            headers: {
                'Accept': 'application/json',
                ...options.headers
            }
        });

        const statusCode = response.status;
        const statusText = response.statusText;

        let body;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            body = await response.json();
        } else {
            body = await response.text();
        }

        console.log(`Status: ${statusCode} ${statusText}`);
        console.log(`Response (first 500 chars):`);
        console.log(JSON.stringify(body, null, 2).substring(0, 500));

        return { statusCode, statusText, body };
    } catch (error) {
        console.error(`ERROR: ${error.message}`);
        return { error: error.message };
    }
}

async function main() {
    console.log('PRODUCTION API DIAGNOSTIC');
    console.log('Testing against:', PROD_API_BASE);

    // Test 1: Brain MRI procedure orgs
    const brainMriUrl = `${PROD_API_BASE}/procedures/brain-mri/orgs?zip_code=10016&radius_miles=60`;
    await testEndpoint('Brain MRI Orgs', brainMriUrl);

    // Test 2: Provider detail by NPI
    const providerNpiUrl = `${PROD_API_BASE}/providers/1184731119`;
    await testEndpoint('Provider by NPI (1184731119)', providerNpiUrl);

    // Test 3: Cardiologist specialty providers
    const cardioUrl = `${PROD_API_BASE}/specialties/cardiologist/providers?zip_code=10016&radius_miles=60`;
    await testEndpoint('Cardiologist Specialty Providers', cardioUrl);

    console.log(`\n${'='.repeat(60)}`);
    console.log('DIAGNOSTIC COMPLETE');
    console.log(`${'='.repeat(60)}\n`);
}

main().catch(console.error);
