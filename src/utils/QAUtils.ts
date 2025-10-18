// src/utils/QAUtils.ts
import { Page } from 'puppeteer';

export class QAUtils {
  static async takeScreenshot(page: Page, name: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await page.screenshot({ 
      path: `screenshots/${name}-${timestamp}.png`, 
      fullPage: true 
    });
  }

  static async logPageInfo(page: Page, step: string): Promise<void> {
    const url = page.url();
    const title = await page.title();
    console.log(`[QA] ${step}: ${title} - ${url}`);
  }

  static async waitForElementWithRetry(
    page: Page, 
    selector: string, 
    maxRetries: number = 3
  ): Promise<boolean> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        await page.waitForSelector(selector, { timeout: 5000 });
        return true;
      } catch (error) {
        if (i === maxRetries - 1) {
          await this.takeScreenshot(page, `element-not-found-${selector}`);
          return false;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    return false;
  }

  static async validatePageLoad(page: Page, expectedUrl?: string): Promise<boolean> {
    const currentUrl = page.url();
    const title = await page.title();
    
    if (expectedUrl && !currentUrl.includes(expectedUrl)) {
      await this.takeScreenshot(page, 'unexpected-url');
      return false;
    }
    
    if (!title || title.length === 0) {
      await this.takeScreenshot(page, 'empty-title');
      return false;
    }
    
    return true;
  }
}
