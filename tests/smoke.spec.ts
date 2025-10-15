import { test, expect } from '@playwright/test';

// Simple smoke test: open homepage and check title
test('homepage loads', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const title = await page.title();
  console.log('Page title is:', title);
  expect(title.length).toBeGreaterThan(0);
});
