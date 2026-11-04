import { test, expect } from '@playwright/test';

test('explica o produto e não apresenta a demonstração como contratação real', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Um lugar para encontrar. Um espaço para anunciar.');
  await expect(page.getByRole('alert')).toContainText('sem contratação ou cobrança');
  await expect(page.getByRole('heading', { name: 'Para pessoas físicas' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Para pequenas locadoras' })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(hasOverflow).toBe(false);
});
