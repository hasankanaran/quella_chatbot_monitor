import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests',
  timeout: 150 * 1000, // 2.5 minutes overall test timeout to allow 2-minute Quella response check
  expect: {
    timeout: 120 * 1000, // 2 minutes (120 seconds) max timeout for Quella response
  },
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html-report', open: 'never' }],
    ['allure-playwright', { outputFolder: 'reports/allure-results' }]
  ],
  use: {
    baseURL: 'https://wishqueuat.fexcon.com.au',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
