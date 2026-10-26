import { expect, test } from '@playwright/test';

// The tests run in simulation mode: they depend on neither the network nor the exchanges.
test.describe('real-time BTC feed page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projects/btc-realtime');
    await expect(
      page.getByRole('heading', { level: 1, name: /real-time btc multi-exchange feed/i })
    ).toBeVisible();
    await page.getByRole('switch', { name: /simulation/i }).click();
  });

  test('shows the simulation banner and trades', async ({ page }) => {
    await expect(page.getByTestId('mode-banner')).toContainText(/simulation mode/i);
    await expect(page.getByTestId('trade-row').first()).toBeVisible({ timeout: 15_000 });
  });

  test('switches between table, curves and spread', async ({ page }) => {
    await expect(page.getByTestId('trade-row').first()).toBeVisible({ timeout: 15_000 });

    await page.getByRole('tab', { name: 'Curves' }).click();
    await expect(page.getByRole('group', { name: /price curves/i })).toBeVisible();
    await expect(page.locator('.recharts-surface').first()).toBeVisible({ timeout: 15_000 });

    await page.getByRole('tab', { name: 'Spread' }).click();
    await expect(page.getByRole('group', { name: /price spread/i })).toBeVisible();

    await page.getByRole('tab', { name: 'Table' }).click();
    await expect(page.getByTestId('trade-row').first()).toBeVisible();
  });

  test('reconnects after a simulated outage', async ({ page }) => {
    await expect(page.getByTestId('trade-row').first()).toBeVisible({ timeout: 15_000 });

    await page.getByRole('button', { name: /simulate an outage/i }).click();
    await expect(page.getByTestId('mode-banner')).toContainText(/simulated outage/i);

    await expect(page.getByTestId('mode-banner')).toContainText(/simulation mode/i, {
      timeout: 20_000,
    });
  });

  test('exports the curves as CSV', async ({ page }) => {
    await page.getByRole('tab', { name: 'Curves' }).click();
    const exportButton = page.getByRole('button', { name: /export csv/i });
    await expect(exportButton).toBeEnabled({ timeout: 15_000 });

    const [download] = await Promise.all([page.waitForEvent('download'), exportButton.click()]);
    expect(download.suggestedFilename()).toMatch(/^btc-feed-.*\.csv$/);
  });
});

test('the home page links to the demo', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /real-time btc multi-exchange feed/i }).first().click();
  await expect(page).toHaveURL(/\/projects\/btc-realtime$/);
});
