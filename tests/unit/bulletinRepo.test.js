// ============================================================================
// bulletinRepo.test.js
// ----------------------------------------------------------------------------
// Tests src/scripts/data/bulletinRepo.js gegen einen In-Memory-Stub von
// window.firebase.
// ============================================================================

import { describe, it, expect, beforeEach, vi } from 'vitest';

function makeFirebaseStub() {
    const addCalls = [];
    const updateCalls = [];
    const deleteCalls = [];
    let snapCb = null;
    let snapErrCb = null;
    let orderByArgs = null;

    const docFn = vi.fn((docId) => ({
        update: vi.fn(async (data) => {
            updateCalls.push({ docId, data });
        }),
        delete: vi.fn(async () => {
            deleteCalls.push({ docId });
        }),
    }));

    const queryObj = {
        orderBy: vi.fn((field, dir) => {
            orderByArgs = { field, dir };
            return {
                onSnapshot: vi.fn((cb, errCb) => {
                    snapCb = cb;
                    snapErrCb = errCb;
                    return vi.fn();
                }),
            };
        }),
    };

    const collectionFn = vi.fn(() => ({
        ...queryObj,
        doc: docFn,
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
    };

    return {
        addCalls,
        updateCalls,
        deleteCalls,
        collectionFn,
        docFn,
        getOrderByArgs: () => orderByArgs,
        triggerSnap: (items) => snapCb({
            docs: items.map((i) => {
                const { id, ...rest } = i;
                return { id, data: () => rest };
            }),
        }),
        triggerErr: (err) => snapErrCb && snapErrCb(err),
    };
}

describe('bulletinRepo.add', () => {
    let stub;
    let bulletinRepo;

    beforeEach(async () => {
        stub = makeFirebaseStub();
        vi.resetModules();
        ({ bulletinRepo } = await import('../../src/scripts/data/bulletinRepo.js'));
    });

    it('fuegt Dokument mit Standardfeldern hinzu (timestamp number, isDone false)', async () => {
        await bulletinRepo.add({ message: 'Hallo', sender: 'Klaus' });
        expect(stub.collectionFn).toHaveBeenCalledWith('bulletinBoard');
        expect(stub.addCalls).toHaveLength(1);
        const data = stub.addCalls[0].data;
        expect(data.message).toBe('Hallo');
        expect(data.sender).toBe('Klaus');
        expect(data.isDone).toBe(false);
        expect(typeof data.timestamp).toBe('number');
    });

    it('faelt back auf "Unbekannt" wenn sender fehlt', async () => {
        await bulletinRepo.add({ message: 'x' });
        expect(stub.addCalls[0].data.sender).toBe('Unbekannt');
    });
});

describe('bulletinRepo.markDone / delete', () => {
    let stub;
    let bulletinRepo;

    beforeEach(async () => {
        stub = makeFirebaseStub();
        vi.resetModules();
        ({ bulletinRepo } = await import('../../src/scripts/data/bulletinRepo.js'));
    });

    it('markDone setzt isDone=true auf richtigem Doc', async () => {
        await bulletinRepo.markDone('abc');
        expect(stub.docFn).toHaveBeenCalledWith('abc');
        expect(stub.updateCalls).toEqual([{ docId: 'abc', data: { isDone: true } }]);
    });

    it('delete loescht das Doc', async () => {
        await bulletinRepo.delete('xyz');
        expect(stub.docFn).toHaveBeenCalledWith('xyz');
        expect(stub.deleteCalls).toEqual([{ docId: 'xyz' }]);
    });

    it('markDone/delete ignorieren leere id (kein Throw, kein Call)', async () => {
        await bulletinRepo.markDone('');
        await bulletinRepo.markDone(null);
        await bulletinRepo.delete('');
        await bulletinRepo.delete(undefined);
        expect(stub.updateCalls).toHaveLength(0);
        expect(stub.deleteCalls).toHaveLength(0);
    });
});

describe('bulletinRepo.streamAll', () => {
    let stub;
    let bulletinRepo;

    beforeEach(async () => {
        stub = makeFirebaseStub();
        vi.resetModules();
        ({ bulletinRepo } = await import('../../src/scripts/data/bulletinRepo.js'));
    });

    it('orderBy(timestamp, desc) und mappt docs auf { id, ...data }', () => {
        const onSnap = vi.fn();
        bulletinRepo.streamAll(onSnap);
        expect(stub.getOrderByArgs()).toEqual({ field: 'timestamp', dir: 'desc' });

        stub.triggerSnap([
            { id: 'a', message: 'M1', timestamp: 100 },
            { id: 'b', message: 'M2', timestamp: 200 },
        ]);
        expect(onSnap).toHaveBeenCalledTimes(1);
        const items = onSnap.mock.calls[0][0];
        expect(items.map((i) => i.id)).toEqual(['a', 'b']);
        expect(items[0].message).toBe('M1');
    });

    it('ruft onErr bei Snapshot-Error', () => {
        const onErr = vi.fn();
        bulletinRepo.streamAll(vi.fn(), onErr);
        stub.triggerErr(new Error('permission denied'));
        expect(onErr).toHaveBeenCalledWith(expect.any(Error));
    });
});
