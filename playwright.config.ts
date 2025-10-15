import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Folder where your tests are located
  testDir: './tests',

  use: {
    // Base URL comes from your .env file
    baseURL: process.env.BASE_URL ?? 'https://www.aliexpress.com',

    // Browser to use for tests (chromium / firefox / webkit)
    browserName: 'chromium',

    // Capture trace only when test fails and retries
    trace: 'on-first-retry',

    // Take screenshot only on failure
    screenshot: 'only-on-failure',

    // Keep video only if the test fails
    video: 'retain-on-failure',
  },

  // Reporters for console and HTML output
  reporter: [['list'], ['html', { open: 'never' }]],

  // Optional: increase timeout if needed
  // timeout: 60000,
  // expect: { timeout: 10000 },
});
