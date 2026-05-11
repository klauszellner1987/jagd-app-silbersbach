import { test, expect } from '@playwright/test';
import { setupMockedApp } from '../fixtures/setupMockedApp.js';

const TEST_USER = {
    uid: 'tester',
    email: 'tester@silbersbach.de',
    displayName: 'Tester',
    photoURL: '',
};

test.describe('Presence - Online Anzeige', () => {
    test.beforeEach(async ({ page }) => {
        await setupMockedApp(page, TEST_USER);
        await page.goto('/jagd-app-silbersbach/');
        await expect(page.locator('body')).toHaveClass(/authenticated/, { timeout: 10_000 });
    });

    test('Bridge ist registriert (window.__features.presence)', async ({ page }) => {
        const ready = await page.evaluate(() =>
            !!(window.__features && window.__features.presence && typeof window.__features.presence.onLogin === 'function'),
        );
        expect(ready).toBe(true);
    });

    test('Dropdown laesst sich oeffnen und schliessen', async ({ page }) => {
        await page.click('#profile-trigger');
        await expect(page.locator('#online-users-dropdown')).toBeVisible();

        // Click ausserhalb schliesst Dropdown
        await page.click('body', { position: { x: 10, y: 10 } });
        await expect(page.locator('#online-users-dropdown')).toBeHidden();
    });

    test('Zeigt geseedete User mit Online-Status korrekt', async ({ page }) => {
        // Tester hat sich beim Login selbst eingetragen (heartbeat), wir seeden 2 weitere.
        // Alice = frisch (online), Bob = 10min alt (stale = offline).
        await page.evaluate(() => {
            const fresh = { toDate: () => new Date() };
            const stale = { toDate: () => new Date(Date.now() - 10 * 60 * 1000) };
            window.__seedFirestore('users', 'alice', {
                uid: 'alice',
                displayName: 'Alice',
                isOnline: true,
                lastSeen: fresh,
                photoURL: '',
            });
            window.__seedFirestore('users', 'bob', {
                uid: 'bob',
                displayName: 'Bob',
                isOnline: true,
                lastSeen: stale,
                photoURL: '',
            });
        });

        await page.click('#profile-trigger');
        await expect(page.locator('#online-users-dropdown')).toBeVisible();

        // Beide geseedete User muessen mit Namen sichtbar sein
        await expect(page.locator('.user-status-name', { hasText: 'Alice' })).toBeVisible();
        await expect(page.locator('.user-status-name', { hasText: 'Bob' })).toBeVisible();

        // Alice ist online, Bob stale -> mindestens 1 ist online (Tester + Alice)
        await expect(page.locator('#online-count')).not.toHaveText('0');

        // Es muss mind. 1 online und 1 offline Status-Dot geben
        await expect(page.locator('.status-dot.online').first()).toBeVisible();
        await expect(page.locator('.status-dot.offline').first()).toBeVisible();
    });
});
