// ============================================================================
// bulletinFeature.test.js
// ----------------------------------------------------------------------------
// Tests src/scripts/features/bulletin/index.js - die Bridge-API
// (onLogin/onLogout/initUI/renderStatsDetail) + die internen Render-Funktionen.
// Nutzt happy-dom (vitest.config.mjs) fuer document/window.
// ============================================================================

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

function makeFirebaseStub() {
    const addCalls = [];
    const updateCalls = [];
    const deleteCalls = [];
    let snapCb = null;

    const docFn = vi.fn((docId) => ({
        update: vi.fn(async (data) => { updateCalls.push({ docId, data }); }),
        delete: vi.fn(async () => { deleteCalls.push({ docId }); }),
    }));

    const collectionFn = vi.fn(() => ({
        doc: docFn,
        orderBy: vi.fn(() => ({
            onSnapshot: vi.fn((cb /*, errCb */) => {
                snapCb = cb;
                return vi.fn();
            }),
        })),
        add: vi.fn(async (data) => {
            addCalls.push({ data });
            return { id: 'mock-' + addCalls.length };
        }),
    }));

    window.firebase = {
        firestore: Object.assign(
            () => ({ collection: collectionFn }),
            { FieldValue: { serverTimestamp: () => '__ts__' } },
        ),
        auth: () => ({
            currentUser: { uid: 'u1', displayName: 'Klaus', email: 'klaus@test.de' },
        }),
    };

    return {
        addCalls,
        updateCalls,
        deleteCalls,
        triggerSnap(items) {
            const docs = items.map((i) => {
                const { id, ...rest } = i;
                return { id, data: () => rest };
            });
            snapCb({ docs });
        },
    };
}

function installDom() {
    document.body.innerHTML = `
        <div id="bulletin-list"></div>
        <div id="bulletin-list-dashboard"></div>
        <div id="bulletin-preview"></div>
        <span id="bulletin-badge" class="hidden">0</span>
        <input id="bulletin-input" type="text" />
        <button id="bulletin-submit-btn">Senden</button>
        <input id="bulletin-input-dashboard" type="text" />
        <button id="bulletin-submit-dashboard">Senden</button>
        <div id="stats-detail-bulletin"></div>
    `;
}

async function loadFresh() {
    vi.resetModules();
    return await import('../../src/scripts/features/bulletin/index.js');
}

describe('bulletinFeature.onLogin / onLogout', () => {
    let stub;

    beforeEach(() => {
        stub = makeFirebaseStub();
        installDom();
    });

    it('onLogin registriert Snapshot wenn mindestens ein Container im DOM ist', async () => {
        const { bulletinFeature } = await loadFresh();
        bulletinFeature.onLogin({ uid: 'u1' });
        expect(bulletinFeature.__test__.getState().snapshotUnsub).toBeTruthy();
        bulletinFeature.onLogout();
    });

    it('onLogin ohne Container im DOM macht nichts', async () => {
        document.body.innerHTML = '';
        const { bulletinFeature } = await loadFresh();
        bulletinFeature.onLogin({ uid: 'u1' });
        expect(bulletinFeature.__test__.getState().snapshotUnsub).toBeNull();
    });

    it('onLogout cleant snapshot, ist idempotent', async () => {
        const { bulletinFeature } = await loadFresh();
        bulletinFeature.onLogin({ uid: 'u1' });
        bulletinFeature.onLogout();
        expect(bulletinFeature.__test__.getState().snapshotUnsub).toBeNull();
        expect(() => bulletinFeature.onLogout()).not.toThrow();
    });
});

describe('bulletinFeature snapshot rendering', () => {
    let stub;

    beforeEach(() => {
        stub = makeFirebaseStub();
        installDom();
    });

    afterEach(async () => {
        const { bulletinFeature } = await import('../../src/scripts/features/bulletin/index.js');
        bulletinFeature.onLogout();
    });

    it('rendert offene items in bulletin-list, badge, preview - sortiert desc', async () => {
        const { bulletinFeature } = await loadFresh();
        bulletinFeature.onLogin({ uid: 'u1' });
        stub.triggerSnap([
            { id: 'a', message: 'Alt', timestamp: 100, sender: 'A', isDone: false },
            { id: 'b', message: 'Neu', timestamp: 200, sender: 'B', isDone: false },
            { id: 'c', message: 'Erledigt', timestamp: 300, sender: 'C', isDone: true },
        ]);

        const items = document.querySelectorAll('#bulletin-list .bulletin-item');
        expect(items).toHaveLength(2);
        expect(items[0].querySelector('.bulletin-item-content').innerHTML).toBe('Neu');
        expect(items[1].querySelector('.bulletin-item-content').innerHTML).toBe('Alt');

        const badge = document.getElementById('bulletin-badge');
        expect(badge.textContent).toBe('2');
        expect(badge.classList.contains('hidden')).toBe(false);

        expect(document.querySelectorAll('#bulletin-preview .bulletin-preview-item')).toHaveLength(2);
    });

    it('Dashboard und Preview limitieren auf 3 Eintraege', async () => {
        const { bulletinFeature } = await loadFresh();
        bulletinFeature.onLogin({ uid: 'u1' });
        const five = Array.from({ length: 5 }, (_, i) => ({
            id: 'i' + i, message: 'M' + i, timestamp: i * 10, sender: 'S', isDone: false,
        }));
        stub.triggerSnap(five);

        expect(document.querySelectorAll('#bulletin-list .bulletin-item')).toHaveLength(5);
        expect(document.querySelectorAll('#bulletin-list-dashboard .bulletin-item')).toHaveLength(3);
        expect(document.querySelectorAll('#bulletin-preview .bulletin-preview-item')).toHaveLength(3);
    });

    it('zeigt Empty-State wenn alle items isDone sind', async () => {
        const { bulletinFeature } = await loadFresh();
        bulletinFeature.onLogin({ uid: 'u1' });
        stub.triggerSnap([{ id: 'a', message: 'X', timestamp: 1, isDone: true }]);

        expect(document.getElementById('bulletin-badge').classList.contains('hidden')).toBe(true);
        expect(document.querySelector('#bulletin-list .bulletin-empty')).toBeTruthy();
        expect(document.querySelector('#bulletin-preview .bulletin-empty')).toBeTruthy();
    });

    it('escaped HTML in message und sender (kein XSS)', async () => {
        const { bulletinFeature } = await loadFresh();
        bulletinFeature.onLogin({ uid: 'u1' });
        stub.triggerSnap([
            { id: 'x', message: '<img src=x onerror=alert(1)>', sender: '<b>boss</b>', timestamp: 1, isDone: false },
        ]);
        const content = document.querySelector('#bulletin-list .bulletin-item-content');
        expect(content.innerHTML).not.toContain('<img');
        expect(content.innerHTML).toContain('&lt;img');
        const sender = document.querySelector('#bulletin-list .bulletin-item-sender');
        expect(sender.innerHTML).toContain('&lt;b&gt;');
    });

    it('rendert stats-detail-bulletin automatisch beim Snapshot', async () => {
        const { bulletinFeature } = await loadFresh();
        bulletinFeature.onLogin({ uid: 'u1' });
        stub.triggerSnap([
            { id: 'a', message: 'Aufgabe 1', timestamp: 100, sender: 'Klaus', isDone: false },
        ]);
        const statsHtml = document.getElementById('stats-detail-bulletin').innerHTML;
        expect(statsHtml).toContain('Aufgabe 1');
        expect(statsHtml).toContain('Klaus');
    });
});

