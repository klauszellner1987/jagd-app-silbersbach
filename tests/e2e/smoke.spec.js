// ============================================================================
// smoke.spec.js
// ----------------------------------------------------------------------------
// Schlankes E2E-Minimalset fuer die Refactor-Phase (v6): App-Boot,
// Login-Shell, v6-Bridges, ein Datenpfad Schwarzes Brett. Ausfuehrliche
// Flows liegen In Vitest; Navigation/Presence/UI-Regression bleiben bewusst
// ohne E2E-Last.
// ============================================================================

import { test, expect } from '@playwright/test';
import { setupMockedApp } from '../fixtures/setupMockedApp.js';

const TEST_USER = {
    uid: 'test-smoke',
    email: 'tester@silbersbach.de',
    displayName: 'Tester',
    photoURL: '',
};

test.describe('Smoke (minimal E2E)', () => {
    test('Gast: Login-Overlay ist sichtbar', async ({ page }) => {
        await setupMockedApp(page, null);
        await page.goto('/jagd-app-silbersbach/');
        await expect(page.locator('#login-overlay')).toBeVisible({ timeout: 10_000 });
        await expect(page.locator('#login-form')).toBeVisible();
    });

    test('Mock-Auth: Dashboard sichtbar, Overlay weg', async ({ page }) => {
        await setupMockedApp(page, TEST_USER);
        await page.goto('/jagd-app-silbersbach/');
        await expect(page.locator('body')).toHaveClass(/authenticated/, { timeout: 10_000 });
        await expect(page.locator('#login-overlay')).toBeHidden();
        await expect(page.locator('#dashboard')).toBeVisible();
    });

    test('v6 Bridges: presence, bulletin, streckenliste, schonzeit, notifications', async ({ page }) => {
        await setupMockedApp(page, TEST_USER);
        await page.goto('/jagd-app-silbersbach/');
        await expect(page.locator('body')).toHaveClass(/authenticated/, { timeout: 10_000 });

        const bridges = await page.evaluate(() => ({
            presence: !!(
                window.__features?.presence
                && typeof window.__features.presence.onLogin === 'function'),
            bulletin: !!(
                window.__features?.bulletin
                && typeof window.__features.bulletin.onLogin === 'function'
                && typeof window.__features.bulletin.initUI === 'function'),
            streckenliste: !!(
                window.__features?.streckenliste
                && typeof window.__features.streckenliste.onLogin === 'function'
                && typeof window.__features.streckenliste.initUI === 'function'),
            schonzeit: !!(
                window.__features?.schonzeit
                && typeof window.__features.schonzeit.initUI === 'function'
                && typeof window.__features.schonzeit.renderListe === 'function'),
            notifications: !!(
                window.__features?.notifications
                && typeof window.__features.notifications.init === 'function'),
        }));

        expect(bridges).toEqual({
            presence: true,
            bulletin: true,
            streckenliste: true,
            schonzeit: true,
            notifications: true,
        });
    });

    test('Schwarzes Brett: Seed-Daten im DOM, Badge zaehlt nur offene', async ({ page }) => {
        await setupMockedApp(page, TEST_USER);
        await page.goto('/jagd-app-silbersbach/');
        await expect(page.locator('body')).toHaveClass(/authenticated/, { timeout: 10_000 });

        await page.evaluate(() => {
            const now = Date.now();
            window.__seedFirestore('bulletinBoard', 'b1', {
                message: 'E2E-Smoke offen',
                sender: 'Klaus',
                timestamp: now - 1000,
                isDone: false,
            });
            window.__seedFirestore('bulletinBoard', 'b2', {
                message: 'E2E-Smoke erledigt (nicht in offener Liste)',
                sender: 'Anna',
                timestamp: now - 5000,
                isDone: true,
                doneAt: now - 2000,
                doneBy: 'Anna',
            });
        });

        await expect(
            page.locator('#bulletin-list .bulletin-item-content', { hasText: 'E2E-Smoke offen' }),
        ).toBeAttached({ timeout: 15_000 });
        await expect(
            page.locator('#bulletin-list .bulletin-item-content', {
                hasText: 'E2E-Smoke erledigt',
            }),
        ).toHaveCount(0);

        await expect.poll(
            async () => (await page.locator('#bulletin-badge').textContent())?.trim() ?? '',
            { timeout: 15_000, intervals: [100, 300, 500] },
        ).toBe('1');
    });
});
