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
            {
                FieldValue: {
                    serverTimestamp: () => '__ts__',
                    delete: () => '__delete__',
                },
            },
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
    try { window.localStorage?.clear(); } catch (_) { /* ignore */ }
    document.body.innerHTML = `
        <div class="bulletin-tabs">
            <button id="bulletin-tab-open" class="bulletin-tab active" data-tab="open">
                <span class="bulletin-tab-label">Offen</span>
                <span id="bulletin-tab-count-open" class="bulletin-tab-count hidden">0</span>
            </button>
            <button id="bulletin-tab-done" class="bulletin-tab" data-tab="done">
                <span class="bulletin-tab-label">Erledigt</span>
                <span id="bulletin-tab-count-done" class="bulletin-tab-count hidden">0</span>
            </button>
        </div>
        <div id="bulletin-list"></div>
        <div id="bulletin-list-done" class="hidden"></div>
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

    it('Done-Klick auf einem gerenderten Item ruft markDone mit doneAt/doneBy', async () => {
        const { bulletinFeature } = await loadFresh();
        bulletinFeature.onLogin({ uid: 'u1', displayName: 'Klaus' });
        bulletinFeature.initUI();
        stub.triggerSnap([{ id: 'i1', message: 'M', timestamp: 1, sender: 'S', isDone: false }]);

        const btn = document.querySelector('#bulletin-list .bulletin-done-btn');
        expect(btn).toBeTruthy();
        bubbleClick(btn);
        await new Promise((r) => setTimeout(r, 0));
        expect(stub.updateCalls).toEqual([{
            docId: 'i1',
            data: { isDone: true, doneAt: '__ts__', doneBy: 'Klaus' },
        }]);
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

describe('bulletinFeature tabs (offen/erledigt)', () => {
    let stub;

    beforeEach(() => {
        stub = makeFirebaseStub();
        installDom();
    });

    function bubbleClick(el) {
        el.dispatchEvent(new Event('click', { bubbles: true, cancelable: true }));
    }

    it('rendert offene und erledigte Items in getrennte Container', async () => {
        const { bulletinFeature } = await loadFresh();
        bulletinFeature.onLogin({ uid: 'u1' });
        stub.triggerSnap([
            { id: 'o1', message: 'Offen 1', timestamp: 100, sender: 'A', isDone: false },
            { id: 'd1', message: 'Done 1', timestamp: 200, sender: 'B', isDone: true, doneAt: 999, doneBy: 'Klaus' },
        ]);
        const openItems = document.querySelectorAll('#bulletin-list .bulletin-item');
        const doneItems = document.querySelectorAll('#bulletin-list-done .bulletin-item--done');
        expect(openItems).toHaveLength(1);
        expect(doneItems).toHaveLength(1);
        expect(openItems[0].querySelector('.bulletin-item-content').innerHTML).toBe('Offen 1');
        expect(doneItems[0].querySelector('.bulletin-item-content--done').innerHTML).toBe('Done 1');
    });

    it('Tab-Counter zeigen die richtigen Zahlen und sind versteckt bei 0', async () => {
        const { bulletinFeature } = await loadFresh();
        bulletinFeature.onLogin({ uid: 'u1' });
        stub.triggerSnap([
            { id: 'o1', timestamp: 100, isDone: false },
            { id: 'o2', timestamp: 110, isDone: false },
            { id: 'd1', timestamp: 200, isDone: true, doneAt: 999 },
        ]);
        const cOpen = document.getElementById('bulletin-tab-count-open');
        const cDone = document.getElementById('bulletin-tab-count-done');
        expect(cOpen.textContent).toBe('2');
        expect(cOpen.classList.contains('hidden')).toBe(false);
        expect(cDone.textContent).toBe('1');
        expect(cDone.classList.contains('hidden')).toBe(false);
    });

    it('Counter "0" ist hidden, wenn die Liste leer ist', async () => {
        const { bulletinFeature } = await loadFresh();
        bulletinFeature.onLogin({ uid: 'u1' });
        stub.triggerSnap([
            { id: 'o1', timestamp: 100, isDone: false },
        ]);
        expect(document.getElementById('bulletin-tab-count-done').classList.contains('hidden')).toBe(true);
    });

    it('Tab-Klick toggled hidden-Klassen + active-Klassen', async () => {
        const { bulletinFeature } = await loadFresh();
        bulletinFeature.initUI();
        const tabOpen = document.getElementById('bulletin-tab-open');
        const tabDone = document.getElementById('bulletin-tab-done');
        const listOpen = document.getElementById('bulletin-list');
        const listDone = document.getElementById('bulletin-list-done');

        // Initialer Zustand: Offen aktiv
        expect(tabOpen.classList.contains('active')).toBe(true);
        expect(listDone.classList.contains('hidden')).toBe(true);

        bubbleClick(tabDone);
        expect(tabDone.classList.contains('active')).toBe(true);
        expect(tabOpen.classList.contains('active')).toBe(false);
        expect(listDone.classList.contains('hidden')).toBe(false);
        expect(listOpen.classList.contains('hidden')).toBe(true);

        bubbleClick(tabOpen);
        expect(tabOpen.classList.contains('active')).toBe(true);
        expect(listOpen.classList.contains('hidden')).toBe(false);
    });

    it('Active-Tab wird in localStorage persistiert', async () => {
        const { bulletinFeature } = await loadFresh();
        bulletinFeature.initUI();
        bubbleClick(document.getElementById('bulletin-tab-done'));
        expect(window.localStorage.getItem('bulletin.activeTab')).toBe('done');
        bubbleClick(document.getElementById('bulletin-tab-open'));
        expect(window.localStorage.getItem('bulletin.activeTab')).toBe('open');
    });

    it('Reopen-Klick auf erledigtes Item ruft bulletinRepo.reopen', async () => {
        const { bulletinFeature } = await loadFresh();
        bulletinFeature.onLogin({ uid: 'u1' });
        bulletinFeature.initUI();
        stub.triggerSnap([
            { id: 'd1', message: 'X', timestamp: 200, isDone: true, doneAt: 999, doneBy: 'A' },
        ]);
        const btn = document.querySelector('#bulletin-list-done .bulletin-reopen-btn');
        expect(btn).toBeTruthy();
        bubbleClick(btn);
        await new Promise((r) => setTimeout(r, 0));
        expect(stub.updateCalls).toEqual([{
            docId: 'd1',
            data: { isDone: false, doneAt: '__delete__', doneBy: '__delete__' },
        }]);
    });

    it('Delete-Klick im Done-Container loescht ebenfalls', async () => {
        window.showConfirm = async () => true;
        const { bulletinFeature } = await loadFresh();
        bulletinFeature.onLogin({ uid: 'u1' });
        bulletinFeature.initUI();
        stub.triggerSnap([
            { id: 'd9', message: 'X', timestamp: 200, isDone: true, doneAt: 999, doneBy: 'A' },
        ]);
        bubbleClick(document.querySelector('#bulletin-list-done .bulletin-delete-btn'));
        await new Promise((r) => setTimeout(r, 0));
        expect(stub.deleteCalls).toEqual([{ docId: 'd9' }]);
    });

    it('Erledigte Items zeigen "Erledigt am ... von ..." und Reopen-Button', async () => {
        const { bulletinFeature } = await loadFresh();
        bulletinFeature.onLogin({ uid: 'u1' });
        stub.triggerSnap([
            { id: 'd1', message: 'M', timestamp: 200, sender: 'S', isDone: true, doneAt: 1715432400000, doneBy: 'Klaus' },
        ]);
        const meta = document.querySelector('#bulletin-list-done .bulletin-done-meta');
        expect(meta).toBeTruthy();
        expect(meta.textContent).toMatch(/Erledigt am/);
        expect(meta.textContent).toContain('Klaus');
        expect(document.querySelector('#bulletin-list-done .bulletin-reopen-btn')).toBeTruthy();
    });

    it('Legacy-Items ohne doneAt zeigen "unbekannt" als Erledigt-Datum', async () => {
        const { bulletinFeature } = await loadFresh();
        bulletinFeature.onLogin({ uid: 'u1' });
        stub.triggerSnap([
            { id: 'old', message: 'M', timestamp: 200, sender: 'S', isDone: true },
        ]);
        const meta = document.querySelector('#bulletin-list-done .bulletin-done-meta');
        expect(meta.textContent).toMatch(/unbekannt/);
    });

    it('Persistierter Tab "done" wird beim onLogin angewendet', async () => {
        window.localStorage.setItem('bulletin.activeTab', 'done');
        const { bulletinFeature } = await loadFresh();
        bulletinFeature.onLogin({ uid: 'u1' });
        stub.triggerSnap([
            { id: 'd1', timestamp: 200, isDone: true, doneAt: 999 },
        ]);
        expect(document.getElementById('bulletin-tab-done').classList.contains('active')).toBe(true);
        expect(document.getElementById('bulletin-list-done').classList.contains('hidden')).toBe(false);
        expect(document.getElementById('bulletin-list').classList.contains('hidden')).toBe(true);
    });
});
