// ============================================================================
// core/notifications/nativeToken.js
// ----------------------------------------------------------------------------
// Capacitor PushNotifications: registriert sich, persistiert das Token via
// fcmTokenRepo und haengt Logging-Listener an. Identisches Verhalten wie das
// alte initNativePush().
// ============================================================================

import { fcmTokenRepo } from '../../data/fcmTokenRepo.js';

/**
 * @param {Object} opts
 * @param {string} opts.appVersion APP_VERSION String fuer das Token-Dokument
 * @returns {Promise<void>}
 */
export async function initNativeToken({ appVersion }) {
    if (!window.Capacitor || !window.Capacitor.Plugins || !window.Capacitor.Plugins.PushNotifications) {
        console.warn('Capacitor Push Plugin nicht gefunden.');
        return;
    }

    const { PushNotifications } = window.Capacitor.Plugins;

    let permStatus = await PushNotifications.checkPermissions();
    if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
        if (typeof window.showToast === 'function') {
            try { window.showToast('Push-Berechtigung verweigert.', 'error'); } catch (_) {}
        }
        return;
    }

    PushNotifications.addListener('registration', async (token) => {
        const fcmToken = token.value;
        const user = window.firebase?.auth?.()?.currentUser;
        try {
            await fcmTokenRepo.upsertToken({
                token: fcmToken,
                userId: user ? user.uid : 'anon',
                userName: user ? (user.displayName || user.email || 'Nutzer') : 'Unbekannt',
                device: 'Android Native App',
                version: appVersion,
            });
            if (typeof window.showToast === 'function') {
                try { window.showToast('Native Push aktiv!', 'success'); } catch (_) {}
            }
        } catch (err) {
            console.error('[FCM-Native] upsertToken error:', err);
        }
    });

    PushNotifications.addListener('registrationError', (error) => {
        console.error('Push registration error:', error);
    });

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push empfangen:', notification);
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Push-Aktion ausgefuehrt:', notification);
    });

    await PushNotifications.register();
}
