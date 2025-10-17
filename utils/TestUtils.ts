import { Page, expect } from '@playwright/test';

export class TestUtils {
  static async handleNotificationPermission(page: Page): Promise<void> {
    page.on('dialog', async dialog => {
      console.log('Dialog appeared:', dialog.message());
      await dialog.dismiss();
    });
  }

  static async waitForPageLoad(page: Page, timeout: number = 10000): Promise<void> {
    try {
      await page.waitForLoadState('networkidle', { timeout });
    } catch {
      console.log('Network idle timeout, continuing...');
    }
  }

  /**
   * Wait until a condition is met with periodic checks (less aggressive)
   * @param page - Playwright page
   * @param condition - Function that returns true when condition is met
   * @param timeout - Maximum time to wait (default: 15000ms)
   * @param checkInterval - How often to check (default: 1000ms)
   */
  static async waitUntil(
    page: Page,
    condition: () => Promise<boolean>,
    timeout: number = 15000,
    checkInterval: number = 1000
  ): Promise<void> {
    await expect(async () => {
      const result = await condition();
      if (!result) {
        throw new Error('Condition not yet met');
      }
    }).toPass({ 
      timeout,
      intervals: [checkInterval] // Check every checkInterval ms
    });
  }

  /**
   * Wait until element count changes (useful for dynamic loading)
   */
  static async waitForCountChange(
    page: Page,
    locator: any,
    initialCount: number,
    timeout: number = 10000
  ): Promise<number> {
    await TestUtils.waitUntil(
      page,
      async () => {
        const currentCount = await locator.count();
        return currentCount > initialCount;
      },
      timeout,
      1000 // Check every 1 second
    );
    
    return await locator.count();
  }

  /**
   * Wait until element becomes visible (with periodic checks)
   */
  static async waitForElementVisible(
    page: Page,
    locator: any,
    timeout: number = 10000
  ): Promise<void> {
    await TestUtils.waitUntil(
      page,
      async () => {
        try {
          return await locator.isVisible();
        } catch {
          return false;
        }
      },
      timeout,
      1000 // Check every 1 second
    );
  }
}
