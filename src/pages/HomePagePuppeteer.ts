// pages-puppeteer/HomePagePuppeteer.ts
import { Page } from 'puppeteer';

export class HomePagePuppeteer {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async handleNotifications(): Promise<void> {
    const notificationSelectors = [
      'button[aria-label*="close" i]',
      'button[aria-label*="dismiss" i]',
      'button[title*="close" i]',
      'button[title*="dismiss" i]',
      '.notification-close',
      '.popup-close',
      '.modal-close',
      '[data-testid*="close"]',
      '[data-testid*="dismiss"]',
      '.close-btn',
      '.dismiss-btn'
    ];

    const textSelectors = [
      '×',
      '✕', 
      'Close',
      'Dismiss',
      'No permitir',
      'Not now',
      'Later'
    ];
    
    // Try CSS selectors first
    for (const selector of notificationSelectors) {
      try {
        const element = await this.page.$(selector);
        if (element) {
          const isVisible = await element.isVisible();
          if (isVisible) {
            await element.click();
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for animation
            return;
          }
        }
      } catch (error) {
        continue;
      }
    }

    // Try text-based selectors using evaluate
    for (const text of textSelectors) {
      try {
        const found = await this.page.evaluate((buttonText) => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const button = buttons.find(btn => btn.textContent?.trim() === buttonText);
          if (button) {
            (button as HTMLElement).click();
            return true;
          }
          return false;
        }, text);
        
        if (found) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for animation
          return;
        }
      } catch (error) {
        continue;
      }
    }
  }

  async navigateToHomePage(): Promise<void> {
    await this.page.goto('https://www.aliexpress.com', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // Handle notifications immediately after page load
    await this.handleNotifications();
    
    const title = await this.page.title();
    
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
            // Wait for potential navigation after clicking verification
            await this.page.waitForNavigation({ timeout: 10000 }).catch((error) => {
              console.log(`No navigation occurred after clicking verification: ${(error as Error).message}`);
            });
            break;
          }
        } catch (error) {
          console.log(`Failed to interact with selector '${selector}': ${(error as Error).message}`);
          continue;
        }
      }
    }
  }

  async searchForProduct(searchTerm: string): Promise<string> {
    // Find search box
    const searchBox = await this.page.$('input[type="text"]');
    if (!searchBox) {
      throw new Error('Search box not found');
    }
    
    // Click and type search term
    await searchBox.click();
    await searchBox.type(searchTerm);
    await this.page.keyboard.press('Enter');
    
    // Wait for search results to load
    await this.page.waitForNavigation({ timeout: 15000 });
    
    // Handle any notifications that might appear after search
    await this.handleNotifications();
    
    // Return the search URL for validation
    return this.page.url();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }
}
