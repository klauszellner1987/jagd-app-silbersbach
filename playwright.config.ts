import { defineConfig, devices } from '@playwright/test';

const PORT = 5176;
const BASE_URL = `http://localhost:${PORT}/jagd-app-silbersbach/`;
const isCI = !!process.env.CI;

export default defineConfig({
    testDir: './tests/e2e',
    timeout: 30_000,
    expect: { timeout: 5_000 },
    fullyParallel: true,
    forbidOnly: isCI,
    retries: isCI ? 1 : 0,
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
    projects: [
        {
            name: 'chromium-desktop',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'mobile-android',
            use: { ...devices['Pixel 7'] },
        },
    ],
    webServer: {
        command: 'npm run dev',
        url: BASE_URL,
        reuseExistingServer: !isCI,
        timeout: 60_000,
        stdout: 'ignore',
        stderr: 'pipe',
    },
});
