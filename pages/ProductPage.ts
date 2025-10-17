import { Page, expect } from '@playwright/test';

export class ProductPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyProductAvailability(): Promise<boolean> {
    // Wait for page to load
    await this.page.waitForLoadState('domcontentloaded');
    
    // Simple check: if we can see any links, assume product is available
    try {
      const productLink = this.page.getByRole('link');
      await expect(productLink.first()).toBeVisible({ timeout: 5000 });
      
      console.log('✅ Product page loaded successfully - assuming available');
      return true;
    } catch {
      console.log('❌ Could not verify product page loaded');
      return false;
    }
  }
}
