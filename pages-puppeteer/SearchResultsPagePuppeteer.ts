// pages-puppeteer/SearchResultsPagePuppeteer.ts
import { Page } from 'puppeteer';

export class SearchResultsPagePuppeteer {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async clickOnSecondPage(): Promise<void> {
    console.log('Looking for second page...');
    
    // Scroll to bottom to find pagination
    await this.page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    
    // Wait for scroll to complete and elements to be visible
    await this.page.waitForFunction(() => {
      return window.scrollY > 0;
    }, { timeout: 5000 });
    
    // Look for page "2" button using evaluate
    const secondPageButton = await this.page.evaluate((): boolean => {
      // Look for links or buttons containing "2"
      const links = Array.from(document.querySelectorAll('a, button'));
      const page2Element = links.find(el => el.textContent?.trim() === '2');
      return page2Element ? true : false;
    });
    
    if (secondPageButton) {
      console.log('Found page 2 button');
      
      // Click the page 2 button
      await this.page.evaluate((): void => {
        const links = Array.from(document.querySelectorAll('a, button'));
        const page2Element = links.find(el => el.textContent?.trim() === '2');
        if (page2Element) {
          (page2Element as HTMLElement).click();
        }
      });
      
      console.log('Clicked on page 2');
      
      // Wait for page 2 to load
      await this.page.waitForNavigation({ timeout: 15000 });
    } else {
      console.log('Page 2 button not found, continuing with current page');
    }
  }

  async clickOnFirstProduct(): Promise<string> {
    console.log('Looking for first product...');
    
    // Find first product link - be more specific to avoid navigation links
    const productLinks = await this.page.$$('a[href*="/item/"], a[href*="/product/"]');
    
    if (productLinks.length > 0) {
      console.log(`Found ${productLinks.length} product links`);
      
      // Get the href of the first product link
      const firstProductHref = await this.page.evaluate((el: Element): string => {
        return (el as HTMLAnchorElement).href;
      }, productLinks[0]);
      
      console.log(`First product URL: ${firstProductHref}`);
      
      // Navigate directly to the product page instead of clicking
      await this.page.goto(firstProductHref, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });
      console.log('Navigated to first product page');
      
      return firstProductHref;
    } else {
      throw new Error('No product links found');
    }
  }
}
