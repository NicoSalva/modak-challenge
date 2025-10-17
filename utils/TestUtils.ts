import { Page } from '@playwright/test';

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
}
