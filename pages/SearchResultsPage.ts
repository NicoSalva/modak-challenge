import { Page, expect } from '@playwright/test';

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
    
    // Wait for scroll to complete
    await this.page.waitForTimeout(2000);
    console.log('✅ Scrolled to bottom of page');
  }

  async clickOnSecondPage(): Promise<void> {
    // First scroll to bottom to find pagination
    await this.scrollToBottom();
    
    // Look for page "2" button in pagination - be more specific
    const secondPageButton = this.page.getByRole('list').getByText('2', { exact: true });
    
    // Wait for and click the second page button
    await expect(secondPageButton).toBeVisible({ timeout: 10000 });
    await secondPageButton.click();
    
    console.log('✅ Clicked on page 2 button');
    
    // Wait for page to load
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(3000);
  }

  async clickOnFirstProduct(): Promise<void> {
    // Click on the first product link
    const productLink = this.page.getByRole('link').first();
    
    await expect(productLink).toBeVisible({ timeout: 10000 });
    await productLink.click();
    
    console.log('✅ Clicked on first product link');
    
    // Wait for navigation to complete
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(3000);
    
    console.log('✅ Navigated to product page!');
  }
}
