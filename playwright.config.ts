import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'https://www.aliexpress.com',
    browserName: 'chromium',
    channel: 'chrome', // Use real Chrome instead of Chromium
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1366, height: 768 },
    // Anti-bot measures
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    contextOptions: {
      ignoreHTTPSErrors: true,
      locale: 'es-AR,es;q=0.9,en;q=0.8',
      timezoneId: 'America/Argentina/Buenos_Aires',
      extraHTTPHeaders: {
        'Accept-Language': 'es-AR,es;q=0.9,en;q=0.8',
        'DNT': '1',
      },
    },
  },
  reporter: [['list'], ['html', { open: 'never' }]],
  timeout: 60000,
  expect: { timeout: 10000 },
  retries: 2, // More retries for bot detection
});
