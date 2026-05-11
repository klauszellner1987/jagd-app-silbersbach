import { test, expect } from '@playwright/test';
import { setupMockedApp } from '../fixtures/setupMockedApp.js';

const TEST_USER = {
    uid: 'test-uid',
    email: 'tester@silbersbach.de',
    displayName: 'Tester',
    photoURL: '',
};

test.describe('Dashboard-Feed Navigation', () => {
    test.beforeEach(async ({ page }) => {
        await setupMockedApp(page, TEST_USER);
        await page.addInitScript(() => {
            localStorage.setItem('dokumente_wizard_done', 'true');
        });
        await page.goto('/jagd-app-silbersbach/');
        await expect(page.locator('body')).toHaveClass(/authenticated/, { timeout: 10_000 });
    });

    test('Standard -> Wetter Feed -> zurueck', async ({ page }) => {
        await expect(page.locator('#dashboard-standard-feed')).toBeVisible();
        await page.locator('.quick-link span', { hasText: 'Wetter' }).click();

        await expect(page.locator('#dashboard-wetter-feed')).toBeVisible();
        await expect(page.locator('#dashboard-standard-feed')).toBeHidden();

        await page.locator('#dashboard-wetter-feed .feed-back-btn').click();
        await expect(page.locator('#dashboard-standard-feed')).toBeVisible();
        await expect(page.locator('#dashboard-wetter-feed')).toBeHidden();
    });

    test('Standard -> Dokumentensafe -> zurueck', async ({ page }) => {
        await page.locator('.quick-link span', { hasText: 'Dokus' }).click();
        await expect(page.locator('#dashboard-dokumente-feed')).toBeVisible();

        await page.locator('#dashboard-dokumente-feed .feed-back-btn').click();
        await expect(page.locator('#dashboard-standard-feed')).toBeVisible();
        await expect(page.locator('#dashboard-dokumente-feed')).toBeHidden();
    });

    test('Klick auf Schwarzes Brett zeigt Bulletin-Feed an', async ({ page }) => {
        // Hinweis: bulletin-widget macht eine Page-Navigation; je nach Implementierung
        // wird das #dashboard-bulletin-feed eingeblendet ODER zur Page gewechselt.
        // Wir testen lediglich, dass der Feed sichtbar wird.
        await page.locator('#bulletin-widget').click();
        await expect(page.locator('#dashboard-bulletin-feed')).toBeVisible();
    });

    test('Klick auf Schonzeit-Widget oeffnet Schonzeit-Feed', async ({ page }) => {
        await page.locator('#schonzeit-widget').click();
        await expect(page.locator('#dashboard-schonzeit-feed')).toBeVisible();

        await page.locator('#dashboard-schonzeit-feed .feed-back-btn').click();
        await expect(page.locator('#dashboard-standard-feed')).toBeVisible();
    });

    test('Mehrfaches Hin- und Herwechseln stabil (kein Doppel-Render)', async ({ page }) => {
        const standard = page.locator('#dashboard-standard-feed');
        const wetter = page.locator('#dashboard-wetter-feed');

        for (let i = 0; i < 3; i++) {
            await page.locator('.quick-link span', { hasText: 'Wetter' }).click();
            await expect(wetter).toBeVisible();
            await page.locator('#dashboard-wetter-feed .feed-back-btn').click();
            await expect(standard).toBeVisible();
        }
    });
});
