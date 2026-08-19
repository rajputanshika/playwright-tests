import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Maximum time for a single test
  // timeout: 120_000,

  // // Maximum time for each assertion
  // expect: {
  //   timeout: 30_000,
  // },

  testDir: './tests',

  // Set to false if tests share login/session data
  fullyParallel: false,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

  reporter: 'html',

  use: {
    baseURL: 'https://app-dev.assetinfinity.io',

    trace: 'on-first-retry',

    screenshot: 'only-on-failure',

    video: 'retain-on-failure',

    // actionTimeout: 30_000,

    // navigationTimeout: 60_000,
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});