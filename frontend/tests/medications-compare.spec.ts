import { test, expect } from '@playwright/test';

test('medication compare uses API prices and highlights mario pick', async ({ page }) => {
  await page.route('**/api/v1/medications/prices**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          rxcui_scd: '197580',
          pharmacy_id: 'pharmacy_a',
          pharmacy_name: 'Alpha Pharmacy',
          pharmacy_type: 'retail',
          delivery_only: false,
          national: false,
          region: 'west',
          source_id: 'goodrx',
          source_name: 'GoodRx',
          source_type: 'coupon',
          price: 12.5,
          quantity: '30',
          product_url: 'https://example.com/a',
          created_at: '2026-02-01T00:00:00Z',
        },
        {
          rxcui_scd: '197580',
          pharmacy_id: 'pharmacy_b',
          pharmacy_name: 'Beta Pharmacy',
          pharmacy_type: 'mail_order',
          delivery_only: true,
          national: true,
          region: 'national',
          source_id: 'costplus',
          source_name: 'Cost Plus',
          source_type: 'cash',
          price: 8,
          quantity: '30',
          product_url: 'https://example.com/b',
          created_at: '2026-02-01T00:00:00Z',
        },
      ]),
    });
  });

  const [request] = await Promise.all([
    page.waitForRequest('**/api/v1/medications/prices**'),
    page.goto('/__test__/medications-compare'),
  ]);

  const url = new URL(request.url());
  expect(url.searchParams.get('rxcui_scd')).toBe('197580');
  expect(url.searchParams.get('quantity')).toBe('30');

  const rows = page.locator('[data-testid="pharmacy-row"]');
  await expect(rows).toHaveCount(2);

  const firstRow = rows.first();
  await expect(firstRow).toContainText('Beta Pharmacy');
  await expect(firstRow).toContainText('$8.00');
  await expect(firstRow.getByText("🎯 Mario's Pick")).toBeVisible();
});
