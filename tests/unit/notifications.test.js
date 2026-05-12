// ============================================================================
// notifications.test.js
// ----------------------------------------------------------------------------
// Tests src/scripts/core/notifications/index.js - der Init-Dispatcher
// (Web vs. Native), Permission-Gating, und der Web-Token-Pfad ueber
// fcmTokenRepo.
// ============================================================================

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

function setNotificationPermission(value) {
    Object.defineProperty(globalThis, 'Notification', {
        configurable: true,
        writable: true,
        value: Object.assign(function NoopNotification() {}, {
            permission: value,
            requestPermission: vi.fn(async () => 'granted'),
        }),
    });
}

function makeMessagingStub({ supported = true, getToken = 'tok-abc' } = {}) {
    const setCalls = [];
    const docFn = vi.fn((docId) => ({
        set: vi.fn(async (data, opts) => { setCalls.push({ docId, data, opts }); }),
    }));
    const collectionFn = vi.fn(() => ({ doc: docFn }));

    const messagingFn = vi.fn(() => ({
        getToken: vi.fn(async () => getToken),
        onMessage: () => () => {},
    }));
    messagingFn.isSupported = vi.fn(async () => supported);

    window.firebase = {
        firestore: Object.assign(
            () => ({ collection: collectionFn }),
            { FieldValue: { serverTimestamp: () => '__ts__' } },
        ),
        messaging: messagingFn,
        auth: () => ({ currentUser: { uid: 'u1', displayName: 'Klaus', email: 'k@x.de' } }),
    };
    return { setCalls, messagingFn, collectionFn, docFn };
}

async function loadFresh() {
    vi.resetModules();
    return await import('../../src/scripts/core/notifications/index.js');
}

describe('notificationsFeature.init - Web Pfad', () => {
    let stub;

    beforeEach(() => {
        delete window.Capacitor;
        stub = makeMessagingStub();
        Object.defineProperty(navigator, 'userAgent', {
            value: 'TestAgent/1.0',
            configurable: true,
        });
    });

    afterEach(async () => {
        const { notificationsFeature } = await loadFresh();
        notificationsFeature.__test__.reset();
    });

    it('schreibt fcm-Token bei permission=granted ueber fcmTokenRepo', async () => {
        setNotificationPermission('granted');
        const swReg = { active: { state: 'activated' } };
        const { notificationsFeature } = await loadFresh();
        await notificationsFeature.init({ swReg, appVersion: 'v6.0.0' });

        expect(stub.messagingFn.isSupported).toHaveBeenCalled();
        expect(stub.collectionFn).toHaveBeenCalledWith('fcmTokens');
        expect(stub.docFn).toHaveBeenCalledWith('tok-abc');
        expect(stub.setCalls).toHaveLength(1);
        expect(stub.setCalls[0].data).toMatchObject({
            token: 'tok-abc',
            userId: 'u1',
            version: 'v6.0.0',
        });
        expect(stub.setCalls[0].opts).toEqual({ merge: true });
    });

    it('macht nichts wenn messaging.isSupported = false', async () => {
        stub = makeMessagingStub({ supported: false });
        setNotificationPermission('granted');
        const { notificationsFeature } = await loadFresh();
        await notificationsFeature.init({ swReg: { active: { state: 'activated' } }, appVersion: 'v6' });
        expect(stub.setCalls).toHaveLength(0);
    });

    it('wartet auf Klick wenn permission=default und schreibt erst danach', async () => {
        setNotificationPermission('default');
        const { notificationsFeature } = await loadFresh();
        await notificationsFeature.init({ swReg: { active: { state: 'activated' } }, appVersion: 'v6' });
        expect(stub.setCalls).toHaveLength(0);
        expect(notificationsFeature.__test__.getState().pendingClickListener).toBeTruthy();
    });

    it('zeigt nur Toast bei permission=denied (kein Write)', async () => {
        setNotificationPermission('denied');
        const toastSpy = vi.fn();
        window.showToast = toastSpy;
        const { notificationsFeature } = await loadFresh();
        await notificationsFeature.init({ swReg: { active: { state: 'activated' } }, appVersion: 'v6' });
        expect(stub.setCalls).toHaveLength(0);
        expect(toastSpy).toHaveBeenCalledWith(expect.stringMatching(/BLOCKIERT/i), 'error');
    });

    it('init ist idempotent (zweimaliger Aufruf, einmal Token-Write)', async () => {
        setNotificationPermission('granted');
        const swReg = { active: { state: 'activated' } };
        const { notificationsFeature } = await loadFresh();
        await notificationsFeature.init({ swReg, appVersion: 'v6.0.0' });
        await notificationsFeature.init({ swReg, appVersion: 'v6.0.0' });
        expect(stub.setCalls).toHaveLength(1);
    });
});

describe('notificationsFeature.init - Native Pfad', () => {
    let stub;
    let registerSpy;

    beforeEach(() => {
        stub = makeMessagingStub();
        const listeners = {};
        registerSpy = vi.fn(async () => {
            const reg = listeners.registration;
            if (reg) await reg({ value: 'native-token-xyz' });
        });
        window.Capacitor = {
            isNativePlatform: () => true,
            Plugins: {
                PushNotifications: {
                    checkPermissions: vi.fn(async () => ({ receive: 'granted' })),
                    requestPermissions: vi.fn(async () => ({ receive: 'granted' })),
                    addListener: vi.fn((evt, cb) => { listeners[evt] = cb; }),
                    register: registerSpy,
                },
            },
        };
    });

    afterEach(async () => {
        delete window.Capacitor;
        const { notificationsFeature } = await loadFresh();
        notificationsFeature.__test__.reset();
    });

    it('dispatcht zum Native-Pfad und persistiert das Token', async () => {
        const { notificationsFeature } = await loadFresh();
        await notificationsFeature.init({ swReg: null, appVersion: 'v6.0.0' });
        await new Promise((r) => setTimeout(r, 0));

        expect(registerSpy).toHaveBeenCalled();
        expect(stub.docFn).toHaveBeenCalledWith('native-token-xyz');
        expect(stub.setCalls[0].data).toMatchObject({
            token: 'native-token-xyz',
            device: 'Android Native App',
            version: 'v6.0.0',
        });
    });
});
