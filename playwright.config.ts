import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  // Fail the build on CI if a test.only was accidentally left in
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Run tests sequentially on CI to avoid flakiness from shared state
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],                                        // downloadable HTML report
    ['junit', { outputFile: 'results.xml' }],        // machine-readable format for CI reporting
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
