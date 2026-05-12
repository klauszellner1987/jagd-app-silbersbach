// ============================================================================
// core/notifications/webToken.js
// ----------------------------------------------------------------------------
// Browser-FCM: holt mit dem registrierten Service-Worker und einem VAPID-Key
// das Push-Token und persistiert es ueber den fcmTokenRepo.
//
// Idempotent + Retry-Logic uebernommen 1:1 aus dem alten fetchAndSaveToken().
// ============================================================================

import { fcmTokenRepo } from '../../data/fcmTokenRepo.js';

/**
 * @param {Object} opts
 * @param {Object} opts.swReg     ServiceWorkerRegistration
 * @param {string} opts.vapidKey  VAPID public key
 * @param {string} opts.appVersion APP_VERSION String fuer das Token-Dokument
 * @param {number} [opts.maxAttempts=3]
 * @returns {Promise<void>}
 */
export async function fetchAndSaveWebToken({ swReg, vapidKey, appVersion, maxAttempts = 3 }) {
    if (!swReg) {
        console.warn('[FCM] Kein Service Worker vorhanden');
        return;
    }
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') {
        return;
    }

    let worker = swReg.active;
    if (!worker || worker.state !== 'activated') {
        await new Promise((r) => setTimeout(r, 2500));
        worker = swReg.active;
        if (!worker || worker.state !== 'activated') {
            console.warn('[FCM] Service Worker nicht aktiviert, ueberspringe');
            return;
        }
    }

    let user = window.firebase?.auth?.()?.currentUser;
    if (!user) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        user = window.firebase?.auth?.()?.currentUser;
        if (!user) {
            console.warn('[FCM] Kein User nach Warten, ueberspringe');
            return;
        }
    }

    const messaging = window.firebase.messaging();

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const currentToken = await messaging.getToken({
                vapidKey,
                serviceWorkerRegistration: swReg,
            });

            if (currentToken) {
                user = window.firebase?.auth?.()?.currentUser;
                await fcmTokenRepo.upsertToken({
                    token: currentToken,
                    userId: user ? user.uid : 'anon',
                    userName: user ? (user.displayName || user.email || 'Nutzer') : 'Unbekannt',
                    device: (typeof navigator !== 'undefined' && navigator.userAgent
                        ? navigator.userAgent.substring(0, 100)
                        : 'unknown'),
                    version: appVersion,
                });
                if (typeof window.showToast === 'function') {
                    try { window.showToast('Push-Benachrichtigungen aktiv!', 'success'); } catch (_) {}
                }
                return;
            }
            return;
        } catch (err) {
            console.warn(`[FCM] Versuch ${attempt}/${maxAttempts}:`, err.code || err.name);
            if ((err.code === 20 || err.name === 'AbortError') && attempt < maxAttempts) {
                await new Promise((r) => setTimeout(r, 3000 * attempt));
                continue;
            }
            if (attempt === maxAttempts) {
                console.error('[FCM] Token-Registrierung fehlgeschlagen nach', maxAttempts, 'Versuchen');
            }
            break;
        }
    }
}
