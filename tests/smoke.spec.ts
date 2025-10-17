import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');
    
    // Simple smoke test - just check that page loads
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    
    // Basic check that we're on AliExpress
    expect(title.toLowerCase()).toContain('aliexpress');
  });
});
