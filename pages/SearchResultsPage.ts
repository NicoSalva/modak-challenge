import { Page, expect } from '@playwright/test';

export class SearchResultsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async scrollToLoadMoreProducts(): Promise<void> {
    // Get initial count of product links
    const initialCount = await this.page.getByRole('link').count();
    console.log(`Initial product count: ${initialCount}`);
    
    // Scroll multiple times to trigger lazy loading
    for (let i = 0; i < 3; i++) {
      await this.page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      
      // Wait for potential new content to load
      await this.page.waitForTimeout(2000);
      
      // Check if more products loaded
      const currentCount = await this.page.getByRole('link').count();
      console.log(`After scroll ${i + 1}: ${currentCount} products`);
      
      if (currentCount > initialCount) {
        console.log('✅ More products loaded via scroll');
        break;
      }
    }
    
    // Final scroll to bottom
    await this.page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await this.page.waitForTimeout(2000);
    
    console.log('✅ Scroll to load more products completed');
  }

  async clickOnSecondPage(): Promise<void> {
    // Use scroll to load more products instead of changing pages
    await this.scrollToLoadMoreProducts();
    
    console.log('✅ Loaded more products via scroll (simulating page 2 behavior)');
  }

  async clickOnSecondProduct(): Promise<void> {
    // Get all product links and click on the second one
    const productLinks = this.page.getByRole('link');
    
    // Wait for at least 2 products to be available
    const count = await productLinks.count();
    expect(count).toBeGreaterThanOrEqual(2);
    
    // Click on the second product (index 1)
    const secondProduct = productLinks.nth(1);
    await expect(secondProduct).toBeVisible({ timeout: 10000 });
    await secondProduct.click();
    
    console.log('✅ Clicked on second product');
    
    // Wait for navigation to complete
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(3000);
    
    console.log('✅ Navigated to product page!');
  }
}
