#!/usr/bin/env node

/**
 * Mario Health Backend API Test Script
 * Tests all endpoints of the Mario Health API
 */

const BASE_URL = 'https://mario-health-api-72178908097.us-central1.run.app';

interface TestResult {
  name: string;
  url: string;
  status: number;
  success: boolean;
  responsePreview: string;
  error?: string;
}

const results: TestResult[] = [];

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

async function testEndpoint(
  name: string,
  url: string
): Promise<TestResult> {
  try {
    console.log(`${colors.cyan}📍${colors.reset} Testing: ${colors.blue}${name}${colors.reset}`);
    console.log(`   ${colors.cyan}→${colors.reset} ${url}`);
    
    const response = await fetch(url);
    const status = response.status;
    
    let responsePreview = '';
    if (response.ok) {
      const data = await response.text();
      responsePreview = data.substring(0, 200);
    } else {
      responsePreview = await response.text();
    }
    
    const success = status >= 200 && status < 300;
    
    // Display result with emoji
    const emoji = success ? '✅' : '❌';
    const statusColor = success ? colors.green : colors.red;
    
    console.log(`${emoji} Status: ${statusColor}${status}${colors.reset}`);
    console.log(`${success ? '   ✓' : '   ✗'} Response: ${responsePreview.substring(0, 80)}${responsePreview.length > 80 ? '...' : ''}`);
    console.log('');
    
    return {
      name,
      url,
      status,
      success,
      responsePreview,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(`❌ ${colors.red}Error: ${errorMessage}${colors.reset}\n`);
    
    return {
      name,
      url,
      status: 0,
      success: false,
      responsePreview: '',
      error: errorMessage,
    };
  }
}

async function runTests() {
  console.log('\n🧪 Mario Health Backend API Test Suite\n');
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  // Test 1: GET /api/v1/categories
  results.push(
    await testEndpoint(
      'Get all categories',
      `${BASE_URL}/api/v1/categories`
    )
  );

  // Test 2: GET /api/v1/categories/{slug}/families
  results.push(
    await testEndpoint(
      'Get families for category',
      `${BASE_URL}/api/v1/categories/imaging/families`
    )
  );

  // Test 3: GET /api/v1/categories/radiology/families (using actual category from DB)
  results.push(
    await testEndpoint(
      'Get families for radiology category',
      `${BASE_URL}/api/v1/categories/cancer-treatment/families`
    )
  );

  // Test 4: GET /api/v1/families/{slug}/procedures
  results.push(
    await testEndpoint(
      'Get procedures for family',
      `${BASE_URL}/api/v1/families/x-ray/procedures`
    )
  );

  // Test 5: GET /api/v1/procedures/{slug}
  results.push(
    await testEndpoint(
      'Get procedure detail',
      `${BASE_URL}/api/v1/procedures/proc_abdomen_x_ray`
    )
  );

  // Test 6: GET /api/v1/search?q=chest
  results.push(
    await testEndpoint(
      'Search procedures - chest',
      `${BASE_URL}/api/v1/search?q=chest`
    )
  );

  // Test 7: GET /api/v1/search?q=mri&zip=02138&radius=25
  results.push(
    await testEndpoint(
      'Search procedures - MRI with location',
      `${BASE_URL}/api/v1/search?q=mri&zip=02138&radius=25`
    )
  );

  // Test 8: GET /api/v1/codes/{code}?code_type=CPT
  results.push(
    await testEndpoint(
      'Get billing code detail',
      `${BASE_URL}/api/v1/codes/71046?code_type=CPT`
    )
  );

  // Test 9: GET /api/v1/providers/{provider_id}
  results.push(
    await testEndpoint(
      'Get provider detail',
      `${BASE_URL}/api/v1/providers/prov_1`
    )
  );

  // Summary
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
  console.log('📊 Test Summary\n');
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ Passed: ${colors.green}${successful}${colors.reset}`);
  console.log(`❌ Failed: ${colors.red}${failed}${colors.reset}`);
  console.log(`📊 Total: ${results.length}\n`);
  
  if (failed > 0) {
    console.log(`${colors.red}Failed Tests:${colors.reset}\n`);
    results
      .filter(r => !r.success)
      .forEach(r => {
        console.log(`❌ ${colors.red}${r.name}${colors.reset}`);
        console.log(`   URL: ${r.url}`);
        console.log(`   Status: ${r.status}${r.error ? ` - ${r.error}` : ''}`);
      });
    console.log('');
  }
  
  // Exit with error code if any tests failed
  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
  console.error(`${colors.red}❌ Fatal error: ${error}${colors.reset}`);
  process.exit(1);
});
