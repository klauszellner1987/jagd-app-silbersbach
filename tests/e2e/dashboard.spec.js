import { test, expect } from '@playwright/test';
import { setupMockedApp } from '../fixtures/setupMockedApp.js';

const TEST_USER = {
    uid: 'test-uid',
    email: 'tester@silbersbach.de',
    displayName: 'Tester',
    photoURL: '',
};

test.describe('Dashboard - Hauptansicht', () => {
    test.beforeEach(async ({ page }) => {
        await setupMockedApp(page, TEST_USER);
        await page.goto('/jagd-app-silbersbach/');
        await expect(page.locator('body')).toHaveClass(/authenticated/, { timeout: 10_000 });
    });

    test('Login-Overlay ist nach Mock-Auth ausgeblendet', async ({ page }) => {
        await expect(page.locator('#login-overlay')).toBeHidden();
        await expect(page.locator('#dashboard')).toBeVisible();
    });

    test('Alle 5 Quick-Links sind sichtbar (Karte, Strecke, Dokus, Wetter, Optionen)', async ({ page }) => {
        const quickLinks = page.locator('.quick-link');
        await expect(quickLinks).toHaveCount(5);

        const labels = ['Karte', 'Strecke', 'Dokus', 'Wetter', 'Optionen'];
        for (const label of labels) {
            await expect(page.locator('.quick-link span', { hasText: label })).toBeVisible();
        }
    });

    test('Standard-Feed enthaelt Schwarzes Brett, Schonzeiten und Statistik', async ({ page }) => {
        const feed = page.locator('#dashboard-standard-feed');
        await expect(feed).toBeVisible();
        await expect(feed.locator('#bulletin-widget')).toBeVisible();
        await expect(feed.locator('#schonzeit-widget')).toBeVisible();
        await expect(feed.locator('.feed-card-title', { hasText: 'Revier Statistik' })).toBeVisible();
    });

    test('Mobile (Pixel 7): keine horizontale Scrollbar', async ({ page }) => {
        const overflowing = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
        });
        expect(overflowing).toBe(false);
    });

    test('Klick auf Dokus oeffnet Dokumentensafe-Feed', async ({ page }) => {
        await page.evaluate(() => localStorage.setItem('dokumente_wizard_done', 'true'));
        await page.locator('.quick-link span', { hasText: 'Dokus' }).click();
        await expect(page.locator('#dashboard-dokumente-feed')).toBeVisible();
        await expect(page.locator('#dashboard-standard-feed')).toBeHidden();
    });
});
