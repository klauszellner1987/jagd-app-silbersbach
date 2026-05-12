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
        // Bulk-Seed -> nur EIN Snapshot-Notify, vermeidet Render-Races.
        await page.evaluate(() => {
            const fresh = { toDate: () => new Date() };
            const stale = { toDate: () => new Date(Date.now() - 10 * 60 * 1000) };
            window.__seedFirestoreBulk('users', {
                alice: {
                    uid: 'alice', displayName: 'Alice', isOnline: true,
                    lastSeen: fresh, photoURL: '',
                },
                bob: {
                    uid: 'bob', displayName: 'Bob', isOnline: true,
                    lastSeen: stale, photoURL: '',
                },
            });
        });

        // Pruefung erfolgt direkt im DOM (auch wenn das Dropdown durch
        // visibilitychange auf mobile-android verschwinden kann, sind die
        // Daten in #online-users-list -> wir checken Strukturen, nicht
        // Visibility. Das ist robust gegen alle Linux-/mobile-Flakes.
        await expect.poll(async () => {
            return await page.evaluate(() => {
                const items = document.querySelectorAll('#online-users-list .user-status-item');
                let aliceOnline = false;
                let bobOffline = false;
                let onlineCount = 0;
                for (const item of items) {
                    const name = item.querySelector('.user-status-name')?.textContent?.trim() || '';
                    const dot = item.querySelector('.status-dot');
                    if (!dot) continue;
                    if (dot.classList.contains('online')) onlineCount++;
                    if (name === 'Alice' && dot.classList.contains('online')) aliceOnline = true;
                    if (name === 'Bob' && dot.classList.contains('offline')) bobOffline = true;
                }
                return {
                    total: items.length,
                    aliceOnline,
                    bobOffline,
                    onlineCount,
                    onlineCountText: document.getElementById('online-count')?.textContent || '',
                };
            });
        }, { timeout: 10_000, intervals: [200, 500, 1000] }).toMatchObject({
            total: 3,
            aliceOnline: true,
            bobOffline: true,
        });

        // Sanity: #online-count zeigt nicht 0 (mindestens Tester oder Alice ist online)
        await expect(page.locator('#online-count')).not.toHaveText('0');
    });
});
