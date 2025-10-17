// pages-puppeteer/HomePagePuppeteer.ts
import { Page } from 'puppeteer';

export class HomePagePuppeteer {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateToHomePage(): Promise<void> {
    console.log('Navigating to AliExpress homepage...');
    await this.page.goto('https://www.aliexpress.com', { waitUntil: 'domcontentloaded' });
    
    // Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const title = await this.page.title();
    console.log(`Page title: ${title}`);
    
    // Handle bot detection if present
    if (title.toLowerCase().includes('captcha') || 
        title.toLowerCase().includes('interception') ||
        title.toLowerCase().includes('verify')) {
      console.log('Bot detection detected, attempting to handle...');
      
      const verificationSelectors: string[] = [
        'input[type="checkbox"]',
        '[role="switch"]',
        'button:has-text("Verify")',
        'button:has-text("Continue")',
        'button:has-text("Continue to AliExpress")',
        'a[href*="aliexpress.com"]'
      ];
      
      for (const selector of verificationSelectors) {
        try {
          const element = await this.page.$(selector);
          if (element) {
            console.log(`Found verification element: ${selector}`);
            await element.click();
            console.log('Clicked verification element');
            await new Promise(resolve => setTimeout(resolve, 3000));
            break;
          }
        } catch {
          // Continue to next selector
        }
      }
    }
  }

  async searchForProduct(searchTerm: string): Promise<string> {
    console.log(`Searching for "${searchTerm}"...`);
    
    // Find search box
    const searchBox = await this.page.$('input[type="text"]');
    if (!searchBox) {
      throw new Error('Search box not found');
    }
    
    console.log('Search box found');
    
    // Click and type search term
    await searchBox.click();
    await searchBox.type(searchTerm);
    await this.page.keyboard.press('Enter');
    
    console.log('Search completed');
    
    // Wait for search results
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Return the search URL for validation
    return this.page.url();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }
}
