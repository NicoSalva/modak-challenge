// pages-puppeteer/SearchResultsPagePuppeteer.ts
import { Page } from 'puppeteer';

export class SearchResultsPagePuppeteer {
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
            console.log(`Found notification close button: ${selector}`);
            await element.click();
            console.log('Notification closed successfully');
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for animation
            return;
          }
        }
      } catch (error) {
        console.log(`Failed to interact with notification selector '${selector}': ${(error as Error).message}`);
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
          console.log(`Found and clicked notification close button with text: ${text}`);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for animation
          return;
        }
      } catch (error) {
        console.log(`Failed to interact with text selector '${text}': ${(error as Error).message}`);
        continue;
      }
    }
  }

  async clickOnSecondPage(): Promise<void> {
    // Handle any notifications before proceeding
    await this.handleNotifications();
    
    // Scroll to bottom to find pagination
    await this.page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    
    // Wait for scroll to complete and elements to be visible
    await this.page.waitForFunction(() => {
      return window.scrollY > 0;
    }, { timeout: 5000 });
    
    // Look for page "2" button and click it
    const clicked = await this.page.evaluate((): boolean => {
      const links = Array.from(document.querySelectorAll('a, button'));
      const page2Element = links.find(el => el.textContent?.trim() === '2');
      if (page2Element) {
        (page2Element as HTMLElement).click();
        return true;
      }
      return false;
    });
    
    if (clicked) {
      // Wait for page 2 to load
      await this.page.waitForNavigation({ timeout: 15000 });
    }
  }

  async clickOnSecondProduct(): Promise<string> {
    // Handle any notifications before clicking product
    await this.handleNotifications();
    
    // Find product links - be more specific to avoid navigation links
    const productLinks = await this.page.$$('a[href*="/item/"], a[href*="/product/"]');
    
    if (productLinks.length >= 2) {
      // Get the href of the SECOND product link (index 1)
      const secondProductHref = await this.page.evaluate((el: Element): string => {
        return (el as HTMLAnchorElement).href;
      }, productLinks[1]);
      
      // Navigate directly to the product page instead of clicking
      await this.page.goto(secondProductHref, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });
      
      return secondProductHref;
    } else {
      throw new Error('Not enough product links found for second product');
    }
  }
}
