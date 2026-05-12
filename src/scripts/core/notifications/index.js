// ============================================================================
// core/notifications/index.js
// ----------------------------------------------------------------------------
// FCM Orchestrator. Dispatcht Web vs. Native, kuemmert sich um Permission-
// Gating (Browser) und delegiert an webToken / nativeToken Module, die das
// eigentliche Token holen und via fcmTokenRepo persistieren.
//
// Public API (Bridge):
//   notificationsFeature.init({ db?, swReg?, appVersion })
//
// `db` ist heute optional - die Repo-Schicht greift selbst auf
// window.firebase.firestore() zu. Wir akzeptieren den Parameter trotzdem,
// damit der Aufrufer im Monolith konsistent bleibt.
// ============================================================================

import { fetchAndSaveWebToken } from './webToken.js';
import { initNativeToken } from './nativeToken.js';

const VAPID_KEY = 'BDy4YWtERHAaFyUQHr7URTCHbsFC_AwMImJJ5U_AlFrdF_uhsHtEMZMybDXdZWUkapxR9X5JzoKJFAHXvYSIEQg';

const state = {
    initialized: false,
    pendingClickListener: null,
    pendingTouchListener: null,
};

function isNativeApp() {
    return !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
}

async function initWeb({ swReg, appVersion }) {
    const fb = window.firebase;
    if (!fb || !fb.messaging) return;

    try {
        const supported = await fb.messaging.isSupported();
        if (!supported) return;
    } catch (_) {
        return;
    }

    if (typeof Notification === 'undefined') return;

    const currentPerm = Notification.permission;

    if (currentPerm === 'granted') {
        await fetchAndSaveWebToken({ swReg, vapidKey: VAPID_KEY, appVersion });
        return;
    }

    if (currentPerm === 'default') {
        const requestPushAccess = async () => {
            window.removeEventListener('click', requestPushAccess);
            window.removeEventListener('touchstart', requestPushAccess);
            state.pendingClickListener = null;
            state.pendingTouchListener = null;

            try {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    await fetchAndSaveWebToken({ swReg, vapidKey: VAPID_KEY, appVersion });
                }
            } catch (err) {
                console.error('Fehler bei Push-Berechtigung:', err);
            }
        };

        state.pendingClickListener = requestPushAccess;
        state.pendingTouchListener = requestPushAccess;
        window.addEventListener('click', requestPushAccess);
        window.addEventListener('touchstart', requestPushAccess, { passive: true });
        return;
    }

    if (currentPerm === 'denied') {
        if (typeof window.showToast === 'function') {
            try {
                window.showToast(
                    'BLOCKIERT! Bitte in den Handy-Einstellungen (App Info) erlauben.',
                    'error',
                );
            } catch (_) {}
        }
    }
}

export const notificationsFeature = {
    /**
     * Orchestriert FCM-Token-Beschaffung. Idempotent: ein zweiter Aufruf
     * macht nichts (verhindert doppelte Listener).
     *
     * @param {Object} opts
     * @param {Object} [opts.db]        nicht zwingend, Repos nutzen window.firebase
     * @param {ServiceWorkerRegistration|null} [opts.swReg]
     * @param {string} opts.appVersion
     * @returns {Promise<void>}
     */
    async init({ swReg = null, appVersion = '' } = {}) {
        if (state.initialized) return;
        state.initialized = true;

        try {
            if (isNativeApp()) {
                await initNativeToken({ appVersion });
                return;
            }
            await initWeb({ swReg, appVersion });
        } catch (err) {
            console.error('[notifications] init error:', err);
        }
    },

    // Fuer Tests
    __test__: {
        getState() { return state; },
        reset() {
            if (state.pendingClickListener) {
                try { window.removeEventListener('click', state.pendingClickListener); } catch (_) {}
            }
            if (state.pendingTouchListener) {
                try { window.removeEventListener('touchstart', state.pendingTouchListener); } catch (_) {}
            }
            state.initialized = false;
            state.pendingClickListener = null;
            state.pendingTouchListener = null;
        },
        VAPID_KEY,
    },
};
