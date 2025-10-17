import { Page, expect } from '@playwright/test';

export class ProductPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async getProductLinks(): Promise<number> {
    // Wait for page to load
    await this.page.waitForLoadState('domcontentloaded');
    
    // Return count of product links found
    const links = this.page.getByRole('link');
    return await links.count();
  }

  async isProductPageLoaded(): Promise<boolean> {
    // Check if we're on a product page
    const url = this.page.url();
    return url.includes('/item/') || url.includes('/product/');
  }
}
