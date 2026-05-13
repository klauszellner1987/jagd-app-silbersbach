import { defineConfig, devices } from '@playwright/test';

const PORT = 5176;
const BASE_URL = `http://localhost:${PORT}/`;
const isCI = !!process.env.CI;

/** In CI nur Desktop-Chromium — halbiert Laenge und Linux-Flakes (Mobile bleibt lokal optional). */
const projects = isCI
    ? [{ name: 'chromium-desktop', use: { ...devices['Desktop Chrome'] } }]
    : [
          { name: 'chromium-desktop', use: { ...devices['Desktop Chrome'] } },
          { name: 'mobile-android', use: { ...devices['Pixel 7'] } },
      ];

export default defineConfig({
    testDir: './tests/e2e',
    timeout: 30_000,
    expect: { timeout: 5_000 },
    fullyParallel: true,
    forbidOnly: isCI,
    retries: isCI ? 2 : 0,
    workers: isCI ? 1 : undefined,
    reporter: [
        ['html', { open: 'never' }],
        ['list'],
    ],
    use: {
        baseURL: BASE_URL,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },
    projects,
    webServer: {
        command: 'npm run dev',
        url: BASE_URL,
        reuseExistingServer: !isCI,
        timeout: 60_000,
        stdout: 'ignore',
        stderr: 'pipe',
    },
});