describe('bulletinFeature submit / done / delete', () => {
    let stub;

    beforeEach(() => {
        stub = makeFirebaseStub();
        installDom();
    });

    it('Submit-Button auf Main Page ruft bulletinRepo.add', async () => {
        const { bulletinFeature } = await loadFresh();
        bulletinFeature.initUI();
        document.getElementById('bulletin-input').value = 'Neue Aufgabe';
        document.getElementById('bulletin-submit-btn').click();
        await new Promise((r) => setTimeout(r, 0));
        expect(stub.addCalls).toHaveLength(1);
        expect(stub.addCalls[0].data.message).toBe('Neue Aufgabe');
        expect(stub.addCalls[0].data.sender).toBe('Klaus');
    });

    it('Submit ignoriert leere Eingabe', async () => {
        const { bulletinFeature } = await loadFresh();
        bulletinFeature.initUI();
        document.getElementById('bulletin-input').value = '   ';
        document.getElementById('bulletin-submit-btn').click();
        await new Promise((r) => setTimeout(r, 0));
        expect(stub.addCalls).toHaveLength(0);
    });

    function bubbleClick(el) {
        el.dispatchEvent(new Event('click', { bubbles: true, cancelable: true }));
    }

    it('Done-Klick auf einem gerenderten Item ruft markDone', async () => {
        const { bulletinFeature } = await loadFresh();
        bulletinFeature.onLogin({ uid: 'u1' });
        bulletinFeature.initUI();
        stub.triggerSnap([{ id: 'i1', message: 'M', timestamp: 1, sender: 'S', isDone: false }]);

        const btn = document.querySelector('#bulletin-list .bulletin-done-btn');
        expect(btn).toBeTruthy();
        bubbleClick(btn);
        await new Promise((r) => setTimeout(r, 0));
        expect(stub.updateCalls).toEqual([{ docId: 'i1', data: { isDone: true } }]);
    });

    it('Delete-Klick fragt confirm und ruft delete bei Bestaetigung', async () => {
        window.showConfirm = async () => true;
        const { bulletinFeature } = await loadFresh();
        bulletinFeature.onLogin({ uid: 'u1' });
        bulletinFeature.initUI();
        stub.triggerSnap([{ id: 'i9', message: 'M', timestamp: 1, sender: 'S', isDone: false }]);

        bubbleClick(document.querySelector('#bulletin-list .bulletin-delete-btn'));
        await new Promise((r) => setTimeout(r, 0));
        expect(stub.deleteCalls).toEqual([{ docId: 'i9' }]);
    });

    it('Delete-Klick wird abgebrochen wenn confirm false', async () => {
        window.showConfirm = async () => false;
        const { bulletinFeature } = await loadFresh();
        bulletinFeature.onLogin({ uid: 'u1' });
        bulletinFeature.initUI();
        stub.triggerSnap([{ id: 'i9', message: 'M', timestamp: 1, sender: 'S', isDone: false }]);

        bubbleClick(document.querySelector('#bulletin-list .bulletin-delete-btn'));
        await new Promise((r) => setTimeout(r, 0));
        expect(stub.deleteCalls).toHaveLength(0);
    });

    it('initUI ist idempotent (zweimaliger Aufruf bindet Listener nicht doppelt)', async () => {
        const { bulletinFeature } = await loadFresh();
        bulletinFeature.initUI();
        bulletinFeature.initUI();
        document.getElementById('bulletin-input').value = 'Test';
        document.getElementById('bulletin-submit-btn').click();
        await new Promise((r) => setTimeout(r, 0));
        expect(stub.addCalls).toHaveLength(1);
    });
});
