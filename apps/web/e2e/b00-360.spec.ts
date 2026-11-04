import { test, expect } from '@playwright/test';

test('B00 mantém conteúdo demonstrativo legível no limite de 360 px', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('alert')).toContainText('sem contratação ou cobrança');
  await expect(page.getByRole('heading', { name: 'Para pessoas físicas' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Para pequenas locadoras' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await expect(page.locator('input, select, textarea')).toHaveCount(0);
});
