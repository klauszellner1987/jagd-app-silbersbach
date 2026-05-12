import { test, expect } from '@playwright/test';
import { setupMockedApp } from '../fixtures/setupMockedApp.js';

const TEST_USER = {
    uid: 'tester',
    email: 'tester@silbersbach.de',
    displayName: 'Tester',
    photoURL: '',
};

test.describe('Bulletin (Schwarzes Brett) - v6 modular', () => {
    test.beforeEach(async ({ page }) => {
        await setupMockedApp(page, TEST_USER);
        await page.goto('/jagd-app-silbersbach/');
        await expect(page.locator('body')).toHaveClass(/authenticated/, { timeout: 10_000 });
    });

    test('Bridge ist registriert (window.__features.bulletin + notifications)', async ({ page }) => {
        const ready = await page.evaluate(() => ({
            bulletin: !!(window.__features?.bulletin
                && typeof window.__features.bulletin.onLogin === 'function'
                && typeof window.__features.bulletin.initUI === 'function'
                && typeof window.__features.bulletin.renderStatsDetail === 'function'),
            notifications: !!(window.__features?.notifications
                && typeof window.__features.notifications.init === 'function'),
        }));
        expect(ready).toEqual({ bulletin: true, notifications: true });
    });

    test('Geseedete Aushaenge erscheinen in der Hauptliste und Badge zaehlt offene', async ({ page }) => {
        await page.evaluate(() => {
            const now = Date.now();
            window.__seedFirestore('bulletinBoard', 'b1', {
                message: 'Treibjagd am 15.11. - bitte zusagen',
                sender: 'Klaus',
                timestamp: now - 1000,
                isDone: false,
            });
            window.__seedFirestore('bulletinBoard', 'b2', {
                message: 'Salzlecke nachfuellen',
                sender: 'Anna',
                timestamp: now - 5000,
                isDone: false,
            });
            window.__seedFirestore('bulletinBoard', 'b3', {
                message: 'Schon erledigt - sollte nicht erscheinen',
                sender: 'Bob',
                timestamp: now - 10000,
                isDone: true,
            });
        });

        // Items sind im DOM (auch wenn die Seite ggf. versteckt ist)
        await expect(
            page.locator('#bulletin-list .bulletin-item-content', { hasText: 'Treibjagd am 15.11.' }),
        ).toBeAttached({ timeout: 5_000 });
        await expect(
            page.locator('#bulletin-list .bulletin-item-content', { hasText: 'Salzlecke' }),
        ).toBeAttached();

        // Erledigte Items sind nicht im DOM
        await expect(
            page.locator('#bulletin-list .bulletin-item-content', { hasText: 'Schon erledigt' }),
        ).toHaveCount(0);

        // Badge zeigt 2 offene
        await expect(page.locator('#bulletin-badge')).toHaveText('2');
    });

    test('Submit auf Main Page legt neuen Aushang an', async ({ page }) => {
        const submitBtn = page.locator('#bulletin-submit-btn');
        const input = page.locator('#bulletin-input');
        if (!(await submitBtn.count()) || !(await input.count())) {
            test.skip(true, 'bulletin-submit-btn / bulletin-input nicht im aktuellen DOM');
        }

        // Wert direkt setzen (Element koennte versteckt sein)
        await input.evaluate((el, v) => { el.value = v; }, 'E2E-Aushang vom Test');
        await submitBtn.evaluate((el) => el.click());

        await expect(
            page.locator('#bulletin-list .bulletin-item-content', { hasText: 'E2E-Aushang vom Test' }),
        ).toBeAttached({ timeout: 5_000 });
        await expect(
            page.locator('#bulletin-list .bulletin-item-sender', { hasText: 'Tester' }).first(),
        ).toBeAttached();
    });

    test('Done-Klick markiert Item als erledigt -> verschwindet aus Liste', async ({ page }) => {
        await page.evaluate(() => {
            window.__seedFirestore('bulletinBoard', 'todo1', {
                message: 'Bitte erledigen',
                sender: 'Tester',
                timestamp: Date.now(),
                isDone: false,
            });
        });

        await expect(
            page.locator('#bulletin-list .bulletin-item-content', { hasText: 'Bitte erledigen' }),
        ).toBeAttached({ timeout: 5_000 });
        await expect(page.locator('#bulletin-badge')).toHaveText('1');

        // Done-Button des passenden Items klicken (auch wenn versteckt)
        await page.locator('#bulletin-list .bulletin-item', { hasText: 'Bitte erledigen' })
            .locator('.bulletin-done-btn')
            .evaluate((el) => el.click());

        // Liste leert sich, Badge versteckt sich
        await expect(
            page.locator('#bulletin-list .bulletin-item-content', { hasText: 'Bitte erledigen' }),
        ).toHaveCount(0, { timeout: 5_000 });
        await expect(page.locator('#bulletin-badge')).toHaveClass(/hidden/);
    });
});
