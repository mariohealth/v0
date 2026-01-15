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
        if (response.url().includes('/search') && response.status() >= 400) {
            errors.push(`Search API Failed: ${response.url()} status ${response.status()}`);
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
    // Type "cardio"
    const searchInput = page.getByPlaceholder(/Search services, doctors, or meds/i);
    await expect(searchInput).toBeVisible();
    await searchInput.fill('cardio');

    // Expect autocomplete list appears and contains Cardiologist
    const suggestion = page.getByText('Cardiologist', { exact: false }).first();
    await expect(suggestion).toBeVisible();
});

test('TEST 2: Home -> Autocomplete -> Procedure navigation', async ({ page }) => {
    await page.goto('/home');
    const searchInput = page.getByPlaceholder(/Search services, doctors, or meds/i);
    await searchInput.fill('brain mri');

    // Click the procedure suggestion
    const suggestion = page.getByText('Brain MRI', { exact: false }).first();
    await expect(suggestion).toBeVisible();
    await suggestion.click();

    // Expect URL matches /procedures/brain-mri (lenient match for slug)
    await expect(page).toHaveURL(/\/procedures\/.*brain.*mri.*/i);

    // Page loads without redirecting to /
    await page.waitForLoadState('networkidle');
    const url = page.url();
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
