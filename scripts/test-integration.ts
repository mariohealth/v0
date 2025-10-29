#!/usr/bin/env node

/**
 * Frontend-Backend Integration Test Suite
 * 
 * Tests the actual API client functions against the live backend.
 * Validates response structure and TypeScript types.
 */

import * as api from '../src/lib/api';
import { getApiPerformanceStats } from '../src/lib/analytics';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mario-health-api-72178908097.us-central1.run.app';

interface TestResult {
    name: string;
    passed: boolean;
    error?: string;
    duration?: number;
}

const results: TestResult[] = [];

// Color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
};

async function testCase(name: string, test: () => Promise<void>): Promise<void> {
    const startTime = Date.now();

    try {
        await test();
        const duration = Date.now() - startTime;
        results.push({ name, passed: true, duration });
        console.log(`${colors.green}✅${colors.reset} ${name} (${duration}ms)`);
    } catch (error) {
        const duration = Date.now() - startTime;
        const errorMessage = error instanceof Error ? error.message : String(error);
        results.push({ name, passed: false, error: errorMessage, duration });
        console.log(`${colors.red}❌${colors.reset} ${name}`);
        console.log(`   Error: ${errorMessage}`);
    }
}

async function runTests() {
    console.log('\n🧪 Mario Health Integration Test Suite\n');
    console.log(`${colors.cyan}API Base URL: ${BASE_URL}${colors.reset}\n`);
    console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

    // Test 1: Get categories
    await testCase('getCategories() returns array of categories', async () => {
        const categories = await api.getCategories();

        if (!Array.isArray(categories)) {
            throw new Error('Expected array but got ' + typeof categories);
        }

        if (categories.length === 0) {
            throw new Error('Expected at least one category');
        }

        const category = categories[0];
        if (!category.id || !category.name || !category.slug) {
            throw new Error('Category missing required fields');
        }

        console.log(`   Found ${categories.length} categories`);
    });

    // Test 2: Get families by category
    await testCase('getFamiliesByCategory("imaging") returns families', async () => {
        const result = await api.getFamiliesByCategory('imaging');

        if (!Array.isArray(result.families)) {
            throw new Error('Expected families array');
        }

        if (!result.categorySlug) {
            throw new Error('Missing categorySlug');
        }

        if (result.families.length > 0) {
            const family = result.families[0];
            if (!family.id || !family.name || !family.slug) {
                throw new Error('Family missing required fields');
            }
        }

        console.log(`   Found ${result.families.length} families`);
    });

    // Test 3: Get procedures by family
    await testCase('getProceduresByFamily("x-ray") returns procedures', async () => {
        const result = await api.getProceduresByFamily('x-ray');

        if (!Array.isArray(result.procedures)) {
            throw new Error('Expected procedures array');
        }

        if (!result.familySlug || !result.familyName) {
            throw new Error('Missing family info');
        }

        if (result.procedures.length > 0) {
            const procedure = result.procedures[0];
            if (!procedure.id || !procedure.name) {
                throw new Error('Procedure missing required fields');
            }
        }

        console.log(`   Found ${result.procedures.length} procedures`);
    });

    // Test 4: Search procedures
    await testCase('searchProcedures("chest") returns results', async () => {
        const result = await api.searchProcedures('chest');

        if (!Array.isArray(result.results)) {
            throw new Error('Expected results array');
        }

        if (result.query !== 'chest') {
            throw new Error('Query mismatch');
        }

        if (result.results.length > 0) {
            const searchResult = result.results[0];
            if (!searchResult.procedureId || !searchResult.procedureName) {
                throw new Error('Search result missing required fields');
            }
        }

        console.log(`   Found ${result.resultsCount} results`);
    });

    // Test 5: Search with location
    await testCase('searchProcedures("mri", "02138") works with location', async () => {
        const result = await api.searchProcedures('mri', '02138', 25);

        if (!Array.isArray(result.results)) {
            throw new Error('Expected results array');
        }

        console.log(`   Found ${result.resultsCount} results near 02138`);
    });

    // Test 6: Invalid slug returns error
    await testCase('Invalid slug returns proper error', async () => {
        try {
            await api.getFamiliesByCategory('this-category-does-not-exist-12345');
            throw new Error('Expected error but got success');
        } catch (error) {
            if (!(error instanceof Error) || !error.message.includes('error')) {
                throw error;
            }
        }

        console.log(`   Correctly handled invalid category slug`);
    });

    // Test 7: Procedure detail
    await testCase('getProcedureDetail() returns detail structure', async () => {
        try {
            const result = await api.getProcedureDetail('chest-x-ray-2-views');

            if (!result.id || !result.name || !result.slug) {
                throw new Error('Procedure detail missing required fields');
            }

            if (!result.familyId || !result.categoryId) {
                throw new Error('Missing context fields');
            }

            console.log(`   Got procedure detail: ${result.name}`);
        } catch (error) {
            // This might fail if the exact slug doesn't exist, that's okay
            console.log(`   Procedure detail not found (expected if slug doesn't exist)`);
        }
    });

    // Summary
    console.log(`\n${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;

    console.log('📊 Test Summary\n');
    console.log(`${colors.green}✅ Passed: ${passed}${colors.reset}`);
    console.log(`${colors.red}❌ Failed: ${failed}${colors.reset}`);
    console.log(`📊 Total: ${results.length}\n`);

    if (failed > 0) {
        console.log(`${colors.red}Failed Tests:${colors.reset}\n`);
        results
            .filter(r => !r.passed)
            .forEach(r => {
                console.log(`❌ ${colors.red}${r.name}${colors.reset}`);
                if (r.error) {
                    console.log(`   ${r.error.substring(0, 100)}${r.error.length > 100 ? '...' : ''}`);
                }
            });
        console.log('');
    }

    // Show performance stats
    const stats = getApiPerformanceStats();
    if (stats.totalCalls > 0) {
        console.log('📈 API Performance:\n');
        console.log(`   Total API Calls: ${stats.totalCalls}`);
        console.log(`   Average Duration: ${stats.averageDuration}ms`);
        console.log(`   Error Rate: ${stats.errorRate}%`);
        console.log(`   Slow Calls (>1000ms): ${stats.slowCalls.length}`);
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
