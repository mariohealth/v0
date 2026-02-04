import { test, expect } from '@playwright/test';

// Global error collection
const failures = new Map<string, string[]>();

test.beforeEach(async ({ page }, testInfo) => {
    failures.set(testInfo.testId, []);
    const errors = failures.get(testInfo.testId)!;

    page.on('console', msg => {
        const text = msg.text();
        if (
            text.includes('CORS') ||
            text.includes('net::ERR_FAILED') ||
            text.includes('Access-Control-Allow-Origin')
        ) {
            errors.push(`Console Error: ${text}`);
        }
    });

    page.on('pageerror', error => {
        errors.push(`Unhandled Promise Rejection/Page Error: ${error.message}`);
    });

    page.on('requestfailed', request => {
        if (request.failure()?.errorText !== 'net::ERR_ABORTED') {
            errors.push(`Network Request Failed: ${request.url()} - ${request.failure()?.errorText}`);
        }
    });

    page.on('response', response => {
        try {
            const url = new URL(response.url());
            if (url.pathname.endsWith('/search') && response.status() >= 400) {
                errors.push(`Search API Failed: ${response.url()} status ${response.status()}`);
            }
        } catch (e) {
            // Ignore invalid URLs
        }
    });
});

test.afterEach(async ({ }, testInfo) => {
    const errors = failures.get(testInfo.testId);
    if (errors && errors.length > 0) {
        throw new Error(`Smoke Test Violations:\n${errors.join('\n')}`);
    }
});

test('TEST 1: Home -> Autocomplete -> Specialty appears', async ({ page }) => {
    await page.goto('/home');
    await page.waitForLoadState('domcontentloaded');

    // Debug: Log basic page info
    console.log(`[Test 1] Current URL: ${page.url()}`);
    console.log(`[Test 1] Page Title: ${await page.title()}`);

    // Type "cardio" using stable test ID with increased timeout
    const searchInput = page.getByTestId('global-search-input');
    await expect(searchInput).toBeVisible({ timeout: 15000 });
    await searchInput.fill('cardio');

    // Expect autocomplete list appears and contains Cardiologist
    const suggestion = page.getByText('Cardiologist', { exact: false }).first();
    await expect(suggestion).toBeVisible({ timeout: 10000 });
});

test('TEST 1B: Home -> Autocomplete -> Doctor suggestions render', async ({ page }) => {
    await page.route('**/api/v1/doctors/search**', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([
                {
                    provider_id: '1234567890',
                    first_name: 'Jane',
                    last_name: 'Smith',
                    credential: 'MD',
                    specialty_name: 'Dermatology',
                    org_name: 'Memorial Hospital',
                    city: 'Austin',
                    state: 'TX',
                    zip_code: '78701'
                }
            ])
        });
    });

    await page.goto('/home');
    await page.waitForLoadState('domcontentloaded');

    const searchInput = page.getByTestId('global-search-input');
    await expect(searchInput).toBeVisible({ timeout: 15000 });
    await searchInput.fill('jane smith');

    await expect(page.getByText('Jane Smith, MD', { exact: false })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Dermatology', { exact: false })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Memorial Hospital • Austin, TX • 78701', { exact: false })).toBeVisible({ timeout: 10000 });
});

test('TEST 2: Home -> Autocomplete -> Procedure navigation', async ({ page }) => {
    await page.goto('/home');
    await page.waitForLoadState('domcontentloaded');

    const searchInput = page.getByTestId('global-search-input');
    await expect(searchInput).toBeVisible({ timeout: 15000 });
    await searchInput.fill('brain mri');

    // Click the procedure suggestion
    const suggestion = page.getByText('Brain MRI', { exact: false }).first();
    await expect(suggestion).toBeVisible({ timeout: 10000 });
    await suggestion.click();

    // Expect URL matches /procedures/brain-mri (lenient match for slug)
    // Wait for URL change explicitly
    await expect(page).toHaveURL(/\/procedures\/.*brain.*mri.*/i, { timeout: 15000 });

    // Page loads without redirecting to /
    await page.waitForLoadState('networkidle');
    const url = page.url();
    console.log(`[Test 2] Post-navigation URL: ${url}`);

    expect(url).not.toMatch(/^https?:\/\/[^\/]+\/?$/); // Not root
    expect(url).toContain('/procedures/');

    // Page contains a visible procedure heading or identifier
    await expect(page.getByRole('heading', { name: /brain mri/i })).toBeVisible();
});

test('TEST 3: Back navigation from procedure', async ({ page }) => {
    await page.goto('/procedures/brain-mri');

    // Click the in-app Back button
    await page.getByRole('button', { name: /back/i }).click();

    // Expect URL is /home
    await expect(page).toHaveURL(/\/home/);
    expect(page.url()).not.toMatch(/^https?:\/\/[^\/]+\/?$/);
});

test('TEST 4: Specialty deep link page', async ({ page }) => {
    await page.goto('/specialties/cardiologist?zip_code=10001');

    // Specialty name "Cardiologist" is visible
    await expect(page.getByText('Cardiologist', { exact: false }).first()).toBeVisible();

    // "Pricing unavailable" text is visible somewhere
    await expect(page.getByText('Pricing unavailable', { exact: false })).toBeVisible();

    // Click Back button
    await page.getByRole('button', { name: /back/i }).click();

    // Expect URL is /home (NOT /)
    await expect(page).toHaveURL(/\/home/);
});

test('TEST 5: Login page loads safely', async ({ page }) => {
    await page.goto('/login');
    // Ensure no redirect loop
    await expect(page).toHaveURL(/\/login/);

    // Recognizable login heading or button
    const heading = page.getByRole('heading', { level: 1 }).first();
    const button = page.getByRole('button', { name: /(sign|log) in/i });

    await expect(heading.or(button)).toBeVisible();
});

test('TEST 6: Signup page loads safely', async ({ page }) => {
    await page.goto('/signup');
    await expect(page).toHaveURL(/\/signup/);

    const heading = page.getByRole('heading', { level: 1 }).first();
    // "Sign Up" or "Create Account"
    const button = page.getByRole('button', { name: /(sign|log) up|create account/i });

    await expect(heading.or(button)).toBeVisible();
});
