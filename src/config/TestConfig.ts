// src/config/TestConfig.ts
export interface TestConfig {
  browser: {
    headless: boolean;
    args: string[];
  };
  baseUrl: string;
  environment: 'dev' | 'staging' | 'prod';
  retries: number;
  parallel: boolean;
}

export const testConfig: TestConfig = {
  browser: {
    headless: process.env.HEADLESS === 'true',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  },
  baseUrl: process.env.BASE_URL || 'https://www.aliexpress.com',
  environment: (process.env.ENVIRONMENT as 'dev' | 'staging' | 'prod') || 'prod',
  retries: parseInt(process.env.RETRIES || '2'),
  parallel: process.env.PARALLEL === 'true'
};
