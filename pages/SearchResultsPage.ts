import { Page, expect } from '@playwright/test';
import { TestUtils } from '../utils/TestUtils';

export class SearchResultsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async scrollToBottom(): Promise<void> {
    // Scroll to bottom to find pagination
    await this.page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    
    // Wait for scroll to complete using periodic checks (less aggressive)
    await TestUtils.waitUntil(
      this.page,
      async () => {
        // Check if we've scrolled to bottom
        const scrollY = await this.page.evaluate(() => window.scrollY);
        const maxScroll = await this.page.evaluate(() => document.body.scrollHeight - window.innerHeight);
        return scrollY >= maxScroll * 0.9; // 90% scrolled
      },
      5000,
      500 // Check every 500ms
    );
    console.log('✅ Scrolled to bottom of page');
  }

  async clickOnSecondPage(): Promise<void> {
    // First scroll to bottom to find pagination
    await this.scrollToBottom();
    
    // Look for page "2" button in pagination - be more specific
    const secondPageButton = this.page.getByRole('list').getByText('2', { exact: true });
    
    // Wait for and click the second page button using periodic checks
    await TestUtils.waitForElementVisible(this.page, secondPageButton, 10000);
    await secondPageButton.click();
    
    console.log('✅ Clicked on page 2 button');
    
    // Wait for page to load using periodic checks
    await this.page.waitForLoadState('domcontentloaded');
    await TestUtils.waitUntil(
      this.page,
      async () => {
        // Check if page has loaded by looking for content
        const links = await this.page.getByRole('link').count();
        return links > 0;
      },
      10000,
      1000 // Check every 1 second
    );
  }

  async clickOnFirstProduct(): Promise<void> {
    // Click on the first product link
    const productLink = this.page.getByRole('link').first();
    
    await TestUtils.waitForElementVisible(this.page, productLink, 10000);
    await productLink.click();
    
    console.log('✅ Clicked on first product link');
    
    // Wait for navigation to complete using periodic checks
    await this.page.waitForLoadState('domcontentloaded');
    await TestUtils.waitUntil(
      this.page,
      async () => {
        // Check if we're on a product page by looking for product-specific elements
        const url = this.page.url();
        return url.includes('/item/') || url.includes('/product/');
      },
      15000,
      1000 // Check every 1 second
    );
    
    console.log('✅ Navigated to product page!');
  }
}
