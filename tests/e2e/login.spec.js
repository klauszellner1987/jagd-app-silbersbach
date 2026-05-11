import { test, expect } from '@playwright/test';
import { setupMockedApp } from '../fixtures/setupMockedApp.js';

test.describe('Login Overlay', () => {
    test.beforeEach(async ({ page }) => {
        await setupMockedApp(page, null); // kein User -> Login-Overlay sichtbar
    });

    test('Login-Overlay ist beim Start sichtbar', async ({ page }) => {
        await page.goto('/jagd-app-silbersbach/');
        await expect(page.locator('#login-overlay')).toBeVisible();
        await expect(page.locator('#login-form')).toBeVisible();
        await expect(page.locator('#login-email')).toBeVisible();
        await expect(page.locator('#login-password')).toBeVisible();
    });

    test('Submit ohne Eingaben verhindert Login (HTML5 required)', async ({ page }) => {
        await page.goto('/jagd-app-silbersbach/');
        await page.locator('button[type="submit"].login-btn').click();
        await expect(page.locator('#login-overlay')).toBeVisible();
        await expect(page.locator('body.authenticated')).toHaveCount(0);
    });

    test('Erfolgreicher Mock-Login fuehrt zum Dashboard', async ({ page }) => {
        await page.goto('/jagd-app-silbersbach/');
        await page.locator('#login-email').fill('test@silbersbach.de');
        await page.locator('#login-password').fill('mock-password');
        await page.locator('button[type="submit"].login-btn').click();

        await expect(page.locator('body')).toHaveClass(/authenticated/, { timeout: 10_000 });
        await expect(page.locator('#login-overlay')).toBeHidden();
        await expect(page.locator('#dashboard')).toBeVisible();
    });

    test('Passwort-Toggle wechselt Input-Typ', async ({ page }) => {
        await page.goto('/jagd-app-silbersbach/');
        const pwInput = page.locator('#login-password');
        const toggle = page.locator('#password-toggle');

        await expect(pwInput).toHaveAttribute('type', 'password');
        await toggle.click();
        await expect(pwInput).toHaveAttribute('type', 'text');
        await toggle.click();
        await expect(pwInput).toHaveAttribute('type', 'password');
    });
});
