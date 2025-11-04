#!/usr/bin/env node
/**
 * Cursor Command: /Test APIs
 * 
 * Runs automated backend and frontend API health test,
 * validates endpoint reachability, and summarizes results.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const PROJECT_ROOT = process.cwd();

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function getLatestCommitHash() {
  try {
    return execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim().substring(0, 8);
  } catch {
    return 'unknown';
  }
}

function checkBackendReachability() {
  try {
    const response = execSync(`curl -s -o /dev/null -w "%{http_code}" ${API_BASE_URL}/health 2>&1`, { encoding: 'utf-8' });
    return response.trim() === '200';
  } catch {
    return false;
  }
}

async function runTests() {
  console.log('\n🧪 API Validation Test\n');
  console.log('=' .repeat(60) + '\n');

  // Check backend reachability
  const backendReachable = checkBackendReachability();
  if (!backendReachable) {
    console.log(`${colors.red}❌ Backend not reachable at ${API_BASE_URL}${colors.reset}\n`);
    console.log('🔧 Suggested fix: Start backend server');
    console.log('   cd backend/mario-health-api');
    console.log('   uvicorn app.main:app --reload\n');
    return;
  }

  console.log(`${colors.green}✅ Backend reachable at ${API_BASE_URL}${colors.reset}\n`);

  // Run test script
  try {
    const output = execSync(
      `NEXT_PUBLIC_API_URL=${API_BASE_URL} node scripts/test-api-endpoints.js`,
      { encoding: 'utf-8', cwd: PROJECT_ROOT }
    );

    // Parse output for summary
    const lines = output.split('\n');
    let passing = 0;
    let warnings = 0;
    let errors = 0;
    let total = 0;
    let passRate = '0';

    for (const line of lines) {
      if (line.includes('✅ Passing:')) {
        const match = line.match(/✅ Passing: (\d+) \((\d+\.\d+)%\)/);
        if (match) {
          passing = parseInt(match[1]);
          passRate = match[2];
        }
      }
      if (line.includes('⚠️  Warnings:')) {
        const match = line.match(/⚠️  Warnings: (\d+)/);
        if (match) warnings = parseInt(match[1]);
      }
      if (line.includes('❌ Errors:')) {
        const match = line.match(/❌ Errors: (\d+)/);
        if (match) errors = parseInt(match[1]);
      }
      if (line.includes('Total endpoints tested:')) {
        const match = line.match(/Total endpoints tested: (\d+)/);
        if (match) total = parseInt(match[1]);
      }
    }

    // Display summary
    console.log('📊 Test Results Summary\n');
    console.log(`${colors.green}✅ ${passing} / ${total} endpoints passed (${passRate}%)${colors.reset}`);
    
    if (warnings > 0) {
      console.log(`${colors.yellow}⚠️  ${warnings} warnings (expected: auth / validation)${colors.reset}`);
    }
    
    if (errors > 0) {
      console.log(`${colors.red}❌ ${errors} errors${colors.reset}`);
    } else {
      console.log(`${colors.green}❌ 0 errors${colors.reset}`);
    }

    console.log(`\n${colors.cyan}🌐 Base URL: ${API_BASE_URL}${colors.reset}`);
    console.log(`${colors.blue}📦 Last Commit: ${getLatestCommitHash()}${colors.reset}\n`);

    // Show full output
    console.log('\n' + '='.repeat(60));
    console.log('Full Test Output:\n');
    console.log(output);

    // Final status
    if (passing === total && errors === 0) {
      console.log(`\n${colors.green}🎯 All critical endpoints reachable — frontend↔backend integration healthy${colors.reset}\n`);
    } else if (errors === 0) {
      console.log(`\n${colors.yellow}⚠️  Some endpoints returned expected warnings (auth/validation)${colors.reset}`);
      console.log(`${colors.cyan}💡 Endpoints are accessible; warnings are expected behavior${colors.reset}\n`);
    } else {
      console.log(`\n${colors.red}❌ Some endpoints have errors — check backend connectivity${colors.reset}\n`);
    }

  } catch (error) {
    console.error(`${colors.red}❌ Error running tests:${colors.reset}`, error.message);
    console.log('\n🔧 Suggested fix: Ensure test script exists at scripts/test-api-endpoints.js');
  }
}

// Run tests
runTests().catch(console.error);

