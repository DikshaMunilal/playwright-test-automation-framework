import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

export default defineConfig({
  fullyParallel: true,
  workers: process.env.CI ? 4 : undefined,
  retries: process.env.CI ? 2 : 0,
  use: {
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
  },
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['monocart-reporter', { outputFile: 'monocart-report/index.html' }],
  ],
  projects: [
    {
      name: 'api',
      testDir: './tests/api',
      use: { baseURL: process.env.API_BASE_URL },
    },
    {
      name: 'ui',
      testDir: './tests/ui',
      use: { ...devices['Desktop Chrome'], baseURL: process.env.UI_BASE_URL },
    },
  ],
});