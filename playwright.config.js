// @ts-check
import { defineConfig, devices } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

// Fix partagé pour firefox 157 pour macOS 27
/** @type {import('@playwright/test').LaunchOptions} */
const firefoxLaunchOptions = {};
if (process.platform === 'darwin') {
  const appData = path.join(__dirname, 'playwright/.cache/firefox/app-data');
  const localAppData = path.join(__dirname, 'playwright/.cache/firefox/local-data');
  mkdirSync(appData, { recursive: true });
  mkdirSync(localAppData, { recursive: true });
  firefoxLaunchOptions.env = {
    ...process.env,
    MOZ_APP_DATA: appData,
    MOZ_LOCAL_APP_DATA: localAppData,
  };
}

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

// vote.spec.js insère/supprime les mêmes lignes dans une base partagée (uniq_vote_dedup) :
// ses 3 passages (un par navigateur) sont chaînés par `dependencies` pour ne jamais tourner en même temps,
// pendant que les autres fichiers utilisent les workers restants.
const VOTE = '**/vote.spec.js';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI
    ? [
      ['list', { printSteps: true }],
      ['github'],
      ['html', { open: 'never' }],
    ]
    : 'html',
  timeout: process.env.CI ? 60_000 : 45_000,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: 'https://azure-pelican-926599.hostingersite.com/',
    httpCredentials: {
      username: 'laura',
      password: 'playwright',
    },

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: VOTE,
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], launchOptions: firefoxLaunchOptions },
      testIgnore: VOTE,
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testIgnore: VOTE,
    },

    /* vote.spec.js : un navigateur après l'autre */
    {
      name: 'vote-chromium',
      testMatch: VOTE,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'vote-firefox',
      testMatch: VOTE,
      use: { ...devices['Desktop Firefox'], launchOptions: firefoxLaunchOptions },
      dependencies: ['vote-chromium'],
    },
    {
      name: 'vote-webkit',
      testMatch: VOTE,
      use: { ...devices['Desktop Safari'] },
      dependencies: ['vote-firefox'],
    },


    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

