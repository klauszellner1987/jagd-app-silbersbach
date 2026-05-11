// ============================================================================
// setupMockedApp.js
// ----------------------------------------------------------------------------
// Zentraler Helper fuer alle E2E-Tests:
//   1. Blockiert die echten Firebase-CDN-Skripte via page.route(),
//      sodass unser window.firebase Stub NICHT ueberschrieben wird.
//   2. Injiziert mockFirebase.js BEFORE jedes Skript laeuft.
//   3. Optional: setzt einen Test-User (sofortiges Auto-Login).
// ============================================================================

import path from 'node:path';

const MOCK_PATH = path.resolve('tests/fixtures/mockFirebase.js');

/**
 * @param {import('@playwright/test').Page} page
 * @param {Object|null} [user] - Optionaler Test-User
 */
export async function setupMockedApp(page, user = null) {
    // 1) Echte Firebase-CDN-Skripte abfangen + leerer Body zurueckliefern
    await page.route('**/firebasejs/**', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/javascript',
            body: '/* mocked firebase cdn */',
        });
    });

    // Auch den GenerateContent-Endpoint blocken (FCM-Token-Request)
    await page.route('**/firebaseinstallations.googleapis.com/**', (route) => route.abort());
    await page.route('**/fcmregistrations.googleapis.com/**', (route) => route.abort());
    await page.route('**/api.weatherapi.com/**', (route) =>
        route.fulfill({ status: 200, body: '{"current":{},"forecast":{"forecastday":[]}}' })
    );

    // 2) mockFirebase.js LADEN -> wird vor jedem Page-Skript ausgefuehrt
    await page.addInitScript({ path: MOCK_PATH });

    // 3) Test-User setzen
    await page.addInitScript((u) => {
        window.__TEST_AUTH_USER = u;
    }, user);
}
