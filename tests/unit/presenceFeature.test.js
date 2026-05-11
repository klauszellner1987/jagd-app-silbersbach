// ============================================================================
// presenceFeature.test.js
// ----------------------------------------------------------------------------
// Testet src/scripts/features/presence/index.js - die Bridge-API
// (onLogin/onLogout/initUI/markOffline) + den internen renderOnlineUsers.
// Nutzt happy-dom (vitest.config.mjs) fuer document/window.
// ============================================================================

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

function makeFirebaseStub() {
    const setCalls = [];
    let snapCb = null;

    const docFn = vi.fn((docId) => ({
        set: vi.fn(async (data, opts) => {
            setCalls.push({ docId, data, opts });
        }),
    }));

    const collectionFn = vi.fn(() => ({
        doc: docFn,
        limit: () => ({
            onSnapshot: (cb /*, errCb */) => {
                snapCb = cb;
                return vi.fn();
            },
        }),
    }));

    window.firebase = {
        firestore: Object.assign(
            () => ({ collection: collectionFn }),
            { FieldValue: { serverTimestamp: () => '__ts__' } },
        ),
    };

    return {
        setCalls,
        triggerSnapshot(docs) {
            snapCb({ docs: docs.map((d) => ({ data: () => d })) });
        },
    };
}

function installDom() {
    document.body.innerHTML = `
        <div id="profile-trigger"></div>
        <div id="online-users-dropdown" class="hidden">
            <span id="online-count">0</span>
            <div id="online-users-list"></div>
        </div>
    `;
}

async function loadFreshPresence() {
    vi.resetModules();
    return await import('../../src/scripts/features/presence/index.js');
}

describe('presenceFeature.onLogin / onLogout', () => {
    let stub;

    beforeEach(() => {
        vi.useFakeTimers();
        stub = makeFirebaseStub();
        installDom();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('onLogin schreibt initial isOnline=true ueber userRepo', async () => {
        const { presenceFeature } = await loadFreshPresence();
        presenceFeature.onLogin({ uid: 'u1', displayName: 'Klaus', photoURL: '' });
        expect(stub.setCalls).toHaveLength(1);
        expect(stub.setCalls[0]).toMatchObject({
            docId: 'u1',
            data: expect.objectContaining({ uid: 'u1', isOnline: true }),
            opts: { merge: true },
        });
        presenceFeature.onLogout();
    });

    it('onLogin registriert visibilitychange + beforeunload Listener', async () => {
        const addDoc = vi.spyOn(document, 'addEventListener');
        const addWin = vi.spyOn(window, 'addEventListener');
        const { presenceFeature } = await loadFreshPresence();
        presenceFeature.onLogin({ uid: 'u1' });
        expect(addDoc).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
        expect(addWin).toHaveBeenCalledWith('beforeunload', expect.any(Function));
        addDoc.mockRestore();
        addWin.mockRestore();
        presenceFeature.onLogout();
    });

    it('onLogout entfernt die zuvor registrierten Listener', async () => {
        const removeDoc = vi.spyOn(document, 'removeEventListener');
        const removeWin = vi.spyOn(window, 'removeEventListener');
        const { presenceFeature } = await loadFreshPresence();
        presenceFeature.onLogin({ uid: 'u1' });
        presenceFeature.onLogout();
        expect(removeDoc).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
        expect(removeWin).toHaveBeenCalledWith('beforeunload', expect.any(Function));
        removeDoc.mockRestore();
        removeWin.mockRestore();
    });

    it('onLogout ist idempotent (zweimaliger Aufruf kein Crash)', async () => {
        const { presenceFeature } = await loadFreshPresence();
        presenceFeature.onLogin({ uid: 'u1' });
        presenceFeature.onLogout();
        expect(() => presenceFeature.onLogout()).not.toThrow();
    });

    it('markOffline schreibt isOnline=false und cleant State', async () => {
        const { presenceFeature } = await loadFreshPresence();
        presenceFeature.onLogin({ uid: 'u9' });
        stub.setCalls.length = 0;
        await presenceFeature.markOffline();
        expect(stub.setCalls).toHaveLength(1);
        expect(stub.setCalls[0].data.isOnline).toBe(false);
    });
});

describe('presenceFeature.initUI + rendering', () => {
    let stub;

    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-05-11T12:00:00Z'));
        stub = makeFirebaseStub();
        installDom();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('Snapshot mit 2 Usern -> 2 .user-status-item rendered und online-count korrekt', async () => {
        const { presenceFeature } = await loadFreshPresence();
        presenceFeature.initUI();
        const freshTs = { toDate: () => new Date('2026-05-11T11:59:55Z') }; // 5s alt
        const staleTs = { toDate: () => new Date('2026-05-11T11:00:00Z') }; // 1h alt
        stub.triggerSnapshot([
            { uid: 'a', displayName: 'Alice', isOnline: true, lastSeen: freshTs, photoURL: '' },
            { uid: 'b', displayName: 'Bob',   isOnline: true, lastSeen: staleTs, photoURL: '' },
        ]);

        const items = document.querySelectorAll('.user-status-item');
        expect(items).toHaveLength(2);
        expect(document.getElementById('online-count').textContent).toBe('1');
        expect(items[0].querySelector('.status-dot').className).toContain('online');
        expect(items[1].querySelector('.status-dot').className).toContain('offline');
    });

    it('Klick auf #profile-trigger toggelt #online-users-dropdown', async () => {
        const { presenceFeature } = await loadFreshPresence();
        presenceFeature.initUI();
        const dropdown = document.getElementById('online-users-dropdown');
        expect(dropdown.classList.contains('hidden')).toBe(true);

        document.getElementById('profile-trigger').click();
        expect(dropdown.classList.contains('hidden')).toBe(false);

        document.getElementById('profile-trigger').click();
        expect(dropdown.classList.contains('hidden')).toBe(true);
    });

    it('escaped HTML in displayName (kein XSS)', async () => {
        const { presenceFeature } = await loadFreshPresence();
        presenceFeature.initUI();
        const ts = { toDate: () => new Date() };
        stub.triggerSnapshot([
            { uid: 'x', displayName: '<script>bad</script>', isOnline: true, lastSeen: ts, photoURL: '' },
        ]);
        const nameSpan = document.querySelector('.user-status-name');
        expect(nameSpan.textContent).toBe('<script>bad</script>');
        expect(nameSpan.innerHTML).not.toContain('<script>');
    });
});
